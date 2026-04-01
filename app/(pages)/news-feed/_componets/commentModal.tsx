"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TfiCommentsSmiley } from "react-icons/tfi";

import { Button } from "@/components/ui/button";
import Image from "next/image";

const CommentModal = ({ item }: { item: any }) => {
  return (
    <div className="flex justify-end w-full px-2  ">
      <Dialog>
        <DialogTrigger asChild>
      
       <Button
            variant="outline"
            className="flex items-center  gap-2 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition "
          >
            <TfiCommentsSmiley className="text-xl  " />
            <p className="font-medium">{item.comments.length} Comments</p>
          </Button>
     
        </DialogTrigger>

        <DialogContent className="max-w-[90%] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] min-h-[500px] mx-auto rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-center  mb-2">
              Comments
            </DialogTitle>
          </DialogHeader>

          <DialogDescription>
            {item.comments.length > 0 ? (
                <div className="h-[400px] pr-4 overflow-y-auto  ">
                <div className="space-y-6">
                  {item.comments.map((comment: any, index: number) => (
                    <div
                      key={index}
                      className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg shadow hover:shadow-md transition"
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${comment.user.profile.profilePicture}`}
                        width={20}
                        height={20}
                        alt={`${comment.user.userName}'s profile`}
                        className="rounded-full  object-cover h-16 w-16"
                      />
                      <div className="">
                        <p className="font-semibold text-lg text-gray-800">
                          {comment.user.userName}
                        </p>
                        <p className="text-base text-gray-600 mt-1 w-fit break-words ">
                          {comment.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
      
            ) : (
              <div className="text-center text-gray-500 py-10">
                No comments yet. Be the first to comment!
              </div>
            )}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommentModal;
