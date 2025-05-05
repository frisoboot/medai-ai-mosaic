
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, loading, signIn, signInWithPassword } = useAuth();
  
  // Redirect if already logged in to dashboard
  if (user && !loading) {
    return <Navigate to="/dashboard" replace />;
  }
  
  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signInWithPassword(email, password);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center mb-2">
            <Button variant="ghost" size="sm" asChild className="mr-auto p-0">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Terug naar home
              </Link>
            </Button>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Medische AI Multiplex</CardTitle>
          <CardDescription className="text-center">
            Log in om toegang te krijgen tot AI-advies en hulp bij medische vragen
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="password" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="password">Email & Wachtwoord</TabsTrigger>
              <TabsTrigger value="magic-link">Magic Link</TabsTrigger>
            </TabsList>
            
            <TabsContent value="password">
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-pw">E-mailadres</Label>
                  <Input
                    id="email-pw"
                    type="email"
                    placeholder="uw@email.nl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Wachtwoord</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Uw wachtwoord"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loading || !email.trim() || !password.trim()}
                  >
                    {loading ? "Even geduld..." : "Inloggen"}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="magic-link">
              <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-ml">E-mailadres</Label>
                  <Input
                    id="email-ml"
                    type="email"
                    placeholder="uw@email.nl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || !email.trim()}
                >
                  {loading ? "Even geduld..." : "Inloggen met Magic Link"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex flex-col text-center text-sm text-gray-500">
          <p>
            Neem contact op met de beheerder voor een account.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
