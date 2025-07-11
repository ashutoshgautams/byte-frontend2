'use client';
import React, { useState } from 'react';
import { ArrowLeft, Check, Eye, EyeOff, Github, Info } from 'lucide-react';
import Link from 'next/link';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    companyName: '',
    jobTitle: '',
    useCaseDescription: '',
    agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call for registration
    setTimeout(() => {
      setIsLoading(false);
      setRegistrationComplete(true);
    }, 2000);
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
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Register for Byte</h1>
            <p className="text-[#9CA3AF]">
              {registrationComplete 
                ? "Thanks for your interest! Our team will review your application." 
                : "Complete the form below to request access to Byte's platform"}
            </p>
          </div>

          {registrationComplete ? (
            <div className="bg-[#161618] border border-[#2E2E2E] rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-[#3B82F6]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-8 w-8 text-[#3B82F6]" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">Registration Complete</h2>
              <p className="text-[#9CA3AF] mb-6">
                Thank you for your interest in Byte! As we&apos;re currently in stealth mode, 
                our operations team will review your application and contact you with your 
                sign-in credentials if approved.
              </p>
              <div className="p-4 bg-[#1A1A1C] border border-[#2E2E2E] rounded-md mb-6">
                <p className="text-sm text-[#9CA3AF]">
                  <Info className="h-4 w-4 inline mr-2 text-[#3B82F6]" />
                  Expected response time: <span className="text-white">1-2 business days</span>
                </p>
              </div>
              <Link
                href="/" 
                className="inline-block bg-[#3B82F6] hover:bg-[#7D5AE4] text-white px-6 py-2 rounded-md transition-colors"
              />
                Return to Homepage
              
            </div>
          ) : (
            <div className="bg-[#161618] border border-[#2E2E2E] rounded-lg p-8">
              {/* Progress Steps */}
              <div className="flex mb-8">
                <div className="flex-1">
                  <div className={`h-1 rounded-full ${step >= 1 ? 'bg-[#3B82F6]' : 'bg-[#2E2E2E]'}`}></div>
                  <div className="mt-2 text-center">
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                      step >= 1 ? 'bg-[#3B82F6]' : 'bg-[#1A1A1C] border border-[#2E2E2E]'
                    } text-sm font-medium mb-1`}>
                      {step > 1 ? <Check className="h-4 w-4" /> : '1'}
                    </div>
                    <div className={`text-xs ${step >= 1 ? 'text-white' : 'text-[#9CA3AF]'}`}>Account</div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className={`h-1 rounded-full ${step >= 2 ? 'bg-[#3B82F6]' : 'bg-[#2E2E2E]'}`}></div>
                  <div className="mt-2 text-center">
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                      step >= 2 ? 'bg-[#3B82F6]' : 'bg-[#1A1A1C] border border-[#2E2E2E]'
                    } text-sm font-medium mb-1`}>
                      {step > 2 ? <Check className="h-4 w-4" /> : '2'}
                    </div>
                    <div className={`text-xs ${step >= 2 ? 'text-white' : 'text-[#9CA3AF]'}`}>Company</div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className={`h-1 rounded-full ${step >= 3 ? 'bg-[#3B82F6]' : 'bg-[#2E2E2E]'}`}></div>
                  <div className="mt-2 text-center">
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                      step >= 3 ? 'bg-[#3B82F6]' : 'bg-[#1A1A1C] border border-[#2E2E2E]'
                    } text-sm font-medium mb-1`}>
                      3
                    </div>
                    <div className={`text-xs ${step >= 3 ? 'text-white' : 'text-[#9CA3AF]'}`}>Use Case</div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Step 1: Account Information */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                          First name
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => updateFormData('firstName', e.target.value)}
                          className="w-full bg-[#1A1A1C] border border-[#2E2E2E] rounded-md px-3 py-2 text-white placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                          placeholder="Jane"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                          Last name
                        </label>
                        <input
                          id="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => updateFormData('lastName', e.target.value)}
                          className="w-full bg-[#1A1A1C] border border-[#2E2E2E] rounded-md px-3 py-2 text-white placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Work email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        className="w-full bg-[#1A1A1C] border border-[#2E2E2E] rounded-md px-3 py-2 text-white placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                        placeholder="you@company.com"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => updateFormData('password', e.target.value)}
                          className="w-full bg-[#1A1A1C] border border-[#2E2E2E] rounded-md px-3 py-2 text-white placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                          placeholder="••••••••"
                          required
                          minLength={8}
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
                      <p className="mt-1 text-xs text-[#9CA3AF]">
                        Must be at least 8 characters long
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="py-2 px-4 bg-[#3B82F6] hover:bg-[#7D5AE4] rounded-md transition-colors"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Company Information */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="companyName" className="block text-sm font-medium mb-2">
                        Company name
                      </label>
                      <input
                        id="companyName"
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => updateFormData('companyName', e.target.value)}
                        className="w-full bg-[#1A1A1C] border border-[#2E2E2E] rounded-md px-3 py-2 text-white placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                        placeholder="Acme Inc."
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="jobTitle" className="block text-sm font-medium mb-2">
                        Your job title
                      </label>
                      <input
                        id="jobTitle"
                        type="text"
                        value={formData.jobTitle}
                        onChange={(e) => updateFormData('jobTitle', e.target.value)}
                        className="w-full bg-[#1A1A1C] border border-[#2E2E2E] rounded-md px-3 py-2 text-white placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                        placeholder="Machine Learning Engineer"
                        required
                      />
                    </div>

                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="py-2 px-4 border border-[#2E2E2E] rounded-md hover:bg-[#1A1A1C] transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="py-2 px-4 bg-[#3B82F6] hover:bg-[#7D5AE4] rounded-md transition-colors"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Use Case Information */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="useCaseDescription" className="block text-sm font-medium mb-2">
                        Tell us about your model deployment needs
                      </label>
                      <textarea
                        id="useCaseDescription"
                        value={formData.useCaseDescription}
                        onChange={(e) => updateFormData('useCaseDescription', e.target.value)}
                        rows={5}
                        className="w-full bg-[#1A1A1C] border border-[#2E2E2E] rounded-md px-3 py-2 text-white placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                        placeholder="Describe the types of models you're working with and your current deployment challenges..."
                        required
                      />
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="agreeTerms"
                          type="checkbox"
                          checked={formData.agreeTerms}
                          onChange={(e) => updateFormData('agreeTerms', e.target.checked)}
                          className="h-4 w-4 bg-[#1A1A1C] border border-[#2E2E2E] rounded focus:ring-[#3B82F6] focus:ring-offset-[#0A0A0A] focus:ring-offset-2"
                          required
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="agreeTerms" className="text-[#9CA3AF]">
                          I agree to Byte&apos;s{' '}
                          <a href="#" className="text-[#3B82F6] hover:text-[#7D5AE4]">
                            Terms of Service
                          </a>{' '}
                          and{' '}
                          <a href="#" className="text-[#3B82F6] hover:text-[#7D5AE4]">
                            Privacy Policy
                          </a>
                        </label>
                      </div>
                    </div>

                    <div className="p-4 bg-[#1A1A1C] border border-[#2E2E2E] rounded-md">
                      <p className="text-sm text-[#9CA3AF]">
                        <Info className="h-4 w-4 inline mr-2 text-[#3B82F6]" />
                        As we&apos;re currently in stealth mode, access is granted after a brief review by our team.
                        You&apos;ll receive your credentials via email if approved.
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="py-2 px-4 border border-[#2E2E2E] rounded-md hover:bg-[#1A1A1C] transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading || !formData.agreeTerms}
                        className={`py-2 px-4 bg-[#3B82F6] hover:bg-[#7D5AE4] rounded-md transition-colors ${
                          (isLoading || !formData.agreeTerms) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {isLoading ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                          </span>
                        ) : (
                          'Submit Application'
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>

              {/* Alternative registration option */}
              <div className="mt-8 pt-6 border-t border-[#2E2E2E]">
                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    className="flex items-center py-2 px-4 border border-[#2E2E2E] rounded-md shadow-sm bg-[#1A1A1C] text-sm font-medium text-white hover:bg-[#222224] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3B82F6]"
                  >
                    <Github className="h-5 w-5 mr-2" />
                    Continue with GitHub
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="text-center mt-8">
            <p className="text-[#9CA3AF]">
              Already have an account?{' '}
              <a 
                href="/sign-in" 
                className="text-[#3B82F6] hover:text-[#7D5AE4] transition-colors"
              >
                Sign in
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

export default RegisterPage;
