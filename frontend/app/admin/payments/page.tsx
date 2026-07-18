"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  CreditCard,
  DollarSign,
  ShoppingBag,
  Eye,
} from "lucide-react";

// --- Types & Interfaces ---
interface PaymentRecord {
  id: string;
  transactionId: string;
  orderId: string;
  customer: {
    name: string;
    email: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  amount: number;
  method: "Credit Card" | "PayPal" | "Apple Pay" | "Bank Transfer";
  status: "Completed" | "Pending" | "Failed";
  date: string;
}

// --- High Quality Static Mock Data ---
const MOCK_PAYMENTS: PaymentRecord[] = [
  {
    id: "PAY-001",
    transactionId: "TXN-98421048",
    orderId: "ORD-84920",
    customer: { name: "Alexander Wright", email: "a.wright@studio.com" },
    items: [
      { name: "Minimalist Leather Tote", quantity: 1, price: 285.0 },
      { name: "Silk Twill Scarf", quantity: 2, price: 95.0 },
    ],
    amount: 475.0,
    method: "Credit Card",
    status: "Completed",
    date: "2026-07-18 14:32",
  },
  {
    id: "PAY-002",
    transactionId: "TXN-10495821",
    orderId: "ORD-84921",
    customer: { name: "Elena Rostova", email: "elena.ros@archive.net" },
    items: [{ name: "Cashmere Knit Sweater", quantity: 1, price: 420.0 }],
    amount: 420.0,
    method: "Apple Pay",
    status: "Completed",
    date: "2026-07-18 11:15",
  },
  {
    id: "PAY-003",
    transactionId: "TXN-49201948",
    orderId: "ORD-84922",
    customer: { name: "Marcus Vance", email: "marcus.v@designco.org" },
    items: [
      { name: "Tailored Wool Blazer", quantity: 1, price: 550.0 },
      { name: "Classic Poplin Shirt", quantity: 1, price: 120.0 },
    ],
    amount: 670.0,
    method: "Credit Card",
    status: "Pending",
    date: "2026-07-17 16:45",
  },
  {
    id: "PAY-004",
    transactionId: "TXN-58301934",
    orderId: "ORD-84923",
    customer: { name: "Sora Tanaka", email: "s.tanaka@tokyo.io" },
    items: [{ name: "Japanese Denim Jeans", quantity: 1, price: 210.0 }],
    amount: 210.0,
    method: "PayPal",
    status: "Failed",
    date: "2026-07-17 09:22",
  },
  {
    id: "PAY-005",
    transactionId: "TXN-77301922",
    orderId: "ORD-84924",
    customer: { name: "Clara Mendel", email: "clara@mendel.de" },
    items: [
      { name: "Suede Ankle Boots", quantity: 1, price: 340.0 },
      { name: "Merino Wool Socks", quantity: 3, price: 25.0 },
    ],
    amount: 415.0,
    method: "Bank Transfer",
    status: "Completed",
    date: "2026-07-16 18:02",
  },
];

export default function PaymentDetailsPage() {
  // --- UI Filter & Context States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [methodFilter, setMethodFilter] = useState<string>("ALL");
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(
    null,
  );

  // --- Dynamic Live Revenue Metric Calculations ---
  const stats = useMemo(() => {
    let total = 0;
    let completedCount = 0;
    let pendingCount = 0;
    let failedCount = 0;

    MOCK_PAYMENTS.forEach((p) => {
      if (p.status === "Completed") {
        total += p.amount;
        completedCount++;
      } else if (p.status === "Pending") {
        pendingCount++;
      } else if (p.status === "Failed") {
        failedCount++;
      }
    });

    return { total, completedCount, pendingCount, failedCount };
  }, []);

  // --- Search & Filter Evaluation Matrix ---
  const filteredPayments = useMemo(() => {
    return MOCK_PAYMENTS.filter((payment) => {
      const matchesSearch =
        payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.transactionId
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.customer.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        payment.customer.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || payment.status === statusFilter;
      const matchesMethod =
        methodFilter === "ALL" || payment.method === methodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [searchTerm, statusFilter, methodFilter]);

  return (
    <div className="space-y-8 bg-neutral-50/50 min-h-screen font-sans text-neutral-900 antialiased">
      {/* Top Main Heading Actions panel */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-serif font-light tracking-tight text-neutral-900">
            Payment Ledger
          </h1>
          <p className="text-xs font-light text-neutral-500 mt-0.5">
            Audit global incoming transactions, payment pipelines, and order
            items settlement records.
          </p>
        </div>
        <div>
          <button className="inline-flex items-center gap-2 bg-white border border-neutral-200 px-3.5 py-2 text-xs font-medium uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-all rounded-none shadow-sm">
            <Download className="h-3.5 w-3.5" />
            Export Ledger
          </button>
        </div>
      </div>

      {/* --- SECTION 1: Dynamic Revenue & Transaction Stats Matrix --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Gross Gross Settled Revenue */}
        <div className="bg-white border border-neutral-200 p-5 rounded-none shadow-sm flex items-start justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-medium uppercase tracking-widest text-neutral-400 block">
              Settled Revenue
            </span>
            <span className="text-2xl font-serif font-light text-neutral-900 block">
              ${stats.total.toFixed(2)}
            </span>
            <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-none">
              +{stats.completedCount} Settled Orders
            </span>
          </div>
          <div className="bg-neutral-50 p-2.5 text-neutral-600 border border-neutral-100">
            <DollarSign className="h-4 w-4 stroke-[1.5]" />
          </div>
        </div>

        {/* Card 2: Pending Volume */}
        <div className="bg-white border border-neutral-200 p-5 rounded-none shadow-sm flex items-start justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-medium uppercase tracking-widest text-neutral-400 block">
              Pending Process
            </span>
            <span className="text-2xl font-serif font-light text-neutral-900 block">
              {stats.pendingCount}
            </span>
            <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-none">
              Awaiting Clearances
            </span>
          </div>
          <div className="bg-neutral-50 p-2.5 text-neutral-600 border border-neutral-100">
            <CreditCard className="h-4 w-4 stroke-[1.5]" />
          </div>
        </div>

        {/* Card 3: Failed Transactions Exception Count */}
        <div className="bg-white border border-neutral-200 p-5 rounded-none shadow-sm flex items-start justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-medium uppercase tracking-widest text-neutral-400 block">
              Failed Attempts
            </span>
            <span className="text-2xl font-serif font-light text-neutral-900 block">
              {stats.failedCount}
            </span>
            <span className="text-[10px] font-medium text-destructive bg-destructive/5 px-1.5 py-0.5 rounded-none">
              Requires Attention
            </span>
          </div>
          <div className="bg-neutral-50 p-2.5 text-neutral-600 border border-neutral-100">
            <AlertCircle className="h-4 w-4 stroke-[1.5]" />
          </div>
        </div>

        {/* Card 4: Global Conversion Performance Rate */}
        <div className="bg-white border border-neutral-200 p-5 rounded-none shadow-sm flex items-start justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-medium uppercase tracking-widest text-neutral-400 block">
              Success Ratio
            </span>
            <span className="text-2xl font-serif font-light text-neutral-900 block">
              {((stats.completedCount / MOCK_PAYMENTS.length) * 100).toFixed(0)}
              %
            </span>
            <span className="text-[10px] font-medium text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded-none">
              Across {MOCK_PAYMENTS.length} Payments
            </span>
          </div>
          <div className="bg-neutral-50 p-2.5 text-neutral-600 border border-neutral-100">
            <ShoppingBag className="h-4 w-4 stroke-[1.5]" />
          </div>
        </div>
      </div>

      {/* --- SECTION 2: Control Filtering and Search Actions Pipeline --- */}
      <div className="bg-white border border-neutral-200 p-4 rounded-none shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Input Box */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400/80" />
          <input
            type="text"
            placeholder="Search by Payment ID, Transaction, Order ID, or Customer email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-200 bg-white rounded-none text-xs text-neutral-800 placeholder:text-neutral-400 placeholder:font-light focus:outline-none focus:border-neutral-900 transition-colors"
          />
        </div>

        {/* Filter Dropdown Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 border border-neutral-200 px-3 py-1.5 bg-white">
            <Filter className="h-3.5 w-3.5 text-neutral-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-medium text-neutral-700 bg-transparent outline-none cursor-pointer pr-2"
            >
              <option value="ALL">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <div className="flex items-center gap-2 border border-neutral-200 px-3 py-1.5 bg-white">
            <CreditCard className="h-3.5 w-3.5 text-neutral-400" />
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="text-xs font-medium text-neutral-700 bg-transparent outline-none cursor-pointer pr-2"
            >
              <option value="ALL">All Gateways</option>
              <option value="Credit Card">Credit Card</option>
              <option value="PayPal">PayPal</option>
              <option value="Apple Pay">Apple Pay</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          {(searchTerm || statusFilter !== "ALL" || methodFilter !== "ALL") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("ALL");
                setMethodFilter("ALL");
              }}
              className="text-xs text-neutral-500 underline uppercase tracking-wider font-medium hover:text-neutral-900 transition-colors pl-2"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* --- SECTION 3: Main Ledger Records Data Table --- */}
      <div className="bg-white border border-neutral-200 rounded-none shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] font-medium uppercase tracking-widest text-neutral-400">
                <th className="py-3.5 px-4 font-medium">Payment ID / Date</th>
                <th className="py-3.5 px-4 font-medium">References</th>
                <th className="py-3.5 px-4 font-medium">Customer Details</th>
                <th className="py-3.5 px-4 font-medium">Settled Items</th>
                <th className="py-3.5 px-4 font-medium">Gateway</th>
                <th className="py-3.5 px-4 font-medium">Status</th>
                <th className="py-3.5 px-4 font-medium text-right">
                  Gross Amount
                </th>
                <th className="py-3.5 px-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-neutral-50/50 transition-colors group"
                  >
                    {/* ID & Date Column */}
                    <td className="py-4 px-4 vertical-top">
                      <span className="font-medium text-neutral-900 block">
                        {payment.id}
                      </span>
                      <span className="text-[10px] text-neutral-400 block mt-0.5">
                        {payment.date}
                      </span>
                    </td>

                    {/* Order & Transaction IDs Reference Columns */}
                    <td className="py-4 px-4">
                      <span className="font-mono text-[11px] text-neutral-700 bg-neutral-100 px-1.5 py-0.5 block w-fit rounded-none">
                        {payment.orderId}
                      </span>
                      <span className="font-mono text-[10px] text-neutral-400 block mt-1 tracking-tight">
                        {payment.transactionId}
                      </span>
                    </td>

                    {/* Customer Info Identity Column */}
                    <td className="py-4 px-4">
                      <span className="font-medium text-neutral-800 block">
                        {payment.customer.name}
                      </span>
                      <span className="text-[10px] text-neutral-400 block tracking-wide">
                        {payment.customer.email}
                      </span>
                    </td>

                    {/* Order Item Mapping Summary Field Stack */}
                    <td className="py-4 px-4 max-w-xs">
                      <div className="space-y-1">
                        {payment.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-4 text-[11px] text-neutral-600"
                          >
                            <span className="truncate max-w-[160px] font-light">
                              {item.name}
                            </span>
                            <span className="text-neutral-400 font-mono text-[10px] flex-shrink-0">
                              x{item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Gateway Payment Provider Type Method */}
                    <td className="py-4 px-4 text-neutral-600 font-light">
                      {payment.method}
                    </td>

                    {/* Structural Processing State Status Badges */}
                    <td className="py-4 px-4">
                      {payment.status === "Completed" && (
                        <span className="inline-flex items-center gap-1.5 rounded-none bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-100">
                          <CheckCircle2 className="h-3 w-3" /> Completed
                        </span>
                      )}
                      {payment.status === "Pending" && (
                        <span className="inline-flex items-center gap-1.5 rounded-none bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700 border border-amber-100">
                          <ClockIcon className="h-3 w-3 animate-pulse" />{" "}
                          Pending
                        </span>
                      )}
                      {payment.status === "Failed" && (
                        <span className="inline-flex items-center gap-1.5 rounded-none bg-destructive/5 px-2 py-0.5 text-[10px] font-medium text-destructive border border-destructive/10">
                          <XCircle className="h-3 w-3" /> Failed
                        </span>
                      )}
                    </td>

                    {/* Financial Amount Value Numeric Columns */}
                    <td className="py-4 px-4 text-right font-mono font-medium text-neutral-900">
                      ${payment.amount.toFixed(2)}
                    </td>

                    {/* Row Item Audit Operations Drawer Activation Toggles */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => setSelectedPayment(payment)}
                        className="text-neutral-400 hover:text-neutral-900 p-1 transition-colors rounded-none"
                        title="View Detailed Logs"
                      >
                        <Eye className="h-4 w-4 stroke-[1.5]" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-12 text-neutral-400 font-light"
                  >
                    No transaction entries match the current filter parameters
                    context configuration.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Records Footer Matrix Summary Metrics Details */}
        <div className="bg-neutral-50 px-4 py-3 border-t border-neutral-200 flex items-center justify-between text-[11px] text-neutral-500">
          <span>
            Showing <b>{filteredPayments.length}</b> of{" "}
            <b>{MOCK_PAYMENTS.length}</b> ledger settlements.
          </span>
          <span className="font-light">
            Database Persistence Layer: Mock Local Array Store
          </span>
        </div>
      </div>

      {/* --- SECTION 4: Contextual Slide-Over Drawer Modal Interface for Specific Record Audits --- */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/20 backdrop-blur-sm">
          <div className="w-full max-w-md h-full bg-white p-6 shadow-2xl flex flex-col justify-between border-l border-neutral-200 animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                <div>
                  <h3 className="font-serif text-lg font-light text-neutral-900">
                    Transaction Audit
                  </h3>
                  <p className="text-[10px] font-mono text-neutral-400 mt-0.5">
                    {selectedPayment.id} logs details
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="text-xs uppercase tracking-widest font-medium border-b border-transparent text-neutral-400 hover:text-neutral-900 transition-colors"
                >
                  Close
                </button>
              </div>

              {/* Summary Status Parameters Summary Block */}
              <div className="bg-neutral-50 border border-neutral-100 p-4 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400 font-light">
                    Payment Gateway Status:
                  </span>
                  <span className="font-medium text-neutral-800">
                    {selectedPayment.status}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400 font-light">
                    Provider Signature:
                  </span>
                  <span className="font-mono text-neutral-700">
                    {selectedPayment.transactionId}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400 font-light">
                    Timestamp:
                  </span>
                  <span className="text-neutral-600">
                    {selectedPayment.date}
                  </span>
                </div>
              </div>

              {/* Customer Entity Identity Node Block */}
              <div className="space-y-2">
                <h4 className="text-[10px] uppercase tracking-widest font-medium text-neutral-400">
                  Account Owner
                </h4>
                <div className="text-xs border border-neutral-200 p-3 bg-white space-y-1">
                  <p className="font-medium text-neutral-900">
                    {selectedPayment.customer.name}
                  </p>
                  <p className="text-neutral-500 font-light">
                    {selectedPayment.customer.email}
                  </p>
                </div>
              </div>

              {/* Itemized Breakdown Parameters Content Loop Stack */}
              <div className="space-y-2">
                <h4 className="text-[10px] uppercase tracking-widest font-medium text-neutral-400">
                  Purchased Inventory
                </h4>
                <div className="border border-neutral-200 divide-y divide-neutral-100 bg-white">
                  {selectedPayment.items.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 flex justify-between items-center text-xs"
                    >
                      <div>
                        <p className="font-medium text-neutral-800">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-neutral-400 font-light">
                          Unit Cost: ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <span className="font-mono font-medium text-neutral-700">
                        x{item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Total Footer Calculation Drawer Block Area */}
            <div className="border-t border-neutral-200 pt-4 bg-white space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
                  Total Settlement Gross
                </span>
                <span className="font-mono text-xl font-medium text-neutral-900">
                  ${selectedPayment.amount.toFixed(2)}
                </span>
              </div>
              <button
                onClick={() =>
                  alert(
                    `Printing detailed transaction invoice for receipt reference key node ID: ${selectedPayment.transactionId}`,
                  )
                }
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white uppercase text-[10px] tracking-widest py-3 font-light transition-colors"
              >
                Print Transaction Invoice Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Supplementary Inline Small Icon Component Helper Instance ---
function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
