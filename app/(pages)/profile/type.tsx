export interface ProfileFormData {
    name: string;
    // birthday: Birthday;
    month: string;
    day: string;
    year: string;
    country: string;
    city: string;
    englishLevel: string;
    languages: string[];
    maritalStatus: string;
    fieldOfWork: string;
    traits: string[];
    interests: string[];
    movies: string[];
    music: string[];
    lookingFor: string[];
    ageRange: [number, number]; // Tuple for age range
    gender: string;
    personality: string;
    story: string;
  }
  
 export  interface FormErrors {
    [key:string]:string;
  }