"use client";
import { RootState } from "@/redux/store";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Canvas = dynamic(() => import("../../components/Canvas"), {
  ssr: false,
});

/**
 * Home component that checks for user authentication and renders the Canvas component.
 * If the user is not authenticated, it redirects to the login page.
 */
export default function Home() {
  const router = useRouter();
  const userId = useSelector((state: RootState) => state.user.userId);

  useEffect(() => {
    // Redirect to the login page if the user is not authenticated
    if (!userId) {
      router.push("/");
    }
  }, [userId, router]);

  // Render nothing if the user is not authenticated
  if (!userId) {
    return null;
  }

  // Render the Canvas component if the user is authenticated
  return <Canvas />;
}
