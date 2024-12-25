import React, { useState, useEffect } from "react";
import "./App.css";
import { FaBars, FaPlus } from "react-icons/fa";
import AddPage from "./AddPage";

function App() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
  const [isAddPageOpen, setIsAddPageOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null); 

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleDropdown = (id) => {
    setIsDropdownOpen((prev) => (prev === id ? null : id));
  };

  const openAddPage = () => {
    setIsAddPageOpen(true);
    setEditingProduct(null); 
  };

  const openEditPage = (product) => {
    setEditingProduct(product); 
    setIsAddPageOpen(true);
  };

  const closeAddPage = () => {
    setIsAddPageOpen(false);
    setEditingProduct(null); 
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      console.log(`Product with ID ${id} deleted successfully`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="container-wrapper">
          {products.map((product) => (
            <div className="container-group" key={product.id}>
              <button
                className="circle-button"
                onClick={() => toggleDropdown(product.id)}
              >
                <FaBars className="menu-icon" />
              </button>
              {isDropdownOpen === product.id && (
                <ul className="dropdown-menu">
                  <li className="dropdown-item" onClick={() => openEditPage(product)}>
                    แก้ไข
                  </li>
                  <li
                    className="dropdown-item"
                    onClick={() => handleDelete(product.id)}
                  >
                    ลบ
                  </li>
                </ul>
              )}
              <img
                src={
                  product.image_url ||
                  "https://i.pinimg.com/originals/75/48/45/754845861f7da1a82cf0312c6927cb05.jpg"
                }
                className="img-style"
                alt={product.name}
              />
              <h1 className="container-text-header">{product.name}</h1>
              <div className="container-text-details">
                <h4>{product.description}</h4>
              </div>
              <div className="container-text-price-and-quantity">
                <div>$ {product.price}</div>
                <div>Quantity: {product.quantity}</div>
              </div>
            </div>
          ))}
          <div className="container-add-group" onClick={openAddPage}>
            <FaPlus className="add-icon" />
          </div>
          <AddPage
            isOpen={isAddPageOpen}
            onClose={closeAddPage}
            refreshProducts={fetchProducts}
            editingProduct={editingProduct} 
          />
        </div>
      </header>
    </div>
  );
}


export default App;
