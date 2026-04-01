import { Card } from '@/components/ui/card';
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
        <div className='bg-black'>
           {image.length >0 && <Card className="mt-2 lg:h-[600px] flex">
                {image.length > 1 && 
                <button
                    onClick={() => handlePrev()}
                    className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
                >
                    <FaChevronLeft />
                </button>}
                <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${image[active].image}`}
                    width={1000}
                    height={296}
                    className="w-full  h-full "
                    alt={`${image}'s profile`}
                />
                {image.length>1 &&<button
                    onClick={() => handleNext(image.length)}
                    className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
                >
                    <FaChevronRight />
                </button>}
            </Card>
            }
        </div>
    )
}

export default MultipleImages
