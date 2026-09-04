import React, { useState } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  Columns2,
  Square,
  Crosshair,
  Sparkles,
  Download,
  BookOpen,
  Plus,
  ChevronDown,
  Building2,
  FlaskConical,
  ExternalLink,
  RotateCw,
  Layers,
  Check,
} from 'lucide-react';
import { useCro } from '../context/CroContext';
import { DeptLogo } from './DeptLogo';

interface HeaderProps {
  onOpenSnippetLibrary: () => void;
  onOpenAiAssistant: () => void;
  onOpenExportModal: () => void;
  onOpenClientModal: () => void;
  onOpenExperimentModal: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSnippetLibrary,
  onOpenAiAssistant,
  onOpenExportModal,
  onOpenClientModal,
  onOpenExperimentModal,
  onToggleSidebar,
  isSidebarOpen,
}) => {
  const {
    clients,
    experiments,
    selectedClientId,
    selectedExperimentId,
    currentClient,
    currentExperiment,
    device,
    viewMode,
    isInspectorActive,
    snippets,
    setSelectedClientId,
    setSelectedExperimentId,
    setDevice,
    setViewMode,
    setIsInspectorActive,
    triggerLiveReload,
    isLiveReloading,
  } = useCro();

  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const [expDropdownOpen, setExpDropdownOpen] = useState(false);

  const clientExperiments = (experiments || []).filter((e) => e?.clientId === selectedClientId);

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Active</span>;
      case 'ready_for_prod':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">Ready</span>;
      case 'concluded':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-50 text-purple-700 border border-purple-200">Concluded</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-gray-100 text-gray-600 border border-gray-200">Draft</span>;
    }
  };

  return (
    <header className="h-14 bg-white text-[#111827] border-b border-[#E5E7EB] px-4 flex items-center justify-between select-none z-30 shrink-0">
      {/* Left section: DEPT Logo, Studio Pill & Selectors */}
      <div className="flex items-center gap-3">
        <button
          id="toggle-sidebar-btn"
          onClick={onToggleSidebar}
          className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            isSidebarOpen
              ? 'bg-[#F3F4F6] border-[#E5E7EB] text-gray-700 hover:bg-gray-200'
              : 'bg-black border-black text-white hover:bg-gray-800'
          }`}
          title="Toggle Navigation Sidebar"
        >
          <Layers className="w-4 h-4" />
        </button>

        {/* DEPT Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center">
            <DeptLogo className="h-5 w-auto text-black" />
          </div>

          <div className="h-4 w-px bg-gray-300 mx-1" />

          {/* Active Studio Pill (Screenshot Studio style) */}
          <div className="bg-[#F3F4F6] text-gray-900 font-semibold px-3 py-1 rounded-full text-xs flex items-center gap-1.5 border border-gray-200/60 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#EA580C] shrink-0" />
            <span className="font-semibold text-xs tracking-tight">CRO Studio</span>
          </div>
        </div>

        {/* Client Selector Dropdown */}
        <div className="relative">
          <button
            id="client-picker-dropdown"
            onClick={() => {
              setClientDropdownOpen(!clientDropdownOpen);
              setExpDropdownOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F9FAFB] hover:bg-gray-100 border border-[#E5E7EB] text-xs font-semibold text-gray-800 transition-colors"
          >
            <Building2 className="w-3.5 h-3.5 text-gray-500" />
            <span className="max-w-[130px] truncate">
              {currentClient?.name || 'Select Client'}
            </span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {clientDropdownOpen && (
            <div className="absolute top-full mt-1.5 left-0 w-64 bg-white rounded-xl shadow-xl border border-[#E5E7EB] p-2 z-50">
              <div className="px-2 py-1 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                Active Clients
              </div>
              <div className="space-y-1 my-1 max-h-56 overflow-y-auto">
                {clients.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedClientId(c.id);
                      setClientDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      c.id === selectedClientId
                        ? 'bg-gray-100 text-black font-semibold border border-gray-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: c.brandColor || '#111827' }}
                      />
                      <span className="truncate">{c.name}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 uppercase font-medium">{c.industry}</span>
                  </button>
                ))}
              </div>
              <div className="border-t border-[#E5E7EB] pt-1.5 mt-1">
                <button
                  id="add-new-client-btn"
                  onClick={() => {
                    setClientDropdownOpen(false);
                    onOpenClientModal();
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-gray-900 hover:bg-gray-100 font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ New Client</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Experiment Selector Dropdown */}
        <div className="relative">
          <button
            id="exp-picker-dropdown"
            onClick={() => {
              setExpDropdownOpen(!expDropdownOpen);
              setClientDropdownOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F9FAFB] hover:bg-gray-100 border border-[#E5E7EB] text-xs font-semibold text-gray-800 transition-colors"
          >
            <FlaskConical className="w-3.5 h-3.5 text-gray-500" />
            <span className="max-w-[160px] truncate">
              {currentExperiment?.name || 'Select Experiment'}
            </span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {expDropdownOpen && (
            <div className="absolute top-full mt-1.5 left-0 w-80 bg-white rounded-xl shadow-xl border border-[#E5E7EB] p-2 z-50">
              <div className="px-2 py-1 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider flex items-center justify-between">
                <span>Client Experiments</span>
                <span className="text-gray-400 font-normal">{clientExperiments.length} found</span>
              </div>
              <div className="space-y-1 my-1 max-h-64 overflow-y-auto">
                {clientExperiments.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => {
                      setSelectedExperimentId(e.id);
                      setExpDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      e.id === selectedExperimentId
                        ? 'bg-gray-100 text-black font-semibold border border-gray-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="font-semibold truncate">{e.name}</div>
                      <div className="text-[10px] text-gray-400 truncate">{e.primaryMetric}</div>
                    </div>
                    {getStatusBadge(e.status)}
                  </button>
                ))}
              </div>
              <div className="border-t border-[#E5E7EB] pt-1.5 mt-1">
                <button
                  id="add-new-experiment-btn"
                  onClick={() => {
                    setExpDropdownOpen(false);
                    onOpenExperimentModal();
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-gray-900 hover:bg-gray-100 font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ New Experiment</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center section: Viewport devices & Layout modes */}
      <div className="hidden lg:flex items-center gap-1.5 bg-[#F3F4F6] p-1 rounded-xl border border-[#E5E7EB]">
        {/* Devices */}
        <div className="flex items-center gap-1 pr-1.5 border-r border-[#E5E7EB]">
          <button
            id="device-desktop-btn"
            onClick={() => setDevice('desktop')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              device === 'desktop' ? 'bg-white text-black shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
            title="Desktop Viewport (1920x1080)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="text-[11px]">Desktop</span>
          </button>
          <button
            id="device-tablet-btn"
            onClick={() => setDevice('tablet')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              device === 'tablet' ? 'bg-white text-black shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
            title="Tablet Viewport (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="text-[11px]">Tablet</span>
          </button>
          <button
            id="device-mobile-btn"
            onClick={() => setDevice('mobile')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              device === 'mobile' ? 'bg-white text-black shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
            title="Mobile Viewport (393px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="text-[11px]">Mobile (393px)</span>
          </button>
        </div>

        {/* View Layout Modes */}
        <div className="flex items-center gap-1 pl-1">
          <button
            id="layout-single-btn"
            onClick={() => setViewMode('single')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
              viewMode === 'single' ? 'bg-white text-black shadow-xs' : 'text-gray-500 hover:text-gray-800'
            }`}
            title="Single Preview"
          >
            <Square className="w-3 h-3" />
            <span className="text-[11px]">Single</span>
          </button>
          <button
            id="layout-split-btn"
            onClick={() => setViewMode('split_side_by_side')}
            className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
              viewMode === 'split_side_by_side' ? 'bg-white text-black shadow-xs' : 'text-gray-500 hover:text-gray-800'
            }`}
            title="Side-by-Side (Control vs Active Variant)"
          >
            <Columns2 className="w-3 h-3" />
            <span className="text-[11px]">Split A/B</span>
          </button>
        </div>
      </div>

      {/* Right section: API Status pill, Inspector, Snippets, AI, Export */}
      <div className="flex items-center gap-2">
        {/* Status Pill (matching Screenshot Studio right-header) */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-gray-100 border border-gray-200/80 rounded-full text-xs text-gray-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span className="font-mono text-[11px] text-gray-800">CRO: READY</span>
          <span className="text-[10px] text-gray-400">Engine</span>
        </div>

        {/* Element Inspector Toggle */}
        <button
          id="toggle-inspector-btn"
          onClick={() => setIsInspectorActive((prev) => !prev)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            isInspectorActive
              ? 'bg-amber-50 text-amber-900 border border-amber-300 ring-2 ring-amber-400'
              : 'bg-white hover:bg-gray-50 text-gray-700 border border-[#E5E7EB]'
          }`}
          title="Click to activate Element Inspector on preview webpage"
        >
          <Crosshair className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isInspectorActive ? 'Inspecting' : 'Inspector'}</span>
        </button>

        {/* Snippet Library Button */}
        <button
          id="header-snippet-library-btn"
          onClick={onOpenSnippetLibrary}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-gray-50 text-gray-700 border border-[#E5E7EB] transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5 text-gray-600" />
          <span className="hidden sm:inline">Snippets</span>
          <span className="px-1.5 py-0.2 rounded-full bg-gray-100 text-[10px] font-bold text-gray-700">
            {snippets.length}
          </span>
        </button>

        {/* Gemini CRO AI Assistant */}
        <button
          id="header-gemini-ai-btn"
          onClick={onOpenAiAssistant}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#F3F4F6] hover:bg-gray-200 text-gray-900 border border-gray-200 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#EA580C]" />
          <span className="hidden sm:inline">AI Copilot</span>
        </button>

        {/* Export Production Code */}
        <button
          id="header-export-code-btn"
          onClick={onOpenExportModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-black hover:bg-gray-800 text-white shadow-xs transition-colors"
          title="Export variant code for Optimizely, VWO, GTM, AB Tasty"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>

        {/* Refresh / Live Reload */}
        <button
          id="header-refresh-btn"
          onClick={triggerLiveReload}
          className={`p-1.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors ${
            isLiveReloading ? 'animate-spin text-black' : ''
          }`}
          title="Re-run and reload variant injection"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

