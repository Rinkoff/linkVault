"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Bookmark, Loader2 } from "lucide-react";

const LoginPage = () => {
  const { user, loading, loginWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F7F5] p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex flex-col items-center">
          <div className="bg-[#37352F] text-white p-4 rounded-2xl shadow-xl mb-6 transform hover:rotate-3 transition-transform">
            <Bookmark size={48} />
          </div>
          <h1 className="text-4xl font-extrabold text-[#37352F] tracking-tight mb-2">
            LinkVault
          </h1>
          <p className="text-gray-500 text-lg">
            Your personal, minimalist bookmark manager.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <p className="text-sm text-gray-400 font-medium">
            Sign in to start organizing your web.
          </p>
          
          <button
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 py-3.5 px-4 rounded-2xl text-[#37352F] font-bold hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-[0.98]"
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google" 
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          <p className="text-[10px] text-gray-300 px-8 leading-relaxed">
            By signing in, you agree to organize your links efficiently and stay focused on what matters.
          </p>
        </div>

        <div className="pt-8">
          <div className="flex justify-center gap-8 text-xs text-gray-400 font-medium">
            <span>Secure</span>
            <span>Minimalist</span>
            <span>Fast</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
