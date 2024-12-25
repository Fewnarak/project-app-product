import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./AddPage.css";

function AddPage({ isOpen, onClose, refreshProducts, editingProduct }) {
    const [formData, setFormData] = useState({
      name: "",
      description: "",
      price: "",
      quantity: "",
      imageUrl: "",
    });
  

    useEffect(() => {
      if (editingProduct) {
        setFormData({
          name: editingProduct.name || "",
          description: editingProduct.description || "",
          price: editingProduct.price || "",
          quantity: editingProduct.quantity || "",
          imageUrl: editingProduct.image_url || "",
        });
      } else {
        setFormData({
          name: "",
          description: "",
          price: "",
          quantity: "",
          imageUrl: "",
        });
      }
    }, [editingProduct]);
  
   
    const handleCancel = () => {
      setFormData({
        name: "",
        description: "",
        price: "",
        quantity: "",
        imageUrl: "",
      });
      onClose(); 
    };
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = async () => {
      try {
        const url = editingProduct
          ? `http://localhost:5000/products/${editingProduct.id}` 
          : "http://localhost:5000/products"; 
  
        const method = editingProduct ? "PUT" : "POST";
  
        const response = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            image_url: formData.imageUrl,
            price: parseFloat(formData.price),
            quantity: parseInt(formData.quantity, 10),
          }),
        });
  
        if (!response.ok) {
          throw new Error(editingProduct ? "Failed to update product" : "Failed to add product");
        }
  
        console.log(editingProduct ? "Product updated successfully" : "Product added successfully");
  
        refreshProducts(); 
        handleCancel(); 
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={null}
        shouldCloseOnOverlayClick={false}
        className="modal"
        overlayClassName="overlay"
      >
        <div className="modal-content">
          <div className="image-section">
            <input
              type="text"
              name="imageUrl"
              className="text-input"
              placeholder="วาง URL รูปภาพ"
              value={formData.imageUrl}
              onChange={handleInputChange}
            />
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="image-preview"
              />
            )}
          </div>
  
          <div className="form-section">
            <input
              type="text"
              name="name"
              className="text-input"
              placeholder="ชื่อสินค้า"
              value={formData.name}
              onChange={handleInputChange}
            />
            <textarea
              name="description"
              className="textarea-input"
              placeholder="รายละเอียดสินค้า"
              value={formData.description}
              onChange={handleInputChange}
            />
            <div className="form-section-two">
              <input
                type="text"
                name="price"
                className="text-input"
                placeholder="ราคา"
                value={formData.price}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="quantity"
                className="text-input"
                placeholder="จำนวน"
                value={formData.quantity}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        <div className="button-group">
          <button className="cancel-button" onClick={handleCancel}>
            ยกเลิก
          </button>
          <button className="confirm-button" onClick={handleSubmit}>
            {editingProduct ? "แก้ไข" : "เพิ่ม"}สินค้า
          </button>
        </div>
      </Modal>
    );
  }
  
  export default AddPage;
  
