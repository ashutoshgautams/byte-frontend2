'use client';
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Download, AlertTriangle, Check, Copy, Search, Filter, RefreshCw, Clock, Square } from 'lucide-react';
import Link from 'next/link';

// Type definitions
interface Log {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG';
  component: string;
  message: string;
}

interface FilterState {
  searchTerm: string;
  level: 'ALL' | 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG';
  component: string;
}

interface Deployment {
  id: string;
  name: string;
  status: 'Ready' | 'Deploying' | 'Error' | 'Stopped';
  createdAt: string;
  endpoint: string;
}

interface StatusBadgeProps {
  status: 'Ready' | 'Deploying' | 'Error' | 'Stopped';
}

// Mock log data
const generateMockLogs = (): Log[] => {
  const logLevels: Log['level'][] = ['INFO', 'WARNING', 'ERROR', 'DEBUG'];
  const components = ['Server', 'Model', 'KServe', 'Container', 'Prediction'];
  const messages = [
    'Loading model from path /models/sentiment-analysis',
    'Model loaded successfully',
    'Listening on port 8080',
    'Received prediction request',
    'Processing input tensor of shape (1, 768)',
    'Memory usage: 2.3GB',
    'CPU usage: 45%',
    'Connection timeout after 30s',
    'Failed to process request: input tensor shape mismatch',
    'Prediction completed in 250ms',
    'Starting health check',
    'Health check passed',
    'Request payload size: 1.2MB',
    'Response size: 34KB',
    'Model warmup complete',
    'Processing batch of size 32',
    'Received malformed request',
    'Autoscaling triggered',
    'Max batch size increased to 64',
    'OOM warning: approaching memory limit'
  ];
  
  const logs: Log[] = [];
  
  const now = new Date();
  for (let i = 0; i < 100; i++) {
    const level = logLevels[Math.floor(Math.random() * logLevels.length)];
    const component = components[Math.floor(Math.random() * components.length)];
    const message = messages[Math.floor(Math.random() * messages.length)];
    
    // Create timestamp, subtracting a few seconds for each older log
    const timestamp = new Date(now.getTime() - (i * 3000));
    
    logs.push({
      id: i.toString(),
      timestamp: timestamp.toISOString(),
      level,
      component,
      message
    });
  }
  
  return logs;
};

const LogViewer: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [filter, setFilter] = useState<FilterState>({
    searchTerm: '',
    level: 'ALL',
    component: 'ALL'
  });
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const logContainerRef = useRef<HTMLDivElement>(null);
  
  // Mock deployment details
  const deployment: Deployment = {
    id: '1',
    name: 'sentiment-analysis-model',
    status: 'Ready',
    createdAt: '2025-05-10T12:00:00Z',
    endpoint: 'https://api.byte.ai/models/sentiment-analysis-model'
  };
  
  // Initialize logs
  useEffect(() => {
    setLogs(generateMockLogs());
    
    // Simulate log streaming
    if (isStreaming) {
      const interval = setInterval(() => {
        const logLevels: Log['level'][] = ['INFO', 'WARNING', 'ERROR', 'DEBUG'];
        const components = ['Server', 'Model', 'KServe', 'Container', 'Prediction'];
        
        const newLog: Log = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          level: logLevels[Math.floor(Math.random() * logLevels.length)],
          component: components[Math.floor(Math.random() * components.length)],
          message: `Log message at ${new Date().toLocaleTimeString()}`
        };
        
        setLogs(prevLogs => [newLog, ...prevLogs.slice(0, 299)]); // Keep max 300 logs
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [isStreaming]);
  
  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = 0;
    }
  }, [logs, autoScroll]);
  
  // Filter logs based on search and filters
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
                          log.component.toLowerCase().includes(filter.searchTerm.toLowerCase());
    const matchesLevel = filter.level === 'ALL' || log.level === filter.level;
    const matchesComponent = filter.component === 'ALL' || log.component === filter.component;
    
    return matchesSearch && matchesLevel && matchesComponent;
  });
  
  // Get unique components for filter dropdown
  const uniqueComponents = ['ALL', ...new Set(logs.map(log => log.component))];
  
  // Format timestamp
  const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 });
  };
  
  // Download logs
  const handleDownloadLogs = (): void => {
    const content = logs.map(log => 
      `${log.timestamp} ${log.level.padEnd(7)} [${log.component}] ${log.message}`
    ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${deployment.name}-logs-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Get log level styling
  const getLogLevelStyle = (level: Log['level']): string => {
    switch (level) {
      case 'ERROR':
        return 'bg-red-500/10 text-red-500';
      case 'WARNING':
        return 'bg-amber-500/10 text-amber-500';
      case 'INFO':
        return 'bg-blue-500/10 text-blue-500';
      case 'DEBUG':
        return 'bg-green-500/10 text-green-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };
  
  const handleCopyLog = (log: Log): void => {
    navigator.clipboard.writeText(`${log.timestamp} ${log.level} [${log.component}] ${log.message}`);
  };
  
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Top Navigation */}
      <div className="container mx-auto px-4 py-6 border-b border-[#1E1E1E]">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Logo />
            <div className="ml-8 flex items-center text-[#9CA3AF]">
              <a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a>
              <span className="mx-2">/</span>
              <Link href="/deployments/1" className="hover:text-white transition-colors">{deployment.name}</Link>
              <span className="mx-2">/</span>
              <span className="text-white">Logs</span>
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
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">Logs for &quot;{deployment.name}&quot;</h1>
          
          <div className="flex flex-wrap gap-4 items-center">
            <div className="bg-[#161618] border border-[#2E2E2E] rounded-md px-4 py-2 flex items-center">
              <span className="text-[#9CA3AF] mr-2">Status:</span>
              <StatusBadge status={deployment.status} />
            </div>
            
            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className={`flex items-center px-4 py-2 rounded-md border ${
                isStreaming ? 'border-green-500 bg-green-500/10 text-green-500' : 'border-[#2E2E2E] text-[#9CA3AF]'
              }`}
            >
              <span className={`w-2 h-2 rounded-full mr-2 ${isStreaming ? 'bg-green-500' : 'bg-[#9CA3AF]'}`}></span>
              {isStreaming ? 'Live streaming' : 'Streaming paused'}
            </button>
            
            <div className="flex-grow"></div>
            
            <button
              onClick={handleDownloadLogs}
              className="flex items-center px-4 py-2 border border-[#2E2E2E] rounded-md text-[#E5E7EB] hover:bg-[#1A1A1C] transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Logs
            </button>
          </div>
        </div>
        
        {/* Logs Panel */}
        <div className="bg-[#161618] border border-[#2E2E2E] rounded-lg overflow-hidden">
          {/* Filter Controls */}
          <div className="p-4 border-b border-[#2E2E2E] flex flex-wrap gap-4 items-center">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] h-4 w-4" />
              <input
                type="text"
                placeholder="Search logs..."
                value={filter.searchTerm}
                onChange={(e) => setFilter({...filter, searchTerm: e.target.value})}
                className="w-full bg-[#1A1A1C] border border-[#2E2E2E] rounded-md py-2 pl-10 pr-4 text-sm text-white placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4 text-[#9CA3AF]" />
              <select
                value={filter.level}
                onChange={(e) => setFilter({...filter, level: e.target.value as FilterState['level']})}
                className="bg-[#1A1A1C] border border-[#2E2E2E] rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
              >
                <option value="ALL">All Levels</option>
                <option value="ERROR">Error</option>
                <option value="WARNING">Warning</option>
                <option value="INFO">Info</option>
                <option value="DEBUG">Debug</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <select
                value={filter.component}
                onChange={(e) => setFilter({...filter, component: e.target.value})}
                className="bg-[#1A1A1C] border border-[#2E2E2E] rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
              >
                {uniqueComponents.map(component => (
                  <option key={component} value={component}>
                    {component === 'ALL' ? 'All Components' : component}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center ml-auto">
              <button
                onClick={() => setLogs(generateMockLogs())}
                className="flex items-center p-2 rounded-md hover:bg-[#1A1A1C]"
              >
                <RefreshCw className="h-4 w-4 text-[#9CA3AF]" />
              </button>
            </div>
          </div>
          
          {/* Log Display */}
          <div 
            className="h-[600px] overflow-y-auto font-mono text-sm bg-[#0E0E0E]" 
            ref={logContainerRef}
          >
            {filteredLogs.length > 0 ? (
              <div className="p-0">
                {filteredLogs.map(log => (
                  <div 
                    key={log.id} 
                    className="py-2 px-4 border-b border-[#1A1A1C] hover:bg-[#1E1E1E] group"
                  >
                    <div className="flex items-start">
                      <div className="text-[#9CA3AF] min-w-[100px]">
                        {formatTime(log.timestamp)}
                      </div>
                      <div className={`rounded px-2 py-0.5 text-xs font-medium mr-3 ${getLogLevelStyle(log.level)}`}>
                        {log.level}
                      </div>
                      <div className="text-[#64748B] mr-3">
                        [{log.component}]
                      </div>
                      <div className="text-white flex-grow">{log.message}</div>
                      <button 
                        className="text-[#9CA3AF] hover:text-white invisible group-hover:visible ml-2"
                        onClick={() => handleCopyLog(log)}
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-[#9CA3AF]">
                <AlertTriangle className="h-8 w-8 mb-2" />
                <p>No logs matching your filters</p>
              </div>
            )}
          </div>
          
          {/* Auto-scroll control */}
          <div className="p-3 border-t border-[#2E2E2E] bg-[#161618] flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="autoScroll"
                type="checkbox"
                checked={autoScroll}
                onChange={() => setAutoScroll(!autoScroll)}
                className="h-4 w-4 bg-[#1A1A1C] border border-[#2E2E2E] rounded focus:ring-[#3B82F6] focus:ring-offset-[#0A0A0A] focus:ring-offset-2"
              />
              <label htmlFor="autoScroll" className="ml-2 text-sm text-[#9CA3AF]">
                Auto-scroll to new logs
              </label>
            </div>
            
            <div className="text-sm text-[#9CA3AF]">
              Showing {filteredLogs.length} of {logs.length} logs
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
    {/* <div className="w-8 h-8 bg-[#3B82F6] rounded-md mr-2 flex items-center justify-center">
      <span className="font-bold text-lg">B</span>
    </div> */}
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

export default LogViewer;
