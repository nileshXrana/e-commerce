"use client";
import { useState, useEffect } from "react";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@mui/material/Button";
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Navbar from "../components/navbar";
import "../page.css";
import "./cart.css";
import Box from '@mui/material/Box';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [open, setOpen] = React.useState(false);

  // snackbar
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>  
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

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
    updateCart([]);
  };

  return (
    <Box>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        message="Order Placed Successfully"
        action={action}
      />
      <Navbar />
      <main className="main">
        <Box className="cart-container">
          <Box className="cart-header">
            <h1 className="cart-title">Your Cart</h1>
            <Button className="back" variant="outlined" color="primary">
              <Link href="/" className="back-link">Back to Shopping</Link>
            </Button>
          </Box>

          {cart.length === 0 ? (
            <Box className="empty-cart">
              <p>Your cart is empty !</p>
            </Box>
          ) : (
            <Box className="cart-layout">
              <Box className="cart-items-list">
                {cart.map((item) => (
                  <Box key={item.id} className="cart-item">
                    <Box className="cart-item-image">
                      <Image src={item.image} alt={item.title} width={80} height={80} style={{ objectFit: "contain" }} />
                    </Box>
                    <Box className="cart-item-details">
                      <h3 className="cart-item-title">{item.title}</h3>
                      <p className="cart-item-price">${item.price.toFixed(2)}</p>
                    </Box>
                    <Box className="cart-item-actions">
                      <Box className="cart-qty-selector">
                        <button className="qty-btn" onClick={() => decreaseQty(item.id)}>-</button>
                        <span className="qty-text">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => increaseQty(item.id)}>+</button>
                      </Box>
                      <button className="remove-btn" onClick={() => removeItem(item.id)}>Remove</button>
                    </Box>
                  </Box>
                ))}
              </Box>

              <Box className="cart-summary">
                <h2 className="summary-title">Summary</h2>
                <Box className="summary-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </Box>
                <Box className="summary-row">
                  <span>Shipping</span>
                  <span>$1.00</span>
                </Box>
                <Box className="summary-divider"></Box>
                <Box className="summary-row total-row">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </Box>
                <Button
                  variant="contained"
                  className="addtocart"
                  style={{ marginTop: "1.5rem" }}
                  onClick={()=>{
                    handlePlaceOrder();
                    handleClick();
                  }}
                >
                  Place Order
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </main>
    </Box>
  );
}
