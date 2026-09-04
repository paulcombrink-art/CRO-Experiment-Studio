import React, { useState } from 'react';
import {
  X,
  Search,
  BookOpen,
  Plus,
  Copy,
  Check,
  Wand2,
  Trash2,
  Edit2,
  Tag,
  Code2,
  Flame,
  ShieldCheck,
  Zap,
  Pin,
  MousePointerClick,
  FormInput,
  LayoutTemplate,
  Sparkles,
} from 'lucide-react';
import { useCro } from '../context/CroContext';
import { Snippet, SnippetCategory } from '../types';
import { CATEGORY_LABELS } from '../data/snippets';

interface SnippetLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SnippetLibraryModal: React.FC<SnippetLibraryModalProps> = ({ isOpen, onClose }) => {
  const { snippets, addSnippet, deleteSnippet, insertSnippetIntoActiveVariant, currentVariant } = useCro();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SnippetCategory>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [insertedId, setInsertedId] = useState<string | null>(null);

  // New snippet modal state
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<SnippetCategory>('urgency');
  const [newTags, setNewTags] = useState('');
  const [newCss, setNewCss] = useState('');
  const [newJs, setNewJs] = useState('');
  const [newHtml, setNewHtml] = useState('');
  const [newSelectorHint, setNewSelectorHint] = useState('');

  if (!isOpen) return null;

  const filteredSnippets = snippets.filter((s) => {
    const matchCategory = selectedCategory === 'all' || s.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchSearch =
      query === '' ||
      s.title.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query) ||
      s.tags.some((t) => t.toLowerCase().includes(query)) ||
      s.cssCode.toLowerCase().includes(query) ||
      s.jsCode.toLowerCase().includes(query) ||
      s.htmlCode.toLowerCase().includes(query);

    return matchCategory && matchSearch;
  });

  const handleCopySnippet = (snippet: Snippet) => {
    const combined = `/* --- CSS --- */\n${snippet.cssCode}\n\n<!-- --- HTML --- -->\n${snippet.htmlCode}\n\n// --- JAVASCRIPT ---\n${snippet.jsCode}`;
    navigator.clipboard.writeText(combined);
    setCopiedId(snippet.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleInsertSnippet = (snippet: Snippet) => {
    insertSnippetIntoActiveVariant(snippet);
    setInsertedId(snippet.id);
    setTimeout(() => setInsertedId(null), 2000);
  };

  const handleSaveNewSnippet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addSnippet({
      title: newTitle.trim(),
      description: newDesc.trim() || 'Custom CRO Snippet.',
      category: newCategory,
      tags: newTags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
      cssCode: newCss,
      jsCode: newJs,
      htmlCode: newHtml,
      targetSelectorHint: newSelectorHint.trim() || undefined,
    });

    setIsCreatingNew(false);
    // Reset form
    setNewTitle('');
    setNewDesc('');
    setNewTags('');
    setNewCss('');
    setNewJs('');
    setNewHtml('');
    setNewSelectorHint('');
  };

  const getCategoryIcon = (cat: SnippetCategory) => {
    switch (cat) {
      case 'urgency':
        return <Flame className="w-3.5 h-3.5 text-rose-400" />;
      case 'social_proof':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
      case 'friction_reduction':
        return <Zap className="w-3.5 h-3.5 text-amber-400" />;
      case 'sticky_elements':
        return <Pin className="w-3.5 h-3.5 text-indigo-400" />;
      case 'cta_value_prop':
        return <MousePointerClick className="w-3.5 h-3.5 text-blue-400" />;
      case 'form_opt':
        return <FormInput className="w-3.5 h-3.5 text-cyan-400" />;
      case 'layout':
        return <LayoutTemplate className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Code2 className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#E5E7EB] rounded-lg w-full max-w-5xl h-[85vh] flex flex-col shadow-xl overflow-hidden text-[#1F2937] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="h-14 bg-white border-b border-[#E5E7EB] px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-gray-900">CRO Snippet & Template Library</h2>
              <p className="text-[11px] text-gray-500">
                Reusable high-converting modules, sticky CTAs, urgency meters, and trust badges.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="new-snippet-toggle-btn"
              onClick={() => setIsCreatingNew(!isCreatingNew)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isCreatingNew ? 'Browse Library' : '+ New Snippet'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {isCreatingNew ? (
          /* Form to Add New Snippet */
          <form onSubmit={handleSaveNewSnippet} className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-1">
                  Snippet Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Sticky Review Badge Pill"
                  className="w-full p-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-xs text-gray-800 focus:outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as SnippetCategory)}
                  className="w-full p-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-xs text-gray-800 focus:outline-none focus:bg-white focus:border-blue-500 font-medium"
                >
                  <option value="urgency">Urgency & Scarcity</option>
                  <option value="social_proof">Social Proof & Trust</option>
                  <option value="friction_reduction">Friction Reduction</option>
                  <option value="sticky_elements">Sticky CTAs & Bars</option>
                  <option value="cta_value_prop">CTA & Value Props</option>
                  <option value="form_opt">Form Optimization</option>
                  <option value="layout">Layout & Navigation</option>
                  <option value="custom">Custom Module</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-1">
                Description & When to Use
              </label>
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                rows={2}
                placeholder="Explain the conversion hypothesis and psychological trigger..."
                className="w-full p-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-xs text-gray-800 focus:outline-none focus:bg-white focus:border-blue-500 resize-none font-sans"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="pdp, checkout, timer, aov, urgency"
                  className="w-full p-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-xs text-gray-800 focus:outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-1">
                  Target Selector Hint
                </label>
                <input
                  type="text"
                  value={newSelectorHint}
                  onChange={(e) => setNewSelectorHint(e.target.value)}
                  placeholder="e.g. .add-to-cart-btn, #buy-box"
                  className="w-full p-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-xs text-gray-800 font-mono focus:outline-none focus:bg-white focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-1">
                  Custom CSS Code
                </label>
                <textarea
                  value={newCss}
                  onChange={(e) => setNewCss(e.target.value)}
                  rows={4}
                  placeholder="/* CSS rules */"
                  className="w-full p-3 bg-[#1E1E1E] border border-gray-800 rounded-md font-mono text-[11px] text-gray-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-1">
                  Custom HTML Markup
                </label>
                <textarea
                  value={newHtml}
                  onChange={(e) => setNewHtml(e.target.value)}
                  rows={4}
                  placeholder="<!-- HTML elements -->"
                  className="w-full p-3 bg-[#1E1E1E] border border-gray-800 rounded-md font-mono text-[11px] text-emerald-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-1">
                  Custom JavaScript / DOM script
                </label>
                <textarea
                  value={newJs}
                  onChange={(e) => setNewJs(e.target.value)}
                  rows={4}
                  placeholder="// JavaScript logic"
                  className="w-full p-3 bg-[#1E1E1E] border border-gray-800 rounded-md font-mono text-[11px] text-green-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-[#E5E7EB]">
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="px-4 py-2 bg-[#F3F4F6] hover:bg-gray-200 text-gray-700 rounded-md text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
              >
                Save Snippet to Library
              </button>
            </div>
          </form>
        ) : (
          /* Catalog View */
          <div className="flex-1 flex flex-col min-h-0 bg-white">
            {/* Search & Filter Bar */}
            <div className="p-4 border-b border-[#E5E7EB] bg-[#F9FAFB] space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                <input
                  id="snippet-library-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 15+ CRO templates by title, description, code, or tags (e.g. 'countdown', 'sticky', 'cart')..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-md text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 shadow-xs transition-all"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {(Object.keys(CATEGORY_LABELS) as SnippetCategory[]).map((catKey) => {
                  const isSelected = selectedCategory === catKey;
                  const info = CATEGORY_LABELS[catKey];
                  return (
                    <button
                      key={catKey}
                      onClick={() => setSelectedCategory(catKey)}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white hover:bg-gray-100 text-gray-700 border border-[#E5E7EB]'
                      }`}
                    >
                      {getCategoryIcon(catKey)}
                      <span>{info.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Snippet Grid */}
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white">
              {filteredSnippets.length === 0 ? (
                <div className="col-span-2 text-center py-16 text-gray-400">
                  <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30 text-gray-400" />
                  <p className="text-sm font-semibold text-gray-700">No matching snippets found.</p>
                  <p className="text-xs text-gray-500 mt-1">Try adjusting your search or category filter.</p>
                </div>
              ) : (
                filteredSnippets.map((snip) => (
                  <div
                    key={snip.id}
                    className="bg-white border border-[#E5E7EB] hover:border-gray-300 rounded-lg p-4 flex flex-col justify-between transition-all hover:shadow-xs group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 rounded-md bg-[#F3F4F6] border border-[#E5E7EB]">
                            {getCategoryIcon(snip.category)}
                          </span>
                          <h3 className="font-semibold text-sm text-gray-900">{snip.title}</h3>
                        </div>

                        {!snip.isDefault && (
                          <button
                            onClick={() => deleteSnippet(snip.id)}
                            className="p-1 text-gray-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete snippet"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3 font-sans">
                        {snip.description}
                      </p>

                      {/* Code Pill Badges */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {snip.cssCode && (
                          <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-mono font-semibold">
                            CSS ({snip.cssCode.split('\n').length}L)
                          </span>
                        )}
                        {snip.htmlCode && (
                          <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-mono font-semibold">
                            HTML ({snip.htmlCode.split('\n').length}L)
                          </span>
                        )}
                        {snip.jsCode && (
                          <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-mono font-semibold">
                            JS DOM ({snip.jsCode.split('\n').length}L)
                          </span>
                        )}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {snip.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded bg-gray-100 text-[10px] text-gray-600 font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#E5E7EB]">
                      <button
                        onClick={() => handleCopySnippet(snip)}
                        className="px-3 py-1.5 bg-[#F3F4F6] hover:bg-gray-200 text-gray-700 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#E5E7EB]"
                      >
                        {copiedId === snip.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleInsertSnippet(snip)}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        {insertedId === snip.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-white" />
                            <span>Inserted!</span>
                          </>
                        ) : (
                          <>
                            <Wand2 className="w-3.5 h-3.5" />
                            <span>Insert into {currentVariant?.name ? currentVariant.name.split(':')[0] : 'Variant'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
