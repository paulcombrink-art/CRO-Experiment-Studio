import React, { useState, useEffect } from 'react';
import { X, Building2, Trash2, Plus, Check } from 'lucide-react';
import { useCro } from '../context/CroContext';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClientModal: React.FC<ClientModalProps> = ({ isOpen, onClose }) => {
  const { clients, selectedClientId, currentClient, addClient, updateClient, deleteClient, setSelectedClientId } =
    useCro();

  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [name, setName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [industry, setIndustry] = useState('E-commerce');
  const [brandColor, setBrandColor] = useState('#3b82f6');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen && currentClient && isEditingExisting) {
      setName(currentClient.name);
      setWebsiteUrl(currentClient.websiteUrl || '');
      setIndustry(currentClient.industry || 'E-commerce');
      setBrandColor(currentClient.brandColor || '#3b82f6');
      setNotes(currentClient.notes || '');
    } else if (isOpen && !isEditingExisting) {
      setName('');
      setWebsiteUrl('https://');
      setIndustry('E-commerce');
      setBrandColor('#3b82f6');
      setNotes('');
    }
  }, [isOpen, currentClient, isEditingExisting]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isEditingExisting && currentClient) {
      updateClient(currentClient.id, {
        name: name.trim(),
        websiteUrl: websiteUrl.trim(),
        industry,
        brandColor,
        notes: notes.trim(),
      });
    } else {
      const newClientId = addClient({
        name: name.trim(),
        websiteUrl: websiteUrl.trim(),
        industry,
        brandColor,
        notes: notes.trim(),
      });
      setSelectedClientId(newClientId);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#E5E7EB] rounded-lg w-full max-w-lg shadow-xl overflow-hidden text-[#1F2937] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="h-14 bg-white border-b border-[#E5E7EB] px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-gray-900">
                {isEditingExisting ? 'Edit Client Profile' : 'Create New Client'}
              </h2>
              <p className="text-[11px] text-gray-500">Manage client workspace and experiments.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-[#E5E7EB] bg-[#F9FAFB] px-6 pt-2">
          <button
            type="button"
            onClick={() => setIsEditingExisting(false)}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              !isEditingExisting
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            + New Client
          </button>
          <button
            type="button"
            onClick={() => setIsEditingExisting(true)}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              isEditingExisting
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Edit Current ({currentClient?.name})
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-1">
              Client / Brand Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Acme Athletic Wear"
              className="w-full p-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-xs text-gray-800 focus:outline-none focus:bg-white focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-1">
                Industry
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full p-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-xs text-gray-800 focus:outline-none focus:bg-white focus:border-blue-500 font-medium"
              >
                <option value="E-commerce">E-commerce / Retail</option>
                <option value="SaaS">SaaS / B2B Software</option>
                <option value="Lead Generation">Lead Generation</option>
                <option value="FinTech">FinTech / Banking</option>
                <option value="Media">Media / Publishing</option>
                <option value="Travel">Travel & Hospitality</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-1">
                Brand Accent Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="w-10 h-9 p-0.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="flex-1 p-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-xs font-mono text-gray-800 uppercase focus:outline-none focus:bg-white focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-1">
              Production Website URL
            </label>
            <input
              type="text"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full p-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-xs text-gray-800 focus:outline-none focus:bg-white focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-1">
              CRO Program Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Target ICP, key audience segments, average baseline conversion rates..."
              className="w-full p-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-xs text-gray-800 focus:outline-none focus:bg-white focus:border-blue-500 resize-none font-sans"
            />
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
            {isEditingExisting && clients.length > 1 && currentClient ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Delete client "${currentClient.name}" and all its experiments?`)) {
                    deleteClient(currentClient.id);
                    onClose();
                  }
                }}
                className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Client</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
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
                {isEditingExisting ? 'Save Changes' : 'Create Client'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
