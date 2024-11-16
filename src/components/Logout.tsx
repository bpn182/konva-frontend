import React from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { clearUser } from "../redux/userSlice";

/**
 * Logout component to handle user logout functionality.
 * Dispatches the clearUser action and navigates to the login page.
 */
const Logout: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  // Clearing the user state and navigating to the login page.
  const handleLogout = () => {
    dispatch(clearUser());
    router.push("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      Logout
    </button>
  );
};

export default Logout;
