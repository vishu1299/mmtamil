// import { Card } from '@/components/ui/card';
import Image from 'next/image'
import React, { useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

interface Images {
    id: number;
    image: string;
    postId: number;
    createdAt: string;
    updatedAt: string;
}

const MultipleImages = ({image}:{image: Images[]}) => {
    const [active, setActive] = useState(0);

    const handlePrev = () => {
        if (active > 0) {
            setActive(active - 1)
        }
    }

    const handleNext = (end: number) => {
        if (active < end - 1) {
            setActive(active + 1)
        }
    }
    return (
        <div className="rounded-xl overflow-hidden max-w-2xl mx-auto bg-gray-900 shadow-2xl">
            {image.length > 0 && (
                <div className="relative aspect-square max-h-[450px] w-full">
                    <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${image[active].image}`}
                        fill
                        className="object-contain px-2 drop-shadow-2xl"
                        alt="Post image"
                        priority
                    />
                    {image.length > 1 && (
                        <>
                            <button
                                onClick={handlePrev}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-800/80 p-2 rounded-full hover:bg-gray-700 transition shadow-lg"
                            >
                                <FaChevronLeft className="text-white w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleNext(image.length)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800/80 p-2 rounded-full hover:bg-gray-700 transition shadow-lg"
                            >
                                <FaChevronRight className="text-white w-5 h-5" />
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default MultipleImages
