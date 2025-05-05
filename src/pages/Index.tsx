
import { useState } from "react";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatSidebar } from "@/components/ChatSidebar";

const Index = () => {
  const [showSummaryOnly, setShowSummaryOnly] = useState(false);
  
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-950">
      <ChatSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white dark:bg-slate-900 p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Medische AI Multiplex</h1>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatContainer showSummaryOnly={showSummaryOnly} />
        </div>
      </div>
    </div>
  );
};

export default Index;
