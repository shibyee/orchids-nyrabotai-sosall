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
  QrCode,
  Usb
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
        * { 
            box-sizing: border-box; 
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        html, body {
            margin: 0;
            padding: 0;
            width: 375px;
            height: 600px;
            background-color: var(--bg-color);
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            overflow: hidden;
        }
        body {
            display: flex;
            flex-direction: column;
            position: relative;
        }
        .screen {
            position: absolute;
            inset: 0;
            display: none;
            flex-direction: column;
            background: var(--bg-color);
            z-index: 10;
        }
        .screen.active { display: flex; }
        
        .main-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .tab-content {
            flex: 1;
            display: none;
            flex-direction: column;
            overflow-y: auto;
        }
        .tab-content.active { display: flex; }

        header {
            height: 64px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 16px;
            shrink: 0;
        }
        .header-title { font-weight: bold; font-size: 19px; }

        .list-container {
            flex: 1;
            overflow-y: auto;
            padding: 8px 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .list-item {
            background: var(--card-bg);
            border-radius: 20px;
            padding: 18px 20px;
            display: flex;
            align-items: center;
            gap: 16px;
            border: 1px solid rgba(255,255,255,0.03);
            cursor: pointer;
            text-align: left;
            width: 100%;
            color: white;
            transition: background 0.2s;
        }
        .list-item:active { transform: scale(0.98); background: #252528; }
        .item-icon {
            width: 42px;
            height: 42px;
            background: #2C2C2E;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            shrink: 0;
            color: var(--text-zinc-400);
        }
        .item-text h4 { margin: 0; font-size: 16px; font-weight: bold; }
        .item-text p { margin: 2px 0 0; font-size: 13px; color: var(--text-zinc-500); }

        .btn-close-large {
            margin: 16px;
            height: 54px;
            background: #1C1C1E;
            color: white;
            border: none;
            border-radius: 24px;
            font-weight: bold;
            font-size: 17px;
            cursor: pointer;
        }

        .home-header { padding: 16px 16px 8px; display: flex; justify-content: space-between; align-items: center; }
        .account-badge {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            padding: 6px 10px;
            border-radius: 20px;
            background: rgba(255,255,255,0.03);
            transition: background 0.2s;
        }
        .account-badge:hover { background: rgba(255,255,255,0.06); }
        .badge-circle {
            width: 24px;
            height: 24px;
            background: #2A2A2A;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 12px;
            color: white;
        }
        .bal-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 10px 0 25px;
        }
        .total-bal { 
            font-size: 48px; 
            font-weight: 800; 
            letter-spacing: -1px; 
            margin-bottom: 4px;
        }
        .chg-row { display: flex; align-items: center; gap: 8px; font-size: 17px; font-weight: 600; }
        .pct-badge {
            padding: 2px 8px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: bold;
            background: rgba(255, 77, 77, 0.15);
            color: var(--down-color);
        }
        .pct-badge.up { background: rgba(0, 255, 163, 0.15); color: var(--up-color); }

        .actions-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            padding: 0 16px;
            margin-bottom: 24px;
        }
        .action-btn {
            aspect-ratio: 1;
            background: #1C1C1E;
            border-radius: 18px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 6px;
            font-size: 12px;
            font-weight: bold;
            color: var(--text-zinc-400);
            cursor: pointer;
        }
        .action-btn:hover { background: #252528; }

        .banner-row {
            margin: 0 16px 16px;
            background: #1C1C1E;
            border-radius: 18px;
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 16px;
            position: relative;
            border: 1px solid rgba(255,255,255,0.03);
        }
        .banner-icon { width: 44px; height: 44px; border-radius: 10px; shrink: 0; }
        .banner-text { font-size: 14px; font-weight: 700; line-height: 1.4; flex: 1; }
        .banner-close { position: absolute; top: 8px; right: 12px; color: var(--text-zinc-500); cursor: pointer; }

        .token-row {
            margin: 0 16px;
            background: #1C1C1E;
            border-radius: 20px;
            padding: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border: 1px solid rgba(255,255,255,0.03);
            cursor: pointer;
        }
        .token-info { display: flex; align-items: center; gap: 12px; }
        .token-icon { width: 42px; height: 42px; border-radius: 50%; background: black; display: flex; align-items: center; justify-content: center; }
        .token-vals { text-align: right; display: flex; flex-direction: column; }
        
        .manage-tokens {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-top: 24px;
            padding: 10px;
            cursor: pointer;
            opacity: 0.6;
        }
        .manage-tokens span { font-weight: bold; color: var(--text-zinc-500); font-size: 15px; }

        nav {
            height: 72px;
            border-top: 1px solid rgba(255,255,255,0.05);
            display: flex;
            justify-content: space-around;
            align-items: center;
            background: #0F0F0F;
            shrink: 0;
            padding-bottom: 8px;
        }
        .nav-item { 
            flex: 1;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer; 
            color: #3F3F46; 
            position: relative;
        }
        .nav-item.active { color: #AB9FF2; }
        .nav-item.active::after {
            content: "";
            position: absolute;
            top: 0;
            left: 20%;
            right: 20%;
            height: 2px;
            background: #AB9FF2;
            border-radius: 2px;
        }

        .content-scroll {
            flex: 1;
            overflow-y: auto;
            padding: 0 20px 24px;
        }
        .field-group { margin-bottom: 20px; }
        .field-group label {
            display: block;
            font-size: 11px;
            font-weight: 700;
            color: var(--text-zinc-500);
            text-transform: uppercase;
            margin-bottom: 8px;
            letter-spacing: 0.8px;
        }
        .field-group input, .field-group textarea, .field-group select {
            width: 100%;
            background: var(--input-bg);
            border: 1px solid #1A1A1A;
            border-radius: 12px;
            padding: 14px;
            color: white;
            font-size: 15px;
            font-weight: 600;
        }
        .field-group input:focus, .field-group textarea:focus { border-color: #333; outline: none; }
        .primary-btn {
            width: 100%;
            height: 52px;
            background: var(--accent);
            color: black;
            border: none;
            border-radius: 14px;
            font-weight: 800;
            cursor: pointer;
            font-size: 16px;
            margin-top: 10px;
        }
        .primary-btn:active { transform: scale(0.98); }

        .profile-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 20px 0 30px;
            position: relative;
        }
        .profile-circle {
            width: 90px;
            height: 90px;
            background: #252528;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            font-weight: bold;
            color: white;
            border: 2px solid #1A1A1A;
        }
        .profile-edit {
            position: absolute;
            bottom: 0;
            right: calc(50% - 45px);
            width: 28px;
            height: 28px;
            background: #2C2C2E;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid var(--bg-color);
        }

        .addr-display {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 20px;
            padding: 10px 0;
        }
        .addr-display span:first-child { color: white; font-weight: 700; font-size: 14px; }
        .addr-display span:last-child { color: var(--text-zinc-500); font-family: monospace; font-size: 14px; }

        .placeholder-tab {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-zinc-500);
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div id="main-layout" class="main-container">
        <!-- Tab 1: Home -->
        <div id="tab-home" class="tab-content active">
            <div class="home-header">
                <div class="account-badge" id="badge-account">
                    <div class="badge-circle" id="disp-badgeCount">3</div>
                    <span style="font-weight:700;font-size:17px" id="disp-homeName">111</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#71717A" stroke-width="3"><path d="M7 10l5 5 5-5"/></svg>
                </div>
                <div style="display:flex;gap:18px;color:#71717A">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                </div>
            </div>

            <div class="bal-section">
                <div class="total-bal">$<span id="disp-bal">1.22</span></div>
                <div class="chg-row">
                    <span id="disp-delta-color" style="color:var(--down-color)"><span id="disp-delta-sign">-$</span><span id="disp-delta">0.0274</span></span>
                    <div id="disp-pct-badge" class="pct-badge"><span id="disp-pct-sign">-</span><span id="disp-pct">2.21</span>%</div>
                </div>
            </div>

            <div class="actions-grid">
                <div class="action-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                    <span>Receive</span>
                </div>
                <div class="action-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.2"><line x1="22" y1="2" x2="11" y2="13"/><polyline points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    <span>Send</span>
                </div>
                <div class="action-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                    <span>Swap</span>
                </div>
                <div class="action-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    <span>Buy</span>
                </div>
            </div>

            <div class="banner-row" id="banner">
                <div style="background:#2A2A2A;border-radius:12px;width:44px;height:44px;display:flex;align-items:center;justify-content:center;shrink:0">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#00FFA3" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                </div>
                <div class="banner-text" id="disp-banner">Meet Phantom Terminal, your new home for desktop trading</div>
                <div class="banner-close" id="banner-close"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6L6 18M6 6l12 12"/></svg></div>
            </div>

            <div class="token-row">
                <div class="token-info">
                    <div class="token-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00FFA3" stroke-width="2.5"><path d="M2 17L12 22L22 17M2 12L12 17L22 12M12 2L2 7L12 12L22 7L12 2Z"/></svg>
                    </div>
                    <div style="display:flex;flex-direction:column">
                        <span style="font-weight:700;font-size:17px" id="disp-tokName">Solana</span>
                        <span style="font-size:13.5px;color:var(--text-zinc-500);font-weight:600" id="disp-tokAmt">0.01 SOL</span>
                    </div>
                </div>
                <div class="token-vals">
                    <span style="font-weight:700;font-size:17px">$<span id="disp-tokUsd">1.22</span></span>
                    <span style="font-size:13.5px;color:var(--down-color);font-weight:600" id="disp-tokChg-color"><span id="disp-tokChg-sign">-$</span><span id="disp-tokChg">0.03</span></span>
                </div>
            </div>

            <div class="manage-tokens">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--text-zinc-500)"><line x1="4" y1="8" x2="20" y2="8" /><line x1="4" y1="16" x2="20" y2="16" /><circle cx="15" cy="8" r="2" fill="#0F0F0F" stroke="currentColor" stroke-width="3" /><circle cx="9" cy="16" r="2" fill="#0F0F0F" stroke="currentColor" stroke-width="3" /></svg>
                <span id="disp-manage">Manage token list</span>
            </div>
        </div>

        <!-- Tab 2: Grid -->
        <div id="tab-grid" class="tab-content">
            <div class="placeholder-tab">Your Collectibles will appear here</div>
        </div>
        <!-- Tab 3: Swap -->
        <div id="tab-swap" class="tab-content">
            <div class="placeholder-tab">Swap assets instantly</div>
        </div>
        <!-- Tab 4: Activity -->
        <div id="tab-activity" class="tab-content">
            <div class="placeholder-tab">Recent activity will show up here</div>
        </div>
        <!-- Tab 5: Search -->
        <div id="tab-search" class="tab-content">
            <div class="placeholder-tab">Search for tokens or dApps</div>
        </div>

        <nav id="bottom-nav">
            <div class="nav-item active" data-tab="tab-home">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            </div>
            <div class="nav-item" data-tab="tab-grid">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            </div>
            <div class="nav-item" data-tab="tab-swap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg>
            </div>
            <div class="nav-item" data-tab="tab-activity">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div class="nav-item" data-tab="tab-search">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
        </nav>
    </div>

    <!-- Screen 1: Add Account -->
    <div id="s1" class="screen">
        <header>
            <button id="btn-s1-close" style="background:none;border:none;color:white;cursor:pointer;padding:8px"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
            <span class="header-title">Add Account</span>
            <div style="width:40px"></div>
        </header>
        <div class="list-container">
            <div class="list-item" id="item-create-account">
                <div class="item-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 5v14M5 12h14"/></svg>
                </div>
                <div class="item-text">
                    <h4>Create New Account</h4>
                    <p>Add a new multi-chain account</p>
                </div>
            </div>
            <div class="list-item" id="item-hardware">
                <div class="item-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M12 18h.01"/></svg>
                </div>
                <div class="item-text">
                    <h4>Connect Hardware Wallet</h4>
                    <p>Use your Ledger hardware wallet</p>
                </div>
            </div>
            <div class="list-item" id="item-import-phrase">
                <div class="item-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div class="item-text">
                    <h4>Import Recovery Phrase</h4>
                    <p>Import accounts from another wallet</p>
                </div>
            </div>
            <div class="list-item" id="item-import-pk">
                <div class="item-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </div>
                <div class="item-text">
                    <h4>Import Private Key</h4>
                    <p>Import a single-chain account</p>
                </div>
            </div>
            <div class="list-item" id="item-watch">
                <div class="item-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </div>
                <div class="item-text">
                    <h4>Watch Address</h4>
                    <p>Track any public wallet address</p>
                </div>
            </div>
        </div>
        <button class="btn-close-large" id="btn-s1-close-bottom">Close</button>
    </div>

    <!-- Screen: Import Private Key -->
    <div id="s-import-pk" class="screen">
        <header>
            <button class="btn-back" style="background:none;border:none;color:white;cursor:pointer;padding:8px" onclick="showScreen('s1')"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button>
            <span class="header-title">Import Private Key</span>
            <div style="width:40px"></div>
        </header>
        <div class="content-scroll">
            <div class="profile-section">
                <div class="profile-circle">P</div>
                <div class="profile-edit"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></div>
            </div>
            <div class="field-group">
                <select id="import-network">
                    <option value="solana">Solana</option>
                </select>
            </div>
            <div class="field-group">
                <input type="text" id="import-name" value="1111">
            </div>
            <div class="field-group">
                <textarea id="import-key" placeholder="Private key" rows="5" style="resize:none;font-family:monospace;-webkit-text-security:disc"></textarea>
            </div>
            <div class="addr-display">
                <span>Account Address</span>
                <span id="import-addr-disp">7fXB...Hin7</span>
            </div>
            <button class="primary-btn" id="btn-import-pk-action">Import</button>
        </div>
    </div>

    <!-- Screen: Editor (Mock Data) -->
    <div id="s-editor" class="screen">
        <header>
            <button id="btn-editor-back" style="background:none;border:none;color:white;cursor:pointer;padding:8px"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button>
            <span class="header-title">Edit Mock Data</span>
            <div style="width:40px"></div>
        </header>
        
        <div class="content-scroll">
            <div class="field-group">
                <label>Account Address</label>
                <input type="text" id="edit-addr">
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                <div class="field-group">
                    <label>Account Name</label>
                    <input type="text" id="edit-homeName">
                </div>
                <div class="field-group">
                    <label>Badge Count</label>
                    <input type="text" id="edit-badgeCount">
                </div>
            </div>
            <div class="field-group">
                <label>Total Balance</label>
                <input type="text" id="edit-bal">
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                <div class="field-group">
                    <label>Change $</label>
                    <input type="text" id="edit-delta">
                </div>
                <div class="field-group">
                    <label>Change %</label>
                    <input type="text" id="edit-pct">
                </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                <div class="field-group">
                    <label>Token Name</label>
                    <input type="text" id="edit-tokName">
                </div>
                <div class="field-group">
                    <label>Token Amount</label>
                    <input type="text" id="edit-tokAmt">
                </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                <div class="field-group">
                    <label>Token USD</label>
                    <input type="text" id="edit-tokUsd">
                </div>
                <div class="field-group">
                    <label>Token Chg</label>
                    <input type="text" id="edit-tokChg">
                </div>
            </div>
            <div class="field-group">
                <label>Banner Text</label>
                <textarea id="edit-banner" rows="3" style="resize:none"></textarea>
            </div>

            <button class="primary-btn" id="btn-save">Save Changes</button>
        </div>
    </div>

    <script src="popup.js"></script>
</body>
</html>`,
  popupJs: `const DEFAULTS = {
    homeName: "111",
    bal: "1.22",
    delta: "-0.0274",
    pct: "-2.21",
    tokAmt: "0.01 SOL",
    tokUsd: "1.22",
    tokChg: "-0.03",
    badgeCount: "3",
    addr: "7fXB...Hin7",
    banner: "Meet Phantom Terminal, your new home for desktop trading",
    tokName: "Solana"
};

let currentData = { ...DEFAULTS };

function updateUI() {
    const data = currentData;
    
    // Display updates
    document.getElementById('disp-homeName').textContent = data.homeName;
    document.getElementById('disp-bal').textContent = data.bal;
    document.getElementById('disp-banner').textContent = data.banner;
    document.getElementById('disp-badgeCount').textContent = data.badgeCount;
    document.getElementById('disp-tokName').textContent = data.tokName;
    
    // Delta
    const deltaStr = String(data.delta);
    const deltaVal = deltaStr.replace('-', '').replace('+', '');
    const isNegDelta = deltaStr.startsWith('-');
    document.getElementById('disp-delta').textContent = deltaVal;
    document.getElementById('disp-delta-sign').textContent = isNegDelta ? "-$" : "+$";
    document.getElementById('disp-delta-color').style.color = isNegDelta ? "var(--down-color)" : "var(--up-color)";
    
    // Pct
    const pctStr = String(data.pct);
    const pctVal = pctStr.replace('-', '').replace('+', '');
    const isNegPct = pctStr.startsWith('-');
    document.getElementById('disp-pct').textContent = pctVal;
    document.getElementById('disp-pct-sign').textContent = isNegPct ? "-" : "+";
    document.getElementById('disp-pct-badge').className = "pct-badge " + (isNegPct ? "" : "up");
    
    // Token
    document.getElementById('disp-tokAmt').textContent = data.tokAmt;
    document.getElementById('disp-tokUsd').textContent = data.tokUsd;
    
    const chgStr = String(data.tokChg);
    const chgVal = chgStr.replace('-', '').replace('+', '');
    const isNegChg = chgStr.startsWith('-');
    document.getElementById('disp-tokChg').textContent = chgVal;
    document.getElementById('disp-tokChg-sign').textContent = isNegChg ? "-$" : "+$";
    document.getElementById('disp-tokChg-color').style.color = isNegChg ? "var(--down-color)" : "var(--up-color)";

    // Import PK screen address disp
    if (document.getElementById('import-addr-disp')) {
        document.getElementById('import-addr-disp').textContent = data.addr;
    }
}

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    if (id) {
        const target = document.getElementById(id);
        if (target) target.classList.add('active');
    }
}

function switchTab(tabId) {
    showScreen(null);
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    const tab = document.getElementById(tabId);
    if (tab) tab.classList.add('active');
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    const navItem = document.querySelector(\`[data-tab="\${tabId}"]\`);
    if (navItem) navItem.classList.add('active');
}

function openEditor() {
    document.getElementById('edit-addr').value = currentData.addr;
    document.getElementById('edit-bal').value = currentData.bal;
    document.getElementById('edit-delta').value = currentData.delta;
    document.getElementById('edit-pct').value = currentData.pct;
    document.getElementById('edit-tokAmt').value = currentData.tokAmt;
    document.getElementById('edit-tokUsd').value = currentData.tokUsd;
    document.getElementById('edit-tokChg').value = currentData.tokChg;
    document.getElementById('edit-homeName').value = currentData.homeName;
    document.getElementById('edit-badgeCount').value = currentData.badgeCount;
    document.getElementById('edit-tokName').value = currentData.tokName;
    document.getElementById('edit-banner').value = currentData.banner;
    showScreen('s-editor');
}

function saveData() {
    currentData = {
        ...currentData,
        addr: document.getElementById('edit-addr').value,
        bal: document.getElementById('edit-bal').value,
        delta: document.getElementById('edit-delta').value,
        pct: document.getElementById('edit-pct').value,
        tokAmt: document.getElementById('edit-tokAmt').value,
        tokUsd: document.getElementById('edit-tokUsd').value,
        tokChg: document.getElementById('edit-tokChg').value,
        homeName: document.getElementById('edit-homeName').value,
        badgeCount: document.getElementById('edit-badgeCount').value,
        tokName: document.getElementById('edit-tokName').value,
        banner: document.getElementById('edit-banner').value,
    };
    
    updateUI();
    showScreen(null);
    switchTab('tab-home');
    
    if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({ mockData: currentData });
    } else {
        localStorage.setItem('phantom_mock_data', JSON.stringify(currentData));
    }
}

window.onload = () => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get(['mockData'], (res) => {
            if (res.mockData) {
                currentData = { ...DEFAULTS, ...res.mockData };
                updateUI();
            }
        });
    } else {
        const saved = localStorage.getItem('phantom_mock_data');
        if (saved) {
            currentData = { ...DEFAULTS, ...JSON.parse(saved) };
            updateUI();
        }
    }

    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            switchTab(item.getAttribute('data-tab'));
        });
    });

    document.getElementById('btn-s1-close')?.addEventListener('click', () => showScreen(null));
    document.getElementById('btn-s1-close-bottom')?.addEventListener('click', () => showScreen(null));
    document.getElementById('badge-account')?.addEventListener('click', () => showScreen('s1'));
    
    document.getElementById('item-import-phrase')?.addEventListener('click', () => openEditor());
    document.getElementById('item-import-pk')?.addEventListener('click', () => showScreen('s-import-pk'));
    document.getElementById('btn-import-pk-action')?.addEventListener('click', () => {
        showScreen(null);
        switchTab('tab-home');
    });

    document.getElementById('banner-close')?.addEventListener('click', (e) => {
        document.getElementById('banner').style.display = 'none';
    });
    document.getElementById('btn-editor-back')?.addEventListener('click', () => showScreen('s1'));
    document.getElementById('btn-save')?.addEventListener('click', () => saveData());

    updateUI();
};`
};

export default function ShowcasePage() {
  const [data, setData] = useState(DEFAULTS);
  const [screen, setScreen] = useState("s3"); // Overlay screens: s1, s2, editor, s3(home-base)
  const [activeTab, setActiveTab] = useState("home");
  const [view, setView] = useState("preview");
  const [privateKey, setPrivateKey] = useState("");
  const [showBanner, setShowBanner] = useState(true);

  const handleSave = () => {
    setScreen("s3");
    toast.success("Mock data updated!");
  };

  const copyAddr = () => {
    navigator.clipboard.writeText(data.addr);
    toast.info("Address copied to clipboard");
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
              <p className="text-xs text-zinc-500 font-medium">Extension Preview</p>
            </div>
          </div>
          <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-auto">
            <TabsList className="bg-zinc-800/50 border border-zinc-700">
              <TabsTrigger value="preview" className="data-[state=active]:bg-zinc-700"><Eye className="w-4 h-4 mr-2" /> Preview</TabsTrigger>
              <TabsTrigger value="instructions" className="data-[state=active]:bg-zinc-700"><Settings className="w-4 h-4 mr-2" /> Install</TabsTrigger>
              <TabsTrigger value="code" className="data-[state=active]:bg-zinc-700"><Code2 className="w-4 h-4 mr-2" /> Code</TabsTrigger>
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
                            { title: "Create New Account", sub: "Add a new multi-chain account", icon: <Plus className="w-5 h-5" />, onClick: () => toast.info("Create new account") },
                            { title: "Connect Hardware Wallet", sub: "Use your Ledger hardware wallet", icon: <Usb className="w-5 h-5" />, onClick: () => toast.info("Connect hardware wallet") },
                            { title: "Import Recovery Phrase", sub: "Import accounts from another wallet", icon: <File className="w-5 h-5" />, onClick: () => setScreen("editor") },
                            { title: "Import Private Key", sub: "Import a single-chain account", icon: <ArrowDownToLine className="w-5 h-5" />, onClick: () => setScreen("s2") },
                            { title: "Watch Address", sub: "Track any public wallet address", icon: <Eye className="w-5 h-5" />, onClick: () => toast.info("Watch address") },
                          ].map((item, i) => (
                            <button key={i} onClick={item.onClick} className="w-full bg-[#1C1C1E] p-4 rounded-[22px] flex items-center gap-4 text-left border border-white/5 active:scale-95 transition-all">
                              <div className="w-11 h-11 rounded-full bg-[#2C2C2E] flex items-center justify-center shrink-0 text-zinc-400">{item.icon}</div>
                              <div className="flex flex-col">
                                <p className="font-bold text-[17px] leading-tight">{item.title}</p>
                                <p className="text-[14px] text-zinc-500 font-medium leading-tight">{item.sub}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                        <div className="p-4 pb-8"><Button onClick={() => setScreen("s3")} className="w-full h-12 rounded-[22px] bg-[#1C1C1E] font-bold">Close</Button></div>
                      </motion.div>
                    )}

                    {screen === "s2" && (
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
                               <div className="bg-[#1C1C1E] h-12 rounded-xl px-4 flex items-center justify-between border border-white/5"><span className="font-bold">{data.chain}</span><ChevronDown className="w-4 h-4 text-zinc-500" /></div>
                                <input value={data.name} onChange={e => setData({...data, name: e.target.value})} className="w-full bg-[#1C1C1E] h-12 rounded-xl px-4 border border-white/5 font-bold" placeholder="Name" />
                                <textarea value={privateKey} onChange={e => setPrivateKey(e.target.value)} className="w-full bg-[#1C1C1E] p-4 rounded-xl border border-white/5 h-28 font-mono text-sm" placeholder="Private key" style={{ WebkitTextSecurity: 'disc' } as any} />
                                <div className="flex justify-between items-center py-2 px-1">
                                  <span className="font-bold text-sm">Account Address</span>
                                  <span className="text-zinc-500 font-mono text-sm">{data.addr}</span>
                                </div>
                              </div>
                            </div>
                         </div>
                         <div className="p-4 pb-8"><Button disabled={!privateKey} onClick={() => setScreen("s3")} className="w-full h-12 rounded-xl bg-[#AB9FF2] text-black font-bold">Import</Button></div>

                      </motion.div>
                    )}

                    {screen === "editor" && (
                      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25 }} className="absolute inset-0 bg-[#0F0F0F] z-50 flex flex-col">
                        <header className="h-14 flex items-center justify-between px-4">
                          <button onClick={() => setScreen("s1")} className="p-2 text-zinc-100"><ArrowLeft className="w-6 h-6" /></button>
                          <div className="font-bold text-[17px]">Edit Mock Data</div>
                          <div className="w-10" />
                        </header>
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                          {[
                            { label: "Address", key: "addr" }, 
                            { label: "Account Name", key: "homeName" },
                            { label: "Badge Count", key: "badgeCount" },
                            { label: "Total Balance", key: "bal" },
                            { label: "Change $", key: "delta" },
                            { label: "Change %", key: "pct" },
                            { label: "Token Name", key: "tokName" },
                            { label: "Token Amount", key: "tokAmt" },
                            { label: "Token USD", key: "tokUsd" },
                            { label: "Token Change", key: "tokChg" },
                            { label: "Banner Text", key: "banner" }
                          ].map(f => (
                            <div key={f.key} className="space-y-1.5">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase">{f.label}</label>
                              <input value={(data as any)[f.key]} onChange={e => setData({...data, [f.key]: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 font-mono text-sm" />
                            </div>
                          ))}
                        </div>
                        <div className="p-4 pb-8"><Button onClick={handleSave} className="w-full h-12 rounded-xl bg-[#AB9FF2] text-black font-bold">Save Changes</Button></div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* BASE TABS */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex-1 overflow-y-auto">
                      {activeTab === "home" && (
                        <div className="p-4 flex flex-col">
                          <header className="h-12 flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setScreen("s1")}>
                              <div className="w-8 h-8 bg-[#2A2A2A] rounded-full flex items-center justify-center font-bold text-sm">{data.badgeCount}</div>
                              <span className="font-bold text-[17px]">{data.homeName}</span><ChevronDown className="w-4 h-4 text-zinc-500" />
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
                            {[{i:<QrCode/>,l:'Receive'}, {i:<Send/>,l:'Send'}, {i:<Repeat/>,l:'Swap'}, {i:<DollarSign/>,l:'Buy'}].map((a, i) => (
                              <div key={i} className="bg-[#1C1C1E] aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer active:scale-90 transition-transform">
                                <div className="text-[#AB9FF2]">{a.i}</div><span className="text-[12px] font-bold text-zinc-400">{a.l}</span>
                              </div>
                            ))}
                          </div>
                          {showBanner && (
                            <div className="bg-[#1C1C1E] rounded-2xl p-4 mb-4 flex items-center gap-4 relative border border-white/5">
                              <div className="w-11 h-11 bg-zinc-800 rounded-lg flex items-center justify-center text-green-400"><MonitorIcon className="w-6 h-6"/></div>
                              <p className="text-[14px] font-bold leading-snug pr-4">{data.banner}</p>
                              <X onClick={() => setShowBanner(false)} className="absolute top-2 right-2 text-zinc-500 w-4 h-4 cursor-pointer" />
                            </div>
                          )}
                          <div className="bg-[#1C1C1E] rounded-[20px] p-4 flex items-center justify-between border border-white/5 active:bg-[#252528] transition-colors cursor-pointer" onClick={copyAddr}>
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

function MonitorIcon(props: any) {
  return (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
  );
}
