// components/Card.jsx
import React from 'react';
import Image from 'next/image';
import { FaRegTrashAlt, FaRegClock, FaRegEnvelope } from 'react-icons/fa';
import img from "@/public/assets/images/people/img1.webp"

const Card = ({ title, description, time = "Today, 02:23 pm" }: { title: string, description: string, imageUrl: string, linkUrl: string, time?: string }) => {
    return (
        <div className="w-full my-3 mx-0 rounded-xl overflow-hidden bg-white border border-border-soft transition-all duration-200 hover:shadow-md hover:border-maroon/20">
            <div className="flex flex-col md:flex-row gap-x-5 w-full p-4">
                <div className="flex items-start mb-4 md:mb-0">
                    <div className="relative">
                        <Image 
                            src={img} 
                            width={60} 
                            height={60} 
                            alt={title} 
                            className="w-14 h-14 rounded-full object-cover border-2 border-soft-rose" 
                        />
                        <span className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-[#2E7D32] rounded-full border-2 border-white"></span>
                    </div>
                </div>
                
                <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-y-2">
                        <div>
                            <div className="flex items-center gap-x-3 mb-1">
                                <h3 className="font-playfair font-semibold text-lg text-[#2C2C2C]">{title}</h3>
                                <span className="text-xs text-[#6B6B6B] flex items-center">
                                    <FaRegEnvelope className="mr-1 text-maroon/60" /> 2 letters total
                                </span>
                            </div>
                            <span className="inline-block bg-soft-rose text-maroon text-xs font-medium px-3 py-1 rounded-full">
                                Unanswered
                            </span>
                        </div>
                        <div className="text-xs text-[#6B6B6B] flex items-center">
                            <FaRegClock className="mr-1 text-maroon/50" /> {time}
                        </div>
                    </div>
                    
                    <div className="text-sm text-[#2C2C2C] bg-cream p-3 rounded-lg border-l-4 border-maroon">
                        {description}
                    </div>
                    
                    <div className="mt-3 flex justify-end">
                        <button className="text-[#6B6B6B] hover:text-red-600 transition-all duration-200 p-2 rounded-lg hover:bg-red-50">
                            <FaRegTrashAlt />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;

// // components/Card.jsx
// import React from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { FaRegTrashAlt } from 'react-icons/fa';
// import img from "@/public/assets/images/people/img1.webp"

// const Card = ({ title, description, imageUrl, linkUrl }: { title: string, description: string, imageUrl: string, linkUrl: string }) => {
//     return (
//         <div className=" w-full my-5 mx-5 rounded overflow-hidden  bg-white transition-all duration-300 hover:shadow-xl">
//             <div className='flex gap-x-8 w-full'>
//                 <div className='flex items-start  pb-10'>
//                 <Image src={img} width={60} height={30} alt='' className='w-16 h-16 rounded-full' />
//                 </div>
//                 <div className='w-full py-2'>
//                     <div className='flex mb-3 gap-y-3 flex-col items-start justify-start'>
//                         <p className='flex gap-x-3  items-center'>
//                             <span className='font-bold text-xl'>{title}</span>
//                             <span>2 letters total</span>
//                         </p>
//                         <p className='border px-4 py-0.5 rounded-lg'>
//                             Unanswered
//                         </p>
//                     </div>
//                     <div className='text-xl'>
//                         {description}
//                     </div>
//                 </div>
//             </div>
//             <div>

//             </div>
//         </div>
//     );
// };

// export default Card;