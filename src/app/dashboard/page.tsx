'use client';
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Check, 
  Clock, 
  AlertTriangle, 
  Square, 
  ArrowUpRight,
  Cpu,
  HardDrive,
  Activity,
  Play,
  Pause,
  RefreshCw,
  Trash2
} from 'lucide-react';

// TypeScript interfaces
interface Deployment {
  id: string;
  name: string;
  status: 'Ready' | 'Deploying' | 'Error' | 'Stopped';
  image: string;
  endpoint?: string;
  replicas: number;
  createdAt: string;
  cpuUsage: number;
  memoryUsage: number;
  errorMessage?: string;
  lastStopped?: string;
}

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

interface StatusBadgeProps {
  status: 'Ready' | 'Deploying' | 'Error' | 'Stopped';
}

interface ResourceBarProps {
  label: string;
  value: number;
}

interface ActionMenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}

interface NavItemProps {
  active: boolean;
  icon: React.ReactNode;
  label: string;
}

// Mock data for deployments
const mockDeployments: Deployment[] = [
  {
    id: '1',
    name: 'sentiment-analysis-model',
    status: 'Ready',
    image: 'acme-registry/sentiment:v1.2.3',
    endpoint: 'https://api.byte.ai/models/sentiment-analysis-model',
    replicas: 3,
    createdAt: '2025-05-10T12:00:00Z',
    cpuUsage: 32,
    memoryUsage: 68,
  },
  {
    id: '2',
    name: 'image-generation-stable-diffusion',
    status: 'Deploying',
    image: 'acme-registry/stable-diffusion:v3.0.1',
    replicas: 2,
    createdAt: '2025-05-15T09:30:00Z',
    cpuUsage: 45,
    memoryUsage: 52,
  },
  {
    id: '3',
    name: 'gpt-j-text-completion',
    status: 'Error',
    image: 'acme-registry/gpt-j:latest',
    replicas: 5,
    createdAt: '2025-05-14T16:45:00Z',
    errorMessage: 'Container failed to start: GPU memory limit exceeded',
    cpuUsage: 0,
    memoryUsage: 0,
  },
  {
    id: '4',
    name: 'recommendation-engine',
    status: 'Stopped',
    image: 'acme-registry/rec-engine:v2.1.0',
    replicas: 2,
    createdAt: '2025-05-01T11:20:00Z',
    lastStopped: '2025-05-16T08:15:00Z',
    cpuUsage: 0,
    memoryUsage: 0,
  },
  {
    id: '5',
    name: 'entity-recognition-bert',
    status: 'Ready',
    image: 'acme-registry/bert-ner:v1.0.5',
    endpoint: 'https://api.byte.ai/models/entity-recognition-bert',
    replicas: 2,
    createdAt: '2025-05-08T14:35:00Z',
    cpuUsage: 28,
    memoryUsage: 45,
  },
];

const Dashboard: React.FC = () => {
  const [deployments, setDeployments] = useState<Deployment[]>(mockDeployments);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false);

  // Ensure we're on the client side for date formatting
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Filter deployments based on search and status filter
  const filteredDeployments = deployments.filter((deployment: Deployment) => {
    const matchesSearch = deployment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          deployment.image.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || deployment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Summary stats
  const totalDeployments = deployments.length;
  const activeDeployments = deployments.filter((d: Deployment) => d.status === 'Ready').length;
  const deployingCount = deployments.filter((d: Deployment) => d.status === 'Deploying').length;
  const errorCount = deployments.filter((d: Deployment) => d.status === 'Error').length;

  // Handle action menu toggle
  const toggleActionMenu = (id: string): void => {
    setActionMenuOpen(actionMenuOpen === id ? null : id);
  };

  // Handle deployment actions (start, stop, update)
  const handleAction = (id: string, action: string): void => {
    let updatedDeployments = [...deployments];
    const index = updatedDeployments.findIndex((d: Deployment) => d.id === id);
    
    if (index !== -1) {
      if (action === 'start') {
        updatedDeployments[index].status = 'Deploying';
        // In real app, would trigger API call here
        setTimeout(() => {
          const deployments = [...updatedDeployments];
          deployments[index].status = 'Ready';
          setDeployments(deployments);
        }, 3000);
      } else if (action === 'stop') {
        updatedDeployments[index].status = 'Stopped';
        updatedDeployments[index].lastStopped = new Date().toISOString();
      } else if (action === 'update') {
        // This would open the update modal in a real implementation
        alert('Update modal would open here');
      } else if (action === 'delete') {
        updatedDeployments = updatedDeployments.filter((d: Deployment) => d.id !== id);
      }
      
      setDeployments(updatedDeployments);
    }
    
    setActionMenuOpen(null);
  };

  // Format timestamp to readable date
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Dashboard Layout */}
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 border-r border-[#1E1E1E] bg-[#0E0E0E] flex flex-col">
          <div className="p-4 border-b border-[#1E1E1E]">
            <Logo />
          </div>
          
          <nav className="flex-1 pt-5">
            <div className="px-4 mb-2 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
              Main
            </div>
            <NavItem active={true} icon={<HardDrive size={18} />} label="Deployments" />
            <NavItem active={false} icon={<Activity size={18} />} label="Monitoring" />
            <NavItem active={false} icon={<Cpu size={18} />} label="Resources" />
            
            <div className="px-4 mt-8 mb-2 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
              Account
            </div>
            <NavItem active={false} icon={<Square size={18} />} label="Settings" />
          </nav>
          
          <div className="p-4 border-t border-[#1E1E1E]">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-[#3B82F6] flex items-center justify-center">
                <span className="font-semibold text-sm">JD</span>
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium">Jane Doe</div>
                <div className="text-xs text-[#9CA3AF]">jane@acme.ai</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="bg-[#0E0E0E] border-b border-[#1E1E1E] py-4 px-6">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">Deployments</h1>
              <button 
                onClick={() => window.location.href='/deploy-new'}
                className="bg-[#3B82F6] hover:bg-[#7D5AE4] text-white px-4 py-2 rounded-md transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Deployment
              </button>
            </div>
          </header>
          
          {/* Dashboard Content */}
          <main className="flex-1 overflow-y-auto bg-[#0A0A0A] p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard 
                title="Total Deployments" 
                value={totalDeployments} 
                icon={<HardDrive className="h-5 w-5 text-[#3B82F6]" />} 
              />
              <StatsCard 
                title="Active Models" 
                value={activeDeployments}
                icon={<Check className="h-5 w-5 text-green-500" />} 
              />
              <StatsCard 
                title="Deploying" 
                value={deployingCount}
                icon={<Clock className="h-5 w-5 text-amber-500" />} 
              />
              <StatsCard 
                title="Errors" 
                value={errorCount}
                icon={<AlertTriangle className="h-5 w-5 text-red-500" />} 
              />
            </div>
            
            {/* Deployments Table */}
            <div className="bg-[#161618] border border-[#2E2E2E] rounded-lg overflow-hidden">
              {/* Table Header with Search and Filters */}
              <div className="p-4 border-b border-[#2E2E2E] flex flex-wrap items-center justify-between gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search deployments..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="bg-[#1A1A1C] border border-[#2E2E2E] rounded-md py-2 pl-10 pr-4 w-full md:w-80 text-sm text-white placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                  />
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4 text-[#9CA3AF]" />
                    <select
                      value={statusFilter}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
                      className="bg-[#1A1A1C] border border-[#2E2E2E] rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Ready">Ready</option>
                      <option value="Deploying">Deploying</option>
                      <option value="Error">Error</option>
                      <option value="Stopped">Stopped</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#2E2E2E]">
                  <thead className="bg-[#1A1A1C]">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                        Image
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                        Replicas
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                        Created
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                        Resources
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2E2E2E]">
                    {filteredDeployments.length > 0 ? (
                      filteredDeployments.map((deployment: Deployment) => (
                        <tr 
                          key={deployment.id}
                          className="hover:bg-[#1E1E1E] transition-colors"
                          onClick={() => window.location.href = `/deployments/${deployment.id}`}
                          style={{ cursor: 'pointer' }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium">{deployment.name}</div>
                            {deployment.endpoint && (
                              <div className="text-xs text-[#9CA3AF] mt-1 flex items-center">
                                <a 
                                  href={deployment.endpoint}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                  className="flex items-center hover:text-[#3B82F6]"
                                >
                                  <span className="truncate max-w-xs">{deployment.endpoint}</span>
                                  <ArrowUpRight className="h-3 w-3 ml-1 inline" />
                                </a>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={deployment.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-[#E5E7EB] font-mono">{deployment.image}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {deployment.replicas}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-[#E5E7EB]">
                              {isClient ? formatDate(deployment.createdAt) : 'Loading...'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {deployment.status !== 'Stopped' && deployment.status !== 'Error' ? (
                              <div className="flex space-x-4">
                                <ResourceBar label="CPU" value={deployment.cpuUsage} />
                                <ResourceBar label="MEM" value={deployment.memoryUsage} />
                              </div>
                            ) : (
                              <span className="text-sm text-[#9CA3AF]">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                            <div onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              toggleActionMenu(deployment.id);
                            }}>
                              <button className="text-[#9CA3AF] hover:text-white p-1 rounded-md hover:bg-[#2E2E2E]">
                                <MoreHorizontal className="h-5 w-5" />
                              </button>
                              
                              {actionMenuOpen === deployment.id && (
                                <div 
                                  className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[#1A1A1C] border border-[#2E2E2E] z-10"
                                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                >
                                  <div className="py-1">
                                    {deployment.status === 'Stopped' && (
                                      <ActionMenuItem
                                        icon={<Play className="h-4 w-4" />}
                                        label="Start"
                                        onClick={() => handleAction(deployment.id, 'start')}
                                      />
                                    )}
                                    {deployment.status === 'Ready' && (
                                      <ActionMenuItem
                                        icon={<Pause className="h-4 w-4" />}
                                        label="Stop"
                                        onClick={() => handleAction(deployment.id, 'stop')}
                                      />
                                    )}
                                    <ActionMenuItem
                                      icon={<RefreshCw className="h-4 w-4" />}
                                      label="Update"
                                      onClick={() => handleAction(deployment.id, 'update')}
                                    />
                                    <div className="border-t border-[#2E2E2E] my-1"></div>
                                    <ActionMenuItem
                                      icon={<Trash2 className="h-4 w-4 text-red-500" />}
                                      label="Delete"
                                      onClick={() => handleAction(deployment.id, 'delete')}
                                      danger
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-10 text-center text-[#9CA3AF]">
                          {searchTerm || statusFilter !== 'All' 
                            ? "No deployments match your filters"
                            : "No deployments found. Click 'New Deployment' to get started."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
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

// Component for navigation items
const NavItem: React.FC<NavItemProps> = ({ active, icon, label }) => (
  <a
    href="#"
    className={`flex items-center px-4 py-2 text-sm mb-1 ${
      active 
        ? 'bg-[#3B82F6]/10 text-[#3B82F6] border-l-2 border-[#3B82F6]' 
        : 'text-[#9CA3AF] hover:bg-[#1A1A1C] hover:text-white'
    }`}
  >
    <span className="mr-3">{icon}</span>
    <span>{label}</span>
  </a>
);

// Component for stats cards
const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon }) => (
  <div className="bg-[#161618] border border-[#2E2E2E] rounded-lg p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[#9CA3AF] text-sm">{title}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
      </div>
      <div className="w-10 h-10 rounded-md bg-[#1A1A1C] flex items-center justify-center">
        {icon}
      </div>
    </div>
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
    <div className="flex justify-between items-center mb-1">
      <span className="text-xs text-[#9CA3AF]">{label}</span>
      <span className="text-xs">{value}%</span>
    </div>
    <div className="w-24 h-1 bg-[#2E2E2E] rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full ${
          value > 80 ? 'bg-red-500' : value > 60 ? 'bg-amber-500' : 'bg-green-500'
        }`} 
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

// Component for action menu items
const ActionMenuItem: React.FC<ActionMenuItemProps> = ({ icon, label, onClick, danger = false }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-2 text-sm text-left ${
      danger ? 'text-red-500 hover:bg-red-500/10' : 'text-[#E5E7EB] hover:bg-[#2E2E2E]'
    }`}
  >
    <span className="mr-2">{icon}</span>
    <span>{label}</span>
  </button>
);

export default Dashboard;
