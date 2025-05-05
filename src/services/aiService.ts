
import { supabase } from "@/integrations/supabase/client";

export interface ModelAnswer {
  model: string;
  text: string;
  tokens: number;
  latency: number;
}

export interface MultiConsultResponse {
  summary: string;
  answers: ModelAnswer[];
}

export async function multiConsult(question: string): Promise<MultiConsultResponse> {
  try {
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('multi-consult', {
      body: { question }
    });
    
    if (error) {
      console.error("Error calling multi-consult function:", error);
      throw new Error(error.message || "Er is een fout opgetreden bij het aanroepen van de AI-modellen");
    }
    
    // Return the data from the edge function
    return data as MultiConsultResponse;
  } catch (error) {
    console.error("Error in multiConsult:", error);
    // If something goes wrong, throw the error to be handled by the calling component
    throw error;
  }
}
