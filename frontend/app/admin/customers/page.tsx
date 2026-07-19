"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  FileSpreadsheet,
  Plus,
  Edit3,
  Trash2,
  Eye,
  X,
  UserPlus,
  User,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
} from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";

// Simple Customer Interface
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  status: "active" | "inactive";
  totalOrders: number;
  totalSpent: number;
  joinedDate: string;
}

// Default Customer Data for a Clothing Brand
const DEFAULT_CUSTOMERS: Customer[] = [
  {
    id: "CUST-4901",
    firstName: "Sarah",
    lastName: "Jenkins",
    email: "sarah.j@outlook.com",
    phone: "+1 (555) 014-9921",
    city: "San Francisco",
    country: "United States",
    status: "active",
    totalOrders: 14,
    totalSpent: 1240.5,
    joinedDate: "2025-04-12",
  },
  {
    id: "CUST-3829",
    firstName: "Matthieu",
    lastName: "Dubois",
    email: "m.dubois@paris.fr",
    phone: "+33 6 5555 0142",
    city: "Paris",
    country: "France",
    status: "active",
    totalOrders: 8,
    totalSpent: 890.0,
    joinedDate: "2025-08-19",
  },
  {
    id: "CUST-2104",
    firstName: "Amara",
    lastName: "Okafor",
    email: "amara.okafor@techcorp.ng",
    phone: "+234 1 555 8831",
    city: "Lagos",
    country: "Nigeria",
    status: "inactive",
    totalOrders: 3,
    totalSpent: 145.2,
    joinedDate: "2025-11-02",
  },
  {
    id: "CUST-9012",
    firstName: "Yuki",
    lastName: "Tanaka",
    email: "y.tanaka@net-tokyo.jp",
    phone: "+81 3 5555 0199",
    city: "Tokyo",
    country: "Japan",
    status: "active",
    totalOrders: 27,
    totalSpent: 4120.75,
    joinedDate: "2024-02-28",
  },
];

export default function CustomerPage() {
  // Customer State
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Pagination State (Limit 10)
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Drawer Modes: closed, create, edit, view
  const [drawerMode, setDrawerMode] = useState<
    "closed" | "create" | "edit" | "view"
  >("closed");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  // Form Fields State
  const [formData, setFormData] = useState<
    Omit<Customer, "id" | "totalOrders" | "totalSpent" | "joinedDate">
  >({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    status: "active",
  });

  // Load from LocalStorage
  useEffect(() => {
    const stored = localStorage.getItem("clothing_customers");
    if (stored) {
      try {
        setCustomers(JSON.parse(stored));
      } catch (e) {
        setCustomers(DEFAULT_CUSTOMERS);
      }
    } else {
      setCustomers(DEFAULT_CUSTOMERS);
      localStorage.setItem(
        "clothing_customers",
        JSON.stringify(DEFAULT_CUSTOMERS),
      );
    }
  }, []);

  const saveCustomers = (updatedList: Customer[]) => {
    setCustomers(updatedList);
    localStorage.setItem("clothing_customers", JSON.stringify(updatedList));
  };

  // Search and Filter logic
  const filteredCustomers = customers.filter((cust) => {
    const fullName = `${cust.firstName} ${cust.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      cust.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || cust.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination Math
  const totalPages = Math.ceil(filteredCustomers.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredCustomers.slice(
    indexOfFirstRecord,
    indexOfLastRecord,
  );

  // Reset page when filtering
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Drawer Controllers
  const openCreateDrawer = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      city: "",
      country: "",
      status: "active",
    });
    setDrawerMode("create");
  };

  const openEditDrawer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      city: customer.city,
      country: customer.country,
      status: customer.status,
    });
    setDrawerMode("edit");
  };

  const openViewDrawer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDrawerMode("view");
  };

  // Add / Edit Form Submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (drawerMode === "create") {
      const newCustomer: Customer = {
        ...formData,
        id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
        totalOrders: 0,
        totalSpent: 0.0,
        joinedDate: new Date().toISOString().split("T")[0],
      };
      const updated = [newCustomer, ...customers];
      saveCustomers(updated);
      toast.success("New customer profile added successfully");
    } else if (drawerMode === "edit" && selectedCustomer) {
      const updated = customers.map((c) =>
        c.id === selectedCustomer.id ? { ...c, ...formData } : c,
      );
      saveCustomers(updated);
      toast.success(`Customer ${selectedCustomer.id} details updated`);
    }
    setDrawerMode("closed");
  };

  const handleDeleteCustomer = (id: string) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      const updated = customers.filter((c) => c.id !== id);
      saveCustomers(updated);
      toast.error(`Customer ${id} has been removed.`);
    }
  };

  // Structured Global Excel Exporter
  const exportToExcel = () => {
    const exportData = filteredCustomers.map((c) => ({
      "Customer ID": c.id,
      "Customer Name": `${c.firstName} ${c.lastName}`,
      Email: c.email,
      Phone: c.phone,
      Location: `${c.city}, ${c.country}`,
      "Total Orders": c.totalOrders,
      "Total Spent ($)": c.totalSpent.toFixed(2),
      Status: c.status.toUpperCase(),
      "Joined Date": c.joinedDate,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
    XLSX.writeFile(
      workbook,
      `Clothing_Customers_${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  };

  return (
    <div className="space-y-10 relative">
      {/* Title Header Block Layout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-border/40">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight font-serif text-foreground">
            Customers
          </h1>
          <span className="text-[10px] tracking-[0.3em] text-muted-foreground font-semibold block">
            Manage your store shoppers, order histories and contact profiles.
          </span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-medium border border-border px-4 py-2.5 hover:bg-foreground hover:text-background transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export to Excel
          </button>
          <button
            onClick={openCreateDrawer}
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-medium bg-foreground text-background px-4 py-2.5 hover:bg-opacity-90 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Customer
          </button>
        </div>
      </div>

      {/* Query Filtration Control Console */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex-1 flex items-center gap-3 border-b border-border/40 px-1 py-1.5 text-muted-foreground focus-within:border-foreground transition-colors group max-w-md">
          <Search className="w-4 h-4 text-muted-foreground/40 group-focus-within:text-foreground transition-colors" />
          <input
            type="text"
            placeholder="Search by name, email, or city..."
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
            className="text-[10px] uppercase tracking-widest font-medium bg-transparent border border-border/60 px-3 py-1.5 outline-none text-muted-foreground hover:text-foreground focus:border-foreground transition-colors"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Members</option>
            <option value="inactive">Inactive Members</option>
          </select>
        </div>
      </div>

      {/* Main Tabular Registry Structure */}
      <div className="border border-border/60 overflow-hidden bg-background">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/60 bg-zinc-50/50 dark:bg-zinc-900/10 text-[10px] uppercase tracking-wider text-muted-foreground/80 font-semibold select-none">
                <th className="py-4 px-6">Customer ID</th>
                <th className="py-4 px-6">Name & Email</th>
                <th className="py-4 px-6">Location</th>
                <th className="py-4 px-6">Orders Placed</th>
                <th className="py-4 px-6">Total Spend</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs font-light tracking-wide divide-y divide-border/30">
              {currentRecords.length > 0 ? (
                currentRecords.map((cust) => (
                  <tr
                    key={cust.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6 font-mono font-normal text-foreground">
                      {cust.id}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-foreground/90">
                        {cust.firstName} {cust.lastName}
                      </div>
                      <div className="text-[10px] text-muted-foreground/50 font-mono mt-0.5">
                        {cust.email}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground/80">
                      {cust.city}, {cust.country}
                    </td>
                    <td className="py-4 px-6 font-mono text-muted-foreground/70">
                      {cust.totalOrders} items ordered
                    </td>
                    <td className="py-4 px-6 font-medium text-foreground">
                      ${cust.totalSpent.toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-[9px] uppercase tracking-widest px-2 py-0.5 border ${
                          cust.status === "active"
                            ? "border-emerald-500/30 text-emerald-600 bg-emerald-50/20"
                            : "border-rose-500/30 text-rose-600 bg-rose-50/20"
                        }`}
                      >
                        {cust.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => openViewDrawer(cust)}
                        className="p-1.5 border border-border text-muted-foreground hover:text-foreground transition-colors"
                        title="Inspect Registry Dossier"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openEditDrawer(cust)}
                        className="p-1.5 border border-border text-muted-foreground hover:text-foreground transition-colors"
                        title="Mutate Structural Parameters"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(cust.id)}
                        className="p-1.5 border border-rose-500/20 text-rose-600 hover:bg-rose-500 hover:text-white transition-colors"
                        title="Purge Profile Entry"
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
                    className="text-center py-16 text-muted-foreground/40 font-light"
                  >
                    No customers found matching your search options.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination Matrix Control Deck */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border/40 text-[10px] uppercase tracking-widest font-mono select-none text-muted-foreground">
            <span>
              Page {currentPage} of {totalPages} // Total Logs Found:{" "}
              {filteredCustomers.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 border border-border disabled:opacity-30 disabled:hover:bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-1.5 border border-border disabled:opacity-30 disabled:hover:bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Unified Context Sliding Side-Drawer Drawer Layout Panel */}
      {drawerMode !== "closed" && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-50 transition-opacity"
            onClick={() => setDrawerMode("closed")}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-background border-l border-border shadow-2xl z-50 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-10">
              {/* Drawer Dynamic Context Title */}
              <div className="flex items-center justify-between pb-4 border-b border-border/60">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono tracking-widest text-muted-foreground/60 block uppercase">
                    {drawerMode === "view"
                      ? `CUSTOMERID: ${selectedCustomer?.id}`
                      : "CUSTOMER ACCOUNTANCY"}
                  </span>
                  <h2 className="text-xl font-light font-serif text-foreground">
                    {drawerMode === "create" && "Add New Customer"}
                    {drawerMode === "edit" && "Edit Customer Details"}
                    {drawerMode === "view" && "Customer Information"}
                  </h2>
                </div>
                <button
                  onClick={() => setDrawerMode("closed")}
                  className="p-1 border border-border/60 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* VIEW ONLY DOM LAYOUT CONTAINER */}
              {drawerMode === "view" && selectedCustomer && (
                <div className="space-y-8 text-xs font-light">
                  <div className="space-y-3">
                    <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground border-b border-border/40 pb-1">
                      <User className="w-3.5 h-3.5 inline mr-1" /> 01. Profile
                      Info
                    </h3>
                    <div className="grid grid-cols-2 gap-y-3 pl-4">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60 block">
                          Customer Name
                        </span>
                        <p className="font-medium text-foreground text-sm">
                          {selectedCustomer.firstName}{" "}
                          {selectedCustomer.lastName}
                        </p>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60 block">
                          Joined Store On
                        </span>
                        <p className="font-mono mt-0.5">
                          {selectedCustomer.joinedDate}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground border-b border-border/40 pb-1">
                      <Mail className="w-3.5 h-3.5 inline mr-1" /> 02. Contact
                      Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 pl-4">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60 block">
                          Email Link
                        </span>
                        <p className="font-mono mt-0.5 text-foreground/90">
                          {selectedCustomer.email}
                        </p>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60 block">
                          Phone Number
                        </span>
                        <p className="mt-0.5 text-foreground/90">
                          {selectedCustomer.phone}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground border-b border-border/40 pb-1">
                      <MapPin className="w-3.5 h-3.5 inline mr-1" /> 03.
                      Shipping Location
                    </h3>
                    <div className="pl-4">
                      <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60 block">
                        Address Node
                      </span>
                      <p className="mt-0.5 text-foreground/90">
                        {selectedCustomer.city}, {selectedCustomer.country}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border/60 pl-4 space-y-2 select-none">
                    <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                      <ShoppingBag className="w-3 h-3" /> 04. Purchase History
                    </h3>
                    <div className="flex justify-between text-muted-foreground/70 font-mono">
                      <span>Total Orders</span>
                      <span>{selectedCustomer.totalOrders} checkouts</span>
                    </div>
                    <div className="flex justify-between text-sm text-foreground pt-2 border-t border-border/30 font-semibold font-serif">
                      <span>Total Spent</span>
                      <span className="font-sans">
                        ${selectedCustomer.totalSpent.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* MUTATION MUTABLE FIELDS (CREATE & EDIT MODES) */}
              {(drawerMode === "create" || drawerMode === "edit") && (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[12px] uppercase tracking-widest font-mono text-muted-foreground block">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full bg-transparent border border-border/80 px-3 py-2 text-xs font-light outline-none text-foreground focus:border-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[12px] uppercase tracking-widest font-mono text-muted-foreground block">
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="w-full bg-transparent border border-border/80 px-3 py-2 text-xs font-light outline-none text-foreground focus:border-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[12px] uppercase tracking-widest font-mono text-muted-foreground block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-transparent border border-border/80 px-3 py-2 text-xs font-light font-mono outline-none text-foreground focus:border-foreground"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[12px] uppercase tracking-widest font-mono text-muted-foreground block">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full bg-transparent border border-border/80 px-3 py-2 text-xs font-light outline-none text-foreground focus:border-foreground"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[12px] uppercase tracking-widest font-mono text-muted-foreground block">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        className="w-full bg-transparent border border-border/80 px-3 py-2 text-xs font-light outline-none text-foreground focus:border-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[12px] uppercase tracking-widest font-mono text-muted-foreground block">
                        Country
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.country}
                        onChange={(e) =>
                          setFormData({ ...formData, country: e.target.value })
                        }
                        className="w-full bg-transparent border border-border/80 px-3 py-2 text-xs font-light outline-none text-foreground focus:border-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[12px] uppercase tracking-widest font-mono text-muted-foreground block">
                      Customer Account Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as "active" | "inactive",
                        })
                      }
                      className="w-full bg-background border border-border/80 px-3 py-2 text-[10px] uppercase tracking-wider outline-none text-muted-foreground focus:text-foreground focus:border-foreground"
                    >
                      <option value="active">Active Member</option>
                      <option value="inactive">Inactive Member</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-foreground text-background py-3 mt-4 font-medium tracking-widest text-[10px] uppercase hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    {drawerMode === "create" ? (
                      <UserPlus className="w-4 h-4" />
                    ) : (
                      <UserCheck className="w-4 h-4" />
                    )}
                    {drawerMode === "create"
                      ? "Save Customer Profile"
                      : "Save Structural Changes"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
