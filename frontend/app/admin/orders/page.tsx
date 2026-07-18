"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  Download,
  FileSpreadsheet,
  X,
  CornerDownRight,
  CreditCard,
  MapPin,
  User,
  CheckCircle,
  Eye,
} from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import PrintOrderManifest from "@/components/admin/printable/order-report";
import { useReactToPrint } from "react-to-print";

// Interfaces aligned precisely with your specifications
export interface CartItem {
  productId: string;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export interface OrderData {
  id: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  customerInfo: CheckoutForm;
  createdAt: number;
  status: "pending" | "confirmed" | "shipped" | "delivered";
}

// Comprehensive Mock Data Seed Set
const mockOrders: OrderData[] = [
  {
    id: "BFL-9021",
    subtotal: 120.0,
    shipping: 10.0,
    tax: 9.6,
    total: 139.6,
    createdAt: 1784376000000, // 2026 Epoch timestamp values
    status: "pending",
    customerInfo: {
      firstName: "Emma",
      lastName: "Watson",
      email: "emma@watson.com",
      phone: "+1 555 0192",
      address: "221b Baker St",
      city: "London",
      state: "Greater London",
      zipCode: "NW1 6XE",
      country: "United Kingdom",
      cardNumber: "•••• •••• •••• 4242",
      expiryDate: "12/29",
      cvv: "•••",
    },
    items: [
      {
        productId: "Minimalist Linen Blouse",
        quantity: 1,
        selectedSize: "S",
        selectedColor: "Ivory",
      },
      {
        productId: "Relaxed Fit Denim Chino",
        quantity: 1,
        selectedSize: "M",
        selectedColor: "Indigo",
      },
    ],
  },
  {
    id: "BFL-8941",
    subtotal: 240.0,
    shipping: 0.0,
    tax: 19.2,
    total: 259.2,
    createdAt: 1784289600000,
    status: "shipped",
    customerInfo: {
      firstName: "Liam",
      lastName: "Neeson",
      email: "liam@taken.com",
      phone: "+1 555 8831",
      address: "45 Wall Street, Apt 12B",
      city: "New York",
      state: "NY",
      zipCode: "10005",
      country: "United States",
      cardNumber: "•••• •••• •••• 1984",
      expiryDate: "06/28",
      cvv: "•••",
    },
    items: [
      {
        productId: "Essential Oversized Blazer",
        quantity: 2,
        selectedSize: "L",
        selectedColor: "Midnight Black",
      },
    ],
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderData[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [printingOrder, setPrintingOrder] = useState<OrderData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Search Logic indexing across customer details, shipping metrics, and order keys
  const filteredOrders = orders.filter((order) => {
    const customer = order.customerInfo;
    const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fullName.includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.country.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Global Excel Exporter Tool combining customer metadata and tabular formats
  const exportToExcel = () => {
    const formattedData = filteredOrders.map((order) => ({
      "Order ID": order.id,
      "Customer Name": `${order.customerInfo.firstName} ${order.customerInfo.lastName}`,
      "Email Address": order.customerInfo.email,
      "Contact Number": order.customerInfo.phone,
      "Shipping Destination": `${order.customerInfo.address}, ${order.customerInfo.city}, ${order.customerInfo.country}`,
      "Total Items": order.items.reduce((acc, curr) => acc + curr.quantity, 0),
      "Subtotal (Rs. )": order.subtotal.toFixed(2),
      "Total Amount (Rs. )": order.total.toFixed(2),
      "Creation Date": new Date(order.createdAt).toLocaleDateString(),
      "Fulfillment Status": order.status.toUpperCase(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders Ledger");
    XLSX.writeFile(
      workbook,
      `BFL_Orders_Ledger_${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  };

  const printRef = useRef<HTMLDivElement>(null);

  const downloadSingleOrderReport = useReactToPrint({
    contentRef: printRef,
  });

  return (
    <div className="space-y-10 relative">
      {/* Title Header Block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-border/40">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-semibold block">
            Fulfillment Registries
          </span>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight font-serif">
            Order Ledger
          </h1>
        </div>
        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-medium border border-border px-4 py-2.5 hover:bg-foreground hover:text-background transition-colors"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Export Ledger (.XLSX)
        </button>
      </div>

      {/* Simplified Search & filtration control hub */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex-1 flex items-center gap-3 border-b px-1 py-1.5 text-muted-foreground focus-within:border-foreground transition-colors group max-w-md">
          <Search className="w-4 h-4 text-muted-foreground/40 group-focus-within:text-foreground transition-colors" />
          <input
            type="text"
            placeholder="Search by customer, destination, index identifier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-[13px] font-light outline-none border-none w-full placeholder:text-foreground/60 text-foreground"
          />
        </div>

        <div className="flex items-center gap-3">
          <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground/60" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-[13px] uppercase tracking-widest font-medium bg-transparent border border-border/60 px-3 py-1.5 outline-none text-muted-foreground hover:text-foreground focus:border-foreground transition-colors"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Tabular Data Grid Layout Structure */}
      <div className="border border-border/60 overflow-hidden bg-background">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/60 bg-zinc-50/50 dark:bg-zinc-900/10 text-[13px] tracking-wider text-muted-foreground/80 font-medium select-none">
                <th className="py-4 px-6 font-semibold">Order Key</th>
                <th className="py-4 px-6 font-semibold">Customer</th>
                <th className="py-4 px-6 font-semibold">Date Registered</th>
                <th className="py-4 px-6 font-semibold">
                  Shipping Destination
                </th>
                <th className="py-4 px-6 font-semibold">Value</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[13px] font-light tracking-wide divide-y divide-border/30">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6 font-mono font-normal text-foreground">
                      {order.id}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-foreground/90">{`${order.customerInfo.firstName} ${order.customerInfo.lastName}`}</div>
                      <div className="text-[11px] text-foreground/50 font-light font-mono mt-0.5">
                        {order.customerInfo.email}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground/80">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-6 text-muted-foreground/80 truncate max-w-[180px]">
                      {`${order.customerInfo.city}, ${order.customerInfo.country}`}
                    </td>
                    <td className="py-4 px-6 font-medium text-foreground">
                      Rs. {order.total.toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-[9px] uppercase tracking-widest px-2 py-1 border ${
                          order.status === "pending"
                            ? "border-amber-500/30 text-amber-600 bg-amber-50/20"
                            : order.status === "shipped"
                              ? "border-blue-500/30 text-blue-600 bg-blue-50/20"
                              : "border-emerald-500/30 text-emerald-600 bg-emerald-50/20"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center cursor-pointer gap-1 border border-border/80 px-2.5 py-1 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Eye className="w-3 h-3" /> Details
                      </button>
                      <button
                        onClick={() => {
                          setPrintingOrder(order);
                          setTimeout(() => {
                            downloadSingleOrderReport();
                            setPrintingOrder(null);
                          }, 50);
                        }}
                        className="inline-flex items-center cursor-pointer justify-center p-1.5 border border-border/80 text-muted-foreground hover:text-foreground transition-colors"
                        title="Download Document Manifest"
                      >
                        <Download className="w-3 text-green-500 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-16 text-muted-foreground/40 font-light"
                  >
                    No matching records discovered inside database logs.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Premium Sliding Side Summary Drawer Modal Panel */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            {/* Backdrop Shimmer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black z-50"
            />

            {/* Report Side Canvas Panel container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.4, ease: "linear" }}
              className="fixed inset-y-0 right-0 w-full max-w-xl bg-background border-l border-border shadow-2xl z-50 p-6 sm:p-8 overflow-y-auto scrollbar-none flex flex-col justify-between"
            >
              <div className="space-y-10">
                {/* Modal Header */}
                <div className="flex items-center justify-between pb-4 border-b border-border/60">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono tracking-widest text-muted-foreground/60 block">
                      MANIFEST NO: {selectedOrder.id}
                    </span>
                    <h2 className="text-xl font-light font-serif">
                      Order Dossier
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-1 border border-border/60 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Section 1: Customer Identity profile */}
                <div className="space-y-4">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-muted-foreground flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-muted-foreground/50" />{" "}
                    01. Customer Properties
                  </h3>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-light pl-5">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60 block">
                        Full Name
                      </span>
                      <p className="text-foreground tracking-wide font-medium mt-0.5">{`${selectedOrder.customerInfo.firstName} ${selectedOrder.customerInfo.lastName}`}</p>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60 block">
                        Primary Contact
                      </span>
                      <p className="text-foreground/80 mt-0.5">
                        {selectedOrder.customerInfo.phone}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60 block">
                        Email Endpoint
                      </span>
                      <p className="text-foreground/80 font-mono mt-0.5">
                        {selectedOrder.customerInfo.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 2: Shipping Logistics */}
                <div className="space-y-4">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-muted-foreground flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground/50" />{" "}
                    02. Logistics Allocation
                  </h3>
                  <div className="text-xs font-light pl-5 space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60 block">
                      Shipping Address
                    </span>
                    <p className="text-foreground/90 tracking-wide leading-relaxed mt-0.5">
                      {selectedOrder.customerInfo.address},{" "}
                      {selectedOrder.customerInfo.city},{" "}
                      {selectedOrder.customerInfo.state}{" "}
                      {selectedOrder.customerInfo.zipCode},{" "}
                      {selectedOrder.customerInfo.country}
                    </p>
                  </div>
                </div>

                {/* Section 3: Itemized Cart Index */}
                <div className="space-y-4">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-muted-foreground flex items-center gap-2">
                    <CornerDownRight className="w-3.5 h-3.5 text-muted-foreground/40" />{" "}
                    03. Manifest Registries
                  </h3>
                  <div className="border border-border/40 divide-y divide-border/30 bg-zinc-50/30 dark:bg-zinc-900/10 ml-5">
                    {selectedOrder.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 flex items-center justify-between text-xs font-light"
                      >
                        <div className="space-y-0.5">
                          <p className="font-medium text-foreground">
                            {item.productId}
                          </p>
                          <div className="flex items-center gap-3 text-[10px] text-muted-foreground/60 tracking-wider uppercase">
                            <span>Size: {item.selectedSize}</span>
                            <span>•</span>
                            <span>Color: {item.selectedColor}</span>
                          </div>
                        </div>
                        <span className="font-mono text-muted-foreground/80">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 4: Secure Wallet Cryptography details */}
                <div className="space-y-4">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-muted-foreground flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5 text-muted-foreground/50" />{" "}
                    04. Financial Settlement
                  </h3>
                  <div className="grid grid-cols-2 gap-y-2 text-xs font-light pl-5">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60 block">
                        Tokenized Card
                      </span>
                      <p className="font-mono text-foreground/80 mt-0.5">
                        {selectedOrder.customerInfo.cardNumber}
                      </p>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60 block">
                        Terms Lifecycle
                      </span>
                      <p className="font-mono text-foreground/80 mt-0.5">
                        Exp: {selectedOrder.customerInfo.expiryDate}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pricing Framework Ingestion calculations */}
                <div className="pt-6 border-t border-border/60 ml-5 space-y-2 text-xs font-light select-none">
                  <div className="flex justify-between text-muted-foreground/70">
                    <span>Subtotal</span>
                    <span>Rs. {selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground/70">
                    <span>Logistics Matrix Routing</span>
                    <span>Rs. {selectedOrder.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground/70">
                    <span>Tax Assessment</span>
                    <span>Rs. {selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-foreground pt-2 border-t border-border/30 font-medium font-serif">
                    <span>Calculated Total</span>
                    <span>Rs. {selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Drawer Secondary Manifest Operations button */}
              <div className="pt-8 border-t border-border/40 mt-10">
                <button
                        onClick={() => {
                          setPrintingOrder(selectedOrder);
                          setTimeout(() => {
                            downloadSingleOrderReport();
                            setPrintingOrder(null);
                          }, 50);
                        }}
                  className="w-full bg-foreground text-background py-3 font-medium tracking-widest text-[10px] uppercase hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Finalize & Download Report
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <div className="hidden">
        <div ref={printRef}>
          {/* Point to printingOrder instead of selectedOrder */}
          {printingOrder && <PrintOrderManifest order={printingOrder} />}
        </div>
      </div>
    </div>
  );
}
