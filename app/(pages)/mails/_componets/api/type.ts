interface Image {
    id: number;
    image: string;
    postId: number;
    createdAt: string;
    updatedAt: string;
  }
  
  interface Post {
    id: number;
    description: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
    image: Image[];
    LikeDislike: any[];
    comments: any[];
    profile: Profile,
   
  }
  



  interface Profile {
    id: number;
    userId: number;
    userName:string;
    gender: string | null;
    dateOfBirth: string;
    profilePicture: string | null;
    bio: string;
    interests: string[];
    languagesSpoken: string[];
    traits: string[];
    movies: string[];
    music: string[];
    personality: string;
    country: string;
    city: string;
    field_of_work: string;
    understand_english: string;
    credits: number;
    religion: string;
    martialStatus: string;
    children: string;
    isAggredTandC: boolean;
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
    preferredGender: string;
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
    token: string | null;
    phoneVerified: boolean;
    isBanned: boolean;
    banReason: string | null;
    lastLoginAt: string;
    createdAt: string;
    updatedAt: string;
  }
  
  interface Follower {
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
  }
  
  interface Following {
    id: string;
    followerId: number;
    followingId: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    follower: Follower;
    following: User; 
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
    interestGiven: any[];
    interestReceived: any[];
    followers: Following[];
    following: Following[];
  }
  