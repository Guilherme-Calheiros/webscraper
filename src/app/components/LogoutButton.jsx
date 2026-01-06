'use client';

import { useAuth } from "../providers/AuthProvider";

export default function LogoutButton({ onLogout }) {

    const { logout } = useAuth();

    const handleLogout = async () => {
        logout();
        onLogout?.();
    };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
    >
      Logout
    </button>
  );
}