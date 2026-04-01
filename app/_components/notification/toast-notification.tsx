import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { customAxios } from '@/utils/axios-interceptor';
import { User } from '../navbar/api/type';
import ProfileButton from './progressButton';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ToastNotification({ userId, message }: { userId: number, message: string }) {
    const [visible, setVisible] = useState(true);
    const [userdata, setUserData] = useState<User | null>(null);
    const router = useRouter();
    const [progress, setProgress] = useState(100); // Start with full width (100%)


    const fetch = async (id: number) => {
        try {
            const response = await customAxios().get(`mmm/user-web/getById/${id}`)
            console.log("I am ready for your notification", response.data.data);
            setUserData(response.data.data)
        } catch (error) {
            console.log("Some error occured");
        }
    }
    const calculateAge = (dob: string) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }

        return age;
    };
    useEffect(() => {
        fetch(userId)
    }, [userId])

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev <= 0) {
                    clearInterval(interval);
                    return 0; // Stop the timer once it reaches 0
                }
                return prev - 1; // Decrease progress over time
            });
        }, 50); // Decrease progress every 50ms (adjust timing for smoother or faster progress)

        return () => clearInterval(interval); // Cleanup the interval on unmount or state change
    }, []);

    //   useEffect(() => {
    //     const timer = setTimeout(() => {
    //       setVisible(false);
    //     }, 5000);

    //     return () => clearTimeout(timer);
    //   }, []);

    if (!visible) return null;

    return (
        <>
            {userdata &&
                <div className="toast-slide-down fixed bottom-4 right-4 flex items-center rounded bg-black text-white shadow-lg overflow-hidden w-[350px] h-[120px]">

                    <div className="flex items-center p-2">
                        <div className="w-[100px] h-[100px] relative flex-shrink-0">
                            <div className="absolute bottom-0 right-0 bg-black rounded-full p-1">
                                <Star color="gold" size={20} fill="gold" />
                            </div>
                            <div className="w-full h-full bg-gray-300 rounded overflow-hidden">
                                {/* This would be an actual image in production */}
                                <div className=" bg-gray-600">
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${userdata.profile.profilePicture}`}
                                        alt={`${userdata.userName}'s profile`}
                                        width={100}
                                        height={100}
                                        className=" w-[100px] h-[100px]"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className='flex flex-col items-between h-full p-2 justify-between'>
                        <div className="ml-3 flex flex-col">
                            <div className="flex items-center">
                                <span className="font-bold text-md">{userdata.userName}, {calculateAge(userdata.profile.dateOfBirth)}</span>
                                <span className="ml-2 w-2 h-2 bg-green-400 rounded-full"></span>
                            </div>
                            <p className="text-gray-400 text-sm">{message}</p>
                        </div>

                        <div
                            onClick={() => router.push(`/search/${userdata.id}`)}
                            className="relative ml-2 bg-gray-500 cursor-pointer overflow-hidden"
                        >
                            <div
                                className="absolute bottom-0 left-0 h-full bg-orange-700"
                                style={{
                                    width: `${progress}%`,
                                    transition: "width 0.05s linear",
                                }}
                            />
                            <button
                                className="relative z-10 text-white py-2 px-6 h-full flex items-center justify-center"
                                onClick={(e) => e.stopPropagation()} // prevent double push if needed
                            >
                                <span className="font-medium">View profile</span>
                                <span className="ml-1">→</span>
                            </button>
                        </div>

                    </div>
                </div>
            }
        </>
    );
}