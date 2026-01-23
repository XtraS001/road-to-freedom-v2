import React from "react";
import Link from "next/link";
import RoleGuard from "./role-guard";
import { Role } from "@/models/user/UserResponse";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminNav() {
  return (
    <RoleGuard rolesAllowed={[Role.ADMIN]}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative mx-2">
            Admin
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuItem asChild>
            <Link href="/admin/users">Users</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/admin/notifications">Notifications</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </RoleGuard>
  );
}
