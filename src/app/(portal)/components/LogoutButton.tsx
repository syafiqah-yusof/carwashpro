"use client";

import { logoutCustomer } from "../portal/actions";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => logoutCustomer()}
      className="flex items-center text-red-400 hover:text-red-300 font-semibold px-3 py-1 rounded-md border border-red-500/30 hover:bg-red-500/10 transition-colors text-sm"
    >
      <i className="bi bi-box-arrow-right mr-2"></i> Logout
    </button>
  );
}
