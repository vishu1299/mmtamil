"use strict";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HiDotsVertical } from "react-icons/hi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useState } from "react";
import ReportAbuseMenu from "./reportAbusemenu";
import { customAxios } from "@/utils/axios-interceptor";

export function MenuDetails({ id }: { id: number }) {
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);

  const handleBlockUser = async () => {
    try {
      const response = await customAxios().post("mmm/blocked-users/block",{
        blockedId:id
      })
      if (response.status === 200) {
        console.log("User blocked successfully");
        setShowBlockDialog(false);
      } else {
        console.error("Failed to block user:", response.data.message);
      }
        
    } catch (error) {
      console.log('Error blocking user:', error);
    }
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <HiDotsVertical className="text-xl" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-[160px]">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setShowBlockDialog(true);
              setOpen(false);
            }}
          >
            <p className="text-sm">Block user</p>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setOpenDialog(true);
              setOpen(false);
            }}
          >
            <p className="text-sm">Report Abuse</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Block User</AlertDialogTitle>
            <AlertDialogDescription>
              You won't be able to view their profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowBlockDialog(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBlockUser}>Block</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ReportAbuseMenu id={id} open={openDialog} onOpenChange={setOpenDialog} />
    </>
  );
}
