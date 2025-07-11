"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Server, Gauge, Terminal, Github } from 'lucide-react';
import Link from 'next/link';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface StepProps {
  number: string;
  title: string;
  description: string;
}

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Navbar */}
      <nav className="border-b border-[#1E1E1E] bg-[#0A0A0A]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Logo />
            <div className="hidden md:flex space-x-8 ml-12">
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#pricing">Pricing</NavLink>
              <NavLink href="#docs">Documentation</NavLink>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/sign-in" className="text-[#9CA3AF] hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/dashboard" className="bg-[#3B82F6] hover:bg-[#7D5AE4] text-white px-4 py-2 rounded-md transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Deploy AI Models in <span className="text-[#3B82F6]">Minutes</span>, Not Weeks
          </h1>
          <p className="text-xl text-[#9CA3AF] mb-10 max-w-2xl mx-auto">
            Byte simplifies deployment and monitoring of machine learning models, 
            enabling faster iteration and simpler day-to-day management of inference endpoints.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="bg-[#3B82F6] hover:bg-[#7D5AE4] text-white px-6 py-3 rounded-md transition-colors w-full sm:w-auto flex items-center justify-center">
              Get Started <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
            <a 
              href="mailto:namaste@bytevision.com?subject=Schedule Demo - Byte Platform&body=Hi, I'm interested in scheduling a demo of the Byte platform. Please let me know your availability." 
              className="border border-[#2E2E2E] hover:border-[#4E4E4E] px-6 py-3 rounded-md transition-colors w-full sm:w-auto"
            >
              Book a Demo
            </a>
          </div>
        </motion.div>
        
        {/* Dashboard Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-16 w-full max-w-6xl"
        >
          <div className="bg-[#161618] border border-[#2E2E2E] rounded-lg overflow-hidden shadow-2xl">
            <div className="border-b border-[#2E2E2E] p-4 flex items-center">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]"></div>
                <div className="w-3 h-3 rounded-full bg-[#28C840]"></div>
              </div>
              <div className="mx-auto pr-16 text-sm text-[#9CA3AF]">
                Byte Dashboard
              </div>
            </div>
            <div className="p-8 flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#3B82F6]/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Server className="h-8 w-8 text-[#3B82F6]" />
                </div>
                <p className="text-[#9CA3AF]">Dashboard preview coming soon</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-[#0E0E0E] py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Teams Choose Byte</h2>
            <p className="text-[#9CA3AF] max-w-2xl mx-auto">
              Byte gives ML engineers at AI-native startups everything they need to deploy
              and monitor models without the complexity.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Server className="h-6 w-6 text-[#3B82F6]" />}
              title="Simple Deployment"
              description="Deploy pre-trained models to scalable endpoints with just a few clicks. No Kubernetes expertise required."
            />
            <FeatureCard 
              icon={<Gauge className="h-6 w-6 text-[#3B82F6]" />}
              title="Unified Monitoring"
              description="View model status, logs, and operational metrics from a single, intuitive dashboard."
            />
            <FeatureCard 
              icon={<Terminal className="h-6 w-6 text-[#3B82F6]" />}
              title="Full Lifecycle Control"
              description="Easily stop, start, or update your deployed models with simple UI controls."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How Byte Works</h2>
          <p className="text-[#9CA3AF] max-w-2xl mx-auto">
            Byte abstracts away the complexity of Kubernetes and KServe, 
            giving you a simple interface for model deployment and operations.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="space-y-8">
              <Step 
                number="01" 
                title="Register Your Model"
                description="Provide your container image URL and basic configuration."
              />
              <Step 
                number="02" 
                title="Configure Resources"
                description="Specify replicas and GPU requirements with a simple form."
              />
              <Step 
                number="03" 
                title="Deploy & Monitor"
                description="Click deploy and monitor your model's health from a unified dashboard."
              />
            </div>
          </div>
          <div className="bg-[#161618] border border-[#2E2E2E] rounded-lg overflow-hidden shadow-xl">
            <div className="p-12 flex items-center justify-center h-96">
              <div className="text-center">
                <div className="flex space-x-4 justify-center mb-6">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="w-12 h-12 bg-[#3B82F6]/20 rounded-lg flex items-center justify-center">
                      <span className="text-[#3B82F6] font-bold">{step}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[#9CA3AF]">Workflow visualization</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#0E0E0E] py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-[#3B82F6]/10 to-[#3B82F6]/5 border border-[#3B82F6]/20 rounded-xl p-12 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Simplify Model Deployment?</h2>
            <p className="text-[#9CA3AF] mb-8 max-w-2xl mx-auto">
              Join AI-native startups that are accelerating their model delivery with Byte.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/dashboard" className="bg-[#3B82F6] hover:bg-[#7D5AE4] text-white px-6 py-3 rounded-md transition-colors w-full sm:w-auto">
                Get Started for Free
              </Link>
              <button className="bg-[#1E1E1E] hover:bg-[#2E2E2E] px-6 py-3 rounded-md transition-colors w-full sm:w-auto flex items-center justify-center">
                <Github className="mr-2 h-4 w-4" /> Star on GitHub
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1E1E1E] py-12 bg-[#0A0A0A]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <Logo />
              <p className="text-[#9CA3AF] mt-2">
                Making model deployment simple for AI teams.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-2 text-[#9CA3AF]">
                  <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Resources</h3>
                <ul className="space-y-2 text-[#9CA3AF]">
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-[#9CA3AF]">
                  <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="mailto:namaste@bytevision.com" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-[#1E1E1E] mt-12 pt-8 text-[#9CA3AF] text-sm flex flex-col md:flex-row justify-between items-center">
            <p>© 2025 byte. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Component for the logo
const Logo: React.FC = () => (
  <Link href="/" className="flex items-center">
    <span className="font-bold text-xl">byte</span>
  </Link>
);

// Component for navigation links
const NavLink: React.FC<NavLinkProps> = ({ href, children }) => (
  <a 
    href={href} 
    className="text-[#9CA3AF] hover:text-white transition-colors"
  >
    {children}
  </a>
);

// Component for feature cards
const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-[#161618] border border-[#2E2E2E] rounded-lg p-6 transition-transform hover:scale-[1.02]">
    <div className="bg-[#1A1A1C] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-[#9CA3AF]">{description}</p>
  </div>
);

// Component for steps
const Step: React.FC<StepProps> = ({ number, title, description }) => (
  <div className="flex">
    <div className="mr-6">
      <div className="w-10 h-10 rounded-full border border-[#3B82F6] flex items-center justify-center text-sm text-[#3B82F6] font-medium">
        {number}
      </div>
    </div>
    <div>
      <h3 className="text-xl font-semibold mb-1">{title}</h3>
      <p className="text-[#9CA3AF]">{description}</p>
    </div>
  </div>
);

export default LandingPage;
