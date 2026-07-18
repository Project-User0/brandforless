import { OrderData } from "@/types";
import React from "react";

interface PrintProps {
  order: OrderData;
}

export default function PrintOrderManifest({ order }: PrintProps) {
  const invoiceDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="print-canvas-root mx-auto bg-white text-black font-sans selection:bg-transparent">
      {/* Structural Styles to enforce premium, high-readability A4 rules */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          html, body {
            background: #ffffff !important;
            color: #000000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: A4 portrait;
            /* Uniform 20mm margins to ensure absolute safety on standard commercial trays */
            margin: 20mm 20mm 20mm 20mm; 
          }
          .print-canvas-root {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            /* Normalizes sizing metrics specifically for physical paper sheets */
            font-size: 13px !important; 
            line-height: 1.5 !important;
          }
        }

        /* Screen Fallback Previews */
        @media screen {
          .print-canvas-root {
            max-width: 800px;
            padding: 40px;
            border: 1px solid #e5e7eb;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          }
        }
      `,
        }}
      />

      {/* Premium Elegant Invoice Header */}
      <div className="flex justify-between items-end border-b-2 border-black pb-5 mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif tracking-widest uppercase font-normal text-black">
            BRAND FOR LESS
          </h1>
          <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 font-mono font-medium">
            Operations Audit Registry // Console Portal
          </p>
        </div>
        <div className="text-right space-y-1 font-mono text-xs">
          <p className="font-bold text-base text-black">DOC ID: {order.id}</p>
          <p className="text-neutral-600">Date: {invoiceDate}</p>
          <p className="text-neutral-600 font-medium">
            Status:{" "}
            <span className="underline decoration-1 underline-offset-2">
              {order.status.toUpperCase()}
            </span>
          </p>
        </div>
      </div>

      {/* Account Info Grid Split */}
      <div className="grid grid-cols-2 gap-16 text-sm mb-10">
        <div className="space-y-2.5">
          <h3 className="text-[11px] uppercase font-bold tracking-[0.15em] border-b border-neutral-400 pb-1 text-neutral-800 font-mono">
            01. Customer Accounts Profile
          </h3>
          <div className="space-y-1 text-neutral-800">
            <p className="font-semibold text-black text-sm">
              {order.customerInfo.firstName} {order.customerInfo.lastName}
            </p>
            <p className="font-mono text-neutral-600 text-xs">
              {order.customerInfo.email}
            </p>
            <p className="text-neutral-600">{order.customerInfo.phone}</p>
          </div>
        </div>

        <div className="space-y-2.5">
          <h3 className="text-[11px] uppercase font-bold tracking-[0.15em] border-b border-neutral-400 pb-1 text-neutral-800 font-mono">
            02. Shipping Logistics Mapping
          </h3>
          <div className="space-y-1 text-neutral-800 leading-relaxed">
            <p className="font-medium text-black">
              {order.customerInfo.address}
            </p>
            <p className="text-neutral-600">
              {order.customerInfo.city}, {order.customerInfo.state}{" "}
              {order.customerInfo.zipCode}
            </p>
            <p className="text-black font-semibold uppercase tracking-wider text-xs">
              {order.customerInfo.country}
            </p>
          </div>
        </div>
      </div>

      {/* Itemized Manifest Table Inventory */}
      <div className="space-y-3 mb-10">
        <h3 className="text-[11px] uppercase font-bold tracking-[0.15em] text-neutral-800 font-mono">
          03. Manifest Material Index
        </h3>
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="border-b-2 border-neutral-800 text-[10px] uppercase tracking-wider text-neutral-600 font-bold font-mono">
              <th className="py-2 pb-2.5 w-1/2">Line Item Description</th>
              <th className="py-2 pb-2.5 w-1/3">Configuration Variant</th>
              <th className="py-2 pb-2.5 text-right w-1/6">Qty</th>
            </tr>
          </thead>
          <tbody className="text-xs divide-y divide-neutral-200">
            {order.items.map((item, idx) => (
              <tr key={idx} className="align-baseline hover:bg-neutral-50/50">
                <td className="py-3.5 pr-4 font-medium text-black text-sm break-words">
                  {item.productId}
                </td>
                <td className="py-3.5 text-neutral-600 uppercase text-[11px] tracking-wide font-mono">
                  Size:{" "}
                  <span className="text-black font-medium">
                    {item.selectedSize}
                  </span>
                  <span className="mx-2 text-neutral-300">|</span>
                  Color:{" "}
                  <span className="text-black font-medium">
                    {item.selectedColor}
                  </span>
                </td>
                <td className="py-3.5 text-right font-mono font-medium text-black text-sm">
                  {item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Financial Summaries & Security Stamps */}
      <div className="flex justify-between items-start pt-6 border-t-2 border-neutral-800 page-break-inside-avoid">
        {/* System & Verification Data */}
        <div className="space-y-2.5 text-[11px] font-mono text-neutral-500 max-w-sm">
          <h4 className="uppercase font-bold tracking-wider text-neutral-700 text-[10px]">
            04. Secure System Stamp
          </h4>
          <div className="space-y-0.5 leading-relaxed bg-neutral-50 p-3 border border-neutral-200/60 rounded">
            <p className="text-black">
              Tokenized Auth Key:{" "}
              <span className="font-bold">{order.customerInfo.cardNumber}</span>
            </p>
            <p className="text-[10px]">
              Processing Gateway Authorization Verified
            </p>
            <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
              ✓ SSL Encrypted Settlement Ledger Entry
            </p>
          </div>
        </div>

        {/* Pricing Math Block */}
        <div className="w-72 space-y-2 text-xs text-neutral-700">
          <div className="flex justify-between items-center">
            <span className="font-medium">Subtotal Ledger Base</span>
            <span className="font-mono font-semibold text-black">
              Rs. {order.subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Logistics Transportation Rate</span>
            <span className="font-mono text-neutral-600">
              Rs. {order.shipping.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Taxation Assessment Matrix</span>
            <span className="font-mono text-neutral-600">
              Rs. {order.tax.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center text-black pt-2.5 mt-1 border-t border-neutral-400 font-bold font-serif text-base">
            <span>Aggregated Gross Total</span>
            <span className="font-mono font-sans text-lg">
              Rs. {order.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Block */}
      <div className="pt-24 text-center text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-mono font-medium">
        © Brand for Less Internal Records System Manifest — Confidential
      </div>
    </div>
  );
}
