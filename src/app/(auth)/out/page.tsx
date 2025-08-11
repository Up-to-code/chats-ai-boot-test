"use client";
import { useClerk } from "@clerk/nextjs";
import {Button} from "@/components/ui/button";
export default function MyPage() {
  const { signOut } = useClerk();

  const handleLogout = async () => {
    await signOut();
  };

  return <Button onClick={handleLogout}>Log out</Button>;
}
