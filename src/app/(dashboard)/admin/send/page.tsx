"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, FileSpreadsheet, Send, Settings2, Code, Image as ImageIcon, CheckCircle2, ChevronRight } from "lucide-react";

type Step = 1 | 2 | 3 | 4;

export default function SendEmailPage() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [emailMode, setEmailMode] = useState<"ai" | "template" | "html">("ai");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/email/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, tone: "professional", variables: ["name", "company"] })
      });
      const data = await res.json();
      if (res.ok && data.html) {
        setHtmlContent(data.html);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4) as Step);
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1) as Step);

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Create Campaign</h1>
        <p className="text-gray-400">Design your email, upload recipients, and send your campaign.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-12 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/5 rounded-full z-0"></div>
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full z-0 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
        ></div>

        {[
          { step: 1, title: "Design", icon: <Sparkles className="w-4 h-4" /> },
          { step: 2, title: "Assets", icon: <ImageIcon className="w-4 h-4" /> },
          { step: 3, title: "Recipients", icon: <FileSpreadsheet className="w-4 h-4" /> },
          { step: 4, title: "Review", icon: <Send className="w-4 h-4" /> },
        ].map((s) => (
          <div key={s.step} className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
              currentStep >= s.step ? "bg-primary border-primary text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]" : "bg-[#09090b] border-white/10 text-gray-500"
            }`}>
              {currentStep > s.step ? <CheckCircle2 className="w-5 h-5" /> : s.icon}
            </div>
            <span className={`text-xs font-medium ${currentStep >= s.step ? "text-white" : "text-gray-500"}`}>{s.title}</span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="glass-card rounded-3xl border-white/10 p-6 md:p-8 min-h-[500px]">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full"
            >
              <div className="flex items-center gap-4 mb-8">
                <button 
                  onClick={() => setEmailMode("ai")}
                  className={`flex-1 py-3 rounded-xl border transition-all ${emailMode === 'ai' ? 'bg-primary/20 border-primary/50 text-primary' : 'bg-transparent border-white/10 text-gray-400 hover:bg-white/5'}`}
                >
                  <Sparkles className="w-5 h-5 mx-auto mb-2" />
                  <span className="text-sm font-medium">AI Generator</span>
                </button>
                <button 
                  onClick={() => setEmailMode("template")}
                  className={`flex-1 py-3 rounded-xl border transition-all ${emailMode === 'template' ? 'bg-primary/20 border-primary/50 text-primary' : 'bg-transparent border-white/10 text-gray-400 hover:bg-white/5'}`}
                >
                  <Settings2 className="w-5 h-5 mx-auto mb-2" />
                  <span className="text-sm font-medium">Saved Templates</span>
                </button>
                <button 
                  onClick={() => setEmailMode("html")}
                  className={`flex-1 py-3 rounded-xl border transition-all ${emailMode === 'html' ? 'bg-primary/20 border-primary/50 text-primary' : 'bg-transparent border-white/10 text-gray-400 hover:bg-white/5'}`}
                >
                  <Code className="w-5 h-5 mx-auto mb-2" />
                  <span className="text-sm font-medium">Custom HTML</span>
                </button>
              </div>

              {emailMode === "ai" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Campaign Subject</label>
                      <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none" placeholder="e.g. Q3 Performance Update" />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <label className="text-sm font-medium text-gray-300 mb-2 block">What should the email say?</label>
                      <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none resize-none min-h-[200px]" 
                        placeholder="Write a professional email announcing our new Q3 features. Mention {{name}} and their {{company}}."
                      ></textarea>
                    </div>
                    <button 
                      onClick={handleGenerate}
                      disabled={isGenerating || !prompt}
                      className="bg-white text-black font-medium py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isGenerating ? "Generating Magic..." : (
                        <><Sparkles className="w-4 h-4" /> Generate HTML</>
                      )}
                    </button>
                  </div>
                  <div className="flex flex-col h-full">
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Live Preview</label>
                    <div className="flex-1 bg-white rounded-xl border border-white/10 overflow-hidden relative">
                      {htmlContent ? (
                        <iframe srcDoc={htmlContent} className="w-full h-full bg-white" title="Email Preview" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-[#09090b]">
                          <p className="text-sm">Preview will appear here</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Other modes would be implemented here */}
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-xl font-bold text-white mb-4">Upload Dynamic Assets</h2>
              <p className="text-gray-400 text-sm mb-8">Upload up to 3 groups of assets (e.g., personalized certificates, QR codes). These can be dynamically attached or embedded in your emails using variables.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-dashed border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <ImageIcon className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="font-medium text-white mb-1">Asset Group {i}</h3>
                    <p className="text-xs text-gray-500 mb-4">Click or drag folder to upload</p>
                    <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-md">Use variable: {`{{asset${i}}}`}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-xl font-bold text-white mb-4">Upload Recipients List</h2>
              <p className="text-gray-400 text-sm mb-8">Upload an Excel (.xlsx) file containing your recipient data.</p>
              
              <div className="border border-dashed border-white/20 rounded-2xl p-12 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer group">
                <FileSpreadsheet className="w-16 h-16 text-gray-400 group-hover:text-primary mb-6 transition-colors" />
                <h3 className="text-lg font-medium text-white mb-2">Drag and drop your Excel file here</h3>
                <p className="text-sm text-gray-500 mb-6">Must include "Email" and "Name" columns.</p>
                <button className="bg-white/10 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-white/20 transition-colors">
                  Browse Files
                </button>
              </div>

              <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-3">
                <Settings2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-400 mb-1">Row-by-Row Validation Active</h4>
                  <p className="text-xs text-blue-400/80">When you upload, our system will automatically scan each row for missing data to ensure high deliverability.</p>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Ready to Send!</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">Your campaign has been successfully validated. 4,200 recipients are queued for delivery.</p>
              
              <div className="flex justify-center gap-4">
                <button className="bg-white/10 text-white px-8 py-3 rounded-xl font-medium hover:bg-white/20 transition-colors">
                  Send Test Email
                </button>
                <button className="bg-primary text-white px-8 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-lg flex items-center gap-2">
                  <Send className="w-4 h-4" /> Start Campaign
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-between mt-8">
        <button 
          onClick={prevStep}
          disabled={currentStep === 1}
          className="px-6 py-3 rounded-xl font-medium text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
        >
          Back
        </button>
        <button 
          onClick={nextStep}
          className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors ${
            currentStep === 4 ? "hidden" : "bg-white text-black hover:bg-gray-200"
          }`}
        >
          Next Step <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
