import React, { useState } from 'react';
import {
  Building2,
  FlaskConical,
  Plus,
  Search,
  MoreVertical,
  Copy,
  Trash2,
  Edit2,
  Target,
  FileCode2,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Tag,
  BookOpen,
} from 'lucide-react';
import { useCro } from '../context/CroContext';
import { ExperimentStatus } from '../types';

interface SidebarProps {
  onOpenClientModal: () => void;
  onOpenExperimentModal: () => void;
  onOpenSnippetLibrary: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenClientModal,
  onOpenExperimentModal,
  onOpenSnippetLibrary,
}) => {
  const {
    clients,
    experiments,
    selectedClientId,
    selectedExperimentId,
    currentClient,
    currentExperiment,
    setSelectedClientId,
    setSelectedExperimentId,
    duplicateExperiment,
    deleteExperiment,
    updateExperiment,
  } = useCro();

  const [activeNavTab, setActiveNavTab] = useState<'experiments' | 'details'>('experiments');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  const clientExperiments = (experiments || []).filter((e) => {
    if (!e) return false;
    const matchClient = e.clientId === selectedClientId;
    const matchSearch =
      (e.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.hypothesis || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.primaryMetric || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchClient && matchSearch && matchStatus;
  });

  const getStatusColor = (status: ExperimentStatus) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'ready_for_prod':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'concluded':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'archived':
        return 'bg-gray-100 text-gray-500 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <aside className="w-72 bg-white border-r border-[#E5E7EB] flex flex-col shrink-0 text-[#1F2937] select-none h-full overflow-hidden">
      {/* Client Header Card */}
      <div className="p-4 border-b border-[#E5E7EB] bg-white">
        <div className="flex items-center justify-between mb-1.5">
          <div>
            <label className="text-[10px] font-bold text-[#9CA3AF] uppercase block tracking-wider">
              Active Client
            </label>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: currentClient?.brandColor || '#2563eb' }}
              />
              <h2 className="font-bold text-sm text-gray-900 truncate">{currentClient?.name}</h2>
            </div>
          </div>
          <button
            id="sidebar-edit-client-btn"
            onClick={onOpenClientModal}
            className="p-1.5 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 text-xs transition-colors"
            title="Edit Client Settings"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
          {currentClient?.notes || 'No client notes added yet.'}
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-[#E5E7EB] bg-[#F9FAFB] px-3 pt-1.5">
        <button
          id="sidebar-tab-experiments"
          onClick={() => setActiveNavTab('experiments')}
          className={`flex-1 pb-2 text-xs font-semibold border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
            activeNavTab === 'experiments'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5" />
          <span>Tests ({clientExperiments.length})</span>
        </button>
        <button
          id="sidebar-tab-details"
          onClick={() => setActiveNavTab('details')}
          className={`flex-1 pb-2 text-xs font-semibold border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
            activeNavTab === 'details'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Hypothesis</span>
        </button>
      </div>

      {/* Main Tab Content */}
      {activeNavTab === 'experiments' ? (
        <div className="flex-1 flex flex-col min-h-0 bg-white">
          {/* Search and Action Row */}
          <div className="p-3 border-b border-[#E5E7EB] space-y-2 bg-white">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
              <input
                id="search-experiments-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tests, metrics..."
                className="w-full pl-8 pr-3 py-1.5 bg-[#F3F4F6] border border-transparent rounded-md text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex items-center justify-between gap-1.5">
              <select
                id="filter-status-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#F3F4F6] border border-transparent hover:border-gray-300 rounded-md text-[11px] px-2 py-1 text-gray-700 focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="ready_for_prod">Ready for Prod</option>
                <option value="concluded">Concluded</option>
              </select>

              <button
                id="sidebar-new-experiment-btn"
                onClick={onOpenExperimentModal}
                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>New Test</span>
              </button>
            </div>
          </div>

          {/* Experiment List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {clientExperiments.length === 0 ? (
              <div className="text-center py-8 px-4 text-gray-400">
                <FlaskConical className="w-8 h-8 mx-auto mb-2 opacity-40 text-gray-400" />
                <p className="text-xs font-medium text-gray-500">No experiments found.</p>
                <button
                  onClick={onOpenExperimentModal}
                  className="mt-2 text-xs text-blue-600 font-semibold hover:underline"
                >
                  + Create your first test
                </button>
              </div>
            ) : (
              clientExperiments.map((exp) => {
                const isSelected = exp.id === selectedExperimentId;
                return (
                  <div
                    key={exp.id}
                    onClick={() => setSelectedExperimentId(exp.id)}
                    className={`group relative p-2.5 rounded-md border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50 border-blue-300 text-blue-900 shadow-xs'
                        : 'bg-white border-[#E5E7EB] hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <h3
                        className={`font-semibold leading-tight line-clamp-1 ${
                          isSelected ? 'text-blue-900' : 'text-gray-800'
                        }`}
                      >
                        {exp.name}
                      </h3>
                      <div className="flex items-center gap-1 shrink-0">
                        <span
                          className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${getStatusColor(
                            exp.status
                          )}`}
                        >
                          {exp.status.replace('_', ' ')}
                        </span>
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenActionMenuId(openActionMenuId === exp.id ? null : exp.id);
                            }}
                            className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="w-3 h-3" />
                          </button>

                          {openActionMenuId === exp.id && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-0 top-full mt-1 w-36 bg-white rounded-md shadow-lg border border-[#E5E7EB] p-1 z-50 text-[11px]"
                            >
                              <button
                                onClick={() => {
                                  duplicateExperiment(exp.id);
                                  setOpenActionMenuId(null);
                                }}
                                className="w-full text-left px-2 py-1.5 rounded hover:bg-gray-50 text-gray-700 flex items-center gap-1.5"
                              >
                                <Copy className="w-3 h-3 text-blue-600" />
                                <span>Duplicate</span>
                              </button>
                              <button
                                onClick={() => {
                                  deleteExperiment(exp.id);
                                  setOpenActionMenuId(null);
                                }}
                                className="w-full text-left px-2 py-1.5 rounded hover:bg-rose-50 text-rose-600 flex items-center gap-1.5"
                              >
                                <Trash2 className="w-3 h-3 text-rose-500" />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-500 mt-1">
                      <span className="truncate pr-1 font-medium">
                        🎯 {exp.primaryMetric}
                      </span>
                      <span className="shrink-0 text-[10px] text-gray-500 font-semibold">
                        {exp.variants?.length || 0} Var
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* Hypothesis & Goals Editor */
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-white">
          {currentExperiment ? (
            <>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-1">
                  Test Hypothesis (If... Then... Because...)
                </label>
                <textarea
                  value={currentExperiment.hypothesis}
                  onChange={(e) =>
                    updateExperiment(currentExperiment.id, { hypothesis: e.target.value })
                  }
                  rows={4}
                  className="w-full p-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-gray-800 text-xs focus:outline-none focus:bg-white focus:border-blue-500 leading-relaxed resize-none font-sans"
                  placeholder="Formulate your structured hypothesis..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-1">
                  Primary Success Metric
                </label>
                <input
                  type="text"
                  value={currentExperiment.primaryMetric}
                  onChange={(e) =>
                    updateExperiment(currentExperiment.id, { primaryMetric: e.target.value })
                  }
                  className="w-full p-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-gray-800 text-xs focus:outline-none focus:bg-white focus:border-blue-500"
                  placeholder="e.g. Add-to-Cart clicks (+15%)"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-1">
                  Lifecycle Status
                </label>
                <select
                  value={currentExperiment.status}
                  onChange={(e) =>
                    updateExperiment(currentExperiment.id, {
                      status: e.target.value as ExperimentStatus,
                    })
                  }
                  className="w-full p-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-gray-800 text-xs focus:outline-none focus:bg-white focus:border-blue-500 font-medium"
                >
                  <option value="draft">Draft Formulation</option>
                  <option value="active">Live Running</option>
                  <option value="ready_for_prod">Ready for Production Deployment</option>
                  <option value="concluded">Concluded & Validated</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-1">
                  Analyst Strategy Notes
                </label>
                <textarea
                  value={currentExperiment.notes || ''}
                  onChange={(e) =>
                    updateExperiment(currentExperiment.id, { notes: e.target.value })
                  }
                  rows={3}
                  className="w-full p-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-gray-800 text-xs focus:outline-none focus:bg-white focus:border-blue-500 resize-none"
                  placeholder="Audience segment, device targeting notes, GA4 goal IDs..."
                />
              </div>

              <div className="pt-2 border-t border-[#E5E7EB] text-[10px] text-gray-400 flex justify-between">
                <span>Created: {currentExperiment.createdAt}</span>
                <span>Updated: {currentExperiment.updatedAt}</span>
              </div>
            </>
          ) : (
            <p className="text-gray-400 text-center py-6">Select an experiment to view hypothesis.</p>
          )}
        </div>
      )}

      {/* Footer Quick Action: Snippet catalog trigger */}
      <div className="p-3 border-t border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-between">
        <button
          id="sidebar-snippet-catalog-btn"
          onClick={onOpenSnippetLibrary}
          className="w-full py-2 px-3 rounded-md bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center justify-center gap-2 border border-[#E5E7EB] shadow-xs transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span>Browse Snippet Library</span>
        </button>
      </div>
    </aside>
  );
};
