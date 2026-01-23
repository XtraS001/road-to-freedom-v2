"use client";

import FileUpload from "@/components/FileUpload";
import { useAuthGuard } from "@/lib/auth/use-auth";
import httpClient from "@/lib/httpClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import React from "react";
import { toast } from "sonner";

export default function UpdateProfileImageForm() {
  const { user, mutate } = useAuthGuard({ middleware: "auth" });

  const handleLogoChange = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    httpClient.patch(`/api/users/${user?.id}/profile-picture`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(() => {
        toast.success("Profile picture updated successfully");
        mutate();
      })
      .catch((error) => {
        toast.error("Failed to update profile picture");
      });
  };

  return (
    <div className="flex gap-4 flex-col">
      <Label>Logo</Label>
      <FileUpload
        onFileSelect={(file) => handleLogoChange(file)}
        allowedTypes={["image/png", "image/jpg", "image/jpeg"]}
        onValidationError={(err) => {
          toast.error(err);
        }}
      >
        <Avatar className="h-24 w-24">
          <AvatarImage src={user?.profileImageUrl} alt={user?.firstName} />
          <AvatarFallback>{user?.firstName?.charAt(0)}</AvatarFallback>
        </Avatar>
      </FileUpload>
    </div>
  );
}
