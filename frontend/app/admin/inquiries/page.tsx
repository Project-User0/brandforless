"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  FileSpreadsheet,
  Trash2,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  AlertCircle,
} from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";

// Customer Inquiry Interface
export interface CustomerInquiry {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  topic: "order-status" | "return-refund" | "sizing-fit" | "general";
  status: "pending" | "resolved";
  dateSubmitted: string;
}

// Mock Data Seed for Clothing Store Inquiries
const DEFAULT_INQUIRIES: CustomerInquiry[] = [
  {
    id: "INQ-8821",
    customerName: "Sarah Jenkins",
    email: "sarah.j@outlook.com",
    phone: "+1 (555) 014-9921",
    subject: "Exchange size for Classic Linen Shirt",
    message:
      "Hi, I ordered the classic linen shirt in size M, but it runs a bit larger than expected. Can I exchange it for a size S? The tags are still attached.",
    topic: "sizing-fit",
    status: "pending",
    dateSubmitted: "2026-07-18",
  },
  {
    id: "INQ-7643",
    customerName: "Matthieu Dubois",
    email: "m.dubois@paris.fr",
    phone: "+33 6 5555 0142",
    subject: "Delayed Shipment Tracking",
    message:
      "Hello, my order tracking link hasn't updated in 4 days. Could you please check if my package has left the central warehouse?",
    topic: "order-status",
    status: "pending",
    dateSubmitted: "2026-07-19",
  },
  {
    id: "INQ-5104",
    customerName: "Amara Okafor",
    email: "amara.okafor@techcorp.ng",
    phone: "+234 1 555 8831",
    subject: "Refund processed successfully",
    message:
      "Thank you for processing my return request. I wanted to verify how many business days it typically takes to see the credit drop back into my account bank statement.",
    topic: "return-refund",
    status: "resolved",
    dateSubmitted: "2026-07-14",
  },
  {
    id: "INQ-3091",
    customerName: "Yuki Tanaka",
    email: "y.tanaka@net-tokyo.jp",
    phone: "+81 3 5555 0199",
    subject: "Restock query on Denim Jeans",
    message:
      "Are the Slim Fit Denim Jeans in Dark Indigo size 32 going to be restocked before the summer collection ends?",
    topic: "general",
    status: "resolved",
    dateSubmitted: "2026-07-10",
  },
];

export default function AdminInquiryPage() {
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Pagination State Matrix (Limit 10 records per page)
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // View Modal Subsystem Configuration
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] =
    useState<CustomerInquiry | null>(null);

  // Client Storage Framer Hydration
  useEffect(() => {
    const stored = localStorage.getItem("store_inquiries");
    if (stored) {
      try {
        setInquiries(JSON.parse(stored));
      } catch (e) {
        setInquiries(DEFAULT_INQUIRIES);
      }
    } else {
      setInquiries(DEFAULT_INQUIRIES);
      localStorage.setItem(
        "store_inquiries",
        JSON.stringify(DEFAULT_INQUIRIES),
      );
    }
  }, []);

  const saveInquiries = (updatedList: CustomerInquiry[]) => {
    setInquiries(updatedList);
    localStorage.setItem("store_inquiries", JSON.stringify(updatedList));
  };

  // Search and Topic Filter Matching Engine
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination Bounds Computations
  const totalPages = Math.ceil(filteredInquiries.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredInquiries.slice(
    indexOfFirstRecord,
    indexOfLastRecord,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Drawer Inspect Opener
  const openViewDrawer = (inquiry: CustomerInquiry) => {
    setSelectedInquiry(inquiry);
    setIsDrawerOpen(true);
  };

  // Toggle Resolution Status Directly inside View Drawer
  const toggleResolveStatus = (id: string) => {
    const updated = inquiries.map((inq) => {
      if (inq.id === id) {
        const nextStatus = inq.status === "pending" ? "resolved" : "pending";
        toast.success(`Inquiry marked as ${nextStatus}`);
        return { ...inq, status: nextStatus };
      }
      return inq;
    });
    saveInquiries(updated);

    // Update active context views inside drawer if open
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry({
        ...selectedInquiry,
        status: selectedInquiry.status === "pending" ? "resolved" : "pending",
      });
    }
  };

  // Remove individual tickets
  const handleDeleteInquiry = (id: string) => {
    if (
      confirm(
        "Are you sure you want to delete this customer inquiry log permanently?",
      )
    ) {
      const updated = inquiries.filter((inq) => inq.id !== id);
      saveInquiries(updated);
      toast.error(`Inquiry ${id} removed.`);
      if (selectedInquiry?.id === id) setIsDrawerOpen(false);
    }
  };

  // Excel Data Exporter Matrix
  const exportToExcel = () => {
    const exportData = filteredInquiries.map((inq) => ({
      "Ticket ID": inq.id,
      "Customer Name": inq.customerName,
      "Email Address": inq.email,
      "Phone Reference": inq.phone,
      "Inquiry Subject": inq.subject,
      "Message Context": inq.message,
      "Topic Category": inq.topic.toUpperCase(),
      "Resolution Status": inq.status.toUpperCase(),
      "Date Submitted": inq.dateSubmitted,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customer Inquiries Log");
    XLSX.writeFile(
      workbook,
      `Customer_Inquiries_${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  };

  // Human-readable conversions for tag formatting
  const getTopicLabel = (topic: string) => {
    switch (topic) {
      case "order-status":
        return "Order Status";
      case "return-refund":
        return "Return & Refund";
      case "sizing-fit":
        return "Sizing & Fit";
      default:
        return "General Inquiry";
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header Section Layout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Customer Inquiries
          </h1>
          <p className="text-xs text-gray-500 mt-0.5 font-light">
            Read, audit, and track incoming shopping queries, product size
            support requests, and support tickets.
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={exportToExcel}
            className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-medium border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-green-700" /> Export
            Inquiries Sheet
          </button>
        </div>
      </div>

      {/* Filter and Search Action Deck */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex-1 flex items-center gap-3 border-b border-border/40 px-1 py-1.5 text-muted-foreground focus-within:border-foreground transition-colors group max-w-md">
          <Search className="w-4 h-4 text-muted-foreground/40 group-focus-within:text-foreground transition-colors" />
          <input
            type="text"
            placeholder="Search by name, email, or ticket key..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-[13px] font-light outline-none border-none w-full placeholder:text-foreground/60 text-foreground"
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-medium bg-white border border-gray-300 rounded px-3 py-1.5 outline-none text-gray-700 hover:text-black focus:border-black transition-colors"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="resolved">Resolved Tickets</option>
          </select>
        </div>
      </div>

      {/* Main Table Content Container Layout */}
      <div className="border border-gray-200 rounded bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4">Ticket Key</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Subject Heading Summary</th>
                <th className="py-3 px-4">Topic Category</th>
                <th className="py-3 px-4">Date Logged</th>
                <th className="py-3 px-4">Status Flag</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-gray-100 text-gray-700">
              {currentRecords.length > 0 ? (
                currentRecords.map((inq) => (
                  <tr
                    key={inq.id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-medium text-gray-900">
                      {inq.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">
                        {inq.customerName}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        {inq.email}
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-gray-600 font-light">
                      {inq.subject}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-medium bg-gray-100 text-gray-800 border border-gray-200/60 px-2 py-0.5 rounded">
                        {getTopicLabel(inq.topic)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 font-mono">
                      {inq.dateSubmitted}
                    </td>
                    <td className="py-3 px-4">
                       <span
                        className={`text-[9px] uppercase tracking-widest px-2 py-0.5 border ${
                          inq.status === "resolved"
                            ? "border-emerald-500/30 text-emerald-600 bg-emerald-50/20"
                            : "border-rose-500/30 text-rose-600 bg-rose-50/20"
                        }`}
                      >
                        {inq.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => openViewDrawer(inq)}
                        className="p-1 border border-gray-200 rounded text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                        title="Read Full Inquiry Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteInquiry(inq.id)}
                        className="p-1 border border-red-100 rounded text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Ticket Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-gray-400 font-light"
                  >
                    No open support inquiries match your active layout criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Block Deck */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white text-[11px] text-gray-500">
            <span>
              Showing Page {currentPage} of {totalPages} (Total Inquiries:{" "}
              {filteredInquiries.length})
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
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-1 border border-gray-200 rounded bg-white disabled:opacity-40 hover:bg-gray-50 transition-all"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Custom Detail Side Drawer (View & Resolve Action Panel) */}
      {isDrawerOpen && selectedInquiry && (
        <>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs z-50 transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white border-l border-gray-200 shadow-xl z-50 p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              {/* Drawer Title */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Inquiry Dossier
                  </h2>
                  <p className="text-xs text-gray-400">
                    ID Reference Number: {selectedInquiry.id}
                  </p>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Inquiry Details Core Display */}
              <div className="space-y-5 text-xs text-gray-700">
                {/* Meta status alerts */}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Status Properties
                  </h3>
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
                    <div>
                      <span className="text-[10px] text-gray-400 block">
                        Current Resolution Flag
                      </span>
                      <span
                        className={`text-[11px] font-medium uppercase tracking-wider ${
                          selectedInquiry.status === "resolved"
                            ? "text-green-700"
                            : "text-amber-700"
                        }`}
                      >
                        {selectedInquiry.status}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleResolveStatus(selectedInquiry.id)}
                      className="bg-white border border-gray-300 text-gray-800 text-[10px] font-medium px-3 py-1 rounded shadow-xs hover:bg-gray-950 hover:text-white transition-all"
                    >
                      Mark as{" "}
                      {selectedInquiry.status === "pending"
                        ? "Resolved"
                        : "Pending"}
                    </button>
                  </div>
                </div>

                {/* Profile Information Block */}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <User className="w-3 h-3" /> Sender Details
                  </h3>
                  <div className="bg-gray-50 p-3 rounded space-y-2">
                    <div>
                      <span className="text-[10px] text-gray-400 block">
                        Shopper Name
                      </span>
                      <p className="font-medium text-gray-900 text-sm">
                        {selectedInquiry.customerName}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200/60">
                      <div>
                        <span className="text-[10px] text-gray-400 block flex items-center gap-0.5">
                          <Mail className="w-2.5 h-2.5" /> Email Address
                        </span>
                        <p className="font-medium text-gray-900 break-all">
                          {selectedInquiry.email}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block flex items-center gap-0.5">
                          <Phone className="w-2.5 h-2.5" /> Phone Endpoint
                        </span>
                        <p className="font-medium text-gray-900">
                          {selectedInquiry.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message Body Block */}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> Message Subject &
                    Context
                  </h3>
                  <div className="bg-gray-50 p-3 rounded space-y-3">
                    <div>
                      <span className="text-[10px] text-gray-400 block">
                        Subject Headline
                      </span>
                      <p className="font-medium text-gray-900 text-sm">
                        {selectedInquiry.subject}
                      </p>
                    </div>
                    <div className="pt-2.5 border-t border-gray-200/60">
                      <span className="text-[10px] text-gray-400 block">
                        Customer Input Message
                      </span>
                      <p className="text-gray-600 leading-relaxed font-light mt-1 whitespace-pre-wrap bg-white p-3 border border-gray-200 rounded">
                        "{selectedInquiry.message}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timing logs */}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Request Log Timestamp
                  </h3>
                  <div className="bg-gray-50 p-3 rounded">
                    <span className="text-[10px] text-gray-400 block">
                      Date Submitted
                    </span>
                    <p className="font-medium text-gray-900 font-mono">
                      {selectedInquiry.dateSubmitted}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
