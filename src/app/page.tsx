"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Puzzle, 
  Settings, 
  Chrome, 
  Download, 
  Code2, 
  Eye, 
  Home,
  Clock,
  ArrowLeft, 
  Plus, 
  X, 
  Search, 
  LayoutGrid, 
  ArrowRightLeft, 
  Zap,
  Pencil,
  ChevronDown,
  ArrowDownToLine,
  File,
  Copy,
  Send,
  Repeat,
  DollarSign,
  Maximize2,
  QrCode
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// --- Mock Data Constants ---
const DEFAULTS = {
  chain: "Solana",
  name: "1111",
  addr: "7fXB…Hin7",
  homeName: "111",
  bal: "1.22",
  delta: "-0.0274",
  pct: "-2.21",
  banner: "Meet Phantom Terminal, your new home for desktop trading",
  tokName: "Solana",
  tokAmt: "0.01 SOL",
  tokUsd: "1.22",
  tokChg: "-0.03",
  manage: "Manage token list",
  badgeCount: "3"
};

// --- Synced Files Content from public/extension/ ---
const FILES = {
  manifest: `{
  "manifest_version": 3,
  "name": "Phantom Wallet Mockup Editor",
  "version": "1.0",
  "description": "A mockup editor for Phantom Wallet UI, allowing visual customization of balances and data.",
  "action": {
    "default_popup": "popup.html"
  },
  "permissions": ["storage"]
}`,
  popupHtml: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <style>
        :root {
            --bg-color: #0F0F0F;
            --card-bg: #1C1C1E;
            --accent: #AB9FF2;
            --text-zinc-500: #71717A;
            --text-zinc-400: #A1A1AA;
            --up-color: #00FFA3;
            --down-color: #FF4D4D;
            --input-bg: #0A0A0A;
        }
        * { box-sizing: border-box; }
        body {
            margin: 0; padding: 0;
            width: 375px; height: 600px;
            background-color: var(--bg-color); color: white;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            overflow: hidden; display: flex; flex-direction: column;
        }
        .screen { position: absolute; inset: 0; display: none; flex-direction: column; background: var(--bg-color); z-index: 10; }
        .screen.active { display: flex; }
        .tab-content { flex: 1; display: none; flex-direction: column; overflow-y: auto; }
        .tab-content.active { display: flex; }
        header { height: 64px; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; }
        .account-badge { display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 6px 10px; border-radius: 20px; background: rgba(255,255,255,0.03); }
        .total-bal { font-size: 48px; font-weight: 800; letter-spacing: -1px; text-align: center; }
        .actions-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; padding: 0 16px; margin: 24px 0; }
        .action-btn { aspect-ratio: 1; background: #1C1C1E; border-radius: 18px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; font-size: 12px; font-weight: bold; color: var(--text-zinc-400); cursor: pointer; }
        nav { height: 72px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-around; align-items: center; background: #0F0F0F; }
        .nav-item { flex: 1; height: 100%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #3F3F46; }
        .nav-item.active { color: #AB9FF2; }
    </style>
</head>
<body>
    <div id="main-layout" style="flex:1;display:flex;flex-direction:column">
        <div id="tab-home" class="tab-content active">
            <div class="home-header">
                <div class="account-badge" id="badge-account">
                    <div class="badge-circle" id="disp-badgeCount">3</div>
                    <span id="disp-homeName">111</span>
                </div>
            </div>
            <div class="bal-section">
                <div class="total-bal">$<span id="disp-bal">1.22</span></div>
            </div>
            <div class="actions-grid">
                <div class="action-btn">Receive</div>
                <div class="action-btn">Send</div>
                <div class="action-btn">Swap</div>
                <div class="action-btn">Buy</div>
            </div>
        </div>
        <nav id="bottom-nav">
            <div class="nav-item active" data-tab="tab-home">H</div>
            <div class="nav-item" data-tab="tab-grid">G</div>
            <div class="nav-item" data-tab="tab-swap">S</div>
            <div class="nav-item" data-tab="tab-activity">A</div>
            <div class="nav-item" data-tab="tab-search">Q</div>
        </nav>
    </div>
    <script src="popup.js"></script>
</body>
</html>`,
  popupJs: `const DEFAULTS = {
    homeName: "111", bal: "1.22", delta: "-0.0274", pct: "-2.21",
    tokAmt: "0.01 SOL", tokUsd: "1.22", tokChg: "-0.03",
    badgeCount: "3", addr: "7fXB...Hin7"
};
let currentData = { ...DEFAULTS };
function updateUI() {
    document.getElementById('disp-homeName').textContent = currentData.homeName;
    document.getElementById('disp-bal').textContent = currentData.bal;
    // ... UI Logic
}
window.onload = () => {
    // ... Initialization logic
    updateUI();
};`
};

export default function ShowcasePage() {
  const [data, setData] = useState(DEFAULTS);
  const [screen, setScreen] = useState("s3"); // s1, s-import-pk, s-editor, s3 (main)
  const [activeTab, setActiveTab] = useState("home");
  const [view, setView] = useState("preview"); // preview | instructions | code
  const [privateKey, setPrivateKey] = useState("");
  const [showBanner, setShowBanner] = useState(true);

  const handleSave = () => {
    setScreen("s3");
    toast.success("Mockup updated!");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30">
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Puzzle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">Phantom Mockup</h1>
              <p className="text-xs text-zinc-500 font-medium">Extension Showcase & Builder</p>
            </div>
          </div>
          <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-auto">
            <TabsList className="bg-zinc-800/50 border border-zinc-700">
              <TabsTrigger value="preview" className="data-[state=active]:bg-zinc-700"><Eye className="w-4 h-4 mr-2" /> Preview</TabsTrigger>
              <TabsTrigger value="instructions" className="data-[state=active]:bg-zinc-700"><Settings className="w-4 h-4 mr-2" /> Install</TabsTrigger>
              <TabsTrigger value="code" className="data-[state=active]:bg-zinc-700"><Code2 className="w-4 h-4 mr-2" /> Source</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {view === "preview" && (
            <motion.div key="preview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col lg:flex-row gap-12 items-start justify-center">
              <div className="relative w-[375px] h-[667px] bg-[#0a0a0a] rounded-[3rem] border-[8px] border-zinc-800 shadow-2xl overflow-hidden shrink-0">
                <div className="w-full h-full bg-[#0F0F0F] flex flex-col relative overflow-hidden">
                  
                  {/* OVERLAY SCREENS */}
                  <AnimatePresence>
                    {screen === "s1" && (
                      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25 }} className="absolute inset-0 bg-[#0F0F0F] z-50 flex flex-col">
                        <header className="h-14 flex items-center justify-between px-4">
                          <button onClick={() => setScreen("s3")} className="p-2 text-zinc-100"><X className="w-6 h-6" /></button>
                          <div className="font-bold text-[18px]">Add Account</div>
                          <div className="w-10" />
                        </header>
                        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2.5">
                          {[
                            { title: "Import Recovery Phrase", sub: "Edit mock data values", icon: <File className="w-5 h-5" />, onClick: () => setScreen("s-editor") },
                            { title: "Import Private Key", sub: "Add account to mockup", icon: <ArrowDownToLine className="w-5 h-5" />, onClick: () => setScreen("s-import-pk") },
                          ].map((item, i) => (
                            <button key={i} onClick={item.onClick} className="w-full bg-[#1C1C1E] p-4 rounded-[22px] flex items-center gap-4 text-left border border-white/5 active:scale-95 transition-all">
                              <div className="w-11 h-11 rounded-full bg-[#2C2C2E] flex items-center justify-center shrink-0">{item.icon}</div>
                              <div><p className="font-bold text-[17px]">{item.title}</p><p className="text-[14px] text-zinc-500">{item.sub}</p></div>
                            </button>
                          ))}
                        </div>
                        <div className="p-4 pb-8"><Button onClick={() => setScreen("s3")} className="w-full h-12 rounded-[22px] bg-[#1C1C1E] font-bold">Close</Button></div>
                      </motion.div>
                    )}

                    {screen === "s-import-pk" && (
                      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25 }} className="absolute inset-0 bg-[#0F0F0F] z-50 flex flex-col">
                        <header className="h-14 flex items-center justify-between px-4">
                          <button onClick={() => setScreen("s1")} className="p-2 text-zinc-100"><ArrowLeft className="w-6 h-6" /></button>
                          <div className="font-bold text-[17px]">Import Private Key</div>
                          <div className="w-10" />
                        </header>
                        <div className="flex-1 px-4 space-y-6 pt-6">
                           <div className="flex flex-col items-center gap-4">
                             <div className="w-20 h-20 bg-[#252528] rounded-full flex items-center justify-center text-3xl font-bold border border-white/5">P</div>
                             <div className="w-full space-y-2.5">
                               <div className="bg-[#1C1C1E] h-12 rounded-xl px-4 flex items-center justify-between border border-white/5"><span className="font-bold">Solana</span><ChevronDown className="w-4 h-4 text-zinc-500" /></div>
                               <input value={data.name} onChange={e => setData({...data, name: e.target.value})} className="w-full bg-[#1C1C1E] h-12 rounded-xl px-4 border border-white/5 font-bold" placeholder="Name" />
                               <textarea value={privateKey} onChange={e => setPrivateKey(e.target.value)} className="w-full bg-[#1C1C1E] p-4 rounded-xl border border-white/5 h-28 font-mono text-sm" placeholder="Private key" />
                             </div>
                           </div>
                        </div>
                        <div className="p-4 pb-8"><Button disabled={!privateKey} onClick={() => setScreen("s3")} className="w-full h-12 rounded-xl bg-[#AB9FF2] text-black font-bold">Import</Button></div>
                      </motion.div>
                    )}

                    {screen === "s-editor" && (
                      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25 }} className="absolute inset-0 bg-[#0F0F0F] z-50 flex flex-col">
                        <header className="h-14 flex items-center justify-between px-4">
                          <button onClick={() => setScreen("s1")} className="p-2 text-zinc-100"><ArrowLeft className="w-6 h-6" /></button>
                          <div className="font-bold text-[17px]">Edit Mock Data</div>
                          <div className="w-10" />
                        </header>
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                          {[
                            { label: "Account Address", key: "addr" }, { label: "Total Balance", key: "bal" },
                            { label: "Token Amount", key: "tokAmt" }, { label: "Account Name", key: "homeName" }
                          ].map(f => (
                            <div key={f.key} className="space-y-1.5">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{f.label}</label>
                              <input value={(data as any)[f.key]} onChange={e => setData({...data, [f.key]: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors" />
                            </div>
                          ))}
                        </div>
                        <div className="p-4 pb-8"><Button onClick={handleSave} className="w-full h-12 rounded-xl bg-[#AB9FF2] text-black font-bold">Save Changes</Button></div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* MAIN CONTENT AREA with Tabs */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex-1 overflow-y-auto">
                      {activeTab === "home" && (
                        <div className="p-4 flex flex-col">
                          <header className="h-12 flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setScreen("s1")}>
                              <div className="w-8 h-8 bg-[#2A2A2A] rounded-full flex items-center justify-center font-bold text-sm tracking-normal">{data.badgeCount}</div>
                              <span className="font-bold text-[17px] tracking-normal">{data.homeName}</span><ChevronDown className="w-4 h-4 text-zinc-500" />
                            </div>
                            <div className="flex items-center gap-4 text-zinc-500"><Search className="w-6 h-6" /><Maximize2 className="w-6 h-6" /></div>
                          </header>

                          <div className="flex flex-col items-center mb-8">
                            <div className="text-[48px] font-extrabold tracking-tighter mb-1">${data.bal}</div>
                            <div className="flex items-center gap-2 font-bold text-[17px]">
                              <span className={data.delta.startsWith('-') ? "text-[#FF4D4D]" : "text-[#00FFA3]"}>{data.delta.startsWith('-') ? "-$" : "+$"}{data.delta.replace('-', '')}</span>
                              <Badge className={`rounded-lg px-2 py-0.5 border-none font-bold text-[13px] ${data.pct.startsWith('-') ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"}`}>{data.pct}%</Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-4 gap-3 mb-8">
                            {[ {i:<QrCode/>,l:'Receive'}, {i:<Send/>,l:'Send'}, {i:<Repeat/>,l:'Swap'}, {i:<DollarSign/>,l:'Buy'} ].map((a, i) => (
                              <div key={i} className="bg-[#1C1C1E] aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#252528] active:scale-90 transition-transform">
                                <div className="text-[#AB9FF2]">{a.i}</div><span className="text-[12px] font-bold text-zinc-400">{a.l}</span>
                              </div>
                            ))}
                          </div>

                          {showBanner && (
                            <div className="bg-[#1C1C1E] rounded-2xl p-4 mb-4 flex items-center gap-4 relative border border-white/5">
                              <div className="w-11 h-11 bg-zinc-800 rounded-lg flex items-center justify-center text-green-400"><Zap className="w-6 h-6"/></div>
                              <p className="text-[14px] font-bold leading-snug pr-4">{data.banner}</p>
                              <X onClick={() => setShowBanner(false)} className="absolute top-2 right-2 text-zinc-500 w-4 h-4 cursor-pointer" />
                            </div>
                          )}

                          <div className="bg-[#1C1C1E] rounded-[20px] p-4 flex items-center justify-between border border-white/5 hover:bg-[#252528] transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-full bg-black flex items-center justify-center text-green-400 border border-white/5"><Zap className="w-6 h-6" /></div>
                              <div className="flex flex-col"><span className="font-bold text-[17px]">{data.tokName}</span><span className="text-[13.5px] text-zinc-500 font-bold">{data.tokAmt}</span></div>
                            </div>
                            <div className="flex flex-col items-end"><span className="font-bold text-[17px]">${data.tokUsd}</span><span className={`text-[13.5px] font-bold ${data.tokChg.startsWith('-') ? "text-red-400" : "text-green-400"}`}>{data.tokChg.startsWith('-') ? "-$" : "+$"}{data.tokChg.replace('-', '')}</span></div>
                          </div>
                        </div>
                      )}
                      {activeTab !== "home" && <div className="flex-1 flex items-center justify-center text-zinc-500 font-bold text-sm">No data available in this mock section</div>}
                    </div>

                    <nav className="h-16 bg-[#0F0F0F] border-t border-white/5 flex items-center justify-around">
                      {[
                        { id: "home", icon: <Home className={activeTab === "home" ? "fill-current" : ""} /> },
                        { id: "grid", icon: <LayoutGrid /> },
                        { id: "swap", icon: <ArrowRightLeft /> },
                        { id: "activity", icon: <Clock /> },
                        { id: "search", icon: <Search /> }
                      ].map(t => (
                        <div key={t.id} onClick={() => setActiveTab(t.id)} className={`flex-1 flex justify-center cursor-pointer transition-colors ${activeTab === t.id ? "text-[#AB9FF2]" : "text-zinc-500 hover:text-zinc-300"}`}>
                          <div className="p-2">{t.icon}</div>
                        </div>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>

              <div className="max-w-md space-y-6">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader><CardTitle className="text-xl text-indigo-300 flex items-center gap-2"><Zap className="w-5 h-5" /> Mockup Tools</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex gap-4">
                      <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 shrink-0"><Pencil className="w-4 h-4"/></div>
                      <div><p className="font-bold text-sm">Visual Editor</p><p className="text-xs text-zinc-500 leading-relaxed">Change balances and account names instantly for UI testing.</p></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {view === "instructions" && (
            <motion.div key="instructions" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-3xl mx-auto">
              <Card className="bg-zinc-900 border-zinc-800 shadow-2xl">
                <CardHeader className="pb-8">
                  <CardTitle className="text-2xl font-bold flex items-center gap-3"><Chrome className="w-8 h-8 text-indigo-400" /> Installation Guide</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {["Open chrome://extensions", "Enable 'Developer mode'", "Click 'Load unpacked' and select public/extension folder"].map((step, i) => (
                    <div key={i} className="flex gap-6">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-black text-indigo-400 shrink-0">{i+1}</div>
                      <p className="text-zinc-400 text-lg pt-1">{step}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {view === "code" && (
            <motion.div key="code" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-5xl mx-auto">
              <Tabs defaultValue="manifest" className="w-full">
                <TabsList className="bg-zinc-900 border border-zinc-800 mb-4">
                  <TabsTrigger value="manifest">manifest.json</TabsTrigger>
                  <TabsTrigger value="html">popup.html</TabsTrigger>
                  <TabsTrigger value="js">popup.js</TabsTrigger>
                </TabsList>
                <TabsContent value="manifest"><pre className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 font-mono text-sm text-indigo-300 overflow-x-auto"><code>{FILES.manifest}</code></pre></TabsContent>
                <TabsContent value="html"><pre className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 font-mono text-sm text-indigo-300 overflow-x-auto"><code>{FILES.popupHtml}</code></pre></TabsContent>
                <TabsContent value="js"><pre className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 font-mono text-sm text-indigo-300 overflow-x-auto"><code>{FILES.popupJs}</code></pre></TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <footer className="py-12 text-center text-zinc-600 text-xs font-medium">Built with ❤️ for Orchid Developers</footer>
    </div>
  );
}
