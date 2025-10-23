"use client";

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  if (!user) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-6">
          {user.imageUrl && (
            <img
              src={user.imageUrl}
              alt={user.fullName || "Profile"}
              className="h-20 w-20 rounded-full"
            />
          )}
          <div>
            <h2 className="text-xl font-semibold">{user.fullName}</h2>
            <p className="text-gray-600">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
