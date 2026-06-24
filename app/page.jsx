"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import Navbar from "./components/navbar";
import './page.css';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  // Load products from API:
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("API error:", error);
      }
    }
    fetchProducts();
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Update cart state and write to localStorage:
  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  // Add to cart or increment quantity:
  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    let newCart;
    if (existing) {
      newCart = cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }
    updateCart(newCart);
  };

  // Decrease quantity:
  const decreaseQty = (productId) => {
    const existing = cart.find(item => item.id === productId);
    if (!existing) return;

    let newCart;
    if (existing.quantity > 1) {
      newCart = cart.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      );
    } else {
      newCart = cart.filter(item => item.id !== productId);
    }
    updateCart(newCart);
  };

  // to filter products based on search:
  const filterHelper = async (e) => {
    const searchWord = e.target.value.toLowerCase();
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      const data = await response.json();

      if (searchWord === "") {
        setProducts(data);
      } else {
        const filteredProducts = data.filter(product =>
          product.title.toLowerCase().includes(searchWord)
        );
        setProducts(filteredProducts);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };


  return (
    <div>
      <Navbar filterHelper={filterHelper} />
      <main className="main">
        <div className="outer">

          {products.map((product) => {
            const cartItem = cart.find(item => item.id === product.id);
            const isAdded = !!cartItem;
            const qty = cartItem ? cartItem.quantity : 0;

            return (
              <div key={product.id} className="card">
                <div className="image-container">
                  <Image src={product.image} alt={product.title} width={150} height={150}
                    className="image" />
                </div>
                <div className="card-content">
                  <h2 className="title">{product.title}</h2>
                  <div className="card-detail">
                    <p className="price">${product.price.toFixed(2)}</p>
                    
                    {!isAdded ? (
                      <Button 
                        className="addtocart block" 
                        variant="contained" 
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </Button>
                    ) : (
                      <div className="qty-selector">
                        <button 
                          className="qty-btn"
                          onClick={() => decreaseQty(product.id)}
                          disabled={qty === 0}
                        >
                          -
                        </button>
                        <span className="qty-text">{qty}</span>
                        <button 
                          className="qty-btn"
                          onClick={() => addToCart(product)}
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
