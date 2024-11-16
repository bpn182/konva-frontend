"use client";
import { RootState } from "@/redux/store";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Canvas = dynamic(() => import("../../components/Canvas"), {
  ssr: false,
});

export default function Home() {
  const router = useRouter();
  const userId = useSelector((state: RootState) => state.user.userId);

  useEffect(() => {
    if (!userId) {
      router.push("/");
    }
  }, [userId, router]);

  if (!userId) {
    return null;
  }

  return <Canvas />;
}
