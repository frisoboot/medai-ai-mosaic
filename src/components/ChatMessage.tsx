
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface ModelAnswer {
  model: string;
  text: string;
  tokens: number;
  latency: number;
}

interface ChatMessageProps {
  isUser: boolean;
  content: string;
  modelAnswers?: ModelAnswer[];
  summary?: string;
  timestamp: Date;
  showSummaryOnly?: boolean;
}

export const ChatMessage = ({
  isUser,
  content,
  modelAnswers,
  summary,
  timestamp,
  showSummaryOnly = false
}: ChatMessageProps) => {
  const [selectedModelIndex, setSelectedModelIndex] = useState(0);
  
  const formattedTime = new Intl.DateTimeFormat("nl", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(timestamp);

  return (
    <div className={cn(
      "flex flex-col mb-4 max-w-3xl",
      isUser ? "items-end self-end" : "items-start"
    )}>
      <div className={cn(
        "px-4 py-2 rounded-lg mb-1 relative",
        isUser
          ? "bg-medical-primary text-white rounded-br-none"
          : "bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-bl-none"
      )}>
        <div className="text-sm whitespace-pre-wrap">{content}</div>
      </div>
      
      {!isUser && modelAnswers && (
        <div className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-lg mt-2 overflow-hidden">
          {summary && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-medical-secondary dark:bg-slate-800">
              <h3 className="font-medium text-sm mb-2 text-gray-700 dark:text-gray-300">Samenvatting</h3>
              <div className="text-sm whitespace-pre-wrap">{summary}</div>
            </div>
          )}
          
          {!showSummaryOnly && modelAnswers.length > 0 && (
            <div className="overflow-x-auto">
              <div className="flex border-b border-gray-200 dark:border-gray-800">
                {modelAnswers.map((answer, index) => (
                  <div
                    key={answer.model}
                    className={cn(
                      "px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800",
                      index === selectedModelIndex 
                        ? "text-medical-primary border-b-2 border-medical-primary" 
                        : "text-gray-500"
                    )}
                    onClick={() => setSelectedModelIndex(index)}
                  >
                    {answer.model}
                  </div>
                ))}
              </div>
              
              <div className="p-4">
                <div className="text-sm whitespace-pre-wrap">
                  {modelAnswers[selectedModelIndex]?.text || "Geen antwoord beschikbaar"}
                </div>
                <div className="mt-3 text-xs text-gray-500 flex items-center justify-between">
                  <span>Tokens: {modelAnswers[selectedModelIndex]?.tokens || 0}</span>
                  <span>Latentie: {modelAnswers[selectedModelIndex]?.latency || 0}ms</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="text-xs text-gray-500 mt-1 px-1">{formattedTime}</div>
    </div>
  );
};
