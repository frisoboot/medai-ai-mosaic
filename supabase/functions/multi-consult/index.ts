
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// API Keys from environment variables
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const GROK_API_KEY = Deno.env.get("GROK_API_KEY");

// Define interfaces
interface ModelAnswer {
  model: string;
  text: string;
  tokens: number;
  latency: number;
}

interface ConsultRequest {
  question: string;
}

interface MultiConsultResponse {
  summary: string;
  answers: ModelAnswer[];
}

// CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to calculate elapsed time
const getElapsedTime = (startTime: number): number => {
  return Math.round(performance.now() - startTime);
};

// Query GPT-4o
async function queryGPT4o(question: string): Promise<ModelAnswer> {
  const startTime = performance.now();
  
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Je bent een bekwame medische assistent die beknopte en nauwkeurige antwoorden geeft op medische vragen. Baseer je antwoorden op bewezen medische kennis en wees duidelijk over de grenzen van je kennis."
          },
          { role: "user", content: question }
        ]
      })
    });

    const data = await response.json();
    console.log("GPT-4o response:", JSON.stringify(data).substring(0, 200) + "...");
    
    return {
      model: "GPT-4 Turbo",
      text: data.choices[0].message.content,
      tokens: data.usage.total_tokens,
      latency: getElapsedTime(startTime)
    };
  } catch (error) {
    console.error("Error querying GPT-4o:", error);
    return {
      model: "GPT-4 Turbo",
      text: "Er is een fout opgetreden bij het verwerken van het GPT-4 antwoord.",
      tokens: 0,
      latency: getElapsedTime(startTime)
    };
  }
}

// Query Claude 3 Haiku
async function queryClaude(question: string): Promise<ModelAnswer> {
  const startTime = performance.now();
  
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": `${ANTHROPIC_API_KEY}`,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `Als medische assistent, geef een beknopt en nauwkeurig antwoord op deze vraag: ${question}`
          }
        ]
      })
    });

    const data = await response.json();
    console.log("Claude response:", JSON.stringify(data).substring(0, 200) + "...");
    
    // Estimate tokens since Anthropic doesn't return token count in the same way
    const estimatedTokens = Math.round(data.content[0].text.length / 4);
    
    return {
      model: "Claude 3",
      text: data.content[0].text,
      tokens: estimatedTokens,
      latency: getElapsedTime(startTime)
    };
  } catch (error) {
    console.error("Error querying Claude:", error);
    return {
      model: "Claude 3",
      text: "Er is een fout opgetreden bij het verwerken van het Claude antwoord.",
      tokens: 0,
      latency: getElapsedTime(startTime)
    };
  }
}

// Query Grok-1
async function queryGrok(question: string): Promise<ModelAnswer> {
  const startTime = performance.now();
  
  try {
    const response = await fetch("https://api.grok.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROK_API_KEY}`
      },
      body: JSON.stringify({
        model: "grok-1",
        messages: [
          {
            role: "system",
            content: "Je bent een medische assistent die beknopte en accurate antwoorden geeft op medische vragen."
          },
          { role: "user", content: question }
        ]
      })
    });

    const data = await response.json();
    console.log("Grok response:", JSON.stringify(data).substring(0, 200) + "...");
    
    // Estimate tokens since Grok might report token usage differently
    const estimatedTokens = Math.round(data.choices[0].message.content.length / 4);
    
    return {
      model: "Mixtral 8x7B",
      text: data.choices[0].message.content,
      tokens: data.usage?.total_tokens || estimatedTokens,
      latency: getElapsedTime(startTime)
    };
  } catch (error) {
    console.error("Error querying Grok:", error);
    return {
      model: "Mixtral 8x7B",
      text: "Er is een fout opgetreden bij het verwerken van het Grok antwoord.",
      tokens: 0,
      latency: getElapsedTime(startTime)
    };
  }
}

// Generate summary from all answers using GPT-4o
async function generateSummary(answers: ModelAnswer[], question: string): Promise<string> {
  try {
    const answersText = answers.map(a => `${a.model}: ${a.text}`).join("\n\n");
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Schrijf een beknopte samenvatting (maximaal 6 zinnen) die de belangrijkste punten en de consensus uit de verschillende AI-antwoorden combineert. Focus alleen op medisch relevante informatie en verwijs niet naar de AI-modellen zelf."
          },
          {
            role: "user",
            content: `Vraag: ${question}\n\nAntwoorden van verschillende AI-modellen:\n\n${answersText}`
          }
        ]
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Er kon geen samenvatting worden gemaakt van de antwoorden.";
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { question } = await req.json() as ConsultRequest;
    console.log("Received question:", question);
    
    // Validate input
    if (!question || typeof question !== 'string') {
      return new Response(
        JSON.stringify({ error: "Vraag ontbreekt of is ongeldig" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log("Querying AI models in parallel...");
    
    // Query all models in parallel
    const [gpt4Response, claudeResponse, grokResponse] = await Promise.all([
      queryGPT4o(question),
      queryClaude(question),
      queryGrok(question)
    ]);
    
    // Collect all answers
    const answers: ModelAnswer[] = [gpt4Response, claudeResponse, grokResponse];
    
    console.log("All AI models responded, generating summary...");
    
    // Generate summary
    const summary = await generateSummary(answers, question);
    
    console.log("Summary generated, returning response");
    
    // Return combined response
    const response: MultiConsultResponse = { summary, answers };
    
    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in multi-consult function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Er is een fout opgetreden bij het verwerken van uw vraag.",
        details: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
