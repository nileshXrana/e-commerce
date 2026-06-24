"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import Navbar from "./components/navbar";
import './page.css';
import Box from '@mui/material/Box';
// import CircularProgress from '@mui/material/CircularProgress';
import CircularIndeterminate from './components/CircularIndeterminate';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [filter, setFilter] = useState(10);
  const [loading, setLoading] = useState(false);

  // fetch products
  useEffect(() => {
    setLoading(true);
    // from localstorage if < 1 hr:
    const savedProducts = localStorage.getItem("products");
    const savedAt = localStorage.getItem("time");
    const oneHour = 60 * 60 * 1000;
    const timeNow = Date.now();

    if (savedProducts && savedAt && timeNow - new Date(savedAt).getTime() < oneHour) {
      setProducts(JSON.parse(savedProducts));
      setLoading(false);
      return;
    }

    // fetch products from API
    async function fetchProducts() {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        setProducts(data);
        localStorage.setItem("products", JSON.stringify(data));
        localStorage.setItem("time", new Date().toString());
      } catch (error) {
        console.error("API error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // cart from localStorage:
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Update cart + localStorage:
  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  // Add to cart + increment:
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

  // decrement:
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

  // search filter:
  const filterHelper = async (e) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  // low to high price:
  const lowtohigh = async () => {
    setLoading(true);
    // const filteredProducts = products.sort((a, b) => a.price - b.price);
    const filteredProducts = [...products].sort((a, b) => a.price - b.price);
    console.log("Filtered products (low to high):", filteredProducts);
    setProducts(filteredProducts);
    console.log("Products after sorting (low to high):", products);
    setLoading(false);
  };

  // high to low price:
  const hightolow = async () => {
    setLoading(true);
    const filteredProducts = [...products].sort((a, b) => b.price - a.price);
    console.log("Filtered products (high to low):", filteredProducts);
    setProducts(filteredProducts);
    console.log("Products after sorting (high to low):", products);
    setLoading(false);
  };

  // reset filters:
  const resetFilters = async () => {
    setLoading(true);
    // from localstorage if < 1 hr:
    const savedProducts = localStorage.getItem("products");
    const savedAt = localStorage.getItem("time");
    const oneHour = 60 * 60 * 1000;
    const timeNow = Date.now();

    if (savedProducts && savedAt && timeNow - new Date(savedAt).getTime() < oneHour) {
      setProducts(JSON.parse(savedProducts));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://fakestoreapi.com/products");
      const data = await response.json();
      setProducts(data);
      console.log("Products after reset:", products);
    } catch (error) {
      console.error("API error:", error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect for filter changes:
  useEffect(() => {
    if (filter === 20) {
      lowtohigh();
    } else if (filter === 30) {
      hightolow();
    } else if (filter === 10) {
      resetFilters();
    }
  }, [filter]);


  return (
    <Box>
      <Navbar filterHelper={filterHelper} filter={filter} setFilter={setFilter} />

      {loading ?
        <Box className="loading">
          <CircularIndeterminate/>
          Loading...
        </Box> :

        <Box className="main outer" >

          {products.map((product) => {
            const cartItem = cart.find(item => item.id === product.id);
            const isAdded = !!cartItem;
            const qty = cartItem ? cartItem.quantity : 0;

            return (
              <Box key={product.id} className="card">
                <Box className="image-container">
                  <Image src={product.image} alt={product.title} width={150} height={150}
                    className="image" />
                </Box>
                <Box className="card-content">
                  <h2 className="title">{product.title}</h2>
                  <Box className="card-detail">
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
                      <Box className="qty-selector">
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
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>

      }
    </Box>
  );
}
