"use client";

import React, { useState } from "react";
import { 
  Store, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  Mail, 
  Lock, 
  Save, 
  Bell, 
  RefreshCw,
  Percent
} from "lucide-react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  // 1. General Profile State Matrix
  const [storeName, setStoreName] = useState("Vogue & Co. Apparel");
  const [supportEmail, setSupportEmail] = useState("support@vogueapparel.com");
  const [currency, setCurrency] = useState("USD");

  // 2. Logistics & Operational Gateway Rules
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(75);
  const [flatShippingRate, setFlatShippingRate] = useState(5.99);
  const [enableCod, setEnableCod] = useState(true);
  const [enableOnlineGateways, setEnableOnlineGateways] = useState(true);
  const [taxPercentage, setTaxPercentage] = useState(8.5);

  // 3. Inventory & Order Management Policy
  const [lowStockAlertThreshold, setLowStockAlertThreshold] = useState(5);
  const [allowBackorders, setAllowBackorders] = useState(false);

  // 4. Admin Security Credentials State (Required Section)
  const [accountEmail, setAccountEmail] = useState("admin@vogueapparel.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Handler for global configuration modules
  const handleSaveConfig = (e: React.FormEvent, moduleName: string) => {
    e.preventDefault();
    toast.success(`${moduleName} parameters synced and updated successfully.`);
  };

  // Handler for secure credentials update
  const handleUpdateSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword || confirmPassword) {
      if (!currentPassword) {
        toast.error("Verification error: Current password parameter is required.");
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error("Validation error: New password fields do not match.");
        return;
      }
      if (newPassword.length < 8) {
        toast.error("Security criteria unmet: New password must be at least 8 characters long.");
        return;
      }
    }

    toast.success("Security credentials and login node refreshed safely.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-8 max-w-5xl">
      
      {/* Upper Title Header Component Block Layout */}
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900">System Control Settings</h1>
        <p className="text-xs text-gray-500 mt-0.5 font-light">
          Manage operational configurations, logistic limits, tax rules, currency targets, and core administrative verification credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column Strategy Index Navigation Markers */}
        <div className="md:col-span-1 space-y-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Configuration Indexes</p>
          <nav className="space-y-1 text-xs text-gray-600 font-medium">
            <a href="#store-profile" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 hover:text-black transition-all">
              <Store className="w-4 h-4 text-gray-400" /> Store Profile & Core
            </a>
            <a href="#logistics-gateways" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 hover:text-black transition-all">
              <CreditCard className="w-4 h-4 text-gray-400" /> Payment & Logistics
            </a>
            <a href="#inventory-policy" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 hover:text-black transition-all">
              <RefreshCw className="w-4 h-4 text-gray-400" /> Catalog & Stock Policy
            </a>
            <a href="#account-security" className="flex items-center gap-2 p-2 rounded bg-gray-900 text-white font-semibold shadow-xs transition-all">
              <ShieldCheck className="w-4 h-4 text-gray-300" /> Login Node Security
            </a>
          </nav>
        </div>

        {/* Right Configuration Card Stack Form Sheets */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Module 1: Core Profile Info */}
          <form id="store-profile" onSubmit={(e) => handleSaveConfig(e, "Store Profile")} className="border border-gray-200 rounded bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <Store className="w-4 h-4 text-gray-900" />
              <h3 className="text-sm font-medium text-gray-900">Store Profile</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-gray-600 block font-medium">Store Display Name</label>
                <input 
                  type="text" 
                  value={storeName} 
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 bg-white outline-none focus:border-black transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-600 block font-medium">Customer Support Email</label>
                <input 
                  type="email" 
                  value={supportEmail} 
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 bg-white outline-none focus:border-black transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-600 block font-medium">Default Settlement Currency</label>
                <select 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full border border-gray-300 bg-white rounded px-3 py-1.5 outline-none focus:border-black transition-colors"
                >
                  <option value="USD">USD ($) - United States Dollar</option>
                  <option value="EUR">EUR (€) - Euro Union currency</option>
                  <option value="NPR">NPR (Rs.) - Nepalese Rupee</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button type="submit" className="flex items-center gap-1.5 bg-gray-900 hover:bg-black text-white text-[11px] font-medium px-4 py-1.5 rounded transition-all">
                <Save className="w-3.5 h-3.5" /> Save Changes
              </button>
            </div>
          </form>

          {/* Module 2: Payments & Retail Logistics */}
          <form id="logistics-gateways" onSubmit={(e) => handleSaveConfig(e, "Payment & Logistics")} className="border border-gray-200 rounded bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <Truck className="w-4 h-4 text-gray-900" />
              <h3 className="text-sm font-medium text-gray-900">Payment Channels & Delivery Rules</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-gray-600 block font-medium">Flat Shipping Delivery Fee ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={flatShippingRate} 
                  onChange={(e) => setFlatShippingRate(parseFloat(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 bg-white outline-none focus:border-black transition-colors font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-600 block font-medium">Free Shipping Order Threshold ($)</label>
                <input 
                  type="number" 
                  value={freeShippingThreshold} 
                  onChange={(e) => setFreeShippingThreshold(parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 bg-white outline-none focus:border-black transition-colors font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-600 block font-medium">Standard Vat / Tax Percentage (%)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={taxPercentage} 
                  onChange={(e) => setTaxPercentage(parseFloat(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 bg-white outline-none focus:border-black transition-colors font-mono"
                />
              </div>
              <div className="space-y-3 pt-4">
                <label className="flex items-center gap-2 font-medium text-gray-700 select-none">
                  <input 
                    type="checkbox" 
                    checked={enableCod} 
                    onChange={(e) => setEnableCod(e.target.checked)}
                    className="accent-black rounded border-gray-300" 
                  />
                  Activate Cash On Delivery (COD) Channel
                </label>
                <label className="flex items-center gap-2 font-medium text-gray-700 select-none">
                  <input 
                    type="checkbox" 
                    checked={enableOnlineGateways} 
                    onChange={(e) => setEnableOnlineGateways(e.target.checked)}
                    className="accent-black rounded border-gray-300" 
                  />
                  Activate Online Transfer Gateways
                </label>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button type="submit" className="flex items-center gap-1.5 bg-gray-900 hover:bg-black text-white text-[11px] font-medium px-4 py-1.5 rounded transition-all">
                <Save className="w-3.5 h-3.5" /> Save Logistics
              </button>
            </div>
          </form>

          {/* Module 3: Stock Control Mechanics */}
          <form id="inventory-policy" onSubmit={(e) => handleSaveConfig(e, "Stock Strategy")} className="border border-gray-200 rounded bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <RefreshCw className="w-4 h-4 text-gray-900" />
              <h3 className="text-sm font-medium text-gray-900">Inventory Management Policy</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-gray-600 block font-medium">Low Stock Warning Trigger Level</label>
                <input 
                  type="number" 
                  value={lowStockAlertThreshold} 
                  onChange={(e) => setLowStockAlertThreshold(parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 bg-white outline-none focus:border-black transition-colors font-mono"
                />
                <span className="text-[10px] text-gray-400 block font-light">Alerts system dashboard logs when size sku units drop below this index value.</span>
              </div>
              <div className="space-y-1 pt-4">
                <label className="flex items-center gap-2 font-medium text-gray-700 select-none">
                  <input 
                    type="checkbox" 
                    checked={allowBackorders} 
                    onChange={(e) => setAllowBackorders(e.target.checked)}
                    className="accent-black rounded border-gray-300" 
                  />
                  Allow Shoppers to Backorder Out-Of-Stock Apparel
                </label>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button type="submit" className="flex items-center gap-1.5 bg-gray-900 hover:bg-black text-white text-[11px] font-medium px-4 py-1.5 rounded transition-all">
                <Save className="w-3.5 h-3.5" /> Save Policies
              </button>
            </div>
          </form>

          {/* Module 4: Explicit Required Section: Account Email & Password Security Updates */}
          <form id="account-security" onSubmit={handleUpdateSecurity} className="border border-red-200/60 rounded bg-white p-5 shadow-sm space-y-4 ring-1 ring-red-500/5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-600" />
                <h3 className="text-sm font-medium text-gray-900">Account Email & Password Security</h3>
              </div>
              <span className="text-[9px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded uppercase tracking-wider">High Security Zone</span>
            </div>
            
            <div className="space-y-4 text-xs">
              {/* Account Master Verification Node Email */}
              <div className="space-y-1 max-w-md">
                <label className="text-gray-700 font-semibold flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-gray-400" /> Administrative Account Email
                </label>
                <input 
                  type="email" 
                  value={accountEmail} 
                  onChange={(e) => setAccountEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 bg-white font-medium outline-none focus:border-black transition-colors text-gray-900"
                  required
                />
                <span className="text-[10px] text-gray-400 block font-light">This structural email coordinates fundamental log authentication rules and master administrative login triggers.</span>
              </div>

              <div className="border-t border-gray-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Master Authentication Key fields */}
                <div className="space-y-1">
                  <label className="text-gray-600 block font-medium">New Password Token</label>
                  <input 
                    type="password" 
                    placeholder="••••••••••••"
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 bg-white outline-none focus:border-black transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-600 block font-medium">Confirm New Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••••••"
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 bg-white outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              {/* Identity Verification Step */}
              <div className="bg-gray-50 p-4 border border-gray-200 rounded space-y-2 max-w-md">
                <label className="text-gray-900 font-semibold block text-[11px]">
                  Confirm Administration Identity
                </label>
                <input 
                  type="password" 
                  placeholder="Enter current password token to verify"
                  value={currentPassword} 
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border border-gray-300 bg-white rounded px-3 py-1.5 outline-none focus:border-black transition-colors"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button type="submit" className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-[11px] font-medium px-4 py-1.5 rounded transition-all shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" /> Apply Security Credentials
              </button>
            </div>
          </form>

        </div>

      </div>

    </div>
  );
}