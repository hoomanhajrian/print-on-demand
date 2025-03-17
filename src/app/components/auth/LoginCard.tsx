"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

interface LoginCardProps {
  callbackUrl?: string;
  isOpen: boolean;
  onClose: () => void;
}

const LoginCard: React.FC<LoginCardProps> = ({
  callbackUrl,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"signIn" | "signUp">("signIn");
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-md shadow-md p-6 max-w-md w-full relative"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between border-b border-gray-200 mb-4">
          <button
            className={`py-2 px-4 font-semibold ${
              activeTab === "signIn"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("signIn")}
          >
            Sign In
          </button>
          <button
            className={`py-2 px-4 font-semibold ${
              activeTab === "signUp"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("signUp")}
          >
            Sign Up
          </button>
        </div>

        {activeTab === "signIn" && <SignInForm onClose={onClose} />}
        {activeTab === "signUp" && <SignUpForm onClose={onClose} />}

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default LoginCard;
