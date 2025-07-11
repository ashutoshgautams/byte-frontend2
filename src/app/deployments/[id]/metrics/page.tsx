"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Check, Clock, AlertTriangle, Square, RefreshCw, Calendar, ChevronDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Legend } from 'recharts';
import Link from 'next/link';

// TypeScript interfaces
interface MetricData {
  timestamp: Date;
  time: string;
  cpu: number;
  memory: number;
  gpu: number;
  latency: number;
  throughput: number;
  successRate: number;
  errorRate: number;
  podStatus: number;
}

interface HourlySummaryData {
  hour: string;
  requestCount: number;
  avgLatency: number;
  errorCount: number;
}

interface DeploymentInfo {
  id: string;
  name: string;
  status: 'Ready' | 'Deploying' | 'Error' | 'Stopped';
  createdAt: string;
  endpoint: string;
  replicas: number;
  gpu: string;
  cpuLimit: string;
  memoryLimit: string;
}

interface StatusBadgeProps {
  status: 'Ready' | 'Deploying' | 'Error' | 'Stopped';
}

interface StatCardProps {
  title: string;
  value: string;
  trend: number | null;
  subtitle?: string;
}

interface PodStatusCardProps {
  id: number;
  podData: PodData;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    color: string;
    name: string;
    value: number;
    unit?: string;
  }>;
  label?: string;
}

interface PodData {
  name: string;
  status: string;
  uptime: string;
  restarts: number;
  cpuUsage: number;
  memoryUsage: number;
}

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

// Component for stat cards
const StatCard: React.FC<StatCardProps> = ({ title, value, trend, subtitle }) => {
  let trendColor: string, trendIcon: React.ReactNode;
  
  if (trend !== null) {
    if (trend > 0) {
      trendColor = 'text-green-500';
      trendIcon = <span className="mr-1">↑</span>;
    } else if (trend < 0) {
      trendColor = 'text-red-500';
      trendIcon = <span className="mr-1">↓</span>;
    } else {
      trendColor = 'text-[#9CA3AF]';
      trendIcon = null;
    }
  } else {
    trendColor = 'text-[#9CA3AF]';
    trendIcon = null;
  }
  
  return (
    <div className="bg-[#161618] border border-[#2E2E2E] rounded-lg p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[#9CA3AF]">{title}</h3>
        {trend !== null && (
          <span className={`text-xs ${trendColor} flex items-center`}>
            {trendIcon}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-semibold mb-1">{value}</p>
      {subtitle && <p className="text-xs text-[#9CA3AF]">{subtitle}</p>}
    </div>
  );
};

// Component for pod status cards
const PodStatusCard: React.FC<PodStatusCardProps> = ({ podData }) => {
  return (
    <div className="bg-[#1A1A1C] border border-[#2E2E2E] rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-mono text-sm truncate mb-1" title={podData.name}>
            {podData.name}
          </div>
          <div className="flex items-center">
            <span className={`w-2 h-2 rounded-full mr-2 ${podData.status === 'Running' ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm">{podData.status}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-[#9CA3AF]">Uptime</div>
          <div className="text-right">{podData.uptime}</div>
          
          <div className="text-[#9CA3AF]">Restarts</div>
          <div className={`text-right ${podData.restarts > 0 ? 'text-amber-500' : 'text-white'}`}>
            {podData.restarts}
          </div>
        </div>
        
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#9CA3AF]">CPU</span>
              <span>{podData.cpuUsage}%</span>
            </div>
            <div className="w-full h-1 bg-[#2E2E2E] rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  podData.cpuUsage > 80 ? 'bg-red-500' : podData.cpuUsage > 60 ? 'bg-amber-500' : 'bg-green-500'
                }`} 
                style={{ width: `${podData.cpuUsage}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#9CA3AF]">Memory</span>
              <span>{podData.memoryUsage}%</span>
            </div>
            <div className="w-full h-1 bg-[#2E2E2E] rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  podData.memoryUsage > 80 ? 'bg-red-500' : podData.memoryUsage > 60 ? 'bg-amber-500' : 'bg-blue-500'
                }`} 
                style={{ width: `${podData.memoryUsage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Deterministic data generation based on seed
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Generate mock metrics data for the charts with deterministic values
const generateMockMetrics = (seed: number = 12345): MetricData[] => {
  const now = new Date();
  const metrics: MetricData[] = [];
  
  for (let i = 59; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - (i * 60000)); // One data point per minute
    
    // Use deterministic values based on index
    const baseSeed = seed + i;
    
    metrics.push({
      timestamp,
      time: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      cpu: Math.floor(25 + seededRandom(baseSeed) * 35), // CPU between 25-60%
      memory: Math.floor(40 + seededRandom(baseSeed + 1) * 30), // Memory between 40-70%
      gpu: Math.floor(20 + seededRandom(baseSeed + 2) * 50), // GPU usage between 20-70%
      latency: Math.floor(50 + seededRandom(baseSeed + 3) * 150), // Latency between 50-200ms
      throughput: Math.floor(5 + seededRandom(baseSeed + 4) * 15), // Throughput between 5-20 req/s
      successRate: Math.min(100, Math.floor(95 + seededRandom(baseSeed + 5) * 6)), // Success rate between 95-100%
      errorRate: Math.floor(seededRandom(baseSeed + 6) * 5), // Error rate between 0-5%
      podStatus: i % 30 === 0 ? 3 : 4 // Occasionally show pod restarts
    });
  }
  
  return metrics;
};

// Generate hourly metrics summary with deterministic values
const generateHourlySummary = (seed: number = 54321): HourlySummaryData[] => {
  const summary: HourlySummaryData[] = [];
  const now = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const hour = new Date(now.getTime() - (i * 3600000));
    const baseSeed = seed + i;
    
    summary.push({
      hour: hour.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      requestCount: Math.floor(100 + seededRandom(baseSeed) * 900),
      avgLatency: Math.floor(50 + seededRandom(baseSeed + 1) * 100),
      errorCount: Math.floor(seededRandom(baseSeed + 2) * 20)
    });
  }
  
  return summary;
};

// Generate deterministic pod data
const generatePodData = (id: number): PodData => {
  const seed = 1000 + id;
  
  return {
    name: `sentiment-analysis-model-${id}`,
    status: 'Running',
    uptime: '2d 7h 15m',
    restarts: seededRandom(seed) > 0.8 ? 1 : 0,
    cpuUsage: Math.floor(20 + seededRandom(seed + 1) * 40),
    memoryUsage: Math.floor(30 + seededRandom(seed + 2) * 40)
  };
};

const MetricsDisplay: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [hourlySummary, setHourlySummary] = useState<HourlySummaryData[]>([]);
  const [timeRange, setTimeRange] = useState<string>('1h');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  
  // Mock deployment details
  const deployment: DeploymentInfo = {
    id: '1',
    name: 'sentiment-analysis-model',
    status: 'Ready',
    createdAt: '2025-05-10T12:00:00Z',
    endpoint: 'https://api.byte.ai/models/sentiment-analysis-model',
    replicas: 4,
    gpu: 'nvidia-tesla-t4',
    cpuLimit: '8 cores',
    memoryLimit: '16 GB'
  };
  
  // Initialize metrics with deterministic data
  useEffect(() => {
    setIsClient(true);
    setMetrics(generateMockMetrics());
    setHourlySummary(generateHourlySummary());
  }, []);
  
  // Handle metrics refresh
  const refreshMetrics = (): void => {
    setIsRefreshing(true);
    
    setTimeout(() => {
      // Use current timestamp as seed for variety on refresh
      const refreshSeed = Date.now() % 100000;
      setMetrics(generateMockMetrics(refreshSeed));
      setHourlySummary(generateHourlySummary(refreshSeed));
      setIsRefreshing(false);
    }, 1000);
  };
  
  // Format timestamp for tooltip
  const formatTooltipTime = (time: string): string => {
    return time;
  };
  
  // Custom tooltip component for charts
  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1A1A1C] border border-[#2E2E2E] rounded-md p-3 shadow-lg">
          <p className="text-[#9CA3AF] mb-1">{formatTooltipTime(label || '')}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: {entry.value}{entry.unit || ''}
            </p>
          ))}
        </div>
      );
    }
    
    return null;
  };
  
  // Filter metrics based on selected time range
  const filterMetricsByTimeRange = (): MetricData[] => {
    if (timeRange === '1h') {
      return metrics;
    } else if (timeRange === '6h') {
      // For demo purposes, just return all metrics
      return metrics;
    } else if (timeRange === '24h') {
      // For demo purposes, just return all metrics
      return metrics;
    } else if (timeRange === '7d') {
      // For demo purposes, just return all metrics
      return metrics;
    }
    
    return metrics;
  };
  
  const filteredMetrics = filterMetricsByTimeRange();
  
  // Generate pod data with deterministic values
  const podDataList = useMemo(() => {
    return Array.from({ length: deployment.replicas }, (_, index) => 
      generatePodData(index + 1)
    );
  }, [deployment.replicas]);
  
  // Don't render dynamic content until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white">
        {/* Top Navigation */}
        <div className="container mx-auto px-4 py-6 border-b border-[#1E1E1E]">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Logo />
              <div className="ml-8 flex items-center text-[#9CA3AF]">
                <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
                <span className="mx-2">/</span>
                <Link href="/deployments/1" className="hover:text-white transition-colors">{deployment.name}</Link>
                <span className="mx-2">/</span>
                <span className="text-white">Metrics</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/deployments/1" 
                className="text-[#9CA3AF] hover:text-white transition-colors flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Deployment
              </Link>
            </div>
          </div>
        </div>

        {/* Loading placeholder */}
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-[#161618] rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-[#161618] rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-[#161618] border border-[#2E2E2E] rounded-lg p-6 h-24"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Top Navigation */}
      <div className="container mx-auto px-4 py-6 border-b border-[#1E1E1E]">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Logo />
            <div className="ml-8 flex items-center text-[#9CA3AF]">
              <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
              <span className="mx-2">/</span>
              <Link href="/deployments/1" className="hover:text-white transition-colors">{deployment.name}</Link>
              <span className="mx-2">/</span>
              <span className="text-white">Metrics</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/deployments/1" 
              className="text-[#9CA3AF] hover:text-white transition-colors flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Deployment
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Metrics for &quot;{deployment.name}&quot;</h1>
            <div className="flex items-center">
              <StatusBadge status={deployment.status} />
              <span className="mx-2 text-[#9CA3AF]">•</span>
              <span className="text-[#9CA3AF]">{deployment.replicas} replicas</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                className="flex items-center px-4 py-2 bg-[#161618] border border-[#2E2E2E] rounded-md text-white"
                onClick={() => setShowTimeDropdown(!showTimeDropdown)}
              >
                <Calendar className="h-4 w-4 mr-2 text-[#9CA3AF]" />
                {timeRange === '1h' ? 'Last hour' : 
                 timeRange === '6h' ? 'Last 6 hours' : 
                 timeRange === '24h' ? 'Last 24 hours' : 'Last 7 days'}
                <ChevronDown className="h-4 w-4 ml-2 text-[#9CA3AF]" />
              </button>
              
              {showTimeDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1A1A1C] border border-[#2E2E2E] rounded-md shadow-lg z-10">
                  <ul>
                    {['1h', '6h', '24h', '7d'].map((range) => (
                      <li key={range}>
                        <button
                          className={`w-full text-left px-4 py-2 hover:bg-[#2E2E2E] ${timeRange === range ? 'bg-[#2E2E2E]' : ''}`}
                          onClick={() => {
                            setTimeRange(range);
                            setShowTimeDropdown(false);
                          }}
                        >
                          {range === '1h' ? 'Last hour' : 
                           range === '6h' ? 'Last 6 hours' : 
                           range === '24h' ? 'Last 24 hours' : 'Last 7 days'}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <button
              onClick={refreshMetrics}
              disabled={isRefreshing}
              className={`flex items-center px-4 py-2 bg-[#161618] border border-[#2E2E2E] rounded-md text-white hover:bg-[#1E1E1E] transition-colors ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
        
        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="CPU Usage" 
            value={`${filteredMetrics.length ? filteredMetrics[filteredMetrics.length - 1].cpu : 0}%`} 
            trend={5}
            subtitle={`Limit: ${deployment.cpuLimit}`}
          />
          <StatCard 
            title="Memory Usage" 
            value={`${filteredMetrics.length ? filteredMetrics[filteredMetrics.length - 1].memory : 0}%`} 
            trend={-2}
            subtitle={`Limit: ${deployment.memoryLimit}`}
          />
          <StatCard 
            title="GPU Utilization" 
            value={`${filteredMetrics.length ? filteredMetrics[filteredMetrics.length - 1].gpu : 0}%`} 
            trend={8}
            subtitle={`Type: ${deployment.gpu}`}
          />
          <StatCard 
            title="Pods Running" 
            value={`${deployment.replicas} / ${deployment.replicas}`} 
            trend={null}
            subtitle="All pods healthy"
          />
        </div>
        
        {/* Metrics Charts */}
        <div className="space-y-8">
          {/* Resource Usage Charts */}
          <div className="bg-[#161618] border border-[#2E2E2E] rounded-lg overflow-hidden">
            <div className="p-4 border-b border-[#2E2E2E]">
              <h2 className="text-lg font-semibold">Resource Usage</h2>
            </div>
            <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80">
                <h3 className="text-sm font-medium mb-4">CPU & Memory Utilization</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={filteredMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2E2E2E" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#9CA3AF" 
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      domain={[0, 100]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="cpu" 
                      name="CPU" 
                      stroke="#3B82F6" 
                      fill="#3B82F633" 
                      activeDot={{ r: 6 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="memory" 
                      name="Memory" 
                      stroke="#10B981" 
                      fill="#10B98133" 
                      activeDot={{ r: 6 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="h-80">
                <h3 className="text-sm font-medium mb-4">GPU Utilization</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={filteredMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2E2E2E" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#9CA3AF" 
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      domain={[0, 100]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="gpu" 
                      name="GPU" 
                      stroke="#8B5CF6" 
                      fill="#8B5CF633" 
                      activeDot={{ r: 6 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Performance Metrics */}
          <div className="bg-[#161618] border border-[#2E2E2E] rounded-lg overflow-hidden">
            <div className="p-4 border-b border-[#2E2E2E]">
              <h2 className="text-lg font-semibold">Performance Metrics</h2>
            </div>
            <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80">
                <h3 className="text-sm font-medium mb-4">Request Latency</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filteredMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2E2E2E" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#9CA3AF" 
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="latency" 
                      name="Latency" 
                      stroke="#F59E0B" 
                      activeDot={{ r: 6 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="h-80">
                <h3 className="text-sm font-medium mb-4">Throughput</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filteredMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2E2E2E" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#9CA3AF" 
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="throughput" 
                      name="Throughput" 
                      stroke="#3B82F6" 
                      activeDot={{ r: 6 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Success Rate and Errors */}
          <div className="bg-[#161618] border border-[#2E2E2E] rounded-lg overflow-hidden">
            <div className="p-4 border-b border-[#2E2E2E]">
              <h2 className="text-lg font-semibold">Reliability Metrics</h2>
            </div>
            <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80">
                <h3 className="text-sm font-medium mb-4">Success Rate</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filteredMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2E2E2E" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#9CA3AF" 
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      domain={[90, 100]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="successRate" 
                      name="Success Rate" 
                      stroke="#10B981" 
                      activeDot={{ r: 6 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="h-80">
                <h3 className="text-sm font-medium mb-4">Hourly Requests & Errors</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlySummary}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2E2E2E" />
                    <XAxis 
                      dataKey="hour" 
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#9CA3AF" 
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      yAxisId="left"
                    />
                    <YAxis 
                      stroke="#9CA3AF" 
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      yAxisId="right"
                      orientation="right"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar 
                      dataKey="requestCount" 
                      name="Requests" 
                      fill="#3B82F6" 
                      yAxisId="left" 
                    />
                    <Bar 
                      dataKey="errorCount" 
                      name="Errors" 
                      fill="#EF4444" 
                      yAxisId="right" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Pod Status */}
          <div className="bg-[#161618] border border-[#2E2E2E] rounded-lg overflow-hidden">
            <div className="p-4 border-b border-[#2E2E2E]">
              <h2 className="text-lg font-semibold">Pod Status</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {podDataList.map((podData, index) => (
                  <PodStatusCard key={index} id={index + 1} podData={podData} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsDisplay;
    