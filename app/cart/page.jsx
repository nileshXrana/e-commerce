"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@mui/material/Button";
import Navbar from "../components/navbar";
import "../page.css";
import "./cart.css";

export default function Cart() {
  const [cart, setCart] = useState([]);

  // localStorage:
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart).filter(item => item.quantity > 0);
      setCart(parsedCart);
    }
  }, []);

  const updateCart = (newCart) => {
    const filteredCart = newCart.filter(item => item.quantity > 0);
    setCart(filteredCart);
    localStorage.setItem("cart", JSON.stringify(filteredCart));
  };

  const increaseQty = (productId) => {
    const newCart = cart.map(item =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(newCart);
  };

  const decreaseQty = (productId) => {
    const newCart = cart.map(item =>
      item.id === productId ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item
    );
    updateCart(newCart);
  };

  const removeItem = (productId) => {
    const newCart = cart.filter(item => item.id !== productId);
    updateCart(newCart);
  };

  // total:
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCharge = 1.00;
  const total = subtotal + shippingCharge;

  const handlePlaceOrder = () => {
    alert("Order placed!");
    updateCart([]);
  };

  return (
    <div>
      <Navbar />
      <main className="main">
        <div className="cart-container">
          <div className="cart-header">
            <h1 className="cart-title">Your Cart</h1>
            <Button className="back" variant="outlined" color="primary">
              <Link href="/" className="back-link">Back to Shopping</Link>
            </Button>
          </div>

          {cart.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty !</p>
            </div>
          ) : (
            <div className="cart-layout">
              <div className="cart-items-list">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-image">
                      <Image src={item.image} alt={item.title} width={80} height={80} style={{ objectFit: "contain" }} />
                    </div>
                    <div className="cart-item-details">
                      <h3 className="cart-item-title">{item.title}</h3>
                      <p className="cart-item-price">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="cart-item-actions">
                      <div className="cart-qty-selector">
                        <button className="qty-btn" onClick={() => decreaseQty(item.id)}>-</button>
                        <span className="qty-text">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => increaseQty(item.id)}>+</button>
                      </div>
                      <button className="remove-btn" onClick={() => removeItem(item.id)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <h2 className="summary-title">Summary</h2>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>$1.00</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total-row">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <Button 
                  variant="contained" 
                  className="addtocart" 
                  style={{ marginTop: "1.5rem" }} 
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
