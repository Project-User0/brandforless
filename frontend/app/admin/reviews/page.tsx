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
  Star,
  CheckCircle,
  Calendar,
  MessageSquare,
  Package,
  ThumbsUp,
  User
} from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";

// Explicitly requested data model signature
export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  helpful: number;
  createdAt: number; // Unix timestamp configuration
  verified: boolean;
}

// Seed data array modeling a real apparel e-commerce site architecture
const DEFAULT_REVIEWS: Review[] = [
  {
    id: "REV-9081",
    productId: "PROD-M-LNN",
    author: "Alexander Mercer",
    rating: 5,
    title: "Perfect fit for summer wear",
    content: "The fabric weight is pristine. It breathes incredibly well in warm weather. Fits true to size charts, will definitely purchase the beige version soon.",
    helpful: 14,
    createdAt: 1783262400000, // July 15, 2026
    verified: true
  },
  {
    id: "REV-4421",
    productId: "PROD-W-DNM",
    author: "Clara Vance",
    rating: 2,
    title: "Sizing is significantly off",
    content: "The denim build structure feels durable but the waist measurement is far tighter than typical standard sizing limits. Had to process an international return label.",
    helpful: 27,
    createdAt: 1783348800000, // July 16, 2026
    verified: true
  },
  {
    id: "REV-7703",
    productId: "PROD-U-CP",
    author: "Marcus Aurelius",
    rating: 4,
    title: "Solid baseline cap",
    content: "Clean stitching alignment along the front panels. The vintage washed cotton color matches the promotional product photos precisely.",
    helpful: 3,
    createdAt: 1783435200000, // July 17, 2026
    verified: false
  },
  {
    id: "REV-1290",
    productId: "PROD-M-JKT",
    author: "Hana Kobayashi",
    rating: 5,
    title: "Exceeded structural expectations",
    content: "Premium zipper installation and heavy lining elements. Exceptionally windproof during early dawn motorcycle commutes.",
    helpful: 9,
    createdAt: 1783521600000, // July 18, 2026
    verified: true
  }
];

export default function AdminReviewPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  
  // Pagination Management Framework Matrix (Strict 10 records per view tier)
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Visual Detail Inspection Side-Drawer Subsystem Configuration
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  // Storage Hydration Lifecycles
  useEffect(() => {
    const stored = localStorage.getItem("catalog_reviews");
    if (stored) {
      try {
        setReviews(JSON.parse(stored));
      } catch (e) {
        setReviews(DEFAULT_REVIEWS);
      }
    } else {
      setReviews(DEFAULT_REVIEWS);
      localStorage.setItem("catalog_reviews", JSON.stringify(DEFAULT_REVIEWS));
    }
  }, []);

  const saveReviews = (updatedList: Review[]) => {
    setReviews(updatedList);
    localStorage.setItem("catalog_reviews", JSON.stringify(updatedList));
  };

  // Live Audit Filtering Engine
  const filteredReviews = reviews.filter((rev) => {
    const matchesSearch = 
      rev.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.productId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRating = ratingFilter === "all" || rev.rating === parseInt(ratingFilter);
    return matchesSearch && matchesRating;
  });

  // Structural Pagination Computations
  const totalPages = Math.ceil(filteredReviews.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredReviews.slice(indexOfFirstRecord, indexOfLastRecord);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, ratingFilter]);

  const openViewDrawer = (review: Review) => {
    setSelectedReview(review);
    setIsDrawerOpen(true);
  };

  // Content Purge Handler
  const handleDeleteReview = (id: string) => {
    if (confirm("Are you absolutely sure you want to remove this public customer review ledger from the catalog permanently?")) {
      const updated = reviews.filter((rev) => rev.id !== id);
      saveReviews(updated);
      toast.error(`Review entry ${id} purged successfully.`);
      if (selectedReview?.id === id) setIsDrawerOpen(false);
    }
  };

  // Mass Excel Matrix Exporter Subsystem
  const exportReviewsExcel = () => {
    const exportDataset = filteredReviews.map((rev) => ({
      "Review Log Key": rev.id,
      "Target Product SKU ID": rev.productId,
      "Author Display Name": rev.author,
      "Numeric Star Rating": rev.rating,
      "Heading Summary Title": rev.title,
      "Detailed Core Context": rev.content,
      "Helpful Voter Count": rev.helpful,
      "Verified Buyer Flag": rev.verified ? "VERIFIED" : "UNVERIFIED",
      "Timestamp Logged Date": new Date(rev.createdAt).toISOString().slice(0, 10)
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportDataset);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Public Catalog Reviews");
    XLSX.writeFile(workbook, `Product_Reviews_Audit_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Star Rating Array Formatter
  const renderStars = (count: number) => {
    return Array.from({ length: 5 }).map((_, idx) => (
      <Star 
        key={idx} 
        className={`w-3 h-3 ${idx < count ? "text-neutral-900 fill-neutral-900" : "text-gray-600"}`} 
      />
    ));
  };

  return (
    <div className="space-y-6">
      
      {/* Upper Title Header Component Block Layout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Product Reviews Audit</h1>
          <p className="text-xs text-gray-500 mt-0.5 font-light">Monitor user feedback channels, track sizing complaints, inspect low-tier satisfaction entries, and verify genuine customer purchases.</p>
        </div>
        <button
          onClick={exportReviewsExcel}
          className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-medium border border-gray-300 px-4 py-2 rounded bg-white hover:bg-gray-50 transition-colors"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-700" /> Export Feed Spreadsheet
        </button>
      </div>

      {/* Operational Search Deck Matrices */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-2 border border-gray-300 rounded px-3 py-1.5 bg-white w-full sm:max-w-xs focus-within:border-black transition-colors">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by author, SKU, text context..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs outline-none w-full text-gray-900 placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="text-xs font-medium bg-white border border-gray-300 rounded px-3 py-1.5 outline-none text-gray-700 hover:text-black focus:border-black transition-colors"
          >
            <option value="all">All Star Scores</option>
            <option value="5">5 Stars Excellent</option>
            <option value="4">4 Stars Good</option>
            <option value="3">3 Stars Neutral</option>
            <option value="2">2 Stars Poor</option>
            <option value="1">1 Star Critical</option>
          </select>
        </div>
      </div>

      {/* Main Table Display Workspace Container */}
      <div className="border border-gray-200 rounded bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4">Review Key</th>
                <th className="py-3 px-4">Product SKU</th>
                <th className="py-3 px-4">Author Profile</th>
                <th className="py-3 px-4">Score Metric</th>
                <th className="py-3 px-4">Feedback Summary Summary</th>
                <th className="py-3 px-4 text-right">Row Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-gray-100 text-gray-700">
              {currentRecords.length > 0 ? (
                currentRecords.map((rev) => (
                  <tr key={rev.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-gray-900">{rev.id}</td>
                    <td className="py-3 px-4 font-mono text-gray-600 font-semibold">{rev.productId}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-medium text-gray-900">
                        {rev.author}
                        {rev.verified && (
                          <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-50/20" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-0.5">{renderStars(rev.rating)}</div>
                    </td>
                    <td className="py-3 px-4 max-w-sm truncate text-gray-600 font-light">
                      <span className="font-medium text-gray-900 mr-1">"{rev.title}"</span> — {rev.content}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => openViewDrawer(rev)}
                        className="p-1 border border-gray-200 rounded text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                        title="Inspect Complete Text Node"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="p-1 border border-red-100 rounded text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Review Node From Catalog"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 font-light">
                    No consumer catalog review inputs correspond to active query patterns.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Navigation Pagination Control Array */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white text-[11px] text-gray-500">
            <span>
              Showing Page {currentPage} of {totalPages} (Total Catalog Reviews: {filteredReviews.length})
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

      {/* Review Information Detail Overlay Side Drawer */}
      {isDrawerOpen && selectedReview && (
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
                  <h2 className="text-lg font-medium text-gray-900">Review Data Dossier</h2>
                  <p className="text-xs text-gray-400">Unique Token ID: {selectedReview.id}</p>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Core Information Stack */}
              <div className="space-y-5 text-xs text-gray-700">
                
                {/* 1. Profile Context */}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <User className="w-3 h-3" /> Author Profile Properties
                  </h3>
                  <div className="bg-gray-50 p-3 rounded space-y-2 border border-gray-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-gray-400 block">User Signature Name</span>
                        <span className="font-semibold text-gray-900 text-sm">{selectedReview.author}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 block">Purchase State</span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          selectedReview.verified 
                            ? "bg-blue-50 text-blue-700 border border-blue-100" 
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {selectedReview.verified ? "Verified Buyer" : "Guest / Unverified"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Product Matrix Connection */}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Package className="w-3 h-3" /> Linked Inventory Nodes
                  </h3>
                  <div className="bg-gray-50 p-3 rounded border border-gray-100 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-gray-400 block">Product Identification SKU</span>
                      <span className="font-mono font-bold text-gray-900">{selectedReview.productId}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Metrics and Stars */}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Star className="w-3 h-3" /> Satisfaction Score Parameters
                  </h3>
                  <div className="bg-gray-50 p-3 rounded border border-gray-100 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-gray-400 block">Assigned Stars</span>
                      <div className="flex items-center gap-0.5 mt-0.5">{renderStars(selectedReview.rating)}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 block">Score Index</span>
                      <span className="font-mono font-bold text-sm text-gray-900">{selectedReview.rating} / 5.0</span>
                    </div>
                  </div>
                </div>

                {/* 4. Complete Message Context Area */}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> Core Content Narrative
                  </h3>
                  <div className="bg-gray-50 p-3 rounded border border-gray-100 space-y-2">
                    <div>
                      <span className="text-[10px] text-gray-400 block">Heading Title Summarization</span>
                      <span className="font-semibold text-gray-900 text-sm">"{selectedReview.title}"</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200/60">
                      <span className="text-[10px] text-gray-400 block">Narrative Body Text</span>
                      <p className="mt-1 text-gray-600 font-light leading-relaxed bg-white p-3 border border-gray-200 rounded whitespace-pre-wrap">
                        {selectedReview.content}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 5. Timestamps & Social Votes */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded border border-gray-100">
                    <span className="text-[10px] text-gray-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> Logged On</span>
                    <p className="font-semibold text-gray-900 mt-0.5">
                      {new Date(selectedReview.createdAt).toISOString().slice(0, 10)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded border border-gray-100">
                    <span className="text-[10px] text-gray-400 flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> Helpful Engagement</span>
                    <p className="font-mono font-semibold text-gray-900 mt-0.5">+{selectedReview.helpful} Upvotes</p>
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