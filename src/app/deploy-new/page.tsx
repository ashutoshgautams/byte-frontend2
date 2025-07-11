'use client';
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Info, Server, Sliders } from 'lucide-react';

const DeploymentWizard = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deploymentSuccess, setDeploymentSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    serviceName: '',
    containerImage: '',
    replicas: 1,
    gpuEnabled: false,
    gpuType: 'nvidia-tesla-t4',
    gpuCount: 1,
    maxCpu: 2,
    maxMemory: 4
  });

  const updateFormData = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const validateCurrentStep = () => {
    // Step 1 validation: Service name and container image are required
    if (step === 1) {
      return formData.serviceName.trim() !== '' && formData.containerImage.trim() !== '';
    }
    
    // Step 2 validation: Basic validation for resource settings
    if (step === 2) {
      return formData.replicas > 0 && formData.maxCpu > 0 && formData.maxMemory > 0;
    }
    
    return true;
  };

  const isStepValid = validateCurrentStep();

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setDeploymentSuccess(true);
    }, 2000);
  };

  // Dynamic step indicator content
  const stepIndicators = [
    { icon: <Server size={16} />, label: "Service Details" },
    { icon: <Sliders size={16} />, label: "Resource Configuration" },
    { icon: <Check size={16} />, label: "Confirmation" }
  ];

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
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Deploy a New Model</h1>
            <p className="text-[#9CA3AF]">
              Configure and deploy your pre-trained model container as a scalable inference endpoint
            </p>
          </div>

          {/* Step Indicators */}
          <div className="mb-10">
            <div className="flex items-center justify-center">
              {stepIndicators.map((indicator, index) => (
                <React.Fragment key={index}>
                  <div 
                    className={`flex flex-col items-center ${
                      index + 1 < step ? 'text-[#3B82F6]' : 
                      index + 1 === step ? 'text-white' : 'text-[#9CA3AF]'
                    }`}
                  >
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        index + 1 < step ? 'bg-[#3B82F6]' : 
                        index + 1 === step ? 'bg-[#3B82F6]/20 border border-[#3B82F6]' : 
                        'bg-[#1A1A1C] border border-[#2E2E2E]'
                      }`}
                    >
                      {index + 1 < step ? (
                        <Check size={18} />
                      ) : (
                        indicator.icon
                      )}
                    </div>
                    <span className="text-sm">{indicator.label}</span>
                  </div>
                  
                  {/* Connector line between steps */}
                  {index < stepIndicators.length - 1 && (
                    <div 
                      className={`w-24 h-0.5 mx-2 ${
                        index + 1 < step ? 'bg-[#3B82F6]' : 'bg-[#2E2E2E]'
                      }`}
                    ></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {deploymentSuccess ? (
            <div className="bg-[#161618] border border-[#2E2E2E] rounded-lg p-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-[#3B82F6]/10 rounded-full flex items-center justify-center mb-6">
                  <Check className="h-8 w-8 text-[#3B82F6]" />
                </div>
                <h2 className="text-2xl font-semibold mb-4">Deployment Started!</h2>
                <p className="text-[#9CA3AF] mb-6">
                  Your model is now being deployed as a scalable inference service.
                  You can monitor its status on the dashboard.
                </p>
                
                <div className="bg-[#1A1A1C] border border-[#2E2E2E] rounded-md p-4 mb-8 mx-auto max-w-md">
                  <div className="text-left">
                    <div className="mb-4">
                      <h3 className="text-sm text-[#9CA3AF] mb-1">Service Name</h3>
                      <p className="font-medium">{formData.serviceName}</p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-sm text-[#9CA3AF] mb-1">Container Image</h3>
                      <p className="font-medium font-mono text-sm">{formData.containerImage}</p>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-sm text-[#9CA3AF] mb-1">Replicas</h3>
                        <p className="font-medium">{formData.replicas}</p>
                      </div>
                      {formData.gpuEnabled && (
                        <div>
                          <h3 className="text-sm text-[#9CA3AF] mb-1">GPU Resources</h3>
                          <p className="font-medium">{formData.gpuCount}x {formData.gpuType}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <a
                    href="/dashboard"
                    className="bg-[#3B82F6] hover:bg-[#7D5AE4] text-white px-6 py-2 rounded-md transition-colors"
                  >
                    Go to Dashboard
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#161618] border border-[#2E2E2E] rounded-lg p-8">
              <form onSubmit={handleSubmit}>
                {/* Step 1: Basic Service Information */}
                {step === 1 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Service Details</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="serviceName" className="block text-sm font-medium mb-2">
                          Service Name
                        </label>
                        <input
                          id="serviceName"
                          type="text"
                          value={formData.serviceName}
                          onChange={(e) => updateFormData('serviceName', e.target.value)}
                          className="w-full bg-[#1A1A1C] border border-[#2E2E2E] rounded-md px-3 py-2 text-white placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                          placeholder="my-text-classification-model"
                          required
                        />
                        <p className="mt-1 text-xs text-[#9CA3AF]">
                          The name will be used to identify your model service in the dashboard
                        </p>
                      </div>
                      
                      <div>
                        <label htmlFor="containerImage" className="block text-sm font-medium mb-2">
                          Container Image URL
                        </label>
                        <input
                          id="containerImage"
                          type="text"
                          value={formData.containerImage}
                          onChange={(e) => updateFormData('containerImage', e.target.value)}
                          className="w-full bg-[#1A1A1C] border border-[#2E2E2E] rounded-md px-3 py-2 text-white placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent font-mono text-sm"
                          placeholder="your-registry/your-image:tag"
                          required
                        />
                        <p className="mt-1 text-xs text-[#9CA3AF]">
                          Full URL to your containerized model (e.g. from Docker Hub, GCR, or ECR)
                        </p>
                      </div>
                      
                      <div className="p-4 bg-[#1A1A1C] border border-[#2E2E2E] rounded-md">
                        <div className="flex">
                          <div className="mr-3 text-[#3B82F6]">
                            <Info size={16} />
                          </div>
                          <div className="text-sm text-[#9CA3AF]">
                            <p className="mb-2">Your container image should:</p>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Include all necessary dependencies for your model</li>
                              <li>Expose an HTTP endpoint that follows the KServe prediction protocol</li>
                              <li>Be configured to load your model at startup</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Step 2: Resource Configuration */}
                {step === 2 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Resource Configuration</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="replicas" className="block text-sm font-medium mb-2">
                          Number of Replicas
                        </label>
                        <input
                          id="replicas"
                          type="number"
                          min="1"
                          max="10"
                          value={formData.replicas}
                          onChange={(e) => updateFormData('replicas', parseInt(e.target.value, 10) || 1)}
                          className="w-full bg-[#1A1A1C] border border-[#2E2E2E] rounded-md px-3 py-2 text-white placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                        />
                        <p className="mt-1 text-xs text-[#9CA3AF]">
                          Number of instances to deploy (higher values increase throughput and availability)
                        </p>
                      </div>
                      
                      <div className="border-t border-[#2E2E2E] pt-6">
                        <h3 className="text-lg font-medium mb-4">Computing Resources</h3>
                        
                        <div className="mb-6">
                          <div className="flex items-center mb-4">
                            <input
                              id="gpuEnabled"
                              type="checkbox"
                              checked={formData.gpuEnabled}
                              onChange={(e) => updateFormData('gpuEnabled', e.target.checked)}
                              className="h-4 w-4 bg-[#1A1A1C] border border-[#2E2E2E] rounded focus:ring-[#3B82F6] focus:ring-offset-[#0A0A0A] focus:ring-offset-2"
                            />
                            <label htmlFor="gpuEnabled" className="ml-2 block text-sm font-medium">
                              Enable GPU Acceleration
                            </label>
                          </div>
                          
                          {formData.gpuEnabled && (
                            <div className="pl-6 space-y-4">
                              <div>
                                <label htmlFor="gpuType" className="block text-sm font-medium mb-2">
                                  GPU Type
                                </label>
                                <select
                                  id="gpuType"
                                  value={formData.gpuType}
                                  onChange={(e) => updateFormData('gpuType', e.target.value)}
                                  className="w-full bg-[#1A1A1C] border border-[#2E2E2E] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                                >
                                  <option value="nvidia-tesla-t4">NVIDIA Tesla T4</option>
                                  <option value="nvidia-a100">NVIDIA A100</option>
                                  <option value="nvidia-v100">NVIDIA V100</option>
                                </select>
                              </div>
                              
                              <div>
                                <label htmlFor="gpuCount" className="block text-sm font-medium mb-2">
                                  GPU Count
                                </label>
                                <select
                                  id="gpuCount"
                                  value={formData.gpuCount}
                                  onChange={(e) => updateFormData('gpuCount', parseInt(e.target.value, 10))}
                                  className="w-full bg-[#1A1A1C] border border-[#2E2E2E] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                                >
                                  <option value={1}>1</option>
                                  <option value={2}>2</option>
                                  <option value={4}>4</option>
                                  <option value={8}>8</option>
                                </select>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="maxCpu" className="block text-sm font-medium mb-2">
                              Max CPU Cores
                            </label>
                            <select
                              id="maxCpu"
                              value={formData.maxCpu}
                              onChange={(e) => updateFormData('maxCpu', parseFloat(e.target.value))}
                              className="w-full bg-[#1A1A1C] border border-[#2E2E2E] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                            >
                              <option value={0.5}>0.5 cores</option>
                              <option value={1}>1 core</option>
                              <option value={2}>2 cores</option>
                              <option value={4}>4 cores</option>
                              <option value={8}>8 cores</option>
                              <option value={16}>16 cores</option>
                            </select>
                          </div>
                          
                          <div>
                            <label htmlFor="maxMemory" className="block text-sm font-medium mb-2">
                              Max Memory (GB)
                            </label>
                            <select
                              id="maxMemory"
                              value={formData.maxMemory}
                              onChange={(e) => updateFormData('maxMemory', parseInt(e.target.value, 10))}
                              className="w-full bg-[#1A1A1C] border border-[#2E2E2E] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                            >
                              <option value={1}>1 GB</option>
                              <option value={2}>2 GB</option>
                              <option value={4}>4 GB</option>
                              <option value={8}>8 GB</option>
                              <option value={16}>16 GB</option>
                              <option value={32}>32 GB</option>
                              <option value={64}>64 GB</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Step 3: Confirmation */}
                {step === 3 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-6">Confirm Deployment</h2>
                    
                    <div className="bg-[#1A1A1C] border border-[#2E2E2E] rounded-md p-6 mb-8">
                      <h3 className="text-lg font-medium mb-4">Deployment Summary</h3>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between py-2 border-b border-[#2E2E2E]">
                          <span className="text-[#9CA3AF]">Service Name</span>
                          <span className="font-medium">{formData.serviceName}</span>
                        </div>
                        
                        <div className="flex justify-between py-2 border-b border-[#2E2E2E]">
                          <span className="text-[#9CA3AF]">Container Image</span>
                          <span className="font-medium font-mono text-sm">{formData.containerImage}</span>
                        </div>
                        
                        <div className="flex justify-between py-2 border-b border-[#2E2E2E]">
                          <span className="text-[#9CA3AF]">Replicas</span>
                          <span className="font-medium">{formData.replicas}</span>
                        </div>
                        
                        <div className="flex justify-between py-2 border-b border-[#2E2E2E]">
                          <span className="text-[#9CA3AF]">CPU Cores</span>
                          <span className="font-medium">{formData.maxCpu}</span>
                        </div>
                        
                        <div className="flex justify-between py-2 border-b border-[#2E2E2E]">
                          <span className="text-[#9CA3AF]">Memory</span>
                          <span className="font-medium">{formData.maxMemory} GB</span>
                        </div>
                        
                        {formData.gpuEnabled && (
                          <div className="flex justify-between py-2 border-b border-[#2E2E2E]">
                            <span className="text-[#9CA3AF]">GPU Resources</span>
                            <span className="font-medium">{formData.gpuCount}x {formData.gpuType}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between py-2">
                          <span className="text-[#9CA3AF]">Estimated Monthly Cost</span>
                          <span className="font-medium">$120 - $340 USD</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-md mb-6">
                      <div className="flex">
                        <div className="mr-3 text-amber-500">
                          <Info size={16} />
                        </div>
                        <div className="text-sm text-amber-300">
                          <p>
                            Once deployed, your model will be accessible via a secure endpoint.
                            You can start, stop, or update your deployment from the dashboard.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="flex items-center px-4 py-2 border border-[#2E2E2E] rounded-md text-[#E5E7EB] hover:bg-[#1A1A1C] transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </button>
                  ) : (
                    <div></div>
                  )}
                  
                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      disabled={!isStepValid}
                      className={`flex items-center px-4 py-2 bg-[#3B82F6] rounded-md text-white hover:bg-[#7D5AE4] transition-colors ${
                        !isStepValid ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      Continue
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex items-center px-6 py-2 bg-[#3B82F6] rounded-md text-white hover:bg-[#7D5AE4] transition-colors ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Deploying...
                        </>
                      ) : (
                        <>
                          Deploy Model
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Component for the logo
const Logo = () => (
  <div className="flex items-center">
    {/* <div className="w-8 h-8 bg-[#3B82F6] rounded-md mr-2 flex items-center justify-center">
      <span className="font-bold text-lg">B</span>
    </div> */}
    <span className="font-bold text-xl">byte</span>
  </div>
);

export default DeploymentWizard;
