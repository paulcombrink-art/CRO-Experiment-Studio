import React, { useState } from 'react';
import { CroProvider, useCro } from './context/CroContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CodeEditorPanel } from './components/CodeEditorPanel';
import { PreviewStage } from './components/PreviewStage';
import { SnippetLibraryModal } from './components/SnippetLibraryModal';
import { GeminiAssistantModal } from './components/GeminiAssistantModal';
import { ExportModal } from './components/ExportModal';
import { ClientModal } from './components/ClientModal';
import { ExperimentModal } from './components/ExperimentModal';
import { HtmlCaptureModal } from './components/HtmlCaptureModal';
import { Code, Eye, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

function CroStudioApp() {
  const { isHtmlCaptureModalOpen, setIsHtmlCaptureModalOpen, captureModalInitialUrl } = useCro();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(true);
  const [isSnippetLibraryOpen, setIsSnippetLibraryOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isExperimentModalOpen, setIsExperimentModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#F8F9FA] text-[#1F2937] overflow-hidden font-sans select-none">
      {/* Top Header Navigation */}
      <Header
        onOpenSnippetLibrary={() => setIsSnippetLibraryOpen(true)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenClientModal={() => setIsClientModalOpen(true)}
        onOpenExperimentModal={() => setIsExperimentModalOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Main Studio Workspace */}
      <div className="flex-1 flex min-h-0 relative overflow-hidden bg-[#F8F9FA]">
        {/* Navigation Sidebar (Clients, Experiments, Hypothesis) */}
        {isSidebarOpen && (
          <Sidebar
            onOpenClientModal={() => setIsClientModalOpen(true)}
            onOpenExperimentModal={() => setIsExperimentModalOpen(true)}
            onOpenSnippetLibrary={() => setIsSnippetLibraryOpen(true)}
          />
        )}

        {/* Studio Center Stage */}
        <div className="flex-1 flex min-h-0 overflow-hidden bg-[#F8F9FA]">
          {/* Left / Code Injection Editor */}
          {isCodeEditorOpen && (
            <div className="w-full md:w-1/2 lg:w-[45%] h-full flex flex-col shrink-0 border-r border-[#E5E7EB] relative bg-white">
              <CodeEditorPanel
                onOpenSnippetLibrary={() => setIsSnippetLibraryOpen(true)}
                onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
              />
            </div>
          )}

          {/* Toggle Code Editor Divider Handle */}
          <div className="hidden md:flex items-center justify-center bg-gray-100 border-r border-[#E5E7EB] z-10">
            <button
              onClick={() => setIsCodeEditorOpen(!isCodeEditorOpen)}
              className="p-1 hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors"
              title={isCodeEditorOpen ? 'Collapse Code Editor' : 'Expand Code Editor'}
            >
              {isCodeEditorOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Right / Live Preview Stage */}
          <div className="flex-1 h-full min-w-0 bg-[#F8F9FA]">
            <PreviewStage />
          </div>
        </div>
      </div>

      {/* Floating Assistant Trigger (on mobile/compact screens) */}
      <button
        onClick={() => setIsAiAssistantOpen(true)}
        className="fixed bottom-4 right-4 z-40 px-3.5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 flex items-center gap-2 font-bold text-xs transition-all hover:scale-105 border border-blue-500"
        title="Open Gemini CRO Assistant"
      >
        <Sparkles className="w-4 h-4 text-amber-300" />
        <span className="hidden sm:inline">AI CRO Assistant</span>
      </button>

      {/* Modals */}
      <SnippetLibraryModal
        isOpen={isSnippetLibraryOpen}
        onClose={() => setIsSnippetLibraryOpen(false)}
      />

      <GeminiAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      <ClientModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
      />

      <ExperimentModal
        isOpen={isExperimentModalOpen}
        onClose={() => setIsExperimentModalOpen(false)}
      />

      <HtmlCaptureModal
        isOpen={isHtmlCaptureModalOpen}
        onClose={() => setIsHtmlCaptureModalOpen(false)}
        initialUrl={captureModalInitialUrl}
      />
    </div>
  );
}

export function App() {
  return (
    <CroProvider>
      <CroStudioApp />
    </CroProvider>
  );
}

export default App;
