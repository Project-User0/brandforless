import PrintOrderManifest from '@/components/admin/printable/order-report'
import { OrderData } from '@/types';
import React from 'react'

const mockOrders: OrderData =
  {
    id: "BFL-9021",
    subtotal: 120.00,
    shipping: 10.00,
    tax: 9.60,
    total: 139.60,
    createdAt: 1784376000000, // 2026 Epoch timestamp values
    status: "pending",
    customerInfo: {
      firstName: "Emma", lastName: "Watson", email: "emma@watson.com", phone: "+1 555 0192",
      address: "221b Baker St", city: "London", state: "Greater London", zipCode: "NW1 6XE", country: "United Kingdom",
      cardNumber: "•••• •••• •••• 4242", expiryDate: "12/29", cvv: "•••"
    },
    items: [
      { productId: "Minimalist Linen Blouse", quantity: 1, selectedSize: "S", selectedColor: "Ivory" },
      { productId: "Relaxed Fit Denim Chino", quantity: 1, selectedSize: "M", selectedColor: "Indigo" }
    ]
  };

function page() {
  return (
    <div>
      <PrintOrderManifest order={mockOrders} />
    </div>
  )
}

export default page
