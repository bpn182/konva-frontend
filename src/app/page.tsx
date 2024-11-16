"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import { useRouter } from "next/navigation";
import { createUser, getUserByUsername } from "@/firebase/userService";

const UsernamePage: React.FC = () => {
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
console.log(process.env.NEXT_PUBLIC_API_URL)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await getUserByUsername(username);
    if (user) {
      dispatch(setUser({ userId: user.id, username: user.username }));
    } else {
      const newUser = await createUser(username);
      dispatch(setUser({ userId: newUser.id, username: newUser.username }));
    }
    router.push("/canvas");
  };

  return (
    <div className="flex flex-col text-black items-center justify-center h-screen bg-gray-200">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-lg text-black font-bold mb-4">Enter your name</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your name"
          className="border border-gray-400 px-2 py-1 rounded mb-4"
          required
        />
        <button
          type="submit"
          className="bg-green-500 ml-2 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Enter
        </button>
      </form>
    </div>
  );
};

export default UsernamePage;
