
import { useState, useRef, useEffect } from "react";
import { ChatInput } from "./ChatInput";
import { ChatMessage, ModelAnswer } from "./ChatMessage";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Json } from "@/integrations/supabase/types";

// Interfaces for our data types
interface ChatEntry {
  id: string;
  isUser: boolean;
  content: string;
  timestamp: Date;
  modelAnswers?: ModelAnswer[];
  summary?: string;
}

// Modified interface to match Supabase types
interface ConsultLogEntry {
  id: string;
  user_id: string;
  question: string;
  summary: string | null;
  answers_json: Json | null;
  created_at: string;
}

interface ChatContainerProps {
  showSummaryOnly: boolean;
}

export const ChatContainer = ({ showSummaryOnly }: ChatContainerProps) => {
  const [messages, setMessages] = useState<ChatEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Mock data for demonstration - will be replaced with actual API calls
  const MOCK_ANSWERS: ModelAnswer[] = [
    {
      model: "GPT-4 Turbo",
      text: "Dit lijkt op basis van de symptomen op een acute sinusitis (voorhoofdsholteontsteking). Typisch hiervoor zijn de frontale hoofdpijn, druk rond de ogen en purulente rinorroe. Bij een virale oorzaak kunnen patiënten vaak met symptomatische behandeling geholpen worden. Adviseer decongestiva, pijnstilling en zoutwater neusspoelen. Bij aanhoudende klachten >10 dagen, ernstige pijn of koorts kan een antibioticum overwogen worden (amoxicilline).",
      tokens: 435,
      latency: 1240
    },
    {
      model: "Claude 3",
      text: "De symptomen wijzen op een waarschijnlijke acute rhinosinusitis. Met de voorhoofds- en periorbitale pijn, purulente rinorroe en beginnende koorts past dit bij een bacteriële infectie van de sinussen. Aanbevolen behandeling: analgetica (paracetamol/NSAID), nasale corticosteroïden en overweeg antibiotica gezien de purulente afscheiding en beginnende koorts. Amoxicilline zou een geschikte eerste keuze zijn volgens de NHG-Standaard. Adviseer ook stoomtherapie en adequate hydratatie.",
      tokens: 390,
      latency: 980
    },
    {
      model: "Mixtral 8x7B",
      text: "De patiënt presenteert zich met symptomen die passen bij acute rhinosinusitis. De combinatie van frontale hoofdpijn die verergert bij vooroverbuigen, purulente nasale afscheiding en drukgevoel rond de ogen zijn kenmerkend. Volgens de NHG-standaard is het beleid primair symptomatisch met pijnstilling (paracetamol of NSAID) en eventueel xylometazoline neusdruppels. Gezien de subfebriele temperatuur en purulente afscheiding is er mogelijk sprake van een bacteriële component. Overweeg antibiotica (amoxicilline) als symptomen >7-10 dagen aanhouden of bij verslechtering.",
      tokens: 420,
      latency: 690
    }
  ];

  const MOCK_SUMMARY = "Op basis van de symptomen (frontale hoofdpijn, druk rond de ogen, purulente rinorroe en subfebriele temperatuur) is er waarschijnlijk sprake van acute bacteriële rhinosinusitis. Adviseer primair symptomatische behandeling met pijnstilling (paracetamol/NSAID), decongestiva en neusspoelen. Overweeg antibiotica (amoxicilline) bij aanhoudende klachten >7-10 dagen, verslechtering van symptomen of hoge koorts.";

  // Helper function to convert ModelAnswer[] to Json compatible format
  const modelAnswersToJson = (answers: ModelAnswer[]): Json => {
    return answers as unknown as Json;
  };

  // Helper function to convert Json to ModelAnswer[]
  const jsonToModelAnswers = (json: Json | null): ModelAnswer[] | undefined => {
    if (!json) return undefined;
    try {
      // Convert Json to ModelAnswer[] with type checking
      const answers = json as unknown as ModelAnswer[];
      // Validate that the structure matches ModelAnswer
      if (Array.isArray(answers) && answers.every(answer => 
        'model' in answer && 
        'text' in answer && 
        'tokens' in answer && 
        'latency' in answer
      )) {
        return answers;
      }
      return undefined;
    } catch (e) {
      console.error("Error converting JSON to ModelAnswers:", e);
      return undefined;
    }
  };

  // Fetch chat history from Supabase
  const { data: chatHistory } = useQuery({
    queryKey: ['chat-history', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('consult_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
        
      if (error) {
        console.error('Error fetching chat history:', error);
        return [];
      }
      
      return data as ConsultLogEntry[];
    },
    enabled: !!user
  });

  // Convert Supabase chat history to our ChatEntry format
  useEffect(() => {
    if (chatHistory && chatHistory.length > 0) {
      const formattedMessages: ChatEntry[] = [];
      
      chatHistory.forEach((entry) => {
        // Add user message
        formattedMessages.push({
          id: `${entry.id}-user`,
          isUser: true,
          content: entry.question,
          timestamp: new Date(entry.created_at)
        });
        
        // Add AI response
        formattedMessages.push({
          id: entry.id,
          isUser: false,
          content: "Antwoord op uw vraag:",
          timestamp: new Date(entry.created_at),
          modelAnswers: jsonToModelAnswers(entry.answers_json) || MOCK_ANSWERS,
          summary: entry.summary || MOCK_SUMMARY
        });
      });
      
      setMessages(formattedMessages);
    }
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!user) {
      toast.error("U moet ingelogd zijn om vragen te stellen");
      return;
    }
    
    // Add user message
    const userMessage: ChatEntry = {
      id: Date.now().toString(),
      isUser: true,
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(async () => {
      const aiResponse: ChatEntry = {
        id: (Date.now() + 1).toString(),
        isUser: false,
        content: "Antwoord op uw vraag:",
        timestamp: new Date(),
        modelAnswers: MOCK_ANSWERS,
        summary: MOCK_SUMMARY
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
      
      // Save to Supabase
      try {
        await supabase.from('consult_log').insert({
          user_id: user.id,
          question: message,
          summary: MOCK_SUMMARY,
          answers_json: modelAnswersToJson(MOCK_ANSWERS)
        });
      } catch (error) {
        console.error('Error saving chat to Supabase:', error);
      }
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="mb-2 w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center">
              <span className="text-blue-500 text-2xl">👋</span>
            </div>
            <h2 className="text-xl font-semibold mb-1">Welkom bij Medische AI Multiplex</h2>
            <p className="text-sm max-w-md text-center">
              Stel een medische vraag en ontvang antwoorden van meerdere AI-modellen plus een samenvatting
            </p>
          </div>
        ) : (
          messages.map(message => (
            <ChatMessage
              key={message.id}
              isUser={message.isUser}
              content={message.content}
              modelAnswers={message.modelAnswers}
              summary={message.summary}
              timestamp={message.timestamp}
              showSummaryOnly={showSummaryOnly}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};
