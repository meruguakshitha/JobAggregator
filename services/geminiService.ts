import { GoogleGenAI, Type } from "@google/genai";
import type { SearchCriteria, JobPosting } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export async function fetchJobsFromGemini(criteria: SearchCriteria): Promise<JobPosting[]> {
  const prompt = `
    Act as an advanced AI job aggregation engine. Your task is to find and list job postings based on the following criteria.
    You must prioritize finding the most recent job postings and ensure that all provided application links are active and direct.
    It is crucial that all jobs found are posted for the year ${criteria.yearFilter}. This is a hard filter.
    
    Job Search Criteria:
    - Keywords/Role: "${criteria.keywords}"
    - Location Query: "${criteria.locationQuery || 'Worldwide'}"
    - Location Types: "${criteria.locationTypes.join(', ')}"
    - Experience Level: "${criteria.experience} years"
    - Job Type: "${criteria.jobType}"
    - Posted Within: "Last ${criteria.postedWithin} days"
    - Sources to Search: ${criteria.sources.join(', ')}
    - Maximum Results: ${criteria.maxResults}

    For each job posting, provide the following details in a JSON object:
    - jobTitle: The title of the job.
    - company: The name of the company hiring.
    - location: The work location.
    - postedDate: The date the job was posted. Use a realistic relative format like "3 days ago" or a specific date, reflecting recent postings.
    - applyLink: A direct, real, and active URL to the application page.
    - salary: The estimated salary range (e.g., "$100,000 - $120,000 per year"). If not available, omit this field.
    - descriptionSnippet: A brief, 1-2 sentence summary of the job description.
    - source: The name of the platform where the job was found (e.g., "LinkedIn", "Indeed").
    
    Perform deduplication to ensure the same job from different sources appears only once.
    The final output should be a JSON array of these job objects, strictly adhering to the specified schema.
    Only include jobs with recent updates and active links.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              jobTitle: { type: Type.STRING },
              company: { type: Type.STRING },
              location: { type: Type.STRING },
              postedDate: { type: Type.STRING },
              applyLink: { type: Type.STRING },
              salary: { type: Type.STRING, nullable: true },
              descriptionSnippet: { type: Type.STRING },
              source: { type: Type.STRING },
            },
            required: ['jobTitle', 'company', 'location', 'postedDate', 'applyLink', 'descriptionSnippet', 'source'],
          },
        },
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        return [];
    }
    return JSON.parse(jsonText) as JobPosting[];
  } catch (error) {
    console.error("Error fetching from Gemini API:", error);
    throw new Error("Failed to generate job postings from Gemini API.");
  }
}
