
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { Navigate } from "react-router-dom";
import { Layers, MessageCircle, Brain, ShieldCheck } from "lucide-react";

const Landing = () => {
  const { user, loading } = useAuth();
  
  // Redirect to main app if already logged in
  if (user && !loading) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
      {/* Header/Navigation */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-lg">
              M
            </div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Medische AI Multiplex</h1>
          </div>
          <Button asChild variant="default">
            <Link to="/auth">Inloggen</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Meerdere AI-perspectieven voor betere medische inzichten
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Ontvang antwoorden van verschillende geavanceerde AI-modellen en een heldere samenvatting
            voor uw medische vragen in één platform.
          </p>
          <Button asChild size="lg" className="text-base px-8 py-6">
            <Link to="/auth">Start nu gratis</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Wat maakt Medische AI Multiplex bijzonder?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <Layers className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Multiplex AI</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Vergelijk antwoorden van meerdere toonaangevende AI-modellen zoals GPT-4, Claude, en Mixtral in één overzicht.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Geïntegreerde samenvatting</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Begrijp de consensus en verschillen tussen AI-antwoorden dankzij onze geautomatiseerde samenvattingen.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                <Brain className="text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Medische kennis</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Gespecialiseerde AI-modellen met kennis van medische literatuur, richtlijnen en best practices.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Privacy & veiligheid</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Uw medische vragen en consulten worden beveiligd opgeslagen met versleuteling en toegangscontrole.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50 dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Hoe werkt het?
          </h2>
          
          <div className="max-w-3xl mx-auto">
            <ol className="relative border-l border-gray-300 dark:border-gray-700 ml-6">
              <li className="mb-10 ml-8">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-200 rounded-full -left-4 ring-4 ring-white dark:ring-slate-950 dark:bg-blue-900">
                  <span className="text-blue-800 dark:text-blue-200">1</span>
                </span>
                <h3 className="font-semibold text-xl text-gray-900 dark:text-white">Maak een account</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Registreer snel met uw e-mailadres om toegang te krijgen tot het platform.
                </p>
              </li>
              <li className="mb-10 ml-8">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-200 rounded-full -left-4 ring-4 ring-white dark:ring-slate-950 dark:bg-blue-900">
                  <span className="text-blue-800 dark:text-blue-200">2</span>
                </span>
                <h3 className="font-semibold text-xl text-gray-900 dark:text-white">Stel uw medische vraag</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Typ uw vraag in de chatbox. Wees zo specifiek mogelijk voor de beste resultaten.
                </p>
              </li>
              <li className="ml-8">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-200 rounded-full -left-4 ring-4 ring-white dark:ring-slate-950 dark:bg-blue-900">
                  <span className="text-blue-800 dark:text-blue-200">3</span>
                </span>
                <h3 className="font-semibold text-xl text-gray-900 dark:text-white">Vergelijk verschillende AI-antwoorden</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Ontvang meerdere perspectieven op uw vraag en bekijk de samenvatting voor een geïntegreerd inzicht.
                </p>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">
            Klaar om het zelf te ervaren?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Meld u aan en ontvang vandaag nog uw eerste AI-multiplex consultatie.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-blue-600">
            <Link to="/auth">Begin nu</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Medische AI Multiplex. Alle rechten voorbehouden.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Dit platform is enkel bedoeld ter ondersteuning en vervangt geen professioneel medisch advies.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
