export interface User {
  id: number;
  profileId: string;
  profile: UserProfile;
  userName: string;
  email: string;
  password: string;
  phoneNumber: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  followers: Follower[];
  following: Follower[];
}

export interface Image {
  id: number;
  image: string;
  postId: number;
  createdAt: string;
  updatedAt: string;
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

export interface UserProfile {
  id: number;
  userId: number;
  gender: string | null;
  dateOfBirth: string; // ISO date string
  profilePicture: string;
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
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
export interface Follower {
  id: string;
  followerId: number;
  followingId: number;
  status: "FOLLOW" | "UNFOLLOW"; // Assuming possible statuses; adjust as needed.
  createdAt: string; // Or use Date if you'll parse it.
  updatedAt: string; // Or use Date if you'll parse it.
}

//  POST TYPE

export interface FollowersResponse {
  followers: Follower[];
}

export interface Followers {
  following: FollowingUser;
}

export interface FollowingUser {
  id: number;
  userName: string;
  profile: Profile;
  posts: Post[];
}

export interface Post {
  id: number;
  description: string;
  userId: number;
  image: ImagePost[];
  LikeDislike: {
    id: string;
    userId: number;
    postId: number;
    status: "LIKE" | "UNLIKE";
    createdAt: string;
    updatedAt: string;
  }[];
  comments: {
    id: string;
    postId: number;
    userId: number;
    description: number;
    user: {
      userName: string;
      profile: {
        profilePicture: string;
      };
    };
    createdAt: string;
    updatedAt: string;
  }[];
}

export interface ImagePost {
  id: number;
  image: string;
  postId: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostUser {
  userName: string;
}

export interface Profile {
  id: number;
  userId: number;
  gender: string | null;
  dateOfBirth: string;
  profilePicture: string;
  bio: string;
  interests: any[]; // You can specify a type if you have one
  languagesSpoken: any[];
  traits: any[];
  movies: any[];
  music: any[];
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
