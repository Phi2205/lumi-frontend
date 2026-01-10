"use client";
import Link from "next/link";
import Image from "next/image";
import LoginForm from "@/components/auth/LoginForm";
import { Mail } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Brand & Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-500 via-cyan-400 to-yellow-300 text-white flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 relative">
              <Image
                src="/lumi-logo.png"
                alt="Lumi Logo"
                width={64}
                height={64}
                priority
              />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-2 text-white drop-shadow-lg">
            lumi
          </h2>
          <p className="text-white/90 text-base font-medium">
            Where communities shine
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center mb-4 shadow-lg">
              <span className="text-3xl">🏘️</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Your Community Hub</h3>
            <p className="text-white/90 text-base leading-relaxed">
              Connect with neighbors, friends, and local communities all in one
              vibrant place.
            </p>
          </div>

          <div>
            <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center mb-4 shadow-lg">
              <span className="text-3xl">💬</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Share Moments</h3>
            <p className="text-white/90 text-base leading-relaxed">
              Post stories, photos, and messages to inspire your community and
              stay connected.
            </p>
          </div>

          <div>
            <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center mb-4 shadow-lg">
              <span className="text-3xl">✨</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Authentic Connections</h3>
            <p className="text-white/90 text-base leading-relaxed">
              Build meaningful relationships through genuine interactions and
              shared interests.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/30">
          <p className="text-white/90 text-sm">
            Join thousands of creators and communities building brighter futures
            on Lumi
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 relative">
              <Image
                src="/lumi-logo.png"
                alt="Lumi Logo"
                width={48}
                height={48}
              />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              lumi
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back
          </h1>
          <p className="text-gray-600 mb-8">
            Sign in to your account to continue
          </p>

          <LoginForm />

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600 text-sm">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-blue-500 hover:text-cyan-400 transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>

          <div className="mt-6">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  or continue with
                </span>
              </div>
            </div>

            <button className="w-full py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium text-gray-700 flex items-center justify-center gap-2">
              <Mail className="w-5 h-5" />
              Google
            </button>
          </div>

          <p className="text-center text-xs text-gray-500 mt-8">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="text-blue-500 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-blue-500 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
