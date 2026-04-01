import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,

  DropdownMenuLabel,

  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HiDotsVertical } from "react-icons/hi"

export function AboutMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="dot"><HiDotsVertical className="text-xl" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="">
        <DropdownMenuLabel>Report Abuse</DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
