export interface Profile {
  id: number;
  userId: number;
  gender: string;
  dateOfBirth: string;
  profilePicture: string | null;
  bio: string | null;
  interests: string[];
  languagesSpoken: string[];
  traits: string[];
  movies: string[];
  music: string[];
  personality: string | null;
  credits: number;
  religion: string;
  country: string;
  city: string;
  state?: string;
  understand_english: string;
  field_of_work: string;
  maritalStatus?: string;
  martialStatus?: string;
  childrenStatus?: string;
  children?: string;
  isAggredTandC: boolean;
  profileFor?: string;
  iAm?: string;
  firstName?: string;
  lastName?: string;
  nativeCountry?: string;
  citizenship?: string;
  height?: string;
  caste?: string;
  subCaste?: string;
  motherTongue?: string;
  education?: string;
  profession?: string;
  company?: string | null;
  diet?: string;
  smoking?: string;
  drinking?: string;
  hobbies?: string[];
  fatherDetails?: string;
  motherDetails?: string;
  siblingsDetails?: string;
  familyDetails?: string;
  birthTime?: string;
  zodiac?: string;
  star?: string;
  registrationId?: string;
  createdAt: string;
  updatedAt: string;
}

interface Preferences {
  id: number;
  userId: number;
  looking_for: string;
  looking_goal: string[];
  martialStatus: string | null;
  preferredPersonality: string;
  preferredGender: string | null;
  ageRangefrom: number | null;
  ageRangeTo: number | null;
  country: string | null;
  city: string | null;
  countryCode: string | null;
  address: string | null;
  state: string | null;
  zip: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Verification {
  id: number;
  userId: number;
  emailVerified: boolean;
  phoneVerified: boolean;
  isBanned: boolean;
  banReason: string | null;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  profileId: string;
  userName: string;
  email: string;
  password: string;
  phoneNumber: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  profile: Profile;
  preferences: Preferences;
  posts: Post[];
  verification: Verification;
  engagement: any | null;
  receivedMessage: any[];
  reportedBy: any[];
  reportsGiven: any[];
  sendMessage: any[];
  subscription: any | null;
}


// export interface Post{
//   id: number,
//   description: string,
//   userId: number,
//   image : Image[],
//   createdAt: string,
//   updatedAt: string
// }

// export interface Image{
//   id: number,
//   image: string,
//   postId: number,
// }

export interface Image {
  id: number;
  image: string;
  postId: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Post {
  id: number;
  userId: number;
  description: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  image: Image[];
}