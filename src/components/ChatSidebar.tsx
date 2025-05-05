
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const ChatSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showSummaryOnly, setShowSummaryOnly] = useState(false);
  
  // Simulated user data - will be replaced with Supabase Auth
  const user = {
    name: "Dr. J. Jansen",
    email: "j.jansen@huisarts.nl",
    role: "Huisarts"
  };
  
  return (
    <div
      className={cn(
        "h-screen bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-medical-primary flex items-center justify-center text-white font-semibold">
              M
            </div>
            <span className="font-semibold text-gray-800 dark:text-gray-200">Medische AI</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      
      <Separator />
      
      {/* User Info */}
      <div className="p-4">
        {!collapsed ? (
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <User size={18} className="text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium">{user.name}</span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{user.email}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{user.role}</span>
          </div>
        ) : (
          <div className="flex justify-center">
            <User size={24} className="text-gray-500 dark:text-gray-400" />
          </div>
        )}
      </div>
      
      <Separator />
      
      {/* Settings */}
      <div className="p-4">
        {!collapsed && (
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="summary-toggle" 
                checked={showSummaryOnly}
                onCheckedChange={setShowSummaryOnly}
              />
              <Label htmlFor="summary-toggle">Alleen samenvatting</Label>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-auto p-4 flex justify-center">
        <ThemeToggle />
      </div>
    </div>
  );
};
