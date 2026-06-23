"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import Navbar from "./components/navbar";
import './page.css';

export default function Home() {
  const [products, setProducts] = useState([]);
  const CACHE_KEY = "my_api_data";
  const TIMESTAMP_KEY = "my_api_timestamp";
  const ONE_HOUR = 60 * 60 * 1000; // Time in milliseconds  

  // function to fetch products from the API:
  // const fetchProducts = async () => {
  //   try {
  //     const response = await fetch("https://fakestoreapi.com/products");
  //     const data = await response.json();
  //     setProducts(data);
  //   } catch (error) {
  //     console.error("Error fetching products:", error);
  //   }
  // };

  // useEffect to fetch products:
  useEffect(() => {
    const cachedData = localStorage.getItem(CACHE_KEY);
    const cachedTimestamp = localStorage.getItem(TIMESTAMP_KEY);
    const now = Date.now();

    if (cachedData && cachedTimestamp && (now - cachedTimestamp < ONE_HOUR)) {
      setProducts(JSON.parse(cachedData));
      return;
    }

    async function fetchProducts() {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        setProducts(data);

        // local storage:
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(TIMESTAMP_KEY, Date.now().toString());
      } catch (error) {
        console.error("API error:", error);
      }
    }


    fetchProducts();

  }, []);

  // to filter products based on search:
  const filterHelper = async (e) => {

    const cachedData = localStorage.getItem(CACHE_KEY);
    const cachedTimestamp = localStorage.getItem(TIMESTAMP_KEY);
    const now = Date.now();

    if (cachedData && cachedTimestamp && (now - cachedTimestamp < ONE_HOUR)) {
      setProducts(JSON.parse(cachedData));
    } 
    else {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        setProducts(data);

        // local storage:
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(TIMESTAMP_KEY, Date.now().toString());
      } catch (error) {
        console.error("API error:", error);
      }
    }

    if(e.target.value == "") return;
    const searchWord = e.target.value.toLowerCase();

    const filteredProducts = products.filter(product =>
      product.title.toLowerCase().includes(searchWord)
    );
    setProducts(filteredProducts);
  };


  return (
    <div>
      <Navbar filterHelper={filterHelper} />
      <main className="main">
        <div className="outer">

          {products.map((product) => (
            <div key={product.id} className="card">
              <div>
                <Image src={product.image} alt={product.title} width={150} height={150}
                  className="image" />
                <h2 className="title">{product.title}</h2>
              </div>
              <div className="card-detail">
                <p className="price">${product.price.toFixed(2)}</p>
                <Button className="addtocart block" variant="contained">Add to Cart</Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
