
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput = ({ onSendMessage, isLoading }: ChatInputProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    onSendMessage(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-800">
      <div className="relative">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Stel je medische vraag..."
          className="pr-12 resize-none min-h-[60px] max-h-[200px] bg-white dark:bg-slate-900"
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          className="absolute right-2 bottom-2 h-8 w-8"
          disabled={!input.trim() || isLoading}
        >
          <Send size={16} />
        </Button>
      </div>
      
      {isLoading && (
        <div className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400 animate-pulse-subtle">
          AI-modellen denken...
        </div>
      )}
    </form>
  );
};
