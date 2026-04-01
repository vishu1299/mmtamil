export interface User {
  id: number;
  profileId: string;
  registrationId?: string;
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
  posts: PostResponse[];
  verification: Verification;
  engagement: any | null;
  receivedMessage: any[];
  reportedBy: any[];
  reportsGiven: any[];
  sendMessage: any[];
  subscription: any | null;
  interestGiven: any[];
  interestReceived: Interest[];
  followers: Follower[];
  following: Follower[];
}

export interface Follower {
  id: string;
  followerId: number;
  followingId: number;
  status: "FOLLOW" | "UNFOLLOW"; // Assuming possible statuses; adjust as needed.
  createdAt: string; // Or use Date if you'll parse it.
  updatedAt: string; // Or use Date if you'll parse it.
}

export interface PostResponse {
  id: number;
  description: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  comments: any[];
  LikeDislike: any[];
  User: User;
  image: Image[];
}

export interface Profile {
  id: number;
  userId: number;
  gender: string;
  dateOfBirth: string;
  profilePicture: string;
  bio: string;
  interests: any[];
  languagesSpoken: any[];
  traits: any[];
  movies: any[];
  music: any[];
  personality: string | null;
  country: string | null;
  city: string | null;
  field_of_work: string | null;
  understand_english: string;
  credits: number;
  religion: string;
  martialStatus: string;
  children: string;
  isAggredTandC: boolean;
  registrationId?: string;
  createdAt: string;
  updatedAt: string;
  /** API may send `maritalStatus`; normalized into `martialStatus`. */
  maritalStatus?: string;
  childrenStatus?: string;
  height?: string | null;
  caste?: string | null;
  subCaste?: string | null;
  motherTongue?: string | null;
  education?: string | null;
  profession?: string | null;
  company?: string | null;
  state?: string | null;
  birthTime?: string | null;
  zodiac?: string | null;
  star?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  fatherDetails?: string | null;
  motherDetails?: string | null;
  siblingsDetails?: string | null;
  familyDetails?: string | null;
  hobbies?: any[];
}

export interface Preferences {
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

export interface Verification {
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

export interface Interest {
  id: number;
  userId: number;
  targetId: number;
  type: string;
  interestAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

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



export interface sliderPropaginatedResponse {
    data: {
        id: number;
        profile: {
            profilePicture: string | null;
        };
    }[];
    currentPage: number;
    totalPages: number;
    totalRecords: number;
}