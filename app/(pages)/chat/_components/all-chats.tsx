"use client";

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSocket } from '../hooks/useSocket';
import { customAxios } from "@/utils/axios-interceptor";
import Image from 'next/image';
import { User } from "@/app/(pages)/search/type/type";
import LoadingPage from '../loading';

interface UserListProps {
  onSelectUser: (user: User) => void;
  selectedUserId: number;
  loggedInUserId: number | null;
}


export default function UserList({ onSelectUser, selectedUserId, loggedInUserId }: UserListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { getMessageCount } = useSocket();
 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await customAxios().get('mmm/user-web/allActiveUser');
        const users = response.data.data.data;
        
        console.log("API Response:", response.data);console.log( "active user",users.length); // Debugging

        if (response?.data?.data?.data) {
          const fetchedUsers: User[] = response.data.data.data;

          console.log("Logged-in User ID:", loggedInUserId); // Debugging

          // Ensure logged-in user is properly filtered
          const filteredUsers = fetchedUsers.filter(user => user.id !== loggedInUserId);
          
          console.log("Filtered Users:", filteredUsers); // Debugging
          
          setUsers(filteredUsers);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [loggedInUserId]); 

  if (loading) {
    return <div className="flex justify-center p-4"><LoadingPage/></div>;
  }

  return (
    <div className="h-full overflow-hidden">
      <ScrollArea className="h-[calc(100vh-180px)]"> {/* Adjust height to account for header and search */}
        <div>
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => onSelectUser(user)}
              className={`flex items-center p-3 rounded-lg cursor-pointer relative transition-all duration-200
                ${selectedUserId === user.id ? 'bg-soft-rose border-l-2 border-maroon' : 'hover:bg-soft-rose/50'}`}
            >
              <div className="relative">
                <Avatar className="h-10 w-10 border border-border-soft">
                  {user.profile?.profilePicture ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${user.profile.profilePicture}`}
                      alt={user.userName}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <AvatarFallback className="bg-soft-rose text-maroon font-semibold">{user.userName?.[0]?.toUpperCase()}</AvatarFallback>
                  )}
                </Avatar>
              </div>
              <div className="ml-3 flex-grow min-w-0">
                <p className="font-semibold text-sm text-[#2C2C2C] truncate">{user.userName}</p>
                <p className="text-xs text-[#6B6B6B] truncate">
                  {user.profile?.bio}
                </p>
              </div>
              {user.id !== selectedUserId && getMessageCount(user.id.toString()) > 0 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-maroon text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {getMessageCount(user.id.toString())}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
