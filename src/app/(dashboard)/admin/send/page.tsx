"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, FileSpreadsheet, Send, Settings2, Code, Image as ImageIcon, CheckCircle2, ChevronRight, Copy, Loader2, Monitor, Smartphone, Tablet, ChevronLeft, Layout, Trash2, MousePointer2, Save, FileText, Download } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { useSearchParams } from "next/navigation";

type Step = 1 | 2 | 3 | 4;

export default function SendEmailPage() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isEditing, setIsEditing] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [previewScale, setPreviewScale] = useState(0.85);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [showCode, setShowCode] = useState(true);
  const [visualEditMode, setVisualEditMode] = useState(true);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [showSaveDraftModal, setShowSaveDraftModal] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [recipients, setRecipients] = useState<any[]>([]);
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchStats, setLaunchStats] = useState<{ total: number; sent: number; failed: number } | null>(null);
  const [failedList, setFailedList] = useState<any[]>([]);
  const [assets, setAssets] = useState<{ [key: string]: { url: string; name: string; loading: boolean } }>({
    "1": { url: "", name: "", loading: false },
    "2": { url: "", name: "", loading: false },
    "3": { url: "", name: "", loading: false },
  });
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const searchParams = useSearchParams();
  const templateId = searchParams.get("templateId");
  const draftId = searchParams.get("draftId");

  // Handle messages from the visual editor inside the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "HTML_UPDATE") {
        setHtmlContent(event.data.html);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Load template or draft if ID is provided
  useEffect(() => {
    if (templateId) {
        loadTemplate(templateId);
    } else if (draftId) {
        loadDraft(draftId);
    }
  }, [templateId, draftId]);

  const loadTemplate = async (id: string) => {
    const toastId = toast.loading("Loading template...");
    try {
        const res = await fetch(`/api/templates?id=${id}`);
        const data = await res.json();
        if (res.ok) {
            setHtmlContent(data.template.htmlContent);
            setPrompt(data.template.name);
            setIsEditing(true);
            toast.success("Template loaded!", { id: toastId });
        } else {
            toast.error("Failed to load template", { id: toastId });
        }
    } catch (err) {
        toast.error("Something went wrong", { id: toastId });
    }
  };

  const loadDraft = async (id: string) => {
    const toastId = toast.loading("Resuming draft...");
    try {
        const res = await fetch(`/api/campaigns?id=${id}`);
        const data = await res.json();
        if (res.ok) {
            setHtmlContent(data.campaign.htmlContent);
            setPrompt(data.campaign.name);
            setIsEditing(true);
            
            // Map assets if present
            if (data.campaign.assets) {
                const newAssets = { ...assets };
                data.campaign.assets.forEach((group: any, idx: number) => {
                    const key = (idx + 1).toString();
                    if (newAssets[key] && group.files?.[0]) {
                        newAssets[key] = {
                            url: group.files[0].url,
                            name: group.files[0].name || `Asset ${key}`,
                            loading: false
                        };
                    }
                });
                setAssets(newAssets);
            }

            toast.success("Draft resumed!", { id: toastId });
        } else {
            toast.error("Failed to resume draft", { id: toastId });
        }
    } catch (err) {
        toast.error("Something went wrong", { id: toastId });
    }
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    const toastId = toast.loading("Generating your masterpiece...");
    try {
      const res = await fetch("/api/email/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, tone: "professional", variables: ["name", "company"] })
      });
      const data = await res.json();
      if (res.ok && data.html) {
        setHtmlContent(data.html);
        setIsEditing(true);
        toast.success("Design ready!", { id: toastId });
      } else {
        toast.error(data.error || "Generation failed", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(htmlContent);
    toast.success("Code copied!");
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4) as Step);
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1) as Step);

  const handleFileUpload = async (groupKey: string, file: File) => {
    setAssets(prev => ({ ...prev, [groupKey]: { ...prev[groupKey], loading: true } }));
    const formData = new FormData();
    formData.append("file", file);
    formData.append("groupName", `group-${groupKey}`);

    const toastId = toast.loading(`Uploading asset to Group ${groupKey}...`);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setAssets(prev => ({ ...prev, [groupKey]: { url: data.url, name: data.name, loading: false } }));
        toast.success(`Successfully uploaded to Group ${groupKey}!`, { id: toastId });
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setAssets(prev => ({ ...prev, [groupKey]: { ...prev[groupKey], loading: false } }));
      toast.error(err.message || "Upload failed", { id: toastId });
    }
  };

  const getDeviceWidth = () => {
    switch (previewDevice) {
      case "mobile": return "375px";
      case "tablet": return "768px";
      case "desktop": return "1200px";
      default: return "100%";
    }
  };

  const startFromScratch = () => {
    setHtmlContent(`<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: sans-serif; background: #f4f4f4; padding: 40px; }
  .card { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 600px; margin: auto; }
  h1 { color: #333; }
</style>
</head>
<body>
  <div class="card">
    <h1>Hello World</h1>
    <p>Start editing this template...</p>
  </div>
</body>
</html>`);
    setIsEditing(true);
    setShowCode(true);
  };

  // Wrap HTML with visual editor script
  const getVisualEditorHtml = (rawHtml: string) => {
    if (!visualEditMode) return rawHtml;
    
    const script = `
      <script>
        document.addEventListener('DOMContentLoaded', () => {
          // Make all text elements editable
          const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, b, i, strong, em, a, li');
          elements.forEach(el => {
            if (el.children.length === 0 || Array.from(el.childNodes).some(n => n.nodeType === 3)) {
              el.contentEditable = 'true';
              el.style.outline = 'none';
              
              // Hover effect
              el.addEventListener('mouseover', (e) => {
                e.stopPropagation();
                el.style.backgroundColor = 'rgba(99, 102, 241, 0.05)';
                el.style.boxShadow = '0 0 0 1px rgba(99, 102, 241, 0.2)';
              });
              el.addEventListener('mouseout', () => {
                el.style.backgroundColor = '';
                el.style.boxShadow = '';
              });
            }
          });

          // Sync changes back to parent
          let timeout;
          document.body.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              // Clean up before sending back
              const clone = document.documentElement.cloneNode(true);
              clone.querySelectorAll('[contenteditable]').forEach(el => {
                el.removeAttribute('contenteditable');
                el.removeAttribute('style');
              });
              window.parent.postMessage({ type: 'HTML_UPDATE', html: '<!DOCTYPE html>\\n' + clone.outerHTML }, '*');
            }, 500);
          });
        });
      </script>
    `;

    if (rawHtml.includes('</body>')) {
      return rawHtml.replace('</body>', `${script}</body>`);
    }
    return rawHtml + script;
  };

  const handleSaveTemplate = async () => {
    if (!saveName) return;
    const name = saveName;
    const toastId = toast.loading("Saving as template...");
    try {
      const res = await fetch("/api/templates/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, htmlContent, category: "Custom" })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Design saved to Templates!", { id: toastId });
        setShowSaveTemplateModal(false);
        setSaveName("");
      } else {
        toast.error(data.error || "Failed to save template", { id: toastId });
      }
    } catch (err) {
      toast.error("Failed to save template", { id: toastId });
    }
  };

  const handleSaveDraft = async () => {
    if (!saveName) return;
    const name = saveName;
    const toastId = toast.loading("Saving draft...");
    try {
      const res = await fetch("/api/campaigns/save-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          subject: "Draft Campaign", 
          htmlContent,
          assets: Object.values(assets).filter(a => a.url).map((a, i) => ({
            groupName: `Group ${i + 1}`,
            files: [{ url: a.url, name: a.name }]
          }))
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Draft saved successfully!", { id: toastId });
        setIsEditing(false);
        setShowSaveDraftModal(false);
        setShowExitModal(false);
        setSaveName("");
      } else {
        toast.error(data.error || "Failed to save draft", { id: toastId });
      }
    } catch (err) {
      toast.error("Failed to save draft", { id: toastId });
    }
  };

  const downloadTemplate = () => {
    const headers = ["Name", "Email"];
    // Add columns for all asset groups
    Object.keys(assets).forEach(key => {
        headers.push(`Asset ${key}`);
    });

    const worksheet = XLSX.utils.aoa_to_sheet([headers]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Recipients");
    
    XLSX.writeFile(workbook, "InoMail_Template.xlsx");
    toast.success("Template downloaded! Fill it and upload.");
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (data.length === 0) {
            toast.error("The spreadsheet is empty.");
            return;
        }

        // Basic validation
        const firstRow: any = data[0];
        const hasEmail = Object.keys(firstRow).some(k => k.toLowerCase() === "email");
        const hasName = Object.keys(firstRow).some(k => k.toLowerCase() === "name");

        if (!hasEmail || !hasName) {
            toast.error("Columns 'Email' and 'Name' are required.");
            return;
        }

        setRecipients(data);
        toast.success(`Successfully imported ${data.length} recipients!`);
      } catch (err) {
        toast.error("Failed to parse Excel file.");
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleLaunch = async (retryList?: any[]) => {
    const list = retryList || recipients;
    if (list.length === 0) return;

    setIsLaunching(true);
    const toastId = toast.loading(retryList ? "Retrying failures..." : "Launching campaign...");
    
    try {
        const res = await fetch("/api/email/launch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: prompt || "Untitled Campaign",
                subject: "Important Update from InoMail", // Default subject
                htmlContent,
                recipients: list,
                assets: Object.values(assets).filter(a => a.url).map((a, i) => ({
                    groupName: `Group ${i + 1}`,
                    files: [{ url: a.url, name: a.name }]
                }))
            })
        });

        const data = await res.json();
        if (res.ok) {
            setLaunchStats(data.stats);
            setFailedList(data.failedRecipients || []);
            toast.success("Campaign dispatch completed!", { id: toastId });
        } else {
            toast.error(data.error || "Launch failed", { id: toastId });
        }
    } catch (err) {
        toast.error("Failed to connect to delivery server", { id: toastId });
    } finally {
        setIsLaunching(false);
    }
  };

  const downloadFailedList = () => {
    if (failedList.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(failedList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Failed_Recipients");
    XLSX.writeFile(workbook, "Failed_Recipients.xlsx");
  };

  const discardAndExit = () => {
    setIsEditing(false);
    setShowExitModal(false);
    setHtmlContent("");
    setPrompt("");
    setAssets({
      "1": { url: "", name: "", loading: false },
      "2": { url: "", name: "", loading: false },
      "3": { url: "", name: "", loading: false },
    });
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-20 px-4 relative">
      {/* Exit Confirmation Modal */}
      <AnimatePresence>
        {showExitModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowExitModal(false)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-md glass-card p-8 rounded-[2.5rem] border-white/10 bg-[#0c0c0e] shadow-2xl text-center"
                >
                    <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Layout className="w-8 h-8 text-yellow-500" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">Unsaved Changes</h3>
                    <p className="text-gray-400 text-sm mb-8">You are about to leave the studio. What would you like to do with your current design?</p>
                    
                    <div className="space-y-3">
                        <button 
                            onClick={() => { setShowSaveDraftModal(true); setSaveName("New Draft"); }}
                            className="w-full bg-primary text-white font-black py-4 rounded-xl hover:bg-primary/90 transition-all shadow-lg"
                        >
                            Save Draft & Exit
                        </button>
                        <button 
                            onClick={discardAndExit}
                            className="w-full bg-white/5 border border-white/10 text-red-400 font-bold py-4 rounded-xl hover:bg-red-500/10 hover:border-red-500/20 transition-all"
                        >
                            Discard & Exit
                        </button>
                        <button 
                            onClick={() => setShowExitModal(false)}
                            className="w-full bg-transparent text-gray-500 font-medium py-2 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* Header & Stepper */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Campaign Studio</h1>
          <p className="text-gray-400 text-sm font-medium">Step {currentStep} of 4: {currentStep === 1 ? "Design" : currentStep === 2 ? "Assets" : currentStep === 3 ? "Recipients" : "Review"}</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                currentStep === s ? "bg-primary text-white shadow-lg" : currentStep > s ? "bg-primary/10 text-primary" : "text-gray-600 bg-transparent"
              }`}
            >
              {currentStep > s ? <CheckCircle2 className="w-5 h-5" /> : s}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col h-[calc(100vh-250px)] min-h-[700px]"
          >
            {!isEditing ? (
              <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full glass-card p-12 rounded-[3rem] border-white/10 bg-white/5 text-center space-y-8"
                >
                    <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                        <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-white mb-4">What should we create?</h2>
                        <p className="text-gray-400 text-lg">Describe the email you want to send, and our AI will build a premium template for you.</p>
                    </div>
                    <div className="relative group">
                        <textarea 
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full bg-black/40 border-2 border-white/5 rounded-3xl p-8 text-xl text-white placeholder:text-gray-700 focus:border-primary focus:outline-none transition-all resize-none h-[180px] shadow-inner"
                            placeholder="e.g. A colorful thank you email for hackathon participants with a premium card vibe..."
                        />
                        <div className="absolute right-4 bottom-4">
                            <button 
                                onClick={handleGenerate}
                                disabled={isGenerating || !prompt}
                                className="bg-primary hover:bg-primary/90 text-white font-black px-10 py-4 rounded-2xl transition-all flex items-center gap-2 shadow-[0_0_40px_rgba(99,102,241,0.3)] disabled:opacity-30 active:scale-95"
                            >
                                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <><Sparkles className="w-5 h-5" /> Generate</>
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-4 pt-4">
                        <button className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold"><Settings2 className="w-4 h-4" /> Use Template</button>
                        <div className="w-1 h-1 rounded-full bg-gray-800" />
                        <button onClick={startFromScratch} className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold"><Code className="w-4 h-4" /> Start from HTML</button>
                    </div>
                </motion.div>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden"
              >
                {/* Left: Control Panel */}
                <div className="w-full lg:w-[400px] flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-1">
                    <div className="glass-card p-6 rounded-[2.5rem] border-white/10 bg-white/5 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Generation Prompt</span>
                            <button onClick={() => setShowExitModal(true)} className="text-[10px] font-black text-gray-500 hover:text-white uppercase transition-colors tracking-widest flex items-center gap-1"><ChevronLeft className="w-3 h-3" /> New</button>
                        </div>
                        <textarea 
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm text-gray-300 focus:outline-none resize-none h-[100px]"
                        />
                        <button 
                            onClick={handleGenerate}
                            disabled={isGenerating || !prompt}
                            className="w-full bg-white/5 border border-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                        >
                             {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4" /> Re-generate</>}
                        </button>
                    </div>

                    <div className="glass-card p-6 rounded-[2.5rem] border-white/10 bg-white/5 flex flex-col gap-4 shadow-xl">
                        <div className="space-y-4">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Preview Options</span>
                            <div className="flex bg-black/20 p-1 rounded-2xl border border-white/5">
                                <button onClick={() => setPreviewDevice("desktop")} className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-xl transition-all ${previewDevice === 'desktop' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>
                                    <Monitor className="w-5 h-5" />
                                    <span className="text-[10px] font-bold">Desktop</span>
                                </button>
                                <button onClick={() => setPreviewDevice("tablet")} className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-xl transition-all ${previewDevice === 'tablet' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>
                                    <Tablet className="w-5 h-5" />
                                    <span className="text-[10px] font-bold">Tablet</span>
                                </button>
                                <button onClick={() => setPreviewDevice("mobile")} className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-xl transition-all ${previewDevice === 'mobile' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>
                                    <Smartphone className="w-5 h-5" />
                                    <span className="text-[10px] font-bold">Mobile</span>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Scale Preview</span>
                                <span className="text-[10px] font-bold text-primary">{Math.round(previewScale * 100)}%</span>
                            </div>
                            <input 
                                type="range" min="0.4" max="1" step="0.01" 
                                value={previewScale} onChange={(e) => setPreviewScale(parseFloat(e.target.value))}
                                className="w-full h-1.5 bg-white/10 border border-white/5 rounded-full appearance-none cursor-pointer accent-primary"
                            />
                        </div>

                        <div className="flex-1" />

                        <div className="grid grid-cols-2 gap-2">
                            <button 
                                onClick={() => setVisualEditMode(!visualEditMode)}
                                className={`flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-xs transition-all border ${visualEditMode ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                            >
                                <MousePointer2 className="w-4 h-4" /> Visual Edit: {visualEditMode ? "ON" : "OFF"}
                            </button>
                            <button 
                                onClick={() => { setShowSaveTemplateModal(true); setSaveName("New Template"); }}
                                className="flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-xs bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition-all"
                            >
                                <Save className="w-4 h-4 text-primary" /> Save Template
                            </button>
                            <button 
                                onClick={() => setShowCode(!showCode)}
                                className={`flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-xs transition-all border ${showCode ? 'bg-white/10 border-white/20 text-white shadow-lg' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                            >
                                <Code className="w-4 h-4" /> {showCode ? "Hide Code" : "Show Code"}
                            </button>
                            <button onClick={copyCode} className="flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-xs bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition-all">
                                <Copy className="w-4 h-4" /> Copy HTML
                            </button>
                        </div>

                        <button 
                            onClick={nextStep}
                            className="w-full bg-white text-black font-black py-5 rounded-[1.5rem] hover:bg-gray-200 transition-all flex items-center justify-center gap-2 shadow-2xl active:scale-[0.98]"
                        >
                            Next Step <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Right: Preview & Editor Area */}
                <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                    <AnimatePresence>
                        {showCode && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "45%", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="glass-card border-white/10 bg-[#0c0c0e] rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl relative group"
                            >
                                <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                    <div className="flex items-center gap-2">
                                        <Code className="w-3.5 h-3.5 text-primary" />
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Live HTML Editor</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => setHtmlContent("")} className="text-[10px] font-black text-red-500/50 hover:text-red-500 uppercase transition-colors tracking-widest flex items-center gap-1"><Trash2 className="w-3 h-3" /> Clear</button>
                                        <div className="flex gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
                                        </div>
                                    </div>
                                </div>
                                <textarea 
                                    spellCheck={false}
                                    value={htmlContent}
                                    onChange={(e) => setHtmlContent(e.target.value)}
                                    className="flex-1 w-full bg-transparent p-6 text-sm font-mono text-gray-400 focus:outline-none resize-none custom-scrollbar leading-relaxed"
                                    placeholder="Paste your HTML here..."
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex-1 glass-card border-white/10 bg-white rounded-[3.5rem] overflow-hidden relative shadow-2xl">
                        <div className="absolute inset-0 bg-[#f8f9fa] overflow-auto custom-scrollbar flex flex-col items-center p-12">
                             <motion.div 
                                animate={{ width: getDeviceWidth() }}
                                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                                style={{ 
                                    scale: previewScale, 
                                    transformOrigin: "top center",
                                    marginBottom: -( (1 - previewScale) * 100 ) + "%" // Offset the whitespace created by scaling
                                }}
                                className="min-h-full bg-white shadow-[0_40px_100px_rgba(0,0,0,0.1)] rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0"
                            >
                                <iframe 
                                  ref={iframeRef}
                                  srcDoc={getVisualEditorHtml(htmlContent)} 
                                  className="w-full h-[1500px] border-none" 
                                  title="Email Preview" 
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
             <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl font-black text-white mb-4">Upload Assets</h2>
                <p className="text-gray-400">Personalize your campaign with certificates, QR codes, or unique attachments.</p>
             </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.keys(assets).map((key) => (
                  <div key={key} className="relative group">
                    <input 
                      type="file" 
                      id={`file-${key}`} 
                      className="hidden" 
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(key, e.target.files[0])}
                    />
                    <label 
                      htmlFor={`file-${key}`}
                      className={`glass-card border-white/10 bg-white/5 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer h-full ${assets[key].url ? 'border-primary/50 bg-primary/5' : ''}`}
                    >
                      <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-6 transition-all ${assets[key].url ? 'bg-primary/20' : 'bg-white/5 group-hover:bg-primary/20'}`}>
                        {assets[key].loading ? <Loader2 className="w-8 h-8 text-primary animate-spin" /> : 
                         assets[key].url ? <CheckCircle2 className="w-8 h-8 text-primary" /> :
                         <ImageIcon className="w-8 h-8 text-gray-400 group-hover:text-primary transition-all" />
                        }
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Group {key}</h3>
                      <p className="text-sm text-gray-500 mb-6 truncate max-w-full px-4">
                        {assets[key].name || "Drop folders or click to browse"}
                      </p>
                      <span className={`text-[10px] font-black px-4 py-2 rounded-full tracking-[0.1em] uppercase border transition-all ${assets[key].url ? 'text-primary bg-primary/20 border-primary/20' : 'text-gray-500 border-white/10'}`}>
                        Variable: {`{{asset${key}}}`}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center bg-white/5 p-6 rounded-[2rem] border border-white/10">
                <button onClick={prevStep} className="text-gray-400 font-bold px-6 py-2 hover:text-white transition-colors">Go Back</button>
                <button onClick={nextStep} className="bg-white text-black font-black px-10 py-4 rounded-2xl hover:bg-gray-200 transition-all">Next: Recipients</button>
              </div>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl font-black text-white mb-4">Recipient Data</h2>
                <p className="text-gray-400 mb-8">Import your database using Excel. We've prepared a template with the correct columns for your assets.</p>
                
                <div className="flex items-center justify-center gap-4 mb-10">
                    <button 
                        onClick={downloadTemplate}
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-black text-xs uppercase tracking-widest transition-colors bg-primary/10 px-6 py-3 rounded-xl border border-primary/20"
                    >
                        <Download className="w-4 h-4" /> Download Template
                    </button>
                    {recipients.length > 0 && (
                        <div className="flex items-center gap-2 text-green-400 bg-green-500/10 px-4 py-2 rounded-xl border border-green-500/20 text-xs font-bold">
                            <CheckCircle2 className="w-4 h-4" /> {recipients.length} Recipients Loaded
                        </div>
                    )}
                </div>
              </div>
              
              <div className="relative group">
                <input 
                    type="file" 
                    id="excel-upload" 
                    className="hidden" 
                    accept=".xlsx, .xls, .csv"
                    onChange={handleExcelUpload} 
                />
                <label 
                    htmlFor="excel-upload"
                    className="glass-card border-dashed border-white/10 bg-white/5 rounded-[3rem] p-20 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group block"
                >
                    <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    {recipients.length > 0 ? <CheckCircle2 className="w-12 h-12 text-primary" /> : <FileSpreadsheet className="w-12 h-12 text-primary" />}
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">{recipients.length > 0 ? "Spreadsheet Loaded" : "Select Spreadsheet"}</h3>
                    <p className="text-gray-400 mb-8 max-w-sm">
                        {recipients.length > 0 ? "Click to replace the current list" : "Requires 'Email' and 'Name' columns."}
                    </p>
                    <div className="bg-primary text-white px-10 py-4 rounded-2xl font-black hover:bg-primary/90 transition-all shadow-2xl">
                    {recipients.length > 0 ? "Replace File" : "Browse .xlsx Files"}
                    </div>
                </label>
              </div>

              <div className="flex justify-between items-center bg-white/5 p-6 rounded-[2rem] border border-white/10">
                <button onClick={prevStep} className="text-gray-400 font-bold px-6 py-2 hover:text-white transition-colors">Go Back</button>
                <button onClick={nextStep} className="bg-white text-black font-black px-10 py-4 rounded-2xl hover:bg-gray-200 transition-all">Review Campaign</button>
              </div>
          </motion.div>
        )}

        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center space-y-8 py-12"
          >
              {!launchStats ? (
                <>
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-green-500 blur-3xl opacity-20 animate-pulse" />
                        <div className="relative w-32 h-32 bg-green-500/20 rounded-[3rem] flex items-center justify-center mx-auto mb-8 border border-green-500/30">
                            {isLaunching ? <Loader2 className="w-16 h-16 text-primary animate-spin" /> : <CheckCircle2 className="w-16 h-16 text-green-500" />}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-5xl font-black text-white mb-4 tracking-tight">{isLaunching ? "Dispatching..." : "Ready for Blast-off"}</h2>
                        <p className="text-gray-400 text-lg max-w-md mx-auto">
                            {isLaunching ? "Please don't close this window while we send your emails." : `${recipients.length} recipients are validated and ready for delivery.`}
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto pt-8">
                        <button 
                            disabled={isLaunching}
                            onClick={() => toast.info("Test email sent!")}
                            className="flex-1 bg-white/5 border border-white/10 text-white px-8 py-5 rounded-2xl font-bold hover:bg-white/10 transition-all disabled:opacity-30"
                        >
                        Send Test
                        </button>
                        <button 
                            disabled={isLaunching || recipients.length === 0}
                            onClick={() => handleLaunch()}
                            className="flex-1 bg-primary text-white px-8 py-5 rounded-2xl font-black hover:bg-primary/90 transition-all shadow-[0_0_40px_rgba(99,102,241,0.4)] flex items-center justify-center gap-3 disabled:opacity-30"
                        >
                        {isLaunching ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Launch Now</>}
                        </button>
                    </div>
                </>
              ) : (
                <div className="max-w-4xl mx-auto space-y-12">
                    <div>
                        <h2 className="text-4xl font-black text-white mb-2">Campaign Summary</h2>
                        <p className="text-gray-400 font-medium">Results for {prompt || "Untitled Campaign"}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-card p-8 rounded-[2rem] border-white/10 bg-white/5 flex flex-col items-center justify-center">
                            <span className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Total Processed</span>
                            <span className="text-4xl font-black text-white">{launchStats.total}</span>
                        </div>
                        <div className="glass-card p-8 rounded-[2rem] border-green-500/10 bg-green-500/5 flex flex-col items-center justify-center">
                            <span className="text-xs font-black text-green-500 uppercase tracking-widest mb-2">Successfully Sent</span>
                            <span className="text-4xl font-black text-green-500">{launchStats.sent}</span>
                        </div>
                        <div className="glass-card p-8 rounded-[2rem] border-red-500/10 bg-red-500/5 flex flex-col items-center justify-center">
                            <span className="text-xs font-black text-red-500 uppercase tracking-widest mb-2">Failed Deliveries</span>
                            <span className="text-4xl font-black text-red-500">{launchStats.failed}</span>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 flex flex-col items-center gap-6">
                        {launchStats.failed > 0 ? (
                            <>
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-white mb-2">Action Required: {launchStats.failed} Failures</h3>
                                    <p className="text-gray-400 text-sm max-w-sm">Some emails couldn't be delivered. You can download the failed list or retry sending to them.</p>
                                </div>
                                <div className="flex gap-4">
                                    <button 
                                        onClick={downloadFailedList}
                                        className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all"
                                    >
                                        <Download className="w-4 h-4" /> Download Failed List
                                    </button>
                                    <button 
                                        onClick={() => handleLaunch(failedList)}
                                        className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-black hover:bg-primary/90 transition-all"
                                    >
                                        <Send className="w-4 h-4" /> Retry Failed Only
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Perfect Score!</h3>
                                <p className="text-gray-400 text-sm">All emails were successfully dispatched to the target list.</p>
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={() => { setLaunchStats(null); setCurrentStep(1); setRecipients([]); }}
                        className="text-gray-500 font-bold hover:text-white transition-colors"
                    >
                        Start New Campaign
                    </button>
                </div>
              )}
              {!launchStats && <button onClick={prevStep} className="text-gray-500 font-bold hover:text-white transition-colors">Back to Setup</button>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Template Modal */}
      <AnimatePresence>
        {showSaveTemplateModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowSaveTemplateModal(false)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-md glass-card p-8 rounded-[2.5rem] border-white/10 bg-[#0c0c0e] shadow-2xl"
                >
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                        <Save className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">Save as Template</h3>
                    <p className="text-gray-400 text-sm mb-8">Give your design a name to save it to your organization's library.</p>
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Template Name</label>
                            <input 
                                autoFocus
                                type="text"
                                value={saveName}
                                onChange={(e) => setSaveName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:border-primary/50 outline-none transition-all"
                                placeholder="e.g. Winter Sale 2024"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowSaveTemplateModal(false)}
                                className="flex-1 bg-white/5 border border-white/10 text-gray-400 font-bold py-4 rounded-xl hover:bg-white/10 transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveTemplate}
                                disabled={!saveName}
                                className="flex-1 bg-primary text-white font-black py-4 rounded-xl hover:bg-primary/90 transition-all shadow-lg disabled:opacity-50"
                            >
                                Save Template
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* Save Draft Modal */}
      <AnimatePresence>
        {showSaveDraftModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowSaveDraftModal(false)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-md glass-card p-8 rounded-[2.5rem] border-white/10 bg-[#0c0c0e] shadow-2xl"
                >
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
                        <FileText className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">Save Campaign Draft</h3>
                    <p className="text-gray-400 text-sm mb-8">Saving this as a draft allows you to resume this exact state later.</p>
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Draft Name</label>
                            <input 
                                autoFocus
                                type="text"
                                value={saveName}
                                onChange={(e) => setSaveName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:border-primary/50 outline-none transition-all"
                                placeholder="e.g. Untitled Campaign"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowSaveDraftModal(false)}
                                className="flex-1 bg-white/5 border border-white/10 text-gray-400 font-bold py-4 rounded-xl hover:bg-white/10 transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveDraft}
                                disabled={!saveName}
                                className="flex-1 bg-blue-500 text-white font-black py-4 rounded-xl hover:bg-blue-600 transition-all shadow-lg disabled:opacity-50"
                            >
                                Save Draft
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
}
