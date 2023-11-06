import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [numberInStock, setNumberInStock] = useState("");
  const [category, setCategory] = useState("");
  const [productImage, setProductImage] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const handleNumberInStockChange = (e) => {
    setNumberInStock(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setProductImage(imageFile);
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/product/${id}/details`);
        if (response.status === 200) {
          const data = response.data;
          setName(data.name);
          setDescription(data.description);
          setPrice(data.price);
          setNumberInStock(data.numberInStock);
          setCategory(data.category);
          setProductImage(data.productImage);
        } else {
          console.error("Error fetching product details");
        }
      } catch (error) {
        console.error("Axios error:", error);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("numberInStock", numberInStock);
    formData.append("category", category);
    formData.append("productImage", productImage);

    try {
      const response = await fetch(`http://localhost:8000/api/product/${id}/update`, {
        method: "PATCH",
        body: formData,
        credentials: "include",
      });

      if (response.status === 200) {
        const result = await response.json();
        console.log("Product updated:", result);

        setName("");
        setDescription("");
        setPrice("");
        setNumberInStock("");
        setCategory("");
        setProductImage(null);
        navigate("/product/1");
      } else if (response.status === 400) {
        const errorData = await response.json();
        setValidationErrors(errorData.errors);
      } else {
        console.log("Error updating product");
      }
    } catch (error) {
      console.log("Fetch error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Update Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleNameChange}
          />
          {validationErrors.name && (
            <p className="red">{validationErrors.name.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={handleDescriptionChange}
          />
          {validationErrors.description && (
            <p className="red">{validationErrors.description.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={price}
            onChange={handlePriceChange}
          />
          {validationErrors.price && (
            <p className="red">{validationErrors.price.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="numberInStock">Number in Stock:</label>
          <input
            type="number"
            id="numberInStock"
            name="numberInStock"
            value={numberInStock}
            onChange={handleNumberInStockChange}
          />
          {validationErrors.numberInStock && (
            <p className="red">{validationErrors.numberInStock.message}</p>
          )}
        </div>
        <select
          className="form-select"
          name="category"
          value={category}
          onChange={handleCategoryChange}
        >
          <option value="">Select a Category for the Product*</option>
          <option value="Furniture">Furniture</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Books">Books</option>
          <option value="RealEstate">Real Estate</option>
        </select>
        {validationErrors.category && (
          <p className="red">{validationErrors.category.message}</p>
        )}
        <div>
          <img src={productImage} alt={name} width={100} height={100} />
          <label htmlFor="productImage">Product Image:</label>
          <input
            type="file"
            id="productImage"
            name="productImage"
            onChange={handleImageChange}
          />
          {validationErrors.productImage && (
            <p className="red">{validationErrors.productImage.message}</p>
          )}
        </div>
        <div>
          <button type="submit" disabled={isSubmitting}>
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
}
