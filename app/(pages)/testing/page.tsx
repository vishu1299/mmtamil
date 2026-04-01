"use client"
// pages/index.tsx
import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Bell, Heart, User, Menu, ShoppingCart, X } from 'lucide-react';
import { FaTrash } from 'react-icons/fa';

interface BlogPost {
  id: number;
  image: string;
  title: string;
  date: string;
}

export default function Home() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: 1,
      image: '/rilakkuma-flowers.jpg',
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
      date: '2025/04/03',
    },
    {
      id: 2,
      image: '/rilakkuma-black.jpg',
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
      date: '2025/04/02',
    },
    {
      id: 3,
      image: '/rilakkuma-yellow.jpg',
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
      date: '2025/04/01',
    },
    {
      id: 3,
      image: '/rilakkuma-yellow.jpg',
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
      date: '2025/04/01',
    },
    {
      id: 3,
      image: '/rilakkuma-yellow.jpg',
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
      date: '2025/04/01',
    },
    {
      id: 3,
      image: '/rilakkuma-yellow.jpg',
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
      date: '2025/04/01',
    },
  ]);

  const deleteNotification = (id: number) => {
    setBlogPosts(blogPosts.filter(post => post.id !== id));
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-16">
      {/* <Head>
        <title>San-X Net Shop</title>
        <meta name="description" content="San-X Net Shop featuring Rilakkuma" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head> */}

      {/* Header Section */}
      {/* <header className="bg-red-200 p-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="text-white font-bold">CHECK!</span>
          <span className="text-white">サンエックスネットショップ 会員特典</span>
          <Image 
            src="/rilakkuma-icon.png" 
            alt="Rilakkuma icon" 
            width={24} 
            height={24} 
          />
        </div>
        <p className="text-white text-sm">詳しくはこちら</p>
      </header> */}

      {/* Logo Section */}
      {/* <div className="bg-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="text-blue-500 font-bold text-lg sm:text-xl md:text-2xl">San-X</div>
          <div className="text-green-600 font-bold text-lg sm:text-xl md:text-2xl">Net shop</div>
        </div>
        <div className="flex items-center">
          <div className="text-amber-800 font-bold text-lg sm:text-xl md:text-2xl">RILAK</div>
          <div className="text-amber-800 font-bold text-lg sm:text-xl md:text-2xl">KUMA™</div>
        </div>
      </div> */}

      {/* Blog Posts */}
      <div className="bg-white p-4 md:max-w-3xl md:mx-auto lg:max-w-4xl xl:max-w-5xl my-20">
        {blogPosts.length > 0 ? (
          blogPosts.map((post) => (
            <div key={post.id} className="mb-4 pb-4 border-b relative">
              <div className="flex items-center justify-center gap-4">
                <div className="mr-4">
                  <div className="bg-gray-200 h-16 w-16 sm:h-20 sm:w-20 rounded-md overflow-hidden">
                    <Image
                      src={post.image}
                      alt={`Blog post ${post.id}`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                <div className="flex-1 items-start justify-between pr-10">
                  <p className="text-gray-800 text-sm sm:text-base">{post.title}</p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-gray-500 text-xs sm:text-sm">{post.date}</p>
                    <Bell size={16} className="text-blue-500" />
                  </div>
                </div>
                <button 
                  onClick={() => deleteNotification(post.id)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  aria-label="Delete notification"
                >
                  <FaTrash size={16} className="text-gray-500" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No notifications available
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      {/* <div className="fixed bottom-0 left-0 right-0 bg-blue-50 border-t border-gray-300 flex justify-around p-3 z-10">
        <button className="flex flex-col items-center text-gray-600">
          <Menu size={20} />
        </button>
        <button className="flex flex-col items-center text-gray-600 border-2 border-red-400 rounded-md p-2">
          <Bell size={20} />
        </button>
        <button className="flex flex-col items-center text-gray-600">
          <Heart size={20} />
        </button>
        <button className="flex flex-col items-center bg-amber-800 text-white rounded-full px-4 py-2">
          <div className="flex items-center">
            <ShoppingCart size={16} />
            <span className="ml-1 text-sm">Shop</span>
          </div>
        </button>
        <button className="flex flex-col items-center text-gray-600">
          <User size={20} />
        </button>
      </div> */}
    </div>
  );
}