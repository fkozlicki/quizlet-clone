import { Ellipsis } from "lucide-react";

import { Button } from "@acme/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";

const StudySetOptionsDropdown = ({ isOwner }: { isOwner: boolean }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Ellipsis size={16} />
          <span className="sr-only">More</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>More</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isOwner && <DropdownMenuItem>Combine</DropdownMenuItem>}
        <DropdownMenuItem>Print</DropdownMenuItem>
        <DropdownMenuItem>Export</DropdownMenuItem>
        {isOwner && <DropdownMenuItem>Delete</DropdownMenuItem>}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StudySetOptionsDropdown;
