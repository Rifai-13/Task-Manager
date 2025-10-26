
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, Settings, ChevronDown } from "lucide-react";

const UserProfile: React.FC = () => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const fullName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const userInitial = fullName.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20"
      >
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-semibold text-lg shadow-lg">
          {userInitial}
        </div>
        <div className="text-left hidden lg:block">
          <p className="text-white font-semibold text-sm">
            Hai, {fullName.split(" ")[0]}
          </p>
          <p className="text-blue-100 text-xs">{user?.email}</p>
        </div>
        <ChevronDown
          size={16}
          className={`text-white transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-[9999]"
          style={{ zIndex: 9999 }}
        >
          {/* User Info Section */}
          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-semibold text-xl shadow-lg">
                {userInitial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-semibold text-gray-900 truncate">
                  {fullName}
                </p>
                <p className="text-sm text-gray-600 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors group"
            >
              <Settings
                size={18}
                className="text-gray-400 group-hover:text-blue-500"
              />
              <span className="font-medium">Pengaturan Akun</span>
            </button>

            <div className="border-t border-gray-100 my-2"></div>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors group"
            >
              <LogOut size={18} className="group-hover:text-red-500" />
              <span className="font-medium">Keluar</span>
            </button>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              TaskFlow v1.0 • Premium
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;