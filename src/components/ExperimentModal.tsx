import React, { useState, useEffect } from 'react';
import { X, FlaskConical, Plus } from 'lucide-react';
import { useCro } from '../context/CroContext';
import { ExperimentStatus } from '../types';
import { DEMO_PAGES } from '../data/demoPages';

interface ExperimentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExperimentModal: React.FC<ExperimentModalProps> = ({ isOpen, onClose }) => {
  const { selectedClientId, currentClient, addExperiment, setSelectedExperimentId } = useCro();

  const [name, setName] = useState('');
  const [targetUrl, setTargetUrl] = useState('demo://ecommerce-pdp');
  const [primaryMetric, setPrimaryMetric] = useState('Add to Cart Clicks (+15%)');
  const [hypothesis, setHypothesis] = useState(
    'If we add social proof badges and a stock counter directly above the CTA, then shoppers will feel greater urgency and trust, resulting in higher checkout progression.'
  );
  const [status, setStatus] = useState<ExperimentStatus>('draft');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !selectedClientId) return;

    const newExpId = addExperiment({
      clientId: selectedClientId,
      name: name.trim(),
      targetUrl: targetUrl.trim(),
      primaryMetric: primaryMetric.trim(),
      hypothesis: hypothesis.trim(),
      status,
      notes: notes.trim(),
    });

    if (newExpId) {
      setSelectedExperimentId(newExpId);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#E5E7EB] rounded-lg w-full max-w-xl shadow-xl overflow-hidden text-[#1F2937] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="h-14 bg-white border-b border-[#E5E7EB] px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center">
              <FlaskConical className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-gray-900">Create CRO Experiment</h2>
              <p className="text-[11px] text-gray-500">
                For Client: <span className="text-blue-600 font-semibold">{currentClient?.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-1">
              Experiment Title *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. PDP Urgency Timer & Sticky Buy Box"
              className="w-full p-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-xs text-gray-800 focus:outline-none focus:bg-white focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-1">
              Target Test URL (Demo or Live Site)
            </label>
            <div className="space-y-1.5">
              <input
                type="text"
                required
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://example.com/products/item or demo://ecommerce-pdp"
                className="w-full p-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-xs font-mono text-gray-800 focus:outline-none focus:bg-white focus:border-blue-500"
              />
              <div className="flex gap-1.5 overflow-x-auto text-[10px]">
                <span className="text-gray-400 py-0.5">Presets:</span>
                {DEMO_PAGES.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setTargetUrl(d.urlKey)}
                    className="px-2 py-0.5 rounded bg-[#F3F4F6] hover:bg-gray-200 text-blue-600 border border-[#E5E7EB] whitespace-nowrap text-[10px] font-medium transition-colors"
                  >
                    {d.name.split('(')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-1">
                Primary Success Metric
              </label>
              <input
                type="text"
                required
                value={primaryMetric}
                onChange={(e) => setPrimaryMetric(e.target.value)}
                placeholder="e.g. Add-to-Cart CTR (+15%)"
                className="w-full p-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-xs text-gray-800 focus:outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ExperimentStatus)}
                className="w-full p-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-xs text-gray-800 focus:outline-none focus:bg-white focus:border-blue-500 font-medium"
              >
                <option value="draft">Draft Formulation</option>
                <option value="active">Live Running</option>
                <option value="ready_for_prod">Ready for Production</option>
                <option value="concluded">Concluded</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-1">
              Test Hypothesis (If... Then... Because...)
            </label>
            <textarea
              rows={3}
              value={hypothesis}
              onChange={(e) => setHypothesis(e.target.value)}
              placeholder="Structured hypothesis explaining rationale and intended behavior..."
              className="w-full p-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-xs text-gray-800 focus:outline-none focus:bg-white focus:border-blue-500 resize-none leading-relaxed font-sans"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-1">
              Target Audience / Device Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Targeting desktop/mobile, new vs returning visitors, sample size notes..."
              className="w-full p-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-xs text-gray-800 focus:outline-none focus:bg-white focus:border-blue-500 resize-none font-sans"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#F3F4F6] hover:bg-gray-200 text-gray-700 rounded-md text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
            >
              Create Experiment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
