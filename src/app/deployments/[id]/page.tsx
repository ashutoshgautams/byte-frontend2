"use client";

import React, { use, useMemo } from 'react';
import { ArrowLeft, Check, Clock, AlertTriangle, Square, Pause, RefreshCw, ExternalLink } from 'lucide-react';

// Type definitions
interface DeploymentDetailPageProps {
  params: Promise<{ id: string }>;
}

interface Deployment {
  id: string;
  name: string;
  status: 'Ready' | 'Deploying' | 'Error' | 'Stopped';
  image: string;
  endpoint: string;
  replicas: number;
  createdAt: string;
  cpuUsage: number;
  memoryUsage: number;
  gpuConfig: {
    type: string;
    count: number;
  };
}

interface StatusBadgeProps {
  status: 'Ready' | 'Deploying' | 'Error' | 'Stopped';
}

interface ResourceBarProps {
  label: string;
  value: number;
}

const DeploymentDetailPage: React.FC<DeploymentDetailPageProps> = ({ params }) => {
  // Unwrap the params Promise using React.use()
  const { id } = use(params);
  
  // Mock deployment data
  const deployment: Deployment = {
    id,
    name: 'sentiment-analysis-model',
    status: 'Ready',
    image: 'acme-registry/sentiment:v1.2.3',
    endpoint: 'https://api.byte.ai/models/sentiment-analysis-model',
    replicas: 3,
    createdAt: '2025-05-10T12:00:00Z',
    cpuUsage: 32,
    memoryUsage: 68,
    gpuConfig: {
      type: 'nvidia-tesla-t4',
      count: 1
    }
  };

  // Format date in a consistent way to avoid hydration mismatch
  const formattedDate = useMemo(() => {
    const date = new Date(deployment.createdAt);
    // Use a consistent format that works the same on server and client
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, [deployment.createdAt]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Top Navigation */}
      <div className="container mx-auto px-4 py-6 border-b border-[#1E1E1E]">
        <div className="flex justify-between items-center">
          <Logo />
          <a 
            href="/dashboard" 
            className="text-[#9CA3AF] hover:text-white transition-colors flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">{deployment.name}</h1>
          
          <div className="flex flex-wrap gap-4 items-center mb-6">
            <StatusBadge status={deployment.status} />
            <div className="text-[#9CA3AF]">
              Created {formattedDate}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            <button className="flex items-center px-4 py-2 bg-[#161618] border border-[#2E2E2E] rounded-md hover:bg-[#1E1E1E]">
              <Pause className="h-4 w-4 mr-2" />
              Stop
            </button>
            <button className="flex items-center px-4 py-2 bg-[#161618] border border-[#2E2E2E] rounded-md hover:bg-[#1E1E1E]">
              <RefreshCw className="h-4 w-4 mr-2" />
              Update
            </button>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Overview */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <div className="bg-[#161618] border border-[#2E2E2E] rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#9CA3AF] text-sm">Container Image</label>
                  <div className="font-mono text-sm mt-1">{deployment.image}</div>
                </div>
                <div>
                  <label className="text-[#9CA3AF] text-sm">Replicas</label>
                  <div className="mt-1">{deployment.replicas}</div>
                </div>
                <div>
                  <label className="text-[#9CA3AF] text-sm">GPU Configuration</label>
                  <div className="mt-1">{deployment.gpuConfig.count}x {deployment.gpuConfig.type}</div>
                </div>
                <div>
                  <label className="text-[#9CA3AF] text-sm">Endpoint</label>
                  <div className="mt-1">
                    <a 
                      href={deployment.endpoint}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#3B82F6] hover:text-[#7D5AE4] flex items-center"
                    >
                      View Endpoint
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#161618] border border-[#2E2E2E] rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a 
                  href={`/deployments/${deployment.id}/logs`}
                  className="flex items-center justify-center p-4 bg-[#1A1A1C] border border-[#2E2E2E] rounded-md hover:bg-[#2E2E2E] transition-colors"
                >
                  View Logs
                </a>
                <a 
                  href={`/deployments/${deployment.id}/metrics`}
                  className="flex items-center justify-center p-4 bg-[#1A1A1C] border border-[#2E2E2E] rounded-md hover:bg-[#2E2E2E] transition-colors"
                >
                  View Metrics
                </a>
                <button className="flex items-center justify-center p-4 bg-[#1A1A1C] border border-[#2E2E2E] rounded-md hover:bg-[#2E2E2E] transition-colors">
                  Test Endpoint
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Resource Usage */}
          <div className="space-y-6">
            <div className="bg-[#161618] border border-[#2E2E2E] rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Resource Usage</h3>
              <div className="space-y-4">
                <ResourceBar label="CPU" value={deployment.cpuUsage} />
                <ResourceBar label="Memory" value={deployment.memoryUsage} />
              </div>
            </div>

            <div className="bg-[#161618] border border-[#2E2E2E] rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <div className="text-[#9CA3AF]">5m ago</div>
                  <div className="ml-3">Health check passed</div>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <div className="text-[#9CA3AF]">12m ago</div>
                  <div className="ml-3">Processed 150 requests</div>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                  <div className="text-[#9CA3AF]">1h ago</div>
                  <div className="ml-3">Pod restarted</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for the logo
const Logo: React.FC = () => (
  <div className="flex items-center">
    <span className="font-bold text-xl">byte</span>
  </div>
);

// Component for status badges
const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let bgColor: string, textColor: string, icon: React.ReactNode;
  
  switch (status) {
    case 'Ready':
      bgColor = 'bg-green-500/10';
      textColor = 'text-green-500';
      icon = <Check className="h-3 w-3 mr-1" />;
      break;
    case 'Deploying':
      bgColor = 'bg-amber-500/10';
      textColor = 'text-amber-500';
      icon = <Clock className="h-3 w-3 mr-1" />;
      break;
    case 'Error':
      bgColor = 'bg-red-500/10';
      textColor = 'text-red-500';
      icon = <AlertTriangle className="h-3 w-3 mr-1" />;
      break;
    case 'Stopped':
      bgColor = 'bg-[#9CA3AF]/10';
      textColor = 'text-[#9CA3AF]';
      icon = <Square className="h-3 w-3 mr-1" />;
      break;
    default:
      bgColor = 'bg-[#9CA3AF]/10';
      textColor = 'text-[#9CA3AF]';
      icon = null;
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {icon}
      {status}
    </span>
  );
};

// Component for resource usage bars
const ResourceBar: React.FC<ResourceBarProps> = ({ label, value }) => (
  <div className="flex flex-col">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm text-[#9CA3AF]">{label}</span>
      <span className="text-sm">{value}%</span>
    </div>
    <div className="w-full h-2 bg-[#2E2E2E] rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full ${
          value > 80 ? 'bg-red-500' : value > 60 ? 'bg-amber-500' : 'bg-green-500'
        }`} 
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

export default DeploymentDetailPage;
