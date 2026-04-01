"use strict";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HiDotsVertical } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import ReportAbuse from "./reportAbuse";
import { useState } from "react";

export function AboutMenu({id}:{id:number}) {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => {
    setOpen((prev) => !prev);
  };

  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" onClick={toggleMenu}>
            <HiDotsVertical className="text-xl" />
          </Button>
        </DropdownMenuTrigger>
      </DropdownMenu>

      {open && (
        <div className="bg-white p-4 rounded-lg shadow-lg relative">
          <button 
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" 
            onClick={toggleMenu}
          >
            <IoClose className="text-sm" />
          </button>
          <ReportAbuse id={id} />
        </div>
      )}
    </>
  );
}