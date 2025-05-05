
import { useState } from "react";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatSidebar } from "@/components/ChatSidebar";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

const Index = () => {
  const [showSummaryOnly, setShowSummaryOnly] = useState(false);
  const { user, loading } = useAuth();
  
  // If not logged in and not loading, redirect to landing page
  if (!user && !loading) {
    return <Navigate to="/" replace />;
  }
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Laden...</h2>
          <p className="text-gray-500 dark:text-gray-400">Even geduld alstublieft</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-950">
      <ChatSidebar 
        showSummaryOnly={showSummaryOnly} 
        setShowSummaryOnly={setShowSummaryOnly} 
      />
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
