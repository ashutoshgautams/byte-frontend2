'use client';
import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Github } from 'lucide-react';
import Link from 'next/link';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Redirect to dashboard would happen here
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      {/* Top Navigation */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <Logo />
          <Link 
            href="/" 
            className="text-[#9CA3AF] hover:text-white transition-colors flex items-center"
          />
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Sign in to Byte</h1>
            <p className="text-[#9CA3AF]">
              Enter your credentials to access your account
            </p>
          </div>

          <div className="bg-[#161618] border border-[#2E2E2E] rounded-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1A1A1C] border border-[#2E2E2E] rounded-md px-3 py-2 text-white placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                  placeholder="you@company.com"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-medium">
                    Password
                  </label>
                  <a 
                    href="#" 
                    className="text-sm text-[#3B82F6] hover:text-[#7D5AE4] transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#1A1A1C] border border-[#2E2E2E] rounded-md px-3 py-2 text-white placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9CA3AF] hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 bg-[#1A1A1C] border border-[#2E2E2E] rounded focus:ring-[#3B82F6] focus:ring-offset-[#0A0A0A] focus:ring-offset-2"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[#9CA3AF]">
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#3B82F6] hover:bg-[#7D5AE4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3B82F6] ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#2E2E2E]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#161618] text-[#9CA3AF]">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  className="w-full flex justify-center py-2 px-4 border border-[#2E2E2E] rounded-md shadow-sm bg-[#1A1A1C] text-sm font-medium text-white hover:bg-[#222224] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3B82F6]"
                >
                  <Github className="h-5 w-5 mr-2" />
                  Sign in with GitHub
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-[#9CA3AF]">
              Don&apos;t have an account?{' '}
              <a 
                href="/register" 
                className="text-[#3B82F6] hover:text-[#7D5AE4] transition-colors"
              >
                Register for access
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-4 py-6 text-center">
        <p className="text-sm text-[#9CA3AF]">
          © 2025 Byte. All rights reserved.
        </p>
      </div>
    </div>
  );
};

const Logo = () => (
  <div className="flex items-center">
    {/* <div className="w-8 h-8 bg-[#3B82F6] rounded-md mr-2 flex items-center justify-center">
      <span className="font-bold text-lg">B</span>
    </div> */}
    <span className="font-bold text-xl">byte</span>
  </div>
);

export default SignInPage;
