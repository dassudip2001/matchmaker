import { UserProfile } from "@/data/profile";
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const apiKey =
  process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";

const openai = new OpenAI({
  apiKey: apiKey,
});

function generateLocalFallback(client: UserProfile, candidate: UserProfile) {
  // Clean hobbies
  const clientHobbies = client.hobbies || "";
  const candidateHobbies = candidate.hobbies || "";

  // Construct fit analysis
  const matchingPoints = [];
  if (client.city === candidate.city) {
    matchingPoints.push(
      `both reside in ${client.city}, making meetups convenient`,
    );
  } else {
    if (client.openToRelocate === "Yes" || client.openToRelocate === "Maybe") {
      matchingPoints.push(`${client.firstName} is open to relocating`);
    }
    if (
      candidate.openToRelocate === "Yes" ||
      candidate.openToRelocate === "Maybe"
    ) {
      matchingPoints.push(`${candidate.firstName} is open to relocating`);
    }
  }

  if (client.religion === candidate.religion) {
    matchingPoints.push(
      `they share the same religious background (${client.religion})`,
    );
  }

  if (client.familyValues === candidate.familyValues) {
    matchingPoints.push(
      `both align on a ${client.familyValues.toLowerCase()} family values mindset`,
    );
  }

  if (client.dietPreference === candidate.dietPreference) {
    matchingPoints.push(
      `both prefer a ${client.dietPreference.toLowerCase()} diet`,
    );
  }

  // Intersect hobbies
  const clientHobList = clientHobbies
    .split(",")
    .map((h: string) => h.trim().toLowerCase());
  const candHobList = candidateHobbies
    .split(",")
    .map((h: string) => h.trim().toLowerCase());
  const shared = clientHobList.filter((h: string) => candHobList.includes(h));

  if (shared.length > 0) {
    matchingPoints.push(`they both enjoy ${shared.join(" & ")}`);
  } else {
    matchingPoints.push(
      `they have diverse interests ranging from ${clientHobList[0] || "fitness"} to ${candHobList[0] || "reading"}`,
    );
  }

  const joinStr =
    matchingPoints.length > 1
      ? matchingPoints.slice(0, -1).join(", ") +
        " and " +
        matchingPoints.slice(-1)
      : matchingPoints[0] || "they share general compatibility";

  const fitAnalysis = `High Potential Match! This match is exceptionally strong because ${joinStr}. Professionally, ${client.firstName} is a ${client.designation} at ${client.company} and ${candidate.firstName} works as a ${candidate.designation} at ${candidate.company}, showing a balanced and highly compatible career path.`;

  const emailIntro = `Subject: Match Proposal: Meet ${candidate.firstName} - A great potential match!

    Hi ${client.firstName},

    I hope you're doing well! I've been reviewing profiles in our verified pool and I have found a profile that stood out as an excellent match for you.

    Meet ${candidate.firstName} (${candidate.age}, living in ${candidate.city}). She is a ${candidate.designation} at ${candidate.company} and has completed her ${candidate.degree} from ${candidate.college}. 

    Why we think this could work:
    - You both are based in or open to ${client.city === candidate.city ? client.city : "relocation"}.
    - Aligned preferences: ${client.firstName} (${client.religion}) and ${candidate.firstName} (${candidate.religion}) both value ${candidate.familyValues.toLowerCase()} traditions.
    - Shared lifestyle: You both are ${client.dietPreference.toLowerCase()} and enjoy activities like ${candidate.hobbies.toLowerCase()}.

    Let me know if you would like me to share your profile with ${candidate.firstName} and coordinate an introductory call!

    Best regards,
    Your TDC Matchmaker`;

  return { fitAnalysis, emailIntro };
}

export async function POST(req: NextRequest) {
  try {
    const { client, candidate } = await req.json();

    if (!client || !candidate) {
      return NextResponse.json(
        { error: "Missing client or candidate profile" },
        { status: 400 },
      );
    }

    if (!apiKey) {
      console.log(
        "OpenAI API key missing. Using local rule-based heuristic generation.",
      );
      const fallback = generateLocalFallback(client, candidate);
      return NextResponse.json(fallback);
    }

    try {
      // OpenAI Call
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an expert matchmaking assistant at The Date Crew (TDC), a premium dating and matrimonial service in India. You help matchmakers write compelling profile reviews and intro emails.",
          },
          {
            role: "user",
            content: `Generate a match fit analysis and a personalized intro email for:
                    Client: ${JSON.stringify(client)}
                    Candidate (Match): ${JSON.stringify(candidate)}

                    Provide your response in JSON format containing two keys:
                    1. "fitAnalysis": A short, paragraph (2-3 sentences) analyzing why these two profiles are highly compatible in the Indian matchmaking space, highlighting specific fields like profession, location, values, or diet.
                    2. "emailIntro": A warm, professional email from the matchmaker to the Client introducing them to the Candidate, explaining the key compatibility factors, and asking if they want to connect.

                    Return ONLY a valid JSON object. Do not include markdown code block formatting.`,
          },
        ],
        temperature: 0.7,
      });

      const text = response.choices[0]?.message?.content || "";
      // Strip markdown code block wrappers if any
      const cleaned = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const parsed = JSON.parse(cleaned);

      return NextResponse.json({
        fitAnalysis: parsed.fitAnalysis,
        emailIntro: parsed.emailIntro,
      });
    } catch (apiError) {
      console.error(
        "OpenAI API call failed, falling back to local heuristics:",
        apiError,
      );
      const fallback = generateLocalFallback(client, candidate);
      return NextResponse.json(fallback);
    }
  } catch (error: any) {
    console.error("Error in AI intro generation endpoint:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
