"use client";

import { motion } from "framer-motion";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  ShoppingBag, 
  Receipt, 
  Users, 
  TrendingUp, 
  CornerDownRight, 
  ArrowRight
} from "lucide-react";

export default function AdminDashboard() {
  // Mock Metric Data Sets
  const overviewStats = [
    { label: "Net Revenue", current: "Rs. 42,890.50", change: "+14.2%", isPositive: true, context: "vs last month", icon: TrendingUp },
    { label: "Order Volume", current: "1,240", change: "+8.3%", isPositive: true, context: "vs last week", icon: Receipt },
    { label: "Active Customers", current: "8,920", change: "+24.1%", isPositive: true, context: "cumulative total", icon: Users },
    { label: "Conversion Rate", current: "3.14%", change: "-0.4%", isPositive: false, context: "vs seasonal avg", icon: ShoppingBag },
  ];

  const recentActivities = [
    { id: 1, type: "order", message: "New order received from Emma Watson (#ORD-8941)", time: "3 mins ago", value: "+Rs. 189.00" },
    { id: 2, type: "user", message: "New member profile registered: Marcus Aurelius", time: "14 mins ago", value: null },
    { id: 3, type: "review", message: "5-star rating submitted for 'Essential Oversized Tee'", time: "1 hr ago", value: null },
    { id: 4, type: "inquiry", message: "Support ticket #1024 opened regarding shipping delay", time: "2 hrs ago", value: "Pending" },
    { id: 5, type: "order", message: "Bulk dynamic fulfillment cleared for inventory batch #4", time: "4 hrs ago", value: "+Rs. 1,420.00" },
  ];

  // Structural coordinates for a clean SVG Sparkline trend line
  const sparklineData = "M 0 80 Q 40 20 80 50 T 160 30 T 240 70 T 320 10 T 400 40 L 400 100 L 0 100 Z";
  const linePathOnly = "M 0 80 Q 40 20 80 50 T 160 30 T 240 70 T 320 10 T 400 40";

  return (
    <div className="space-y-12">
      
      {/* Title Header Block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-border/40">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-semibold block">
            Operational Matrix
          </span>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight font-serif">
            Console Overview
          </h1>
        </div>
        <div className="text-[13px] font-mono tracking-wider text-green-500 bg-gray-100 font-semibold px-3 py-1.5">
          Live Sync: Active
        </div>
      </div>

      {/* Overview Analytics Matrix Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
        {overviewStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="border border-border/60 p-6 space-y-4 relative overflow-hidden bg-background group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
                {stat.label}
              </span>
              <stat.icon className="w-4 h-4 text-muted-foreground/30 group-hover:text-foreground transition-colors stroke-[1.25]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-light tracking-tight font-serif">
                {stat.current}
              </h3>
              <div className="flex items-center gap-2 text-[11px]">
                <span className={`inline-flex items-center font-medium ${stat.isPositive ? "text-emerald-600" : "text-red-500"}`}>
                  {stat.isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                  {stat.change}
                </span>
                <span className="text-muted-foreground/60 font-light">{stat.context}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Structural Charts and Logs Grid Core */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Growth Trends Graph Display Panel */}
        <div className="lg:col-span-7 border border-border/60 p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="uppercase tracking-[0.2em] font-semibold text-muted-foreground">
                Revenue Ingestion Curve
              </h3>
              <p className="text-muted-foreground font-light">Gross performance calculated over trailing intervals.</p>
            </div>
            <select className="text-[10px] uppercase tracking-widest font-medium bg-transparent border border-border/60 px-2.5 py-1 outline-none text-muted-foreground hover:text-foreground focus:border-foreground transition-colors">
              <option>Last 30 Days</option>
              <option>Quarterly</option>
              <option>Yearly</option>
            </select>
          </div>

          {/* Luxury Graphic Minimalist Chart Container */}
          <div className="relative pt-6 w-full h-64 bg-zinc-50/50 dark:bg-zinc-900/10 border border-border/30 overflow-hidden">
            <svg className="w-full h-full absolute inset-0" viewBox="0 0 400 100" preserveAspectRatio="none">
              {/* Grid Background Horizontal Anchor Guidelines */}
              <line x1="0" y1="25" x2="400" y2="25" stroke="currentColor" className="text-border/20" strokeDasharray="4" />
              <line x1="0" y1="50" x2="400" y2="50" stroke="currentColor" className="text-border/20" strokeDasharray="4" />
              <line x1="0" y1="75" x2="400" y2="75" stroke="currentColor" className="text-border/20" strokeDasharray="4" />
              
              {/* Smooth Trend Visualization Area Paths */}
              <path d={sparklineData} fill="url(#chartGradient)" className="opacity-[0.03] dark:opacity-[0.07]" />
              <path d={linePathOnly} fill="none" stroke="currentColor" className="text-foreground" strokeWidth="1.25" />
              
              {/* Interactive Radial Focal Node Dot indicator */}
              <circle cx="320" cy="10" r="3" fill="currentColor" className="text-foreground animate-pulse" />

              {/* Gradient Definitions Wrapper */}
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>

            {/* Float Label Details Info Overlays */}
            <div className="absolute top-4 right-14 bg-background border border-border px-2.5 py-1 text-[10px] tracking-wide font-mono shadow-sm">
              Peak: Rs. 4.2k/hr
            </div>
          </div>

          {/* Chart Footprint Multi-Legend Meta Metrics */}
          <div className="grid grid-cols-3 gap-4 pt-2 text-center">
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-light">Gross Total</span>
              <p className="text-sm font-light font-serif">Rs. 124,800</p>
            </div>
            <div className="space-y-0.5 border-x border-border/40">
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-light">Daily Avg</span>
              <p className="text-sm font-light font-serif">Rs. 4,160</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-light">Return Rate</span>
              <p className="text-sm font-light font-serif">1.82%</p>
            </div>
          </div>
        </div>

        {/* Right Column: Complete Chronicle Real-Time Activity Log List */}
        <div className="lg:col-span-5 border border-border/60 p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h3 className="uppercase tracking-[0.2em] font-semibold text-muted-foreground">
                Chronicle Registries
              </h3>
              <p className="text-muted-foreground font-light">Live real-time consumer pipeline logs operations feed.</p>
            </div>
          </div>

          {/* Activity Rows Feed Grid */}
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-start justify-between gap-4 py-3 border-b border-border/30 last:border-b-0 last:pb-0"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <CornerDownRight className="w-3.5 h-3.5 mt-0.5 text-muted-foreground/40 shrink-0" />
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-foreground/90 font-light tracking-wide truncate leading-relaxed">
                      {activity.message}
                    </p>
                    <span className="text-[13px] text-muted-foreground/60 font-light block font-mono">
                      {activity.time}
                    </span>
                  </div>
                </div>

                {/* Variable Context Dynamic Actions Side Value Indicators */}
                {activity.value && (
                  <span className={`text-[11px] font-mono tracking-tight font-medium shrink-0 whitespace-nowrap pl-2 ${
                    activity.value.startsWith("+") ? "text-emerald-600" : "text-muted-foreground/60"
                  }`}>
                    {activity.value}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* See All Activities Pathway Trigger */}
          <button className="w-full text-center text-[10px] uppercase tracking-widest font-medium py-2.5 border border-border/60 hover:bg-foreground hover:text-background transition-colors flex items-center justify-center gap-1.5">
            Evaluate Historical Logs <ArrowRight className="w-3 h-3" />
          </button>

        </div>

      </div>

    </div>
  );
}