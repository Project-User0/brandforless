"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useCart } from "@/store";
import { products } from "@/data/products";

const steps = [
  {
    id: 1,
    name: "Shipping",
    fields: [
      "firstName",
      "lastName",
      "address",
      "city",
      "state",
      "zipCode",
      "country",
    ],
  },
  { id: 2, name: "Contact", fields: ["email", "phone"] },
  { id: 3, name: "Shipping Method" },
  { id: 4, name: "Payment" },
  { id: 5, name: "Review" },
  { id: 6, name: "Confirmation" },
];

export function CheckoutPage() {
  const { items, clearCart, getTotalPrice } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    shippingMethod: "standard",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const subtotal = getTotalPrice(products);
  const shipping =
    formData.shippingMethod === "express"
      ? 25
      : formData.shippingMethod === "overnight"
        ? 50
        : 10;
  const tax = Math.round(subtotal * 0.13 * 100) / 100;
  const total = subtotal + shipping + tax;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitOrder = () => {
    // In a real app, this would submit the order to a backend
    setCurrentStep(6);
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Your cart is empty
          </h1>
          <p className="mt-2 text-muted-foreground">
            Add items to proceed with checkout
          </p>
          <Button className="mt-6">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex items-center flex-1">
                <motion.div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold ${
                    currentStep >= step.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground"
                  }`}
                  animate={
                    currentStep >= step.id ? { scale: 1.1 } : { scale: 1 }
                  }
                >
                  {currentStep > step.id ? <Check size={20} /> : step.id}
                </motion.div>
                {idx < steps.length - 1 && (
                  <div
                    className={`mx-2 flex-1 h-1 ${
                      currentStep > step.id ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between">
            {steps.map((step) => (
              <p
                key={step.id}
                className="text-xs font-medium text-muted-foreground"
              >
                {step.name}
              </p>
            ))}
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Step 1: Shipping */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">
                    Shipping Address
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      placeholder="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                    <Input
                      placeholder="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <Input
                    placeholder="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      placeholder="City"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                    <Input
                      placeholder="State"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      placeholder="ZIP Code"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                    />
                    <Select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Nepal</option>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 2: Contact */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">
                    Contact Information
                  </h2>
                  <Input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <Input
                    placeholder="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              {/* Step 3: Shipping Method */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">
                    Shipping Method
                  </h2>
                  {[
                    {
                      id: "standard",
                      name: "Standard Shipping",
                      time: "5-7 days",
                      price: 10,
                    },
                    {
                      id: "express",
                      name: "Express Shipping",
                      time: "2-3 days",
                      price: 25,
                    },
                    {
                      id: "overnight",
                      name: "Overnight Shipping",
                      time: "1 day",
                      price: 50,
                    },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className="flex items-center gap-4 rounded-sm border border-border p-4 cursor-pointer hover:bg-muted/30"
                    >
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={method.id}
                        checked={formData.shippingMethod === method.id}
                        onChange={handleInputChange}
                        className="h-4 w-4"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">
                          {method.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {method.time}
                        </p>
                      </div>
                      <p className="font-semibold text-foreground">
                        Rs. {method.price}
                      </p>
                    </label>
                  ))}
                </div>
              )}

              {/* Step 4: Payment */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">
                    Payment Information
                  </h2>
                  <Input
                    placeholder="Card Number"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      placeholder="MM/YY"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                    />
                    <Input
                      placeholder="CVV"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This is a demo checkout. No actual payment will be
                    processed.
                  </p>
                </div>
              )}

              {/* Step 5: Review */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-foreground">
                    Review Order
                  </h2>
                  <div className="rounded-sm border border-border p-4">
                    <h3 className="font-semibold text-foreground">
                      Shipping To
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {formData.firstName} {formData.lastName}
                      <br />
                      {formData.address}
                      <br />
                      {formData.city}, {formData.state} {formData.zipCode}
                      <br />
                      {formData.country}
                    </p>
                  </div>
                  <div className="rounded-sm border border-border p-4">
                    <h3 className="font-semibold text-foreground">Items</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {items.length} item{items.length !== 1 ? "s" : ""} in your
                      order
                    </p>
                  </div>
                </div>
              )}

              {/* Step 6: Confirmation */}
              {currentStep === 6 && (
                <div className="space-y-6 text-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                      <Check size={40} className="text-green-600" />
                    </div>
                  </motion.div>
                  <div>
                    <h2 className="text-3xl font-bold text-foreground">
                      Order Confirmed!
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                      Thank you for your purchase. Your order has been received
                      and will be processed soon.
                    </p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">
                      Order Number: #123456789
                    </p>
                    <p className="text-muted-foreground">
                      Confirmation email sent to {formData.email}
                    </p>
                  </div>
                  <Button className="mt-6">
                    <Link href="/shop">Continue Shopping</Link>
                  </Button>
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep < 6 && (
                <div className="mt-8 flex gap-4">
                  <Button
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={
                      currentStep === 5 ? handleSubmitOrder : handleNextStep
                    }
                    className="flex-1"
                  >
                    {currentStep === 5 ? "Place Order" : "Next"}{" "}
                    <ChevronRight size={16} />
                  </Button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            className="h-fit rounded-sm border border-border bg-muted/30 p-6 sticky top-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-semibold text-foreground">Order Summary</h3>

            {/* Items in Cart */}
            <div className="mt-6 border-t border-border pb-4">
              <h4 className="font-semibold text-foreground">Items</h4>
              <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
                {items.map((item) => {
                  const product = products.find((p) => p.id === item.productId);
                  if (!product) return null;
                  const price = product.discountPrice || product.price;
                  return (
                    <div
                      key={item.productId}
                      className="flex justify-between text-xs"
                    >
                      <span className="text-muted-foreground">
                        {product.title} x{item.quantity}
                      </span>
                      <span className="font-medium text-foreground">
                        Rs. {(price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">
                  Rs. {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-foreground">
                  Rs. {shipping.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium text-foreground">
                  Rs. {tax.toFixed(2)}
                </span>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-xl font-bold text-foreground">
                    Rs. {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
