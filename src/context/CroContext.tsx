import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Client,
  Experiment,
  Variant,
  Snippet,
  PageSnapshot,
  DeviceViewport,
  ViewLayoutMode,
  ExecutionLog,
  CodeTab,
} from '../types';
import { INITIAL_CLIENTS, INITIAL_EXPERIMENTS } from '../data/initialData';
import { INITIAL_SNIPPETS } from '../data/snippets';
import { INITIAL_SNAPSHOTS } from '../data/sampleSnapshots';

interface CroContextType {
  clients: Client[];
  experiments: Experiment[];
  snippets: Snippet[];
  snapshots: PageSnapshot[];
  selectedClientId: string;
  selectedExperimentId: string;
  activeVariantId: string;
  currentClient?: Client;
  currentExperiment?: Experiment;
  currentVariant?: Variant;
  targetUrl: string;
  device: DeviceViewport;
  viewMode: ViewLayoutMode;
  isInspectorActive: boolean;
  selectedSelector: string | null;
  executionLogs: ExecutionLog[];
  activeCodeTab: CodeTab;
  isLiveReloading: boolean;
  isHtmlCaptureModalOpen: boolean;
  captureModalInitialUrl: string;

  // Actions
  setSelectedClientId: (id: string) => void;
  setSelectedExperimentId: (id: string) => void;
  setActiveVariantId: (id: string) => void;
  setTargetUrl: (url: string) => void;
  setDevice: (device: DeviceViewport) => void;
  setViewMode: (mode: ViewLayoutMode) => void;
  setIsInspectorActive: (active: boolean | ((prev: boolean) => boolean)) => void;
  setSelectedSelector: (selector: string | null) => void;
  setActiveCodeTab: (tab: CodeTab) => void;
  setIsHtmlCaptureModalOpen: (open: boolean) => void;
  openHtmlCaptureWithUrl: (url?: string) => void;
  
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => string;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  addExperiment: (experiment: Omit<Experiment, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateExperiment: (id: string, data: Partial<Experiment>) => void;
  deleteExperiment: (id: string) => void;
  duplicateExperiment: (id: string) => void;

  addVariant: (experimentId: string, variant: Omit<Variant, 'id'>) => string;
  updateVariant: (experimentId: string, variantId: string, data: Partial<Variant>) => void;
  deleteVariant: (experimentId: string, variantId: string) => void;

  addSnippet: (snippet: Omit<Snippet, 'id' | 'createdAt'>) => string;
  updateSnippet: (id: string, data: Partial<Snippet>) => void;
  deleteSnippet: (id: string) => void;
  insertSnippetIntoActiveVariant: (snippet: Snippet) => void;

  addSnapshot: (snapshot: Omit<PageSnapshot, 'id' | 'createdAt'>) => string;
  deleteSnapshot: (id: string) => void;
  getSnapshot: (idOrUrl: string) => PageSnapshot | undefined;

  addExecutionLog: (level: 'info' | 'warn' | 'error' | 'success', message: string) => void;
  clearExecutionLogs: () => void;
  triggerLiveReload: () => void;
}

const CroContext = createContext<CroContextType | undefined>(undefined);

const LOCAL_STORAGE_CLIENTS_KEY = 'cro_studio_clients_v1';
const LOCAL_STORAGE_EXPERIMENTS_KEY = 'cro_studio_experiments_v1';
const LOCAL_STORAGE_SNIPPETS_KEY = 'cro_studio_snippets_v1';
const LOCAL_STORAGE_SNAPSHOTS_KEY = 'cro_studio_snapshots_v1';

export const CroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from LocalStorage or initialize with rich seed data
  const [clients, setClients] = useState<Client[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CLIENTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_CLIENTS;
    } catch {
      return INITIAL_CLIENTS;
    }
  });

  const [experiments, setExperiments] = useState<Experiment[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_EXPERIMENTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((exp: any) => ({
            ...exp,
            variants: Array.isArray(exp?.variants) && exp.variants.length > 0 ? exp.variants : [
              {
                id: `var-ctrl-${exp?.id || Date.now()}`,
                name: 'Control (Original)',
                isControl: true,
                description: 'Original baseline page without modifications.',
                cssCode: '/* Control */',
                jsCode: '// Control',
                htmlCode: '',
                placement: 'body_end',
                insertPosition: 'append',
              }
            ],
            activeVariantId: exp?.activeVariantId || exp?.variants?.[0]?.id || '',
          }));
        }
      }
      return INITIAL_EXPERIMENTS;
    } catch {
      return INITIAL_EXPERIMENTS;
    }
  });

  const [snippets, setSnippets] = useState<Snippet[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SNIPPETS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_SNIPPETS;
    } catch {
      return INITIAL_SNIPPETS;
    }
  });

  const [snapshots, setSnapshots] = useState<PageSnapshot[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SNAPSHOTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_SNAPSHOTS;
    } catch {
      return INITIAL_SNAPSHOTS;
    }
  });

  const [selectedClientId, setSelectedClientId] = useState<string>(() => {
    return clients?.[0]?.id || 'client-apex';
  });

  const [selectedExperimentId, setSelectedExperimentId] = useState<string>(() => {
    const clientExps = (experiments || []).filter((e) => e?.clientId === (clients?.[0]?.id || 'client-apex'));
    return clientExps?.[0]?.id || experiments?.[0]?.id || '';
  });

  const currentExperiment = (experiments || []).find((e) => e?.id === selectedExperimentId);
  const currentClient = (clients || []).find((c) => c?.id === selectedClientId);

  const [activeVariantId, setActiveVariantId] = useState<string>(() => {
    return currentExperiment?.activeVariantId || currentExperiment?.variants?.[0]?.id || '';
  });

  const [targetUrl, setTargetUrl] = useState<string>(() => {
    return currentExperiment?.targetUrl || 'demo://ecommerce-pdp';
  });

  const [device, setDevice] = useState<DeviceViewport>('desktop');
  const [viewMode, setViewMode] = useState<ViewLayoutMode>('single');
  const [isInspectorActive, setIsInspectorActive] = useState<boolean>(false);
  const [selectedSelector, setSelectedSelector] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<CodeTab>('css');
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([]);
  const [isLiveReloading, setIsLiveReloading] = useState<boolean>(false);
  const [isHtmlCaptureModalOpen, setIsHtmlCaptureModalOpen] = useState<boolean>(false);
  const [captureModalInitialUrl, setCaptureModalInitialUrl] = useState<string>('');

  const openHtmlCaptureWithUrl = useCallback((url?: string) => {
    setCaptureModalInitialUrl(url || targetUrl || '');
    setIsHtmlCaptureModalOpen(true);
  }, [targetUrl]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CLIENTS_KEY, JSON.stringify(clients));
    } catch (e) {
      console.error('Failed to save clients', e);
    }
  }, [clients]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_EXPERIMENTS_KEY, JSON.stringify(experiments));
    } catch (e) {
      console.error('Failed to save experiments', e);
    }
  }, [experiments]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_SNIPPETS_KEY, JSON.stringify(snippets));
    } catch (e) {
      console.error('Failed to save snippets', e);
    }
  }, [snippets]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_SNAPSHOTS_KEY, JSON.stringify(snapshots));
    } catch (e) {
      console.error('Failed to save snapshots', e);
    }
  }, [snapshots]);

  // When experiment selection changes, sync activeVariantId and targetUrl
  useEffect(() => {
    if (currentExperiment) {
      setActiveVariantId(currentExperiment.activeVariantId || currentExperiment.variants?.[0]?.id || '');
      setTargetUrl(currentExperiment.targetUrl || 'demo://ecommerce-pdp');
    }
  }, [selectedExperimentId, currentExperiment]);

  // When client changes, select first experiment for that client if current doesn't match
  const handleSelectClient = useCallback(
    (clientId: string) => {
      setSelectedClientId(clientId);
      const clientExps = (experiments || []).filter((e) => e?.clientId === clientId);
      if (clientExps.length > 0) {
        setSelectedExperimentId(clientExps[0].id);
        setActiveVariantId(clientExps[0].activeVariantId || clientExps[0].variants?.[0]?.id || '');
        setTargetUrl(clientExps[0].targetUrl || 'demo://ecommerce-pdp');
      }
    },
    [experiments]
  );

  const currentVariant = currentExperiment?.variants?.find((v) => v?.id === activeVariantId) || currentExperiment?.variants?.[0];

  // Logging helpers
  const addExecutionLog = useCallback((level: 'info' | 'warn' | 'error' | 'success', message: string) => {
    const newLog: ExecutionLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      level,
      message,
      timestamp: new Date().toLocaleTimeString(),
    };
    setExecutionLogs((prev) => [newLog, ...prev].slice(0, 50));
  }, []);

  const clearExecutionLogs = useCallback(() => {
    setExecutionLogs([]);
  }, []);

  const triggerLiveReload = useCallback(() => {
    setIsLiveReloading(true);
    setTimeout(() => setIsLiveReloading(false), 400);
  }, []);

  // Client actions
  const addClient = useCallback(
    (clientData: Omit<Client, 'id' | 'createdAt'>) => {
      const newId = `client-${Date.now()}`;
      const newClient: Client = {
        ...clientData,
        id: newId,
        createdAt: new Date().toISOString().split('T')[0],
        experimentCount: 0,
      };
      setClients((prev) => [...prev, newClient]);
      setSelectedClientId(newId);
      addExecutionLog('success', `Created client "${newClient.name}"`);
      return newId;
    },
    [addExecutionLog]
  );

  const updateClient = useCallback((id: string, data: Partial<Client>) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
  }, []);

  const deleteClient = useCallback(
    (id: string) => {
      setClients((prev) => prev.filter((c) => c.id !== id));
      setExperiments((prev) => prev.filter((e) => e.clientId !== id));
      addExecutionLog('info', `Deleted client ${id}`);
    },
    [addExecutionLog]
  );

  // Experiment actions
  const addExperiment = useCallback(
    (expData: Partial<Experiment> & { name: string; clientId?: string }) => {
      const newId = `exp-${Date.now()}`;
      const now = new Date().toISOString().split('T')[0];
      const defaultVariants: Variant[] =
        expData.variants && expData.variants.length > 0
          ? expData.variants
          : [
              {
                id: `var-ctrl-${Date.now()}`,
                name: 'Control (Original)',
                isControl: true,
                description: 'Original baseline without modifications.',
                cssCode: `/* Control: No modifications */`,
                jsCode: `// Control variant\nconsole.log('[CRO] Control Variant Active');`,
                htmlCode: ``,
                placement: 'body_end',
                insertPosition: 'append',
              },
              {
                id: `var-v1-${Date.now()}`,
                name: 'Variant A: Test Challenger',
                isControl: false,
                description: expData.hypothesis || 'Challenger variant testing hypothesis.',
                cssCode: `/* Custom CSS for Variant A */\n`,
                jsCode: `// Custom JS for Variant A\nconsole.log('[CRO] Variant A initialized');\n`,
                htmlCode: `<!-- Custom HTML markup -->\n`,
                placement: 'body_end',
                insertPosition: 'append',
              },
            ];

      const newExp: Experiment = {
        id: newId,
        clientId: expData.clientId || selectedClientId,
        name: expData.name,
        hypothesis: expData.hypothesis || '',
        status: expData.status || 'draft',
        targetUrl: expData.targetUrl || 'demo://ecommerce-pdp',
        primaryMetric: expData.primaryMetric || 'Conversion Rate',
        secondaryMetrics: expData.secondaryMetrics || [],
        activeVariantId: expData.activeVariantId || defaultVariants[1]?.id || defaultVariants[0]?.id || '',
        createdAt: now,
        updatedAt: now,
        tags: expData.tags || ['new-test'],
        notes: expData.notes || '',
        variants: defaultVariants,
      };

      setExperiments((prev) => [...prev, newExp]);
      setSelectedExperimentId(newId);
      setActiveVariantId(newExp.activeVariantId);
      setTargetUrl(newExp.targetUrl);
      addExecutionLog('success', `Created experiment "${newExp.name}"`);
      return newId;
    },
    [selectedClientId, addExecutionLog]
  );

  const updateExperiment = useCallback(
    (id: string, data: Partial<Experiment>) => {
      setExperiments((prev) =>
        prev.map((e) => {
          if (e.id === id) {
            return {
              ...e,
              ...data,
              updatedAt: new Date().toISOString().split('T')[0],
            };
          }
          return e;
        })
      );
    },
    []
  );

  const deleteExperiment = useCallback(
    (id: string) => {
      setExperiments((prev) => {
        const remaining = prev.filter((e) => e?.id !== id);
        if (selectedExperimentId === id && remaining.length > 0) {
          setSelectedExperimentId(remaining[0]?.id || '');
          setActiveVariantId(remaining[0]?.activeVariantId || remaining[0]?.variants?.[0]?.id || '');
        }
        return remaining;
      });
      addExecutionLog('info', `Deleted experiment`);
    },
    [selectedExperimentId, addExecutionLog]
  );

  const duplicateExperiment = useCallback(
    (id: string) => {
      const expToCopy = (experiments || []).find((e) => e?.id === id);
      if (!expToCopy) return;

      const newId = `exp-${Date.now()}`;
      const duplicated: Experiment = {
        ...expToCopy,
        id: newId,
        name: `${expToCopy.name} (Copy)`,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        variants: (expToCopy.variants || []).map((v, idx) => ({
          ...v,
          id: `var-${Date.now()}-${idx}`,
        })),
      };
      duplicated.activeVariantId = duplicated.variants[1]?.id || duplicated.variants[0]?.id || '';

      setExperiments((prev) => [...prev, duplicated]);
      setSelectedExperimentId(newId);
      addExecutionLog('success', `Duplicated experiment "${expToCopy.name}"`);
    },
    [experiments, addExecutionLog]
  );

  // Variant actions
  const addVariant = useCallback(
    (experimentId: string, variantData: Omit<Variant, 'id'>) => {
      const newVarId = `var-${Date.now()}`;
      const newVariant: Variant = {
        ...variantData,
        id: newVarId,
      };

      setExperiments((prev) =>
        prev.map((e) => {
          if (e.id === experimentId) {
            return {
              ...e,
              variants: [...(e.variants || []), newVariant],
              activeVariantId: newVarId,
            };
          }
          return e;
        })
      );

      setActiveVariantId(newVarId);
      addExecutionLog('success', `Added variant "${newVariant.name}"`);
      return newVarId;
    },
    [addExecutionLog]
  );

  const updateVariant = useCallback(
    (experimentId: string, variantId: string, data: Partial<Variant>) => {
      setExperiments((prev) =>
        prev.map((e) => {
          if (e.id === experimentId) {
            const updatedVariants = (e.variants || []).map((v) =>
              v.id === variantId ? { ...v, ...data } : v
            );
            return {
              ...e,
              variants: updatedVariants,
              updatedAt: new Date().toISOString().split('T')[0],
            };
          }
          return e;
        })
      );
    },
    []
  );

  const deleteVariant = useCallback(
    (experimentId: string, variantId: string) => {
      setExperiments((prev) =>
        prev.map((e) => {
          if (e.id === experimentId) {
            const remainingVariants = (e.variants || []).filter((v) => v.id !== variantId);
            const newActive =
              e.activeVariantId === variantId
                ? remainingVariants[0]?.id || ''
                : e.activeVariantId;
            return {
              ...e,
              variants: remainingVariants,
              activeVariantId: newActive,
            };
          }
          return e;
        })
      );
    },
    []
  );

  // Snippet actions
  const addSnippet = useCallback(
    (snippetData: Omit<Snippet, 'id' | 'createdAt'>) => {
      const newId = `snip-${Date.now()}`;
      const newSnippet: Snippet = {
        ...snippetData,
        id: newId,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setSnippets((prev) => [newSnippet, ...prev]);
      addExecutionLog('success', `Saved snippet "${newSnippet.title}" to library`);
      return newId;
    },
    [addExecutionLog]
  );

  const updateSnippet = useCallback((id: string, data: Partial<Snippet>) => {
    setSnippets((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
  }, []);

  const deleteSnippet = useCallback(
    (id: string) => {
      setSnippets((prev) => prev.filter((s) => s.id !== id));
      addExecutionLog('info', `Deleted snippet from library`);
    },
    [addExecutionLog]
  );

  const insertSnippetIntoActiveVariant = useCallback(
    (snippet: Snippet) => {
      if (!currentExperiment || !currentVariant) return;

      const updatedCss = currentVariant.cssCode
        ? `${currentVariant.cssCode}\n\n/* Injected from Snippet: ${snippet.title} */\n${snippet.cssCode}`
        : snippet.cssCode;

      const updatedJs = currentVariant.jsCode
        ? `${currentVariant.jsCode}\n\n// Injected from Snippet: ${snippet.title}\n${snippet.jsCode}`
        : snippet.jsCode;

      const updatedHtml = currentVariant.htmlCode
        ? `${currentVariant.htmlCode}\n<!-- Injected: ${snippet.title} -->\n${snippet.htmlCode}`
        : snippet.htmlCode;

      updateVariant(currentExperiment.id, currentVariant.id, {
        cssCode: updatedCss,
        jsCode: updatedJs,
        htmlCode: updatedHtml,
        targetSelector: currentVariant.targetSelector || snippet.targetSelectorHint,
      });

      addExecutionLog('success', `Inserted snippet "${snippet.title}" into ${currentVariant.name}`);
      triggerLiveReload();
    },
    [currentExperiment, currentVariant, updateVariant, addExecutionLog, triggerLiveReload]
  );

  // Snapshot actions
  const addSnapshot = useCallback(
    (snapshotData: Omit<PageSnapshot, 'id' | 'createdAt'>) => {
      const newId = `snap-${Date.now()}`;
      const newSnapshot: PageSnapshot = {
        ...snapshotData,
        id: newId,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setSnapshots((prev) => [newSnapshot, ...prev]);
      addExecutionLog('success', `Captured HTML snapshot "${newSnapshot.name}"`);
      return newId;
    },
    [addExecutionLog]
  );

  const deleteSnapshot = useCallback(
    (id: string) => {
      setSnapshots((prev) => prev.filter((s) => s.id !== id));
      addExecutionLog('info', `Deleted snapshot ${id}`);
    },
    [addExecutionLog]
  );

  const getSnapshot = useCallback(
    (idOrUrl: string) => {
      if (idOrUrl.startsWith('snapshot://')) {
        const id = idOrUrl.replace('snapshot://', '');
        return snapshots.find((s) => s.id === id);
      }
      return snapshots.find((s) => s.id === idOrUrl || s.originalUrl === idOrUrl);
    },
    [snapshots]
  );

  return (
    <CroContext.Provider
      value={{
        clients,
        experiments,
        snippets,
        snapshots,
        selectedClientId,
        selectedExperimentId,
        activeVariantId,
        currentClient,
        currentExperiment,
        currentVariant,
        targetUrl,
        device,
        viewMode,
        isInspectorActive,
        selectedSelector,
        executionLogs,
        activeCodeTab,
        isLiveReloading,
        isHtmlCaptureModalOpen,
        captureModalInitialUrl,
        setSelectedClientId: handleSelectClient,
        setSelectedExperimentId,
        setActiveVariantId,
        setTargetUrl,
        setDevice,
        setViewMode,
        setIsInspectorActive,
        setSelectedSelector,
        setActiveCodeTab,
        setIsHtmlCaptureModalOpen,
        openHtmlCaptureWithUrl,
        addClient,
        updateClient,
        deleteClient,
        addExperiment,
        updateExperiment,
        deleteExperiment,
        duplicateExperiment,
        addVariant,
        updateVariant,
        deleteVariant,
        addSnippet,
        updateSnippet,
        deleteSnippet,
        insertSnippetIntoActiveVariant,
        addSnapshot,
        deleteSnapshot,
        getSnapshot,
        addExecutionLog,
        clearExecutionLogs,
        triggerLiveReload,
      }}
    >
      {children}
    </CroContext.Provider>
  );
};

export const useCro = () => {
  const context = useContext(CroContext);
  if (!context) {
    throw new Error('useCro must be used within a CroProvider');
  }
  return context;
};
