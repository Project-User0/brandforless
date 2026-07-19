"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Building, 
  Globe, 
  Camera, 
  X, 
  Check, 
  Edit3,
  Calendar,
  Lock
} from "lucide-react";
import { toast } from "sonner";

// Explicit Interfaces for the System
interface AdminProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  location: string;
  timezone: string;
  employeeId: string;
  joinedDate: string;
  avatarUrl: string;
}

// Complete Seed Set for Fallback Defaults
const DEFAULT_PROFILE: AdminProfileData = {
  firstName: "Alexander",
  lastName: "Vanguard",
  email: "a.vanguard@brandforless.com",
  phone: "+1 (555) 019-2834",
  role: "Senior Systems Administrator",
  department: "Global Operations & Logistics",
  location: "New York Hub, USA",
  timezone: "EST (UTC-5)",
  employeeId: "BFL-ADM-0091",
  joinedDate: "2024-11-14",
  avatarUrl: "", // Triggers empty letter avatar initial state
};

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<AdminProfileData | null>(null);
  
  // Field Editing Operational States
  const [activeEditingField, setActiveEditingField] = useState<keyof AdminProfileData | null>(null);
  const [temporaryFieldValue, setTemporaryFieldValue] = useState<string>("");

  // Avatar Management Subsystem states
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ingest profile data from client storage layers
  useEffect(() => {
    const stored = localStorage.getItem("bfl_admin_profile");
    if (stored) {
      try {
        setProfile(JSON.parse(stored));
      } catch (e) {
        setProfile(DEFAULT_PROFILE);
      }
    } else {
      setProfile(DEFAULT_PROFILE);
      localStorage.setItem("bfl_admin_profile", JSON.stringify(DEFAULT_PROFILE));
    }
  }, []);

  if (!profile) return null;

  // Triggers field mutation controls
  const initiateFieldEdit = (field: keyof AdminProfileData) => {
    setActiveEditingField(field);
    setTemporaryFieldValue(profile[field]);
  };

  // Persists single updated value array mapping back to system layers
  const commitFieldUpdate = (field: keyof AdminProfileData) => {
    if (!profile) return;
    
    const updatedProfile = {
      ...profile,
      [field]: temporaryFieldValue.trim(),
    };
    
    setProfile(updatedProfile);
    localStorage.setItem("bfl_admin_profile", JSON.stringify(updatedProfile));
    setActiveEditingField(null);
    toast.success(`Parameter metadata [${field}] synced successfully`);
  };

  const cancelFieldEdit = () => {
    setActiveEditingField(null);
    setTemporaryFieldValue("");
  };

  // Image Pipeline Processors
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File allocation boundaries exceeded (Max 2MB limits)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const commitAvatarUpload = () => {
    if (!profile || !avatarPreview) return;
    const updatedProfile = { ...profile, avatarUrl: avatarPreview };
    setProfile(updatedProfile);
    localStorage.setItem("bfl_admin_profile", JSON.stringify(updatedProfile));
    setAvatarPreview(null);
    toast.success("System biometric image update confirmed");
  };

  const cancelAvatarUpload = () => {
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Reusable Form Row Component mapping directly to BFL design style
  const ProfileFieldRow = ({ 
    label, 
    field, 
    icon: Icon,
    isImmutable = false 
  }: { 
    label: string; 
    field: keyof AdminProfileData; 
    icon: any;
    isImmutable?: boolean;
  }) => {
    const isEditing = activeEditingField === field;

    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-border/40 gap-2 transition-colors duration-150 hover:bg-zinc-50/20 dark:hover:bg-zinc-900/5 px-2">
        <div className="flex items-center gap-3 w-full sm:w-1/3">
          <Icon className="w-4 h-4 text-muted-foreground/40" />
          <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/70">
            {label}
          </span>
        </div>

        <div className="flex-1 flex items-center justify-between gap-4 w-full">
          {isEditing ? (
            <input
              type="text"
              value={temporaryFieldValue}
              onChange={(e) => setTemporaryFieldValue(e.target.value)}
              className="w-full bg-transparent text-xs font-light outline-none border-b border-foreground py-0.5 text-foreground font-mono focus:ring-0"
              autoFocus
            />
          ) : (
            <span className={`text-xs tracking-wide ${isImmutable ? 'font-mono text-muted-foreground/60' : 'text-foreground/90 font-light'}`}>
              {profile[field] || "—"}
            </span>
          )}

          {!isImmutable && (
            <div className="flex items-center gap-1.5 shrink-0">
              {isEditing ? (
                <>
                  <button 
                    onClick={() => commitFieldUpdate(field)}
                    className="p-1 border border-emerald-500/40 text-emerald-600 bg-emerald-50/10 hover:bg-emerald-500 hover:text-white transition-all"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={cancelFieldEdit}
                    className="p-1 border border-border text-muted-foreground hover:bg-foreground hover:text-background transition-all"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => initiateFieldEdit(field)}
                  className="text-[10px] uppercase tracking-widest inline-flex items-center gap-1 border border-border/80 px-2 py-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Edit3 className="w-2.5 h-2.5" /> Modify
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10 relative max-w-4xl mx-auto pb-16">
      
      {/* Dynamic Title Header Block */}
      <div className="space-y-1 pb-6 border-b border-border/40">
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-semibold block">
          Operations Console Portal
        </span>
        <h1 className="text-2xl sm:text-3xl font-light tracking-tight font-serif text-foreground">
          System Identity Profile
        </h1>
      </div>

      {/* Main Structural System Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
        
        {/* Left Aspect: Biometric Avatar Management */}
        <div className="border border-border/60 p-6 bg-background space-y-6 flex flex-col items-center text-center">
          <div className="relative group">
            <div className="w-32 h-32 border border-border/80 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center overflow-hidden relative">
              {avatarPreview || profile.avatarUrl ? (
                <img 
                  src={avatarPreview || profile.avatarUrl} 
                  alt="Admin Identity" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-serif tracking-widest font-light text-muted-foreground/40 uppercase">
                  {profile.firstName[0]}{profile.lastName[0]}
                </span>
              )}
            </div>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2 bg-foreground text-background hover:bg-opacity-90 transition-all border border-background shadow-lg"
              title="Upload new image token"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          {/* Verification Pipeline State Engine */}
          {avatarPreview ? (
            <div className="w-full space-y-2">
              <div className="text-[9px] font-mono tracking-widest text-amber-600 bg-amber-50/20 border border-amber-500/30 py-1 px-2 uppercase">
                Image Mutation Pending Commit
              </div>
              <div className="flex gap-2 w-full justify-center">
                <button
                  onClick={commitAvatarUpload}
                  className="flex-1 text-[9px] uppercase tracking-widest bg-foreground text-background py-1.5 font-semibold hover:bg-opacity-90 transition-all flex items-center justify-center gap-1"
                >
                  <Check className="w-3 h-3" /> Commit
                </button>
                <button
                  onClick={cancelAvatarUpload}
                  className="flex-1 text-[9px] uppercase tracking-widest border border-border py-1.5 text-muted-foreground hover:text-foreground transition-all flex items-center justify-center gap-1"
                >
                  <X className="w-3 h-3" /> Drop
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-1 select-none">
              <h4 className="text-sm font-medium text-foreground tracking-wide">
                {profile.firstName} {profile.lastName}
              </h4>
              <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/60">
                {profile.employeeId}
              </p>
            </div>
          )}

          <div className="w-full border-t border-border/40 pt-4 text-left space-y-3">
            <div>
              <span className="text-[8px] uppercase tracking-widest font-mono text-muted-foreground/50 block">Security Context</span>
              <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 border border-emerald-500/30 text-emerald-600 bg-emerald-50/20 font-medium inline-block mt-1">
                Active Registry
              </span>
            </div>
          </div>
        </div>

        {/* Right Aspect: Modular Identity Registers */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Section A: Human Profile Metadata */}
          <div className="border border-border/60 bg-background p-6 space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/80 flex items-center gap-2 border-b border-border/40 pb-2">
              <User className="w-3.5 h-3.5 text-muted-foreground/40" /> 01. Personal Identity Metrics
            </h3>
            <div className="divide-y divide-border/20">
              <ProfileFieldRow label="First Name" field="firstName" icon={User} />
              <ProfileFieldRow label="Last Name" field="lastName" icon={User} />
              <ProfileFieldRow label="Email Identity" field="email" icon={Mail} />
              <ProfileFieldRow label="Phone Link" field="phone" icon={Phone} />
            </div>
          </div>

          {/* Section B: Enterprise Routing Metadata */}
          <div className="border border-border/60 bg-background p-6 space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/80 flex items-center gap-2 border-b border-border/40 pb-2">
              <Building className="w-3.5 h-3.5 text-muted-foreground/40" /> 02. Institutional Parameters
            </h3>
            <div className="divide-y divide-border/20">
              <ProfileFieldRow label="Console Role" field="role" icon={Shield} />
              <ProfileFieldRow label="Department Allocation" field="department" icon={Building} />
              <ProfileFieldRow label="Geographic Node" field="location" icon={Globe} />
              <ProfileFieldRow label="Timezone Matrix" field="timezone" icon={Calendar} />
            </div>
          </div>

          {/* Section C: Cryptographic System Context (Read-Only Frameworks) */}
          <div className="border border-border/60 bg-background p-6 space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/80 flex items-center gap-2 border-b border-border/40 pb-2">
              <Lock className="w-3.5 h-3.5 text-muted-foreground/40" /> 03. Immutable System Indexes
            </h3>
            <div className="divide-y divide-border/20">
              <ProfileFieldRow label="Unique Registry Key" field="employeeId" icon={Lock} isImmutable={true} />
              <ProfileFieldRow label="Initialization Timestamp" field="joinedDate" icon={Calendar} isImmutable={true} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}