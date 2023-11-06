import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateProduct() {
    const userId = localStorage.getItem("userId");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [numberInStock, setNumberInStock] = useState("");
    const [category, setCategory] = useState("");
    const [productImage, setProductImage] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    const navigate = useNavigate();

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

    const handleCreateProduct = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("numberInStock", numberInStock);
        formData.append("category", category);
        formData.append("userId", userId);
        formData.append("productImage", productImage);

        try {
            const response = await fetch("http://localhost:8000/api/product/create", {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            if (response.status === 200) {
                const result = await response.json();
                console.log("Product created:", result);
                setName("");
                setDescription("");
                setPrice("");
                setNumberInStock("");
                setCategory("");
                setProductImage(null);
                navigate("/product/1");
            } else {
                const errorData = await response.json();
                console.error("Error creating product:", errorData);
                if (errorData.errors) {
                    setValidationErrors(errorData.errors);
                }
            }
        } catch (error) {
            console.error("An error occurred:", error);
            setValidationErrors({ internal: 'Internal Server Error' });
        }
    };

    return (
        <div>
            <h2>Create a product</h2>
            {validationErrors.accounttype && <p className='red'>{validationErrors.accounttype.message}</p>}
            <form onSubmit={handleCreateProduct}>
                <div className="form-floating mb-3">
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={name}
                        onChange={handleNameChange}
                    />
                    <label htmlFor="name">Name*</label>
                    {validationErrors.name && <p className='red'>{validationErrors.name.message}</p>}
                </div>
                <div className="form-floating mb-3">
                    <input
                        type="file"
                        className="form-control"
                        name="productImage"
                        onChange={handleImageChange}
                    />
                    <label htmlFor="productImage">Image*</label>
                    {validationErrors.productImage && <p className='red'>{validationErrors.productImage.message}</p>}
                </div>
                <div className="form-floating">
                    <textarea
                        className="form-control"
                        style={{ height: "100px" }}
                        name="description"
                        value={description}
                        onChange={handleDescriptionChange}
                    ></textarea>
                    <label htmlFor="description">Description*</label>
                    {validationErrors.description && <p className='red'>{validationErrors.description.message}</p>}
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text">$</span>
                    <input
                        type="number"
                        className="form-control"
                        name="price"
                        value={price}
                        onChange={handlePriceChange}
                    />
                    <span className="input-group-text">.00</span>
                    {validationErrors.price && <p className='red'>{validationErrors.price.message}</p>}
                </div>
                <div className="form-floating mb-3">
                    <input
                        type="number"
                        className="form-control"
                        name="numberInStock"
                        value={numberInStock}
                        onChange={handleNumberInStockChange}
                    />
                    <label htmlFor="numberInStock">Quantity*</label>
                    {validationErrors.numberInStock && <p className='red'>{validationErrors.numberInStock.message}</p>}
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
                {validationErrors.category && <p className='red'>{validationErrors.category.message}</p>}
                <div className="d-grid gap-2 d-md-flex mb-3">
                    <button type="submit" className="btn btn-outline-success">
                        Publish
                    </button>
                </div>
            </form>
        </div>
    );
}
