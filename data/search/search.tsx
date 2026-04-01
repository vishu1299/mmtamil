


interface SearchImgItem {
  id: number;
  name: string;
  age: string;
  image: string;
  camera: number;
  mutipleImages: { image: string }[];
  location: string; 
  dob: string; 
  relationship: string;
  occupation: string;  
  interests: { interest: string}[]; 
  Looking: { Looking: string}[];
  About: { About: string}[];
  AboutDescription: string; 
  aboutMe: string;
}

interface SearchImg {
  [key: number]: SearchImgItem;
}

interface SearchImgGift {
  id: number;
  image: string;
}

interface SearchGifts {
  [key: number]: SearchImgGift;
}

export const SearchGifts: SearchGifts = {
  1: { id: 1, image: "/assets/images/search/diamonds.webp" },
  2: { id: 2, image: "/assets/images/search/diamonds.webp" },
  3: { id: 3, image: "/assets/images/search/diamonds.webp" },
  4: { id: 4, image: "/assets/images/search/diamonds.webp" },
};


export const SearchImg: SearchImg= {
  1: {
    id: 1,
    name: "Carolina",
    aboutMe:"I am seriously considering a change",
    location: "Ukraine",
    dob:"January 03, 1984",
    relationship: "Single",
    occupation: "Engineer",
    interests : [{interest: "Pets"}, {interest: "Traveling"}, {interest: "Gardening"}, {interest: "Cooking"}, {interest: "Tennis"}],
    Looking:[{Looking:"attention"}, {Looking:"People aged:18 - 90"}, {Looking:"Personality type: Homebody"}],
    About:[{About:"Optimistic"}, {About:"Cheerful"}, {About:"Curious"}],
    AboutDescription:"While gardening, I discovered that caring for plants is like caring for friends: a little love, a little water, and they bloom! As a nutritional scientist, I believe that proper nutrition is the key to happiness. Sports, nature and delicious cooking is what fills my days with joy. I love watching shows and movies, and sometimes catch myself thinking that my garden is better than some screen characters! Looking for someone I can discuss the latest series with and experiment in the kitchen together. If you are also looking for someone who will understand you from half a word, I am the one you are looking for LOL",
    age: "23",
    image: "/assets/images/search/body (8).webp",
    camera: 8,
    mutipleImages: [
      { image: "/assets/images/search/body (9).webp" },
      { image: "/assets/images/people/body (10).webp" },
    
      { image: "/assets/images/search/body (12).webp" },
      { image: "/assets/images/search/body (12).webp" },
      { image: "/assets/images/search/body (12).webp" },
      { image: "/assets/images/search/body (12).webp" },
      { image: "/assets/images/search/body (12).webp" },
      { image: "/assets/images/search/body (12).webp" },
      { image: "/assets/images/search/body (12).webp" },
      { image: "/assets/images/search/body (12).webp" },
      { image: "/assets/images/search/body (12).webp" },
    ]
  },
  2: {
    id: 2,
    name: "Olena",
    age: "30",
    location: "New York",
    aboutMe:"How about a nice vacation?",
    dob:"January 03, 1984",
    relationship: "Single",
    occupation: "Engineer",
    Looking:[{Looking:"Chatting"},{Looking:"attention"}, {Looking:"People aged: 18 - 90"}, {Looking:"Personality type: Homebody"}],
    interests : [{interest: "Pets"}, {interest: "Traveling"}, {interest: "Gardening"}, {interest: "Cooking"}, {interest: "Tennis"}],
    About:[{About:"Optimistic"}, {About:"Cheerful"}, {About:"Curious"}],
    AboutDescription:"While gardening, I discovered that caring for plants is like caring for friends: a little love, a little water, and they bloom! As a nutritional scientist, I believe that proper nutrition is the key to happiness. Sports, nature and delicious cooking is what fills my days with joy. I love watching shows and movies, and sometimes catch myself thinking that my garden is better than some screen characters! Looking for someone I can discuss the latest series with and experiment in the kitchen together. If you are also looking for someone who will understand you from half a word, I am the one you are looking for LOL",
    image: "/assets/images/search/body (12).webp",
    camera: 12,
    mutipleImages: [
      { image: "/assets/images/search/body (13).webp" },
      { image: "/assets/images/search/body (14).webp" },
      { image: "/assets/images/search/body (15).webp" },
      { image: "/assets/images/search/body (15).webp" },
      { image: "/assets/images/search/body (15).webp" },
      { image: "/assets/images/search/body (15).webp" },
      { image: "/assets/images/search/body (15).webp" },
      { image: "/assets/images/search/body (12).webp" },
    ]
  },
  3: {
    id: 3,
    name: "Emmalyn",
    location: "New York",
    dob:"January 03, 1984",
    aboutMe:"rainy days",
    relationship: "Single",
    occupation: "Engineer",
    interests : [{interest: "Pets"}, {interest: "Traveling"}, {interest: "Gardening"}, {interest: "Cooking"}, {interest: "Tennis"}],
    Looking:[{Looking:"Chatting"},{Looking:"attention"}, {Looking:"People aged: 18 - 90"}, {Looking:"Personality type: Homebody"}],
    About:[{About:"Optimistic"}, {About:"Cheerful"}, {About:"Curious"}],
    AboutDescription:"While gardening, I discovered that caring for plants is like caring for friends: a little love, a little water, and they bloom! As a nutritional scientist, I believe that proper nutrition is the key to happiness. Sports, nature and delicious cooking is what fills my days with joy. I love watching shows and movies, and sometimes catch myself thinking that my garden is better than some screen characters! Looking for someone I can discuss the latest series with and experiment in the kitchen together. If you are also looking for someone who will understand you from half a word, I am the one you are looking for LOL",
    age: "20",
    image: "/assets/images/search/body (18).webp",
    camera: 32,
    mutipleImages: [
      { image: "/assets/images/search/body (17).webp" },
      { image: "/assets/images/search/body (18).webp" },
      { image: "/assets/images/search/body (19).webp" },
      { image: "/assets/images/search/body (19).webp" },
      { image: "/assets/images/search/body (19).webp" },
      { image: "/assets/images/search/body (19).webp" },
      { image: "/assets/images/search/body (19).webp" },
    ]
  },
  4: {
    id: 4,
    name: "Lapat",
    location: "New York",
    dob:"January 03, 1984",
    aboutMe:"invite me to dance, come and seduce me",
    relationship: "Single",
    occupation: "Engineer",
    Looking:[{Looking:"Chatting"},{Looking:"attention"}, {Looking:"People aged: 18 - 90"}, {Looking:"Personality type: Homebody"}],
    interests : [{interest: "Pets"}, {interest: "Traveling"}, {interest: "Gardening"}, {interest: "Cooking"}, {interest: "Tennis"}],
    About:[{About:"Optimistic"}, {About:"Cheerful"}, {About:"Curious"}],
    AboutDescription:"While gardening, I discovered that caring for plants is like caring for friends: a little love, a little water, and they bloom! As a nutritional scientist, I believe that proper nutrition is the key to happiness. Sports, nature and delicious cooking is what fills my days with joy. I love watching shows and movies, and sometimes catch myself thinking that my garden is better than some screen characters! Looking for someone I can discuss the latest series with and experiment in the kitchen together. If you are also looking for someone who will understand you from half a word, I am the one you are looking for LOL",
    age: "18",
    image: "/assets/images/search/body (4).webp",
    camera: 6,
    mutipleImages: [
      { image: "/assets/images/search/body (1).webp" },
      { image: "/assets/images/search/body (2).webp" },
      { image: "/assets/images/search/body (7).webp" }
    ]
  },
  5: {
    id: 5,
    name: "Alejandra",
    age: "25",
    aboutMe:"How about a nice vacation?",
    location: "New York",
    dob:"January 03, 1984",
    relationship: "Single",
    occupation: "Engineer",
    Looking:[{Looking:"Chatting"},{Looking:"attention"}, {Looking:"People aged: 18 - 90"}, {Looking:"Personality type: Homebody"}],
    interests : [{interest: "Pets"}, {interest: "Traveling"}, {interest: "Gardening"}, {interest: "Cooking"}, {interest: "Tennis"}],
    About:[{About:"Optimistic"}, {About:"Cheerful"}, {About:"Curious"}],
    AboutDescription:"While gardening, I discovered that caring for plants is like caring for friends: a little love, a little water, and they bloom! As a nutritional scientist, I believe that proper nutrition is the key to happiness. Sports, nature and delicious cooking is what fills my days with joy. I love watching shows and movies, and sometimes catch myself thinking that my garden is better than some screen characters! Looking for someone I can discuss the latest series with and experiment in the kitchen together. If you are also looking for someone who will understand you from half a word, I am the one you are looking for LOL",
    image: "/assets/images/search/body (5).webp",
    camera: 21,
    mutipleImages: [
      { image: "/assets/images/search/body (1).webp" },
      { image: "/assets/images/search/body (2).webp" },
      { image: "/assets/images/search/body (7).webp" }
    ]
  },
  6: {
    id: 6,
    name: "Monroe",
    age: "25",
    location: "New York",
    aboutMe:"How about a nice vacation?",
    dob:"January 03, 1984",
    relationship: "Single",
    occupation: "Engineer",
    Looking:[{Looking:"Chatting"},{Looking:"attention"}, {Looking:"People aged: 18 - 90"}, {Looking:"Personality type: Homebody"}],
    interests : [{interest: "Pets"}, {interest: "Traveling"}, {interest: "Gardening"}, {interest: "Cooking"}, {interest: "Tennis"}],
    About:[{About:"Optimistic"}, {About:"Cheerful"}, {About:"Curious"}],
    AboutDescription:"While gardening, I discovered that caring for plants is like caring for friends: a little love, a little water, and they bloom! As a nutritional scientist, I believe that proper nutrition is the key to happiness. Sports, nature and delicious cooking is what fills my days with joy. I love watching shows and movies, and sometimes catch myself thinking that my garden is better than some screen characters! Looking for someone I can discuss the latest series with and experiment in the kitchen together. If you are also looking for someone who will understand you from half a word, I am the one you are looking for LOL",
    image: "/assets/images/search/body (6).webp",
    camera: 44,
    mutipleImages: [
      { image: "/assets/images/search/body (1).webp" },
      { image: "/assets/images/search/body (2).webp" },
      { image: "/assets/images/search/body (7).webp" }
    ]
  },
  7: {
    id: 7,
    name: "Kellen",
    age: "27",
    location: "New York",
    aboutMe:"How about a nice vacation?",
    dob:"January 03, 1984",
    relationship: "Single",
    occupation: "Engineer",
    Looking:[{Looking:"Chatting"},{Looking:"attention"}, {Looking:"People aged: 18 - 90"}, {Looking:"Personality type: Homebody"}],
    interests : [{interest: "Pets"}, {interest: "Traveling"}, {interest: "Gardening"}, {interest: "Cooking"}, {interest: "Tennis"}],
    About:[{About:"Optimistic"}, {About:"Cheerful"}, {About:"Curious"}],
    AboutDescription:"While gardening, I discovered that caring for plants is like caring for friends: a little love, a little water, and they bloom! As a nutritional scientist, I believe that proper nutrition is the key to happiness. Sports, nature and delicious cooking is what fills my days with joy. I love watching shows and movies, and sometimes catch myself thinking that my garden is better than some screen characters! Looking for someone I can discuss the latest series with and experiment in the kitchen together. If you are also looking for someone who will understand you from half a word, I am the one you are looking for LOL",
    image: "/assets/images/search/body (7).webp",
    camera: 18,
    mutipleImages: [
      { image: "/assets/images/search/body (1).webp" },
      { image: "/assets/images/search/body (2).webp" },
      { image: "/assets/images/search/body (7).webp" }
    ]
  },
  8: {
    id: 8,
    name: "Carolina",
    location: "Ukraine",
    dob:"January 03, 1984",
    relationship: "Single",
    occupation: "Engineer",
    aboutMe:"How about a nice vacation?",
    interests : [{interest: "Pets"}, {interest: "Traveling"}, {interest: "Gardening"}, {interest: "Cooking"}, {interest: "Tennis"}],
    Looking:[{Looking:"attention"}, {Looking:"People aged:18 - 90"}, {Looking:"Personality type: Homebody"}],
    About:[{About:"Optimistic"}, {About:"Cheerful"}, {About:"Curious"}],
    AboutDescription:"While gardening, I discovered that caring for plants is like caring for friends: a little love, a little water, and they bloom! As a nutritional scientist, I believe that proper nutrition is the key to happiness. Sports, nature and delicious cooking is what fills my days with joy. I love watching shows and movies, and sometimes catch myself thinking that my garden is better than some screen characters! Looking for someone I can discuss the latest series with and experiment in the kitchen together. If you are also looking for someone who will understand you from half a word, I am the one you are looking for LOL",
    age: "23",
    image: "/assets/images/search/body (8).webp",
    camera: 8,
    mutipleImages: [
      { image: "/assets/images/search/body (9).webp" },
      { image: "/assets/images/search/body (10).webp" },
      { image: "/assets/images/search/body (11).webp" },
      { image: "/assets/images/search/body (12).webp" }
    ]
  },
  9: {
    id: 9,
    name: "Olena",
    age: "30",
    location: "New York",
    aboutMe:"How about a nice vacation?",
    dob:"January 03, 1984",
    relationship: "Single",
    occupation: "Engineer",
    Looking:[{Looking:"Chatting"},{Looking:"attention"}, {Looking:"People aged: 18 - 90"}, {Looking:"Personality type: Homebody"}],
    interests : [{interest: "Pets"}, {interest: "Traveling"}, {interest: "Gardening"}, {interest: "Cooking"}, {interest: "Tennis"}],
    About:[{About:"Optimistic"}, {About:"Cheerful"}, {About:"Curious"}],
    AboutDescription:"While gardening, I discovered that caring for plants is like caring for friends: a little love, a little water, and they bloom! As a nutritional scientist, I believe that proper nutrition is the key to happiness. Sports, nature and delicious cooking is what fills my days with joy. I love watching shows and movies, and sometimes catch myself thinking that my garden is better than some screen characters! Looking for someone I can discuss the latest series with and experiment in the kitchen together. If you are also looking for someone who will understand you from half a word, I am the one you are looking for LOL",
    image: "/assets/images/search/body (12).webp",
    camera: 12,
    mutipleImages: [
      { image: "/assets/images/search/body (13).webp" },
      { image: "/assets/images/search/body (14).webp" },
      { image: "/assets/images/search/body (15).webp" },
      { image: "/assets/images/search/body (12).webp" }
    ]
  },
  10: {
    id: 10,
    name: "Emmalyn",
    location: "New York",
    aboutMe:"How about a nice vacation?",
    dob:"January 03, 1984",
    relationship: "Single",
    occupation: "Engineer",
    interests : [{interest: "Pets"}, {interest: "Traveling"}, {interest: "Gardening"}, {interest: "Cooking"}, {interest: "Tennis"}],
    Looking:[{Looking:"Chatting"},{Looking:"attention"}, {Looking:"People aged: 18 - 90"}, {Looking:"Personality type: Homebody"}],
    About:[{About:"Optimistic"}, {About:"Cheerful"}, {About:"Curious"}],
    AboutDescription:"While gardening, I discovered that caring for plants is like caring for friends: a little love, a little water, and they bloom! As a nutritional scientist, I believe that proper nutrition is the key to happiness. Sports, nature and delicious cooking is what fills my days with joy. I love watching shows and movies, and sometimes catch myself thinking that my garden is better than some screen characters! Looking for someone I can discuss the latest series with and experiment in the kitchen together. If you are also looking for someone who will understand you from half a word, I am the one you are looking for LOL",
    age: "20",
    image: "/assets/images/search/body (18).webp",
    camera: 32,
    mutipleImages: [
      { image: "/assets/images/search/body (17).webp" },
      { image: "/assets/images/search/body (18).webp" },
      { image: "/assets/images/search/body (19).webp" }
    ]
  },
  11: {
    id: 11,
    name: "Lapat",
    location: "New York",
    dob:"January 03, 1984",
    aboutMe:"How about a nice vacation?",
    relationship: "Single",
    occupation: "Engineer",
    Looking:[{Looking:"Chatting"},{Looking:"attention"}, {Looking:"People aged: 18 - 90"}, {Looking:"Personality type: Homebody"}],
    interests : [{interest: "Pets"}, {interest: "Traveling"}, {interest: "Gardening"}, {interest: "Cooking"}, {interest: "Tennis"}],
    About:[{About:"Optimistic"}, {About:"Cheerful"}, {About:"Curious"}],
    AboutDescription:"While gardening, I discovered that caring for plants is like caring for friends: a little love, a little water, and they bloom! As a nutritional scientist, I believe that proper nutrition is the key to happiness. Sports, nature and delicious cooking is what fills my days with joy. I love watching shows and movies, and sometimes catch myself thinking that my garden is better than some screen characters! Looking for someone I can discuss the latest series with and experiment in the kitchen together. If you are also looking for someone who will understand you from half a word, I am the one you are looking for LOL",
    age: "18",
    image: "/assets/images/search/body (4).webp",
    camera: 6,
    mutipleImages: [
      { image: "/assets/images/search/body (1).webp" },
      { image: "/assets/images/search/body (2).webp" },
      { image: "/assets/images/search/body (7).webp" }
    ]
  },
  12: {
    id: 12,
    name: "Alejandra",
    age: "25",
    location: "New York",
    aboutMe:"How about a nice vacation?",
    dob:"January 03, 1984",
    relationship: "Single",
    occupation: "Engineer",
    Looking:[{Looking:"Chatting"},{Looking:"attention"}, {Looking:"People aged: 18 - 90"}, {Looking:"Personality type: Homebody"}],
    interests : [{interest: "Pets"}, {interest: "Traveling"}, {interest: "Gardening"}, {interest: "Cooking"}, {interest: "Tennis"}],
    About:[{About:"Optimistic"}, {About:"Cheerful"}, {About:"Curious"}],
    AboutDescription:"While gardening, I discovered that caring for plants is like caring for friends: a little love, a little water, and they bloom! As a nutritional scientist, I believe that proper nutrition is the key to happiness. Sports, nature and delicious cooking is what fills my days with joy. I love watching shows and movies, and sometimes catch myself thinking that my garden is better than some screen characters! Looking for someone I can discuss the latest series with and experiment in the kitchen together. If you are also looking for someone who will understand you from half a word, I am the one you are looking for LOL",
    image: "/assets/images/search/body (5).webp",
    camera: 21,
    mutipleImages: [
      { image: "/assets/images/search/body (1).webp" },
      { image: "/assets/images/search/body (2).webp" },
      { image: "/assets/images/search/body (7).webp" }
    ]
  },
  13: {
    id: 13,
    name: "Monroe",
    age: "25",
    location: "New York",
    aboutMe:"How about a nice vacation?",
    dob:"January 03, 1984",
    relationship: "Single",
    occupation: "Engineer",
    Looking:[{Looking:"Chatting"},{Looking:"attention"}, {Looking:"People aged: 18 - 90"}, {Looking:"Personality type: Homebody"}],
    interests : [{interest: "Pets"}, {interest: "Traveling"}, {interest: "Gardening"}, {interest: "Cooking"}, {interest: "Tennis"}],
    About:[{About:"Optimistic"}, {About:"Cheerful"}, {About:"Curious"}],
    AboutDescription:"While gardening, I discovered that caring for plants is like caring for friends: a little love, a little water, and they bloom! As a nutritional scientist, I believe that proper nutrition is the key to happiness. Sports, nature and delicious cooking is what fills my days with joy. I love watching shows and movies, and sometimes catch myself thinking that my garden is better than some screen characters! Looking for someone I can discuss the latest series with and experiment in the kitchen together. If you are also looking for someone who will understand you from half a word, I am the one you are looking for LOL",
    image: "/assets/images/search/body (6).webp",
    camera: 44,
    mutipleImages: [
      { image: "/assets/images/search/body (1).webp" },
      { image: "/assets/images/search/body (2).webp" },
      { image: "/assets/images/search/body (7).webp" }
    ]
  },
  14: {
    id: 14,
    name: "Kellen",
    age: "27",
    location: "New York",
    dob:"January 03, 1984",
    aboutMe:"How about a nice vacation?",
    relationship: "Single",
    occupation: "Engineer",
    Looking:[{Looking:"Chatting"},{Looking:"attention"}, {Looking:"People aged: 18 - 90"}, {Looking:"Personality type: Homebody"}],
    interests : [{interest: "Pets"}, {interest: "Traveling"}, {interest: "Gardening"}, {interest: "Cooking"}, {interest: "Tennis"}],
    About:[{About:"Optimistic"}, {About:"Cheerful"}, {About:"Curious"}],
    AboutDescription:"While gardening, I discovered that caring for plants is like caring for friends: a little love, a little water, and they bloom! As a nutritional scientist, I believe that proper nutrition is the key to happiness. Sports, nature and delicious cooking is what fills my days with joy. I love watching shows and movies, and sometimes catch myself thinking that my garden is better than some screen characters! Looking for someone I can discuss the latest series with and experiment in the kitchen together. If you are also looking for someone who will understand you from half a word, I am the one you are looking for LOL",
    image: "/assets/images/search/body (7).webp",
    camera: 18,
    mutipleImages: [
      { image: "/assets/images/search/body (1).webp" },
      { image: "/assets/images/search/body (2).webp" },
      { image: "/assets/images/search/body (7).webp" }
    ]
  },
  15: {
    id: 15,
    name: "Carolina",
    location: "Ukraine",
    dob:"January 03, 1984",
    aboutMe:"How about a nice vacation?",
    relationship: "Single",
    occupation: "Engineer",
    interests : [{interest: "Pets"}, {interest: "Traveling"}, {interest: "Gardening"}, {interest: "Cooking"}, {interest: "Tennis"}],
    Looking:[{Looking:"attention"}, {Looking:"People aged:18 - 90"}, {Looking:"Personality type: Homebody"}],
    About:[{About:"Optimistic"}, {About:"Cheerful"}, {About:"Curious"}],
    AboutDescription:"While gardening, I discovered that caring for plants is like caring for friends: a little love, a little water, and they bloom! As a nutritional scientist, I believe that proper nutrition is the key to happiness. Sports, nature and delicious cooking is what fills my days with joy. I love watching shows and movies, and sometimes catch myself thinking that my garden is better than some screen characters! Looking for someone I can discuss the latest series with and experiment in the kitchen together. If you are also looking for someone who will understand you from half a word, I am the one you are looking for LOL",
    age: "23",
    image: "/assets/images/search/body (8).webp",
    camera: 8,
    mutipleImages: [
      { image: "/assets/images/search/body (9).webp" },
      { image: "/assets/images/search/body (10).webp" },
      { image: "/assets/images/search/body (11).webp" },
      { image: "/assets/images/search/body (12).webp" }
    ]
  },
  16: {
    id: 16,
    name: "Olena",
    age: "30",
    location: "New York",
    aboutMe:"How about a nice vacation?",
    dob:"January 03, 1984",
    relationship: "Single",
    occupation: "Engineer",
    Looking:[{Looking:"Chatting"},{Looking:"attention"}, {Looking:"People aged: 18 - 90"}, {Looking:"Personality type: Homebody"}],
    interests : [{interest: "Pets"}, {interest: "Traveling"}, {interest: "Gardening"}, {interest: "Cooking"}, {interest: "Tennis"}],
    About:[{About:"Optimistic"}, {About:"Cheerful"}, {About:"Curious"}],
    AboutDescription:"While gardening, I discovered that caring for plants is like caring for friends: a little love, a little water, and they bloom! As a nutritional scientist, I believe that proper nutrition is the key to happiness. Sports, nature and delicious cooking is what fills my days with joy. I love watching shows and movies, and sometimes catch myself thinking that my garden is better than some screen characters! Looking for someone I can discuss the latest series with and experiment in the kitchen together. If you are also looking for someone who will understand you from half a word, I am the one you are looking for LOL",
    image: "/assets/images/search/body (12).webp",
    camera: 12,
    mutipleImages: [
      { image: "/assets/images/search/body (13).webp" },
      { image: "/assets/images/search/body (14).webp" },
      { image: "/assets/images/search/body (15).webp" },
      { image: "/assets/images/search/body (12).webp" }
    ]
  },
  17: {
    id: 17,
    name: "Emmalyn",
    location: "New York",
    dob:"January 03, 1984",
    relationship: "Single",
    occupation: "Engineer",
    aboutMe:"How about a nice vacation?",
    interests : [{interest: "Pets"}, {interest: "Traveling"}, {interest: "Gardening"}, {interest: "Cooking"}, {interest: "Tennis"}],
    Looking:[{Looking:"Chatting"},{Looking:"attention"}, {Looking:"People aged: 18 - 90"}, {Looking:"Personality type: Homebody"}],
    About:[{About:"Optimistic"}, {About:"Cheerful"}, {About:"Curious"}],
    AboutDescription:"While gardening, I discovered that caring for plants is like caring for friends: a little love, a little water, and they bloom! As a nutritional scientist, I believe that proper nutrition is the key to happiness. Sports, nature and delicious cooking is what fills my days with joy. I love watching shows and movies, and sometimes catch myself thinking that my garden is better than some screen characters! Looking for someone I can discuss the latest series with and experiment in the kitchen together. If you are also looking for someone who will understand you from half a word, I am the one you are looking for LOL",
    age: "20",
    image: "/assets/images/search/body (18).webp",
    camera: 32,
    mutipleImages: [
      { image: "/assets/images/search/body (17).webp" },
      { image: "/assets/images/search/body (18).webp" },
      { image: "/assets/images/search/body (19).webp" }
    ]
  },
  18: {
    id: 18,
    name: "Lapat",
    location: "New York",
    dob:"January 03, 1984",
    relationship: "Single",
    aboutMe:"How about a nice vacation?",
    occupation: "Engineer",
    Looking:[{Looking:"Chatting"},{Looking:"attention"}, {Looking:"People aged: 18 - 90"}, {Looking:"Personality type: Homebody"}],
    interests : [{interest: "Pets"}, {interest: "Traveling"}, {interest: "Gardening"}, {interest: "Cooking"}, {interest: "Tennis"}],
    About:[{About:"Optimistic"}, {About:"Cheerful"}, {About:"Curious"}],
    AboutDescription:"While gardening, I discovered that caring for plants is like caring for friends: a little love, a little water, and they bloom! As a nutritional scientist, I believe that proper nutrition is the key to happiness. Sports, nature and delicious cooking is what fills my days with joy. I love watching shows and movies, and sometimes catch myself thinking that my garden is better than some screen characters! Looking for someone I can discuss the latest series with and experiment in the kitchen together. If you are also looking for someone who will understand you from half a word, I am the one you are looking for LOL",
    age: "18",
    image: "/assets/images/search/body (4).webp",
    camera: 6,
    mutipleImages: [
      { image: "/assets/images/search/body (1).webp" },
      { image: "/assets/images/search/body (2).webp" },
      { image: "/assets/images/search/body (7).webp" }
    ]
  },
  19: {
    id: 19,
    name: "Alejandra",
    age: "25",
    location: "New York",
    dob:"January 03, 1984",
    relationship: "Single",
    aboutMe:"How about a nice vacation?",
    occupation: "Engineer",
    Looking:[{Looking:"Chatting"},{Looking:"attention"}, {Looking:"People aged: 18 - 90"}, {Looking:"Personality type: Homebody"}],
    interests : [{interest: "Pets"}, {interest: "Traveling"}, {interest: "Gardening"}, {interest: "Cooking"}, {interest: "Tennis"}],
    About:[{About:"Optimistic"}, {About:"Cheerful"}, {About:"Curious"}],
    AboutDescription:"While gardening, I discovered that caring for plants is like caring for friends: a little love, a little water, and they bloom! As a nutritional scientist, I believe that proper nutrition is the key to happiness. Sports, nature and delicious cooking is what fills my days with joy. I love watching shows and movies, and sometimes catch myself thinking that my garden is better than some screen characters! Looking for someone I can discuss the latest series with and experiment in the kitchen together. If you are also looking for someone who will understand you from half a word, I am the one you are looking for LOL",
    image: "/assets/images/search/body (5).webp",
    camera: 21,
    mutipleImages: [
      { image: "/assets/images/search/body (1).webp" },
      { image: "/assets/images/search/body (2).webp" },
      { image: "/assets/images/search/body (7).webp" }
    ]
  },
  20: {
    id: 20,
    name: "Monroe",
    age: "25",
    location: "New York",
    dob:"January 03, 1984",
    relationship: "Single",
    occupation: "Engineer",
    aboutMe:"How about a nice vacation?",
    Looking:[{Looking:"Chatting"},{Looking:"attention"}, {Looking:"People aged: 18 - 90"}, {Looking:"Personality type: Homebody"}],
    interests : [{interest: "Pets"}, {interest: "Traveling"}, {interest: "Gardening"}, {interest: "Cooking"}, {interest: "Tennis"}],
    About:[{About:"Optimistic"}, {About:"Cheerful"}, {About:"Curious"}],
    AboutDescription:"While gardening, I discovered that caring for plants is like caring for friends: a little love, a little water, and they bloom! As a nutritional scientist, I believe that proper nutrition is the key to happiness. Sports, nature and delicious cooking is what fills my days with joy. I love watching shows and movies, and sometimes catch myself thinking that my garden is better than some screen characters! Looking for someone I can discuss the latest series with and experiment in the kitchen together. If you are also looking for someone who will understand you from half a word, I am the one you are looking for LOL",
    image: "/assets/images/search/body (6).webp",
    camera: 44,
    mutipleImages: [
      { image: "/assets/images/search/body (1).webp" },
      { image: "/assets/images/search/body (2).webp" },
      { image: "/assets/images/search/body (7).webp" }
    ]
  },
  21: {
    id: 21,
    name: "Kellen",
    age: "27",
    location: "New York",
    dob:"January 03, 1984",
    relationship: "Single",
    aboutMe:"How about a nice vacation?",
    occupation: "Engineer",
    Looking:[{Looking:"Chatting"},{Looking:"attention"}, {Looking:"People aged: 18 - 90"}, {Looking:"Personality type: Homebody"}],
    interests : [{interest: "Pets"}, {interest: "Traveling"}, {interest: "Gardening"}, {interest: "Cooking"}, {interest: "Tennis"}],
    About:[{About:"Optimistic"}, {About:"Cheerful"}, {About:"Curious"}],
    AboutDescription:"While gardening, I discovered that caring for plants is like caring for friends: a little love, a little water, and they bloom! As a nutritional scientist, I believe that proper nutrition is the key to happiness. Sports, nature and delicious cooking is what fills my days with joy. I love watching shows and movies, and sometimes catch myself thinking that my garden is better than some screen characters! Looking for someone I can discuss the latest series with and experiment in the kitchen together. If you are also looking for someone who will understand you from half a word, I am the one you are looking for LOL",
    image: "/assets/images/search/body (7).webp",
    camera: 18,
    mutipleImages: [
      { image: "/assets/images/search/body (1).webp" },
      { image: "/assets/images/search/body (2).webp" },
      { image: "/assets/images/search/body (7).webp" }
    ]
  }
};
