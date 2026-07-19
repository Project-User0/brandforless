"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  FileSpreadsheet, 
  Eye, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp,
  Download,
  Calendar,
  Users,
  Shirt,
  ShoppingBag,
  DollarSign,
  CreditCard,
  Truck,
  AlertTriangle
} from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";

// Daily Report Dashboard Node Blueprint
export interface DailyEcomReport {
  id: string; // Format: REP-YYYYMMDD
  date: string;
  newUsers: number;
  newProductsAdded: number;
  newOrdersToday: number;
  todayCancelledOrder: number;
  todayShippedOrder: number;
  totalRevenueToday: number;
  revenueCashOnDelivery: number;
  revenueOnlineTransfer: number;
  revenueOther: number;
}

// 15-Day E-commerce Seed Matrix Data
const DEFAULT_REPORTS: DailyEcomReport[] = [
  { id: "REP-20260720", date: "2026-07-20", newUsers: 57, newProductsAdded: 0, newOrdersToday: 37, todayCancelledOrder: 1, todayShippedOrder: 39, totalRevenueToday: 3310.22, revenueCashOnDelivery: 1200.39, revenueOnlineTransfer: 1902.26, revenueOther: 207.57 },
  { id: "REP-20260719", date: "2026-07-19", newUsers: 83, newProductsAdded: 0, newOrdersToday: 48, todayCancelledOrder: 4, todayShippedOrder: 46, totalRevenueToday: 3989.26, revenueCashOnDelivery: 1277.39, revenueOnlineTransfer: 2344.54, revenueOther: 367.33 },
  { id: "REP-20260718", date: "2026-07-18", newUsers: 77, newProductsAdded: 4, newOrdersToday: 39, todayCancelledOrder: 1, todayShippedOrder: 43, totalRevenueToday: 2770.43, revenueCashOnDelivery: 738.17, revenueOnlineTransfer: 1784.48, revenueOther: 247.78 },
  { id: "REP-20260717", date: "2026-07-17", newUsers: 42, newProductsAdded: 0, newOrdersToday: 28, todayCancelledOrder: 2, todayShippedOrder: 25, totalRevenueToday: 2190.50, revenueCashOnDelivery: 657.15, revenueOnlineTransfer: 1314.30, revenueOther: 219.05 },
  { id: "REP-20260716", date: "2026-07-16", newUsers: 51, newProductsAdded: 12, newOrdersToday: 34, todayCancelledOrder: 3, todayShippedOrder: 31, totalRevenueToday: 2680.00, revenueCashOnDelivery: 804.00, revenueOnlineTransfer: 1634.80, revenueOther: 241.20 },
  { id: "REP-20260715", date: "2026-07-15", newUsers: 48, newProductsAdded: 0, newOrdersToday: 22, todayCancelledOrder: 0, todayShippedOrder: 26, totalRevenueToday: 1716.40, revenueCashOnDelivery: 549.25, revenueOnlineTransfer: 1029.84, revenueOther: 137.31 },
  { id: "REP-20260714", date: "2026-07-14", newUsers: 39, newProductsAdded: 2, newOrdersToday: 25, todayCancelledOrder: 1, todayShippedOrder: 24, totalRevenueToday: 1980.20, revenueCashOnDelivery: 693.07, revenueOnlineTransfer: 1128.71, revenueOther: 158.42 },
  { id: "REP-20260713", date: "2026-07-13", newUsers: 62, newProductsAdded: 0, newOrdersToday: 41, todayCancelledOrder: 2, todayShippedOrder: 38, totalRevenueToday: 3180.90, revenueCashOnDelivery: 1049.70, revenueOnlineTransfer: 1908.54, revenueOther: 222.66 },
  { id: "REP-20260712", date: "2026-07-12", newUsers: 91, newProductsAdded: 0, newOrdersToday: 54, todayCancelledOrder: 5, todayShippedOrder: 50, totalRevenueToday: 4420.00, revenueCashOnDelivery: 1547.00, revenueOnlineTransfer: 2563.60, revenueOther: 309.40 },
  { id: "REP-20260711", date: "2026-07-11", newUsers: 88, newProductsAdded: 6, newOrdersToday: 51, todayCancelledOrder: 3, todayShippedOrder: 47, totalRevenueToday: 4010.50, revenueCashOnDelivery: 1283.36, revenueOnlineTransfer: 2446.40, revenueOther: 280.74 },
  { id: "REP-20260710", date: "2026-07-10", newUsers: 44, newProductsAdded: 0, newOrdersToday: 29, todayCancelledOrder: 1, todayShippedOrder: 32, totalRevenueToday: 2310.00, revenueCashOnDelivery: 739.20, revenueOnlineTransfer: 1386.00, revenueOther: 184.80 },
  { id: "REP-20260709", date: "2026-07-09", newUsers: 41, newProductsAdded: 0, newOrdersToday: 26, todayCancelledOrder: 2, todayShippedOrder: 23, totalRevenueToday: 1990.80, revenueCashOnDelivery: 597.24, revenueOnlineTransfer: 1234.30, revenueOther: 159.26 }
];

export default function AdminReportPage() {
  const [reports] = useState<DailyEcomReport[]>(DEFAULT_REPORTS);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pagination Parameters (Strict 10 rows cap)
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Drawer View Sub-configurations
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<DailyEcomReport | null>(null);

  // Search filter query logic (Matches date index or report key string)
  const filteredReports = reports.filter((rep) => {
    return (
      rep.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Pagination calculation vectors
  const totalPages = Math.ceil(filteredReports.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredReports.slice(indexOfFirstRecord, indexOfLastRecord);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const openViewDrawer = (report: DailyEcomReport) => {
    setSelectedReport(report);
    setIsDrawerOpen(true);
  };

  // Single Row Target Downloader Module
  const downloadSingleRowExcel = (report: DailyEcomReport) => {
    const dataRow = [{
      "Report ID Reference": report.id,
      "Calendar Date": report.date,
      "New Registered Users": report.newUsers,
      "New Products Appended": report.newProductsAdded,
      "Gross Orders Placed": report.newOrdersToday,
      "Orders Cancelled": report.todayCancelledOrder,
      "Orders Dispatched/Shipped": report.todayShippedOrder,
      "Total Gross Revenue ($)": report.totalRevenueToday,
      "Cash On Delivery Net Revenue ($)": report.revenueCashOnDelivery,
      "Online Payment Gateways ($)": report.revenueOnlineTransfer,
      "Alternative Payment Channels ($)": report.revenueOther
    }];

    const worksheet = XLSX.utils.json_to_sheet(dataRow);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Report ${report.date}`);
    XLSX.writeFile(workbook, `Ecom_Daily_Report_${report.date}.xlsx`);
    toast.success(`Exported data structure for ${report.date} successfully.`);
  };

  // Mass Master Ledger Downloader Module
  const exportFullLedgerExcel = () => {
    const masterData = filteredReports.map((report) => ({
      "Report Key": report.id,
      "Date": report.date,
      "New Users Count": report.newUsers,
      "Products Added": report.newProductsAdded,
      "Orders Logged": report.newOrdersToday,
      "Orders Cancelled": report.todayCancelledOrder,
      "Orders Shipped": report.todayShippedOrder,
      "Total Daily Gross Revenue": report.totalRevenueToday,
      "COD Channels Revenue": report.revenueCashOnDelivery,
      "Online Gateway Revenue": report.revenueOnlineTransfer,
      "Miscellaneous Revenue": report.revenueOther
    }));

    const worksheet = XLSX.utils.json_to_sheet(masterData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "E-commerce Daily Summary");
    XLSX.writeFile(workbook, `Ecom_Full_Ledger_${new Date().toISOString().slice(0, 10)}.xlsx`);
    toast.success("Full filtered history workbook compiled successfully.");
  };

  // Quick Currency Formatter
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);
  };

  return (
    <div className="space-y-6">
      
      {/* Upper Title Header Component Block Layout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Daily Analytics Reports</h1>
          <p className="text-xs text-gray-500 mt-0.5 font-light">Monitor daily traffic parameters, new clothing catalog updates, operational order state counts, and clean split-revenue settlement channels.</p>
        </div>
        <button
          onClick={exportFullLedgerExcel}
          className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-medium border border-gray-300 px-4 py-2 rounded bg-white hover:bg-gray-50 transition-colors"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-700" /> Export Full History Matrix
        </button>
      </div>

      {/* Dynamic Index Search Bar */}
      <div className="flex items-center gap-2 border border-gray-300 rounded px-3 py-1.5 bg-white w-full sm:max-w-xs focus-within:border-black transition-colors">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Filter logs by date (YYYY-MM-DD)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent text-xs outline-none w-full text-gray-900 placeholder:text-gray-400"
        />
      </div>

      {/* Main Core Spreadsheet Data Frame Visualizer */}
      <div className="border border-gray-200 rounded bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4">Log Token ID</th>
                <th className="py-3 px-4">Date String</th>
                <th className="py-3 px-4">Traffic metrics (Users/Items)</th>
                <th className="py-3 px-4">Order Funnel Stats</th>
                <th className="py-3 px-4">Settled Gross Revenue</th>
                <th className="py-3 px-4 text-right">Row Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-gray-100 text-gray-700">
              {currentRecords.length > 0 ? (
                currentRecords.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-gray-900">{report.id}</td>
                    <td className="py-3 px-4 text-gray-600 font-medium whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {report.date}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-900 font-medium">+{report.newUsers} Signups</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">+{report.newProductsAdded} Catalog Additions</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1.5 items-center">
                        <span className="bg-blue-50 border border-blue-100 text-blue-800 text-[10px] font-medium px-1.5 py-0.5 rounded">
                          {report.newOrdersToday} Placed
                        </span>
                        <span className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-[10px] font-medium px-1.5 py-0.5 rounded">
                          {report.todayShippedOrder} Dispatched
                        </span>
                        {report.todayCancelledOrder > 0 && (
                          <span className="bg-rose-50 border border-rose-100 text-rose-800 text-[10px] font-medium px-1.5 py-0.5 rounded">
                            {report.todayCancelledOrder} Revoked
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900 font-mono">
                      {formatCurrency(report.totalRevenueToday)}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => openViewDrawer(report)}
                        className="p-1 border border-gray-200 rounded text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                        title="Inspect Full Metrics breakdown"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => downloadSingleRowExcel(report)}
                        className="p-1 border border-gray-200 rounded text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 transition-colors"
                        title="Download Data Matrix for Date"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 font-light">
                    No operating report entries discovered within active search queries.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Navigation Pagination Anchor Array */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white text-[11px] text-gray-500">
            <span>
              Showing Page {currentPage} of {totalPages} (Total Audit Rows: {filteredReports.length})
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1 border border-gray-200 rounded bg-white disabled:opacity-40 hover:bg-gray-50 transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1 border border-gray-200 rounded bg-white disabled:opacity-40 hover:bg-gray-50 transition-all"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Audit Metric Details Overlay Side Drawer Container Layout */}
      {isDrawerOpen && selectedReport && (
        <>
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-xs z-50 transition-opacity" 
            onClick={() => setIsDrawerOpen(false)} 
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white border-l border-gray-200 shadow-xl z-50 p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Drawer Summary Banner Grid */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Operational Breakdown</h2>
                  <p className="text-xs text-gray-400">Index ID reference: {selectedReport.id}</p>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Numerical Metrics Payload Framework */}
              <div className="space-y-5 text-xs text-gray-700">
                
                {/* 1. Core Acquisition & Content Additions */}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Growth & Catalog Acquisitions
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded border border-gray-100">
                      <span className="text-[10px] text-gray-400 flex items-center gap-1"><Users className="w-3 h-3" /> New Users</span>
                      <p className="font-semibold text-gray-900 text-lg mt-0.5">{selectedReport.newUsers}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded border border-gray-100">
                      <span className="text-[10px] text-gray-400 flex items-center gap-1"><Shirt className="w-3 h-3" /> Products Added</span>
                      <p className="font-semibold text-gray-900 text-lg mt-0.5">{selectedReport.newProductsAdded}</p>
                    </div>
                  </div>
                </div>

                {/* 2. Operations Fulfillment Track */}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <ShoppingBag className="w-3 h-3" /> Processing Funnel Volumes
                  </h3>
                  <div className="bg-gray-50 p-3 rounded border border-gray-100 space-y-2.5">
                    <div className="flex justify-between items-center text-gray-600">
                      <span className="flex items-center gap-1.5"><ShoppingBag className="w-3.5 h-3.5 text-blue-500" /> New Orders Today</span>
                      <span className="font-semibold text-gray-900 font-mono">{selectedReport.newOrdersToday}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600 pt-2 border-t border-gray-200/60">
                      <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-emerald-500" /> Dispatched Today</span>
                      <span className="font-semibold text-gray-900 font-mono">{selectedReport.todayShippedOrder}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600 pt-2 border-t border-gray-200/60">
                      <span className="flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Cancelled Orders</span>
                      <span className="font-semibold text-gray-900 font-mono">{selectedReport.todayCancelledOrder}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Detailed Settlement Channel Matrices */}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <DollarSign className="w-3 h-3" /> Revenue Distribution Settlement
                  </h3>
                  <div className="bg-gray-950 text-white p-4 rounded-t border border-gray-900 flex justify-between items-center shadow-inner">
                    <span className="text-[10px] uppercase text-gray-400 font-medium tracking-wide">Gross Revenue Placed</span>
                    <span className="text-xl font-bold font-mono">{formatCurrency(selectedReport.totalRevenueToday)}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-b border-x border-b border-gray-200/80 space-y-2.5">
                    <div className="flex justify-between items-center text-gray-600">
                      <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-gray-400" /> Cash On Delivery (COD)</span>
                      <span className="font-medium text-gray-900 font-mono">{formatCurrency(selectedReport.revenueCashOnDelivery)}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600 pt-2 border-t border-gray-200/60">
                      <span className="flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5 text-gray-400" /> Online Gateways / Transfers</span>
                      <span className="font-medium text-gray-900 font-mono">{formatCurrency(selectedReport.revenueOnlineTransfer)}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600 pt-2 border-t border-gray-200/60">
                      <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-gray-400" /> Alternative Pay Channels</span>
                      <span className="font-medium text-gray-900 font-mono">{formatCurrency(selectedReport.revenueOther)}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Drawer Actions Deck */}
            <div className="pt-4 border-t border-gray-200 mt-6">
              <button
                onClick={() => downloadSingleRowExcel(selectedReport)}
                className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white text-xs font-medium py-2 rounded transition-all shadow-xs"
              >
                <Download className="w-4 h-4" /> Download Complete Report Sheet
              </button>
            </div>

          </div>
        </>
      )}

    </div>
  );
}