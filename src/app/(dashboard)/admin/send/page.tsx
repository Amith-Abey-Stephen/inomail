"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, FileSpreadsheet, Send, Settings2, Code, Image as ImageIcon, CheckCircle2, ChevronRight, Copy, Loader2, Monitor, Smartphone, Tablet, ChevronLeft, Layout, Trash2 } from "lucide-react";
import { toast } from "sonner";

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

  const getDeviceWidth = () => {
    switch (previewDevice) {
      case "mobile": return "375px";
      case "tablet": return "768px";
      case "desktop": return "1440px";
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

  return (
    <div className="max-w-[1600px] mx-auto pb-20 px-4">
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
              /* Initial State: Big Prompt Box */
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
              /* Generated State: Studio View */
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden"
              >
                {/* Left: Control Panel */}
                <div className="w-full lg:w-[400px] flex flex-col gap-6">
                    {/* Prompt & Re-generate */}
                    <div className="glass-card p-6 rounded-[2.5rem] border-white/10 bg-white/5 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Generation Prompt</span>
                            <button onClick={() => setIsEditing(false)} className="text-[10px] font-black text-gray-500 hover:text-white uppercase transition-colors tracking-widest flex items-center gap-1"><ChevronLeft className="w-3 h-3" /> New</button>
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

                    {/* View Settings */}
                    <div className="glass-card p-6 rounded-[2.5rem] border-white/10 bg-white/5 flex-1 flex flex-col gap-6 shadow-xl">
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
                                className="w-full h-1.5 bg-black/40 rounded-full appearance-none cursor-pointer accent-primary"
                            />
                        </div>

                        <div className="flex-1" />

                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => setShowCode(!showCode)}
                                className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs transition-all border ${showCode ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                            >
                                <Code className="w-4 h-4" /> {showCode ? "Hide Code" : "Show Code"}
                            </button>
                            <button onClick={copyCode} className="flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition-all">
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
                        <div className="absolute inset-0 bg-[#f8f9fa] overflow-auto custom-scrollbar flex items-start justify-center p-12">
                             <motion.div 
                                animate={{ width: getDeviceWidth() }}
                                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                                style={{ scale: previewScale, transformOrigin: "top center" }}
                                className="min-h-full bg-white shadow-[0_40px_100px_rgba(0,0,0,0.1)] rounded-2xl overflow-hidden border border-gray-100"
                            >
                                <iframe srcDoc={htmlContent} className="w-full h-[1500px] border-none" title="Email Preview" />
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
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass-card border-white/10 bg-white/5 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                    <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all rotate-3 group-hover:rotate-0">
                      <ImageIcon className="w-8 h-8 text-gray-400 group-hover:text-primary transition-all" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Group {i}</h3>
                    <p className="text-sm text-gray-500 mb-6">Drop folders or click to browse</p>
                    <span className="text-[10px] font-black text-primary bg-primary/10 px-4 py-2 rounded-full tracking-[0.1em] uppercase border border-primary/20">Variable: {`{{asset${i}}}`}</span>
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
                <p className="text-gray-400">Import your database using Excel.</p>
              </div>
              
              <div className="glass-card border-dashed border-white/10 bg-white/5 rounded-[3rem] p-20 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <FileSpreadsheet className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Select Spreadsheet</h3>
                <p className="text-gray-400 mb-8 max-w-sm">Requires "Email" and "Name" columns.</p>
                <button className="bg-primary text-white px-10 py-4 rounded-2xl font-black hover:bg-primary/90 transition-all shadow-2xl">
                  Browse .xlsx Files
                </button>
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
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-green-500 blur-3xl opacity-20 animate-pulse" />
                <div className="relative w-32 h-32 bg-green-500/20 rounded-[3rem] flex items-center justify-center mx-auto mb-8 border border-green-500/30">
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                </div>
              </div>
              <div>
                <h2 className="text-5xl font-black text-white mb-4 tracking-tight">Ready for Blast-off</h2>
                <p className="text-gray-400 text-lg max-w-md mx-auto">Campaign is validated and ready for delivery.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto pt-8">
                <button 
                    onClick={() => toast.info("Test email sent!")}
                    className="flex-1 bg-white/5 border border-white/10 text-white px-8 py-5 rounded-2xl font-bold hover:bg-white/10 transition-all"
                >
                  Send Test
                </button>
                <button 
                    onClick={() => toast.success("Campaign launched!")}
                    className="flex-1 bg-primary text-white px-8 py-5 rounded-2xl font-black hover:bg-primary/90 transition-all shadow-[0_0_40px_rgba(99,102,241,0.4)] flex items-center justify-center gap-3"
                >
                  <Send className="w-5 h-5" /> Launch Now
                </button>
              </div>
              <button onClick={prevStep} className="text-gray-500 font-bold hover:text-white transition-colors">Back to Setup</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
