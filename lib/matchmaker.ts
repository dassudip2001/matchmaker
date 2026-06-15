import { data as seedProfiles } from "@/data/profiles";
import { UserProfile } from "@/data/profile";

export interface CompatibilityBreakdown {
  location: number;
  financial: number;
  lifestyle: number;
  values: number;
  physical: number;
}

export interface SuggestedMatch {
  profile: UserProfile;
  compatibilityScore: number;
  breakdown: CompatibilityBreakdown;
  strictMatch: boolean;
  matchReasons: string[];
}

// Lists for generating realistic dummy profiles to expand the pool to 100 males and 100 females.
const femaleFirstNames = [
  "Aanya", "Ananya", "Ishita", "Kavya", "Meera", "Neha", "Pooja", "Riya", "Sanya", "Tanvi",
  "Shruti", "Aditi", "Sneha", "Kriti", "Dia", "Rhea", "Nisha", "Shreya", "Simran", "Preeti",
  "Avani", "Kiran", "Divya", "Gauri", "Shalini", "Jaya", "Priya", "Nidhi", "Swati", "Richa",
  "Aishwarya", "Bhavna", "Deepika", "Esha", "Farah", "Isha", "Juhi", "Kajol", "Lata", "Mona"
];

const maleFirstNames = [
  "Aarav", "Arjun", "Rohan", "Vivek", "Karan", "Nikhil", "Rahul", "Siddharth", "Vikram", "Aditya",
  "Dev", "Raj", "Amit", "Suresh", "Manish", "Deepak", "Ravi", "Ankit", "Mohit", "Tarun",
  "Harsh", "Pranav", "Varun", "Yash", "Ishaan", "Kabir", "Abhishek", "Aman", "Rithvik", "Gaurav",
  "Sanjay", "Vijay", "Anil", "Sunil", "Sameer", "Alok", "Piyush", "Utkarsh", "Rishabh", "Mayank"
];

const lastNames = [
  "Sharma", "Verma", "Gupta", "Mehta", "Patel", "Reddy", "Nair", "Iyer", "Sen", "Chatterjee",
  "Banerjee", "Singh", "Joshi", "Rao", "Kumar", "Choudhury", "Bose", "Das", "Kapoor", "Arora",
  "Mishra", "Pandey", "Saxena", "Trivedi", "Deshmukh", "Kulkarni", "Pillai", "Menon", "Bhat", "Hegde"
];

const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Pune", "Chennai", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh", "Indore"];
const colleges = ["IIT Bombay", "IIT Delhi", "BITS Pilani", "Delhi University", "Mumbai University", "IIM Ahmedabad", "IIM Bangalore", "XLRI Jamshedpur", "Anna University", "VIT Vellore"];
const degrees = ["B.Tech", "M.Tech", "MBA", "B.Sc", "M.Sc", "B.Com", "MCA", "MBBS", "MD", "BBA"];
const companies = ["Google", "Microsoft", "Amazon", "Reliance Industries", "Tata Steel", "Infosys", "Wipro", "TCS", "Accenture", "PwC", "HDFC Bank"];
const designations = ["Software Engineer", "Senior Software Engineer", "Product Manager", "Business Analyst", "Data Scientist", "UI/UX Designer", "Consultant", "HR Manager", "Financial Analyst", "Operations Manager"];
const religions = ["Hindu", "Muslim", "Sikh", "Christian", "Jain", "Buddhist", "Parsi"];
const castes = ["Brahmin", "Kshatriya", "Vaishya", "Iyer", "Iyengar", "Khatri", "Reddy", "Nair", "Agarwal", "Open/No Preference"];
const motherTongues = ["Hindi", "Bengali", "Marathi", "Telugu", "Tamil", "Gujarati", "Urdu", "Kannada", "Malayalam", "Punjabi"];
const hobbiesList = [
  "Reading, Travel", "Cricket, Gaming", "Yoga, Dancing", "Gardening, Baking", "Meditation, Volunteering",
  "Theatre, Writing", "Swimming, Painting", "Music, Photography", "Trekking, Movies", "Badminton, Sketching",
  "Fitness, Cooking", "Photography, Cycling"
];

// Helper to get a deterministic random value based on seed ID
function getDeterministicRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function selectRandom<T>(arr: T[], seed: number): T {
  const rand = getDeterministicRandom(seed);
  return arr[Math.floor(rand * arr.length)];
}

// Generate expanded profiles so we have 100 males (IDs 1-50, 151-200) and 100 females (IDs 51-100, 101-150)
export function getExpandedProfiles(): UserProfile[] {
  const profiles = [...seedProfiles];
  
  // Existing profiles: 1-50 are Male, 51-100 are Female.
  // Add 50 females with IDs 101 to 150
  for (let id = 101; id <= 150; id++) {
    const seed = id * 17;
    const age = Math.floor(getDeterministicRandom(seed) * 15) + 24; // 24 to 38
    const dob = `${2026 - age}-05-${(id % 28) + 1}`;
    const first = selectRandom(femaleFirstNames, seed + 1);
    const last = selectRandom(lastNames, seed + 2);
    
    const femaleProfile: UserProfile = {
      id,
      firstName: first,
      lastName: last,
      gender: "Female",
      dob,
      age,
      country: "India",
      city: selectRandom(cities, seed + 3),
      heightCm: Math.floor(getDeterministicRandom(seed + 4) * 20) + 150, // 150 to 170
      email: `${first.toLowerCase()}.${last.toLowerCase()}${id}@gmail.com`,
      phone: `+91 ${Math.floor(8000000000 + getDeterministicRandom(seed + 5) * 1999999999)}`,
      college: selectRandom(colleges, seed + 6),
      degree: selectRandom(degrees, seed + 7),
      incomeLPA: Math.round((2.5 + getDeterministicRandom(seed + 8) * 35) * 10) / 10, // 2.5 to 37.5 LPA
      company: selectRandom(companies, seed + 9),
      designation: selectRandom(designations, seed + 10),
      maritalStatus: selectRandom(["Never Married", "Divorced", "Widowed"], seed + 11) as any,
      languages: ["English", selectRandom(motherTongues, seed + 12)],
      siblings: Math.floor(getDeterministicRandom(seed + 13) * 4),
      caste: selectRandom(castes, seed + 14),
      religion: selectRandom(religions, seed + 15),
      wantKids: selectRandom(["Yes", "No", "Maybe"], seed + 16) as any,
      openToRelocate: selectRandom(["Yes", "No", "Maybe"], seed + 17) as any,
      openToPets: selectRandom(["Yes", "No", "Maybe"], seed + 18) as any,
      status: selectRandom(["Active", "Searching", "Paused"], seed + 19) as any,
      hobbies: selectRandom(hobbiesList, seed + 20),
      manglik: selectRandom(["Yes", "No", "Doesn't Matter"], seed + 21) as any,
      motherTongue: selectRandom(motherTongues, seed + 22),
      familyType: selectRandom(["Nuclear", "Joint", "Extended"], seed + 23) as any,
      familyValues: selectRandom(["Traditional", "Moderate", "Liberal"], seed + 24) as any,
      drinkingHabits: selectRandom(["Never", "Occasionally", "Socially"], seed + 25) as any,
      smokingHabits: selectRandom(["Never", "Occasionally"], seed + 26) as any,
      dietPreference: selectRandom(["Vegetarian", "Non-Vegetarian", "Eggetarian", "Jain Vegetarian"], seed + 27) as any,
      notes: "",
      photoColor: selectRandom(["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9", "#82E0AA", "#F1948A"], seed + 28),
      type: "pool"
    };
    profiles.push(femaleProfile);
  }
  
  // Add 50 males with IDs 151 to 200
  for (let id = 151; id <= 200; id++) {
    const seed = id * 23;
    const age = Math.floor(getDeterministicRandom(seed) * 15) + 26; // 26 to 40
    const dob = `${2026 - age}-08-${(id % 28) + 1}`;
    const first = selectRandom(maleFirstNames, seed + 1);
    const last = selectRandom(lastNames, seed + 2);
    
    const maleProfile: UserProfile = {
      id,
      firstName: first,
      lastName: last,
      gender: "Male",
      dob,
      age,
      country: "India",
      city: selectRandom(cities, seed + 3),
      heightCm: Math.floor(getDeterministicRandom(seed + 4) * 25) + 165, // 165 to 190
      email: `${first.toLowerCase()}.${last.toLowerCase()}${id}@gmail.com`,
      phone: `+91 ${Math.floor(7000000000 + getDeterministicRandom(seed + 5) * 2999999999)}`,
      college: selectRandom(colleges, seed + 6),
      degree: selectRandom(degrees, seed + 7),
      incomeLPA: Math.round((5.0 + getDeterministicRandom(seed + 8) * 60) * 10) / 10, // 5.0 to 65.0 LPA
      company: selectRandom(companies, seed + 9),
      designation: selectRandom(designations, seed + 10),
      maritalStatus: selectRandom(["Never Married", "Divorced", "Widowed"], seed + 11) as any,
      languages: ["English", selectRandom(motherTongues, seed + 12)],
      siblings: Math.floor(getDeterministicRandom(seed + 13) * 4),
      caste: selectRandom(castes, seed + 14),
      religion: selectRandom(religions, seed + 15),
      wantKids: selectRandom(["Yes", "No", "Maybe"], seed + 16) as any,
      openToRelocate: selectRandom(["Yes", "No", "Maybe"], seed + 17) as any,
      openToPets: selectRandom(["Yes", "No", "Maybe"], seed + 18) as any,
      status: selectRandom(["Active", "Searching", "Paused"], seed + 19) as any,
      hobbies: selectRandom(hobbiesList, seed + 20),
      manglik: selectRandom(["Yes", "No", "Doesn't Matter"], seed + 21) as any,
      motherTongue: selectRandom(motherTongues, seed + 22),
      familyType: selectRandom(["Nuclear", "Joint", "Extended"], seed + 23) as any,
      familyValues: selectRandom(["Traditional", "Moderate", "Liberal"], seed + 24) as any,
      drinkingHabits: selectRandom(["Never", "Occasionally", "Socially", "Regularly"], seed + 25) as any,
      smokingHabits: selectRandom(["Never", "Occasionally", "Socially"], seed + 26) as any,
      dietPreference: selectRandom(["Vegetarian", "Non-Vegetarian", "Eggetarian"], seed + 27) as any,
      notes: "",
      photoColor: selectRandom(["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9", "#82E0AA", "#F1948A"], seed + 28),
      type: "pool"
    };
    profiles.push(maleProfile);
  }
  
  return profiles;
}

// Function to calculate matches for a specific client
export function getMatchesForClient(client: UserProfile): SuggestedMatch[] {
  const allProfiles = getExpandedProfiles();
  
  // Filters: opposite gender and status must not be Inactive
  const candidates = allProfiles.filter(p => {
    if (p.id === client.id) return false;
    if (p.status === "Inactive") return false;
    
    // Gender check: opposite gender only
    if (client.gender === "Male" && p.gender !== "Female") return false;
    if (client.gender === "Female" && p.gender !== "Male") return false;
    
    return true;
  });
  
  const matches: SuggestedMatch[] = candidates.map(candidate => {
    // 1. Evaluate Gender-Specific Strict Rules
    let strictMatch = true;
    const strictReasons: string[] = [];
    
    if (client.gender === "Male") {
      // Younger
      if (candidate.age >= client.age) {
        strictMatch = false;
        strictReasons.push("Age: Male client prefers younger matches.");
      }
      // Earn less
      if (candidate.incomeLPA >= client.incomeLPA) {
        strictMatch = false;
        strictReasons.push("Income: Male client prefers matches earning less.");
      }
      // Shorter
      if (candidate.heightCm >= client.heightCm) {
        strictMatch = false;
        strictReasons.push("Height: Male client prefers shorter matches.");
      }
      // Kids views compatible
      const kidsCompatible = 
        client.wantKids === candidate.wantKids || 
        client.wantKids === "Maybe" || 
        candidate.wantKids === "Maybe";
      if (!kidsCompatible) {
        strictMatch = false;
        strictReasons.push("Children: Incompatible views on wanting kids.");
      }
    } else { // Client is Female
      // Older or equal age
      if (candidate.age < client.age) {
        strictMatch = false;
        strictReasons.push("Age: Female client prefers older matches.");
      }
      // Taller or equal height
      if (candidate.heightCm < client.heightCm) {
        strictMatch = false;
        strictReasons.push("Height: Female client prefers taller matches.");
      }
      // Earn equal or more
      if (candidate.incomeLPA < client.incomeLPA) {
        strictMatch = false;
        strictReasons.push("Income: Female client prefers matches earning equal or more.");
      }
      // Kids views compatible
      const kidsCompatible = 
        client.wantKids === candidate.wantKids || 
        client.wantKids === "Maybe" || 
        candidate.wantKids === "Maybe";
      if (!kidsCompatible) {
        strictMatch = false;
        strictReasons.push("Children: Incompatible views on wanting kids.");
      }
      // Relocation compatible
      // If female doesn't want to relocate (No) and male is in a different city and won't relocate (No), incompatible.
      if (client.city !== candidate.city && client.openToRelocate === "No" && candidate.openToRelocate === "No") {
        strictMatch = false;
        strictReasons.push("Relocation: Lives in different cities and neither is open to relocate.");
      }
      // Family values compatible: Traditional and Liberal is usually incompatible
      if (
        (client.familyValues === "Traditional" && candidate.familyValues === "Liberal") ||
        (client.familyValues === "Liberal" && candidate.familyValues === "Traditional")
      ) {
        strictMatch = false;
        strictReasons.push("Values: Incompatible family values (Traditional vs Liberal).");
      }
    }
    
    // 2. Compatibility Score Breakdown (weighted, out of 100)
    // Location Score (Max 25 pts)
    let locationScore = 0;
    if (client.city === candidate.city) {
      locationScore = 25;
    } else if (client.openToRelocate === "Yes" || candidate.openToRelocate === "Yes") {
      locationScore = 18;
    } else if (client.openToRelocate === "Maybe" || candidate.openToRelocate === "Maybe") {
      locationScore = 12;
    } else {
      locationScore = 0;
    }
    
    // Financial/Career Compatibility (Max 20 pts)
    let financialScore = 0;
    const incomeDiff = Math.abs(client.incomeLPA - candidate.incomeLPA);
    if (client.gender === "Male") {
      // Men prefer lower income, but not too low (e.g. within 0 - 20 LPA lower is ideal)
      if (candidate.incomeLPA < client.incomeLPA) {
        const gap = client.incomeLPA - candidate.incomeLPA;
        if (gap < 10) financialScore = 20;
        else if (gap < 20) financialScore = 16;
        else financialScore = 12;
      } else {
        financialScore = 8; // Male client matches female earning more
      }
    } else {
      // Women prefer equal or higher
      if (candidate.incomeLPA >= client.incomeLPA) {
        const gap = candidate.incomeLPA - client.incomeLPA;
        if (gap < 15) financialScore = 20;
        else financialScore = 17;
      } else {
        // Less is okay if it's close
        if (incomeDiff < 5) financialScore = 12;
        else financialScore = 5;
      }
    }
    
    // Physical Compatibility (Max 15 pts) - Age + Height
    let physicalScore = 0;
    let ageScore = 0;
    let heightScore = 0;
    
    const ageDiff = candidate.age - client.age;
    const heightDiff = candidate.heightCm - client.heightCm;
    
    if (client.gender === "Male") {
      // Male matching female
      // Age: female younger by 1 to 5 years is ideal
      if (ageDiff < 0 && ageDiff >= -5) ageScore = 7.5;
      else if (ageDiff < -5 && ageDiff >= -10) ageScore = 5.5;
      else if (ageDiff === 0) ageScore = 4;
      else ageScore = 1; // older
      
      // Height: female shorter by 5 to 15cm is ideal
      if (heightDiff < 0 && heightDiff >= -15) heightScore = 7.5;
      else if (heightDiff < -15) heightScore = 5.5;
      else if (heightDiff === 0) heightScore = 4;
      else heightScore = 1; // taller
    } else {
      // Female matching male
      // Age: male older by 1 to 6 years is ideal
      if (ageDiff > 0 && ageDiff <= 6) ageScore = 7.5;
      else if (ageDiff > 6 && ageDiff <= 10) ageScore = 5.5;
      else if (ageDiff === 0) ageScore = 4;
      else ageScore = 1; // younger
      
      // Height: male taller by 5 to 15cm is ideal
      if (heightDiff > 0 && heightDiff <= 15) heightScore = 7.5;
      else if (heightDiff > 15) heightScore = 5.5;
      else if (heightDiff === 0) heightScore = 4;
      else heightScore = 1; // shorter
    }
    physicalScore = ageScore + heightScore;
    
    // Values Compatibility (Max 20 pts) - Religion, Caste, Family Values
    let valuesScore = 0;
    let religionPts = client.religion === candidate.religion ? 8 : 0;
    let castePts = 0;
    if (client.caste === "Open/No Preference" || candidate.caste === "Open/No Preference") {
      castePts = 6;
    } else if (client.caste === candidate.caste) {
      castePts = 6;
    } else {
      castePts = 1;
    }
    
    let familyValuesPts = 0;
    if (client.familyValues === candidate.familyValues) {
      familyValuesPts = 6;
    } else if (
      (client.familyValues === "Moderate") || 
      (candidate.familyValues === "Moderate")
    ) {
      familyValuesPts = 4;
    } else {
      familyValuesPts = 1; // Traditional vs Liberal
    }
    valuesScore = religionPts + castePts + familyValuesPts;
    
    // Lifestyle Compatibility (Max 20 pts) - Diet, Habits, Manglik status, Kids
    let lifestyleScore = 0;
    let dietPts = 0;
    if (client.dietPreference === candidate.dietPreference) {
      dietPts = 5;
    } else if (
      (client.dietPreference === "Vegetarian" && candidate.dietPreference === "Jain Vegetarian") ||
      (client.dietPreference === "Jain Vegetarian" && candidate.dietPreference === "Vegetarian")
    ) {
      dietPts = 4;
    } else if (client.dietPreference === "Non-Vegetarian" || candidate.dietPreference === "Non-Vegetarian") {
      dietPts = 2; // mixed
    } else {
      dietPts = 1;
    }
    
    let habitPts = 5;
    if (client.drinkingHabits !== candidate.drinkingHabits) habitPts -= 1.5;
    if (client.smokingHabits !== candidate.smokingHabits) habitPts -= 1.5;
    if (habitPts < 2) habitPts = 2;
    
    let manglikPts = 0;
    if (client.manglik === "Doesn't Matter" || candidate.manglik === "Doesn't Matter") {
      manglikPts = 5;
    } else if (client.manglik === candidate.manglik) {
      manglikPts = 5;
    } else {
      manglikPts = 0; // Manglik vs Non-Manglik clash
    }
    
    let kidsPts = 0;
    if (client.wantKids === candidate.wantKids) {
      kidsPts = 5;
    } else if (client.wantKids === "Maybe" || candidate.wantKids === "Maybe") {
      kidsPts = 3.5;
    } else {
      kidsPts = 0; // Yes vs No conflict
    }
    lifestyleScore = dietPts + habitPts + manglikPts + kidsPts;
    
    const totalScore = Math.round(locationScore + financialScore + physicalScore + valuesScore + lifestyleScore);
    
    // Generate Match Reasons in natural language for explanations
    const matchReasons: string[] = [];
    if (client.city === candidate.city) {
      matchReasons.push(`Both reside in ${client.city}.`);
    } else if (client.openToRelocate === "Yes" || candidate.openToRelocate === "Yes") {
      matchReasons.push("Open to relocation enables geographical match.");
    }
    
    if (client.religion === candidate.religion) {
      matchReasons.push(`Shared religious values (${client.religion}).`);
    }
    
    if (client.dietPreference === candidate.dietPreference) {
      matchReasons.push(`Compatible dietary choices (${client.dietPreference}).`);
    }
    
    if (client.familyValues === candidate.familyValues) {
      matchReasons.push(`Aligned family mindset (${client.familyValues}).`);
    } else if (client.familyValues === "Moderate" || candidate.familyValues === "Moderate") {
      matchReasons.push("Flexible and compatible family values.");
    }
    
    // Hobbies intersection
    const clientHobbies = client.hobbies.split(",").map(h => h.trim().toLowerCase());
    const candidateHobbies = candidate.hobbies.split(",").map(h => h.trim().toLowerCase());
    const sharedHobbies = clientHobbies.filter(h => candidateHobbies.includes(h));
    if (sharedHobbies.length > 0) {
      matchReasons.push(`Overlapping interests in ${sharedHobbies.join(", ")}.`);
    }
    
    if (client.wantKids === candidate.wantKids && client.wantKids === "Yes") {
      matchReasons.push("Both are looking forward to having children in the future.");
    }
    
    if (client.manglik === candidate.manglik && client.manglik !== "Doesn't Matter") {
      matchReasons.push(`Compatible Manglik status (${client.manglik}).`);
    }

    return {
      profile: candidate,
      compatibilityScore: totalScore,
      breakdown: {
        location: Math.round((locationScore / 25) * 100),
        financial: Math.round((financialScore / 20) * 100),
        physical: Math.round((physicalScore / 15) * 100),
        values: Math.round((valuesScore / 20) * 100),
        lifestyle: Math.round((lifestyleScore / 20) * 100),
      },
      strictMatch,
      matchReasons: matchReasons.length > 0 ? matchReasons : ["Strong overall profile compatibility."]
    };
  });
  
  // Sort by compatibility score descending, with strict matches prioritized
  return matches.sort((a, b) => {
    // If one is strict and other is not, prioritize strict
    if (a.strictMatch && !b.strictMatch) return -1;
    if (!a.strictMatch && b.strictMatch) return 1;
    
    // Otherwise sort by score
    return b.compatibilityScore - a.compatibilityScore;
  });
}
