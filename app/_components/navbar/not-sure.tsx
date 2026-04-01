"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { NotSureData } from "@/data/not-sure/not-sure";

import { DialogClose } from "@radix-ui/react-dialog";
import Image from "next/image";
import { useState } from "react";
import { BsFillQuestionCircleFill } from "react-icons/bs";

interface NotSureItem {
  id: number;
  name: string;
  image: string;
}

function NotSure() {
  const [notSureData] = useState<NotSureItem[]>(NotSureData);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const [currentName, setCurrentName] = useState("Not Sure");
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const handleSave = () => {
    const selectedItem = notSureData.find((item) => item.id === selectedOption);
    console.log("selectedItem", selectedItem?.name);

    if (selectedItem) {
      setCurrentName(selectedItem.name);
      setCurrentImage(selectedItem.image);
    } else {
      setCurrentName("Not Sure");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex flex-col justify-center items-center py-4 w-[75px] xl:w-[90px] gap-y-1 cursor-pointer">
          {currentImage ? (
            <Image src={currentImage} width={30} height={30} alt="icon" />
          ) : (
            <BsFillQuestionCircleFill className="text-4xl text-[#aeadb3] cursor-pointer" />
          )}
          <p className="text-base font-semibold hidden lg:block text-[#5e6266]">
            {currentName}
          </p>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {/* Added DialogTitle */}
        <DialogTitle className="text-center font-medium text-lg">
          Select an Option
        </DialogTitle>
        <div className="py-6">
          <p className="text-center font-medium text-lg mb-4">
            Today I’m up for
          </p>
          <div className="grid grid-cols-3 gap-4 px-6">
            {notSureData.map((item) => (
              <div
                key={item.id}
                className={`flex flex-col items-center gap-2 justify-center border hover:bg-gray-100 rounded-lg cursor-pointer ${
                  selectedOption === item.id
                    ? "border-pink-500"
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedOption(item.id)}
              >
                <p
                  className={`mt-2 text-center font-semibold ${
                    selectedOption === item.id
                      ? "text-pink-500"
                      : "text-gray-500"
                  }`}
                >
                  {item.name}
                </p>
                <Image src={item.image} width={90} height={90} alt="icon" />
              </div>
            ))}
          </div>
          <div className="text-center mt-6 w-full px-4">
            <DialogFooter>
              <DialogClose asChild>
                <button
                  onClick={handleSave}
                  className="bg-pink-500 w-full text-white font-bold py-2 rounded-md"
                >
                  Save
                </button>
              </DialogClose>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default NotSure;
