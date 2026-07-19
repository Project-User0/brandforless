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
  ChevronLeft,
  ChevronRight,
  Tag,
  Layers,
  Shirt,
  Sparkles,
  DollarSign,
} from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";

// Product Data Schema matching your exact data interface
export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  fullDescription: string;
  price: number;
  discountPrice?: number;
  category: string;
  collection: string;
  rating: number;
  reviewCount: number;
  images: string[];
  sizes: string[];
  colors: ProductColor[];
  material: string;
  care: string;
  stock: number;
  isNew: boolean;
  isBestseller: boolean;
  isFeatured: boolean;
  tags: string[];
  brand: string;
}

// Initialized default list from your dataset
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "1",
    slug: "classic-linen-shirt",
    title: "Classic Linen Shirt",
    subtitle: "Breathable summer essential",
    description: "Premium linen shirt perfect for warm weather",
    fullDescription:
      "Experience ultimate comfort with our classic linen shirt. Made from 100% pure linen, this shirt offers breathability and style. Perfect for casual outings or beach getaways. Machine washable and easy to maintain.",
    price: 89,
    category: "men-casual",
    collection: "summer-collection",
    rating: 4.8,
    reviewCount: 124,
    images: [
      "https://images.unsplash.com/photo-1596062176415-6a70e4dc9a97?w=800&q=80",
      "https://images.unsplash.com/photo-1598839212662-0f7f4b1a0e2e?w=800&q=80",
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Beige", hex: "#F5E6D3" },
      { name: "Sage", hex: "#9CAF88" },
    ],
    material: "100% Pure Linen",
    care: "Machine wash cold with similar colors",
    stock: 45,
    isNew: true,
    isBestseller: false,
    isFeatured: true,
    tags: ["linen", "summer", "breathable", "casual"],
    brand: "Brand for Less",
  },
  {
    id: "2",
    slug: "oxford-cotton-shirt",
    title: "Oxford Cotton Shirt",
    subtitle: "Timeless casual elegance",
    description: "Premium oxford cloth shirt for versatile styling",
    fullDescription:
      "Our Oxford Cotton Shirt is a wardrobe staple that never goes out of style. Made with premium cotton, featuring a classic button-down collar and versatile fit. Perfect for both work and casual wear.",
    price: 79,
    category: "men-casual",
    collection: "everyday",
    rating: 4.7,
    reviewCount: 98,
    images: [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80",
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Navy", hex: "#001F3F" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Light Blue", hex: "#B4C7E7" },
    ],
    material: "100% Premium Cotton",
    care: "Machine wash warm, tumble dry low",
    stock: 52,
    isNew: false,
    isBestseller: true,
    isFeatured: true,
    tags: ["cotton", "classic", "oxford", "versatile"],
    brand: "Brand for Less",
  },
  {
    id: "3",
    slug: "slim-fit-jeans",
    title: "Slim Fit Denim Jeans",
    subtitle: "Modern everyday essential",
    description: "Perfectly fitted jeans for any occasion",
    fullDescription:
      "Crafted from premium denim, these slim-fit jeans offer a modern silhouette with a comfortable stretch. Featuring a classic five-pocket design with durable hardware. Perfect for layering with any top.",
    price: 99,
    discountPrice: 79,
    category: "men-casual",
    collection: "everyday",
    rating: 4.9,
    reviewCount: 267,
    images: [
      "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=800&q=80",
    ],
    sizes: ["28", "30", "32", "34", "36", "38"],
    colors: [
      { name: "Dark Indigo", hex: "#06038E" },
      { name: "Light Blue", hex: "#5B7C99" },
      { name: "Black", hex: "#000000" },
    ],
    material: "98% Cotton, 2% Elastane",
    care: "Turn inside out, wash cold with similar colors",
    stock: 78,
    isNew: false,
    isBestseller: true,
    isFeatured: false,
    tags: ["denim", "jeans", "casual", "comfortable"],
    brand: "Brand for Less",
  },
  {
    id: "4",
    slug: "minimal-crew-neck-tee",
    title: "Minimal Crew Neck Tee",
    subtitle: "Essentials for everyday",
    description: "Perfect quality basics in timeless colors",
    fullDescription:
      "Our minimal crew neck tee is the foundation of any wardrobe. Made from soft, premium cotton jersey, offering exceptional comfort and durability. Available in neutral colors that pair with everything.",
    price: 39,
    category: "men-casual",
    collection: "basics",
    rating: 4.6,
    reviewCount: 312,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#000000" },
      { name: "Grey", hex: "#808080" },
      { name: "Navy", hex: "#001F3F" },
    ],
    material: "100% Organic Cotton",
    care: "Machine wash warm, tumble dry low",
    stock: 150,
    isNew: true,
    isBestseller: true,
    isFeatured: true,
    tags: ["basics", "tee", "comfortable", "organic"],
    brand: "Brand for Less",
  },
];

export default function ProductPage() {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Pagination (Limit 10 records per page)
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Form Panel configuration states
  const [drawerMode, setDrawerMode] = useState<
    "closed" | "create" | "edit" | "view"
  >("closed");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    fullDescription: "",
    price: 0,
    discountPrice: "",
    category: "men-casual",
    collection: "everyday",
    material: "",
    care: "",
    stock: 0,
    brand: "Brand for Less",
    isNew: false,
    isBestseller: false,
    isFeatured: false,
    sizesInput: "",
    tagsInput: "",
  });

  // Color selection management helpers for simple form input
  const [colorsInput, setColorsInput] = useState<string>("");

  // Storage lifecycle setup
  useEffect(() => {
    const stored = localStorage.getItem("clothing_products");
    if (stored) {
      try {
        setProductsList(JSON.parse(stored));
      } catch (e) {
        setProductsList(DEFAULT_PRODUCTS);
      }
    } else {
      setProductsList(DEFAULT_PRODUCTS);
      localStorage.setItem(
        "clothing_products",
        JSON.stringify(DEFAULT_PRODUCTS),
      );
    }
  }, []);

  const saveProducts = (updatedList: Product[]) => {
    setProductsList(updatedList);
    localStorage.setItem("clothing_products", JSON.stringify(updatedList));
  };

  // Search & Filter Resolution Block
  const filteredProducts = productsList.filter((prod) => {
    const matchesSearch =
      prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || prod.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Pagination calculation deck
  const totalPages = Math.ceil(filteredProducts.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredProducts.slice(
    indexOfFirstRecord,
    indexOfLastRecord,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter]);

  // Drawer Opening Actions
  const openCreateDrawer = () => {
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      fullDescription: "",
      price: 0,
      discountPrice: "",
      category: "men-casual",
      collection: "everyday",
      material: "",
      care: "",
      stock: 0,
      brand: "Brand for Less",
      isNew: true,
      isBestseller: false,
      isFeatured: false,
      sizesInput: "S, M, L, XL",
      tagsInput: "casual, new-arrival",
    });
    setColorsInput("White:#FFFFFF, Black:#000000");
    setDrawerMode("create");
  };

  const openEditDrawer = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      title: product.title,
      subtitle: product.subtitle,
      description: product.description,
      fullDescription: product.fullDescription,
      price: product.price,
      discountPrice: product.discountPrice ? String(product.discountPrice) : "",
      category: product.category,
      collection: product.collection,
      material: product.material,
      care: product.care,
      stock: product.stock,
      brand: product.brand,
      isNew: product.isNew,
      isBestseller: product.isBestseller,
      isFeatured: product.isFeatured,
      sizesInput: product.sizes.join(", "),
      tagsInput: product.tags.join(", "),
    });
    setColorsInput(product.colors.map((c) => `${c.name}:${c.hex}`).join(", "));
    setDrawerMode("edit");
  };

  const openViewDrawer = (product: Product) => {
    setSelectedProduct(product);
    setDrawerMode("view");
  };

  // Submit Handler for Form Create/Edit Updates
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Map human input fields to explicit structural arrays
    const parsedSizes = formData.sizesInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const parsedTags = formData.tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const parsedColors = colorsInput
      .split(",")
      .map((pair) => {
        const [name, hex] = pair.split(":");
        return { name: name?.trim() || "Item", hex: hex?.trim() || "#000000" };
      })
      .filter((c) => c.name);

    if (drawerMode === "create") {
      const newProduct: Product = {
        id: String(productsList.length + 1),
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        fullDescription: formData.fullDescription,
        price: Number(formData.price),
        discountPrice: formData.discountPrice
          ? Number(formData.discountPrice)
          : undefined,
        category: formData.category,
        collection: formData.collection,
        material: formData.material,
        care: formData.care,
        stock: Number(formData.stock),
        brand: formData.brand,
        isNew: formData.isNew,
        isBestseller: formData.isBestseller,
        isFeatured: formData.isFeatured,
        rating: 5.0,
        reviewCount: 0,
        images: [
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
        ], // Fallback stock thumbnail photo
        sizes: parsedSizes,
        colors: parsedColors,
        tags: parsedTags,
      };

      const updated = [newProduct, ...productsList];
      saveProducts(updated);
      toast.success("New retail product successfully added to logs");
    } else if (drawerMode === "edit" && selectedProduct) {
      const updated = productsList.map((p) =>
        p.id === selectedProduct.id
          ? {
              ...p,
              ...formData,
              price: Number(formData.price),
              discountPrice: formData.discountPrice
                ? Number(formData.discountPrice)
                : undefined,
              stock: Number(formData.stock),
              sizes: parsedSizes,
              colors: parsedColors,
              tags: parsedTags,
            }
          : p,
      );
      saveProducts(updated);
      toast.success(
        `Product SKU [${selectedProduct.id}] successfully modified`,
      );
    }

    setDrawerMode("closed");
  };

  // Delete profile routine
  const handleDeleteProduct = (id: string) => {
    if (
      confirm(
        "Are you sure you want to remove this product entry from inventory?",
      )
    ) {
      const updated = productsList.filter((p) => p.id !== id);
      saveProducts(updated);
      toast.error(`Product SKU ${id} dropped from systems.`);
    }
  };

  // Data Exporter Module
  const exportToExcel = () => {
    const exportData = filteredProducts.map((p) => ({
      "Product ID": p.id,
      "Product Title": p.title,
      "Category Tag": p.category,
      "Collection Group": p.collection,
      "Price ($)": p.price,
      "Discount Price ($)": p.discountPrice || "N/A",
      "Stock Inventory Level": p.stock,
      "Fabric Material Type": p.material,
      "Available Sizes": p.sizes.join(", "),
      "New Item Status": p.isNew ? "YES" : "NO",
      "Bestseller Flag": p.isBestseller ? "YES" : "NO",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clothing Stock Records");
    XLSX.writeFile(
      workbook,
      `Store_Products_Inventory_${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Inventory Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Products Catalog
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Control clothing variants, live tracking sheets, retail pricing
            systems, and style metadata blocks.
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={exportToExcel}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 text-xs font-medium border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-green-700" /> Export
            Catalog
          </button>
          <button
            onClick={openCreateDrawer}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 text-xs font-medium bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Grid Filtering Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex-1 flex items-center gap-3 border-b border-border/40 px-1 py-1.5 text-muted-foreground focus-within:border-foreground transition-colors group max-w-md">
          <Search className="w-4 h-4 text-muted-foreground/40 group-focus-within:text-foreground transition-colors" />
          <input
            type="text"
            placeholder="Search by title, style code, material..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-[13px] font-light outline-none border-none w-full placeholder:text-foreground/60 text-foreground"
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs font-medium bg-white border border-gray-300 rounded px-3 py-1.5 outline-none text-gray-700 hover:text-black focus:border-black transition-colors"
          >
            <option value="all">All Categories</option>
            <option value="men-casual">Men's Casual Wear</option>
            <option value="basics">Wardrobe Basics</option>
          </select>
        </div>
      </div>

      {/* Primary Clean Structural Product Table */}
      <div className="border border-gray-200 rounded bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4">SKU / ID</th>
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4">Collection Group</th>
                <th className="py-3 px-4">Retail Price</th>
                <th className="py-3 px-4">Stock Level</th>
                <th className="py-3 px-4">Badges</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-gray-100 text-gray-700">
              {currentRecords.length > 0 ? (
                currentRecords.map((prod) => (
                  <tr
                    key={prod.id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-medium text-gray-900">
                      #00{prod.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {prod.images?.[0] && (
                          <img
                            src={prod.images[0]}
                            alt={prod.title}
                            className="w-10 h-10 object-cover rounded bg-gray-100 border border-gray-200"
                          />
                        )}
                        <div>
                          <div className="font-medium text-gray-900">
                            {prod.title}
                          </div>
                          <div className="text-[11px] text-gray-400 mt-0.5">
                            {prod.subtitle}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 font-medium">
                      {prod.collection}
                    </td>
                    <td className="py-3 px-4">
                      {prod.discountPrice ? (
                        <div className="space-x-1">
                          <span className="font-semibold text-gray-900">
                            ${prod.discountPrice}
                          </span>
                          <span className="text-gray-400 line-through text-[11px]">
                            ${prod.price}
                          </span>
                        </div>
                      ) : (
                        <span className="font-semibold text-gray-900">
                          ${prod.price}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-medium ${prod.stock < 50 ? "text-amber-600 font-semibold" : "text-gray-700"}`}
                      >
                        {prod.stock} items left
                      </span>
                    </td>
                    <td className="py-3 px-4 space-x-1 whitespace-nowrap">
                      {prod.isNew && (
                        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                          NEW
                        </span>
                      )}
                      {prod.isBestseller && (
                        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-100">
                          BEST
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => openViewDrawer(prod)}
                        className="p-1 border border-gray-200 rounded text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openEditDrawer(prod)}
                        className="p-1 border border-gray-200 rounded text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                        title="Edit Details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-1 border border-red-100 rounded text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Entry"
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
                    No active apparel products found matching your active filter
                    views.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination Matrix Component */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white text-[11px] text-gray-500">
            <span>
              Showing Page {currentPage} of {totalPages} (Total logs:{" "}
              {filteredProducts.length} items)
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

      {/* Side Slider Panel Layer for Detailed Configuration */}
      {drawerMode !== "closed" && (
        <>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs z-50 transition-opacity"
            onClick={() => setDrawerMode("closed")}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white border-l border-gray-200 shadow-xl z-50 p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              {/* Drawer Title Section */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    {drawerMode === "create" && "Create Apparel Product"}
                    {drawerMode === "edit" && "Modify Style Attributes"}
                    {drawerMode === "view" && "Product Deep Inspect"}
                  </h2>
                  <p className="text-xs text-gray-400">
                    {drawerMode === "view" &&
                      `Product SKU: #00${selectedProduct?.id}`}
                  </p>
                </div>
                <button
                  onClick={() => setDrawerMode("closed")}
                  className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* VIEW STYLE BLOCK */}
              {drawerMode === "view" && selectedProduct && (
                <div className="space-y-5 text-xs text-gray-700">
                  {/* Image Thumbnails Block */}
                  {selectedProduct.images?.[0] && (
                    <div className="relative rounded overflow-hidden bg-gray-50 border border-gray-200">
                      <img
                        src={selectedProduct.images[0]}
                        alt={selectedProduct.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                      <Shirt className="w-3 h-3" /> Core Specification Labels
                    </h3>
                    <div className="bg-gray-50 p-3 rounded space-y-2">
                      <div>
                        <span className="text-[10px] text-gray-400 block">
                          Product Style Name
                        </span>
                        <p className="font-medium text-gray-900 text-sm">
                          {selectedProduct.title}
                        </p>
                        <p className="text-gray-500 text-[11px] mt-0.5">
                          {selectedProduct.subtitle}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-gray-200/60">
                        <span className="text-[10px] text-gray-400 block">
                          Catalog Summary Description
                        </span>
                        <p className="text-gray-600 leading-relaxed mt-0.5">
                          {selectedProduct.fullDescription}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <DollarSign className="w-3 h-3" /> Cost Structures
                      </h3>
                      <div className="bg-gray-50 p-2.5 rounded">
                        <span className="text-[10px] text-gray-400 block">
                          Base Retail Price
                        </span>
                        <p className="font-semibold text-gray-900">
                          ${selectedProduct.price}
                        </p>
                        {selectedProduct.discountPrice && (
                          <p className="text-[10px] text-green-700 mt-0.5">
                            Discount: ${selectedProduct.discountPrice}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <Layers className="w-3 h-3" /> Stock Counts
                      </h3>
                      <div className="bg-gray-50 p-2.5 rounded">
                        <span className="text-[10px] text-gray-400 block">
                          Inventory Volume
                        </span>
                        <p className="font-semibold text-gray-900">
                          {selectedProduct.stock} items
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Fabric & Care Info
                    </h3>
                    <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded">
                      <div>
                        <span className="text-[10px] text-gray-400 block">
                          Material Composition
                        </span>
                        <p className="font-medium text-gray-900">
                          {selectedProduct.material}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block">
                          Washing / Care Instructions
                        </span>
                        <p className="font-medium text-gray-900">
                          {selectedProduct.care}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Variant Colors & Sizing Sets
                    </h3>
                    <div className="bg-gray-50 p-3 rounded space-y-2.5">
                      <div>
                        <span className="text-[10px] text-gray-400 block mb-1">
                          Available Sizes
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {selectedProduct.sizes.map((size) => (
                            <span
                              key={size}
                              className="bg-white border border-gray-300 rounded px-1.5 py-0.5 font-medium text-[10px] text-gray-800"
                            >
                              {size}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block mb-1">
                          Color Options
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.colors.map((col) => (
                            <div
                              key={col.name}
                              className="flex items-center gap-1 bg-white border border-gray-200 px-1.5 py-0.5 rounded text-[10px]"
                            >
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-gray-400"
                                style={{ backgroundColor: col.hex }}
                              />
                              <span>{col.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FORM INPUTS EDIT / APPREND CONTAINER */}
              {(drawerMode === "create" || drawerMode === "edit") && (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-gray-600 block">
                      Product Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-900 outline-none focus:border-black"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-gray-600 block">
                      Subtitle Hook
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subtitle}
                      onChange={(e) =>
                        setFormData({ ...formData, subtitle: e.target.value })
                      }
                      className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-900 outline-none focus:border-black"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-gray-600 block">
                        Retail Price ($)
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price: Number(e.target.value),
                          })
                        }
                        className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-900 outline-none focus:border-black"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-gray-600 block">
                        Sale Price ($)
                      </label>
                      <input
                        type="number"
                        value={formData.discountPrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            discountPrice: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-900 outline-none focus:border-black"
                        placeholder="Optional"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-gray-600 block">
                        Stock Qty
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.stock}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stock: Number(e.target.value),
                          })
                        }
                        className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-900 outline-none focus:border-black"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-gray-600 block">
                        Category Segment
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-700 outline-none focus:text-black focus:border-black"
                      >
                        <option value="men-casual">Men's Casual Wear</option>
                        <option value="basics">Basics Collection</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-gray-600 block">
                      Material Composition
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.material}
                      onChange={(e) =>
                        setFormData({ ...formData, material: e.target.value })
                      }
                      className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-900 outline-none focus:border-black"
                      placeholder="e.g. 100% Organic Cotton"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-gray-600 block">
                      Sizing Variants (Comma separated)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.sizesInput}
                      onChange={(e) =>
                        setFormData({ ...formData, sizesInput: e.target.value })
                      }
                      className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-900 outline-none focus:border-black"
                      placeholder="XS, S, M, L, XL"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-gray-600 block">
                      Color Mapping (Format: Name:HexCode, ...)
                    </label>
                    <input
                      type="text"
                      required
                      value={colorsInput}
                      onChange={(e) => setColorsInput(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-900 outline-none focus:border-black"
                      placeholder="White:#FFFFFF, Beige:#F5E6D3"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-gray-600 block">
                      Full Description Details
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formData.fullDescription}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fullDescription: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-xs text-gray-900 outline-none resize-none focus:border-black"
                    />
                  </div>

                  <div className="flex gap-4 py-1">
                    <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.isNew}
                        onChange={(e) =>
                          setFormData({ ...formData, isNew: e.target.checked })
                        }
                        className="rounded text-black focus:ring-0 w-3.5 h-3.5 border-gray-300"
                      />
                      <span>New Tag</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.isBestseller}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isBestseller: e.target.checked,
                          })
                        }
                        className="rounded text-black focus:ring-0 w-3.5 h-3.5 border-gray-300"
                      />
                      <span>Bestseller</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-black text-white py-2.5 rounded font-medium text-xs uppercase tracking-wider hover:bg-gray-800 transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    Save Product Configurations
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
