
import { useState, useRef, useEffect } from "react";
import { ChatInput } from "./ChatInput";
import { ChatMessage, ModelAnswer } from "./ChatMessage";

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

interface ChatContainerProps {
  showSummaryOnly: boolean;
}

interface ChatEntry {
  id: string;
  isUser: boolean;
  content: string;
  timestamp: Date;
  modelAnswers?: ModelAnswer[];
  summary?: string;
}

export const ChatContainer = ({ showSummaryOnly }: ChatContainerProps) => {
  const [messages, setMessages] = useState<ChatEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
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
    setTimeout(() => {
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
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="mb-2 w-16 h-16 rounded-full bg-medical-primary/10 flex items-center justify-center">
              <span className="text-medical-primary text-2xl">👩‍⚕️</span>
            </div>
            <h2 className="text-xl font-semibold mb-1">Medische AI Multiplex</h2>
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
