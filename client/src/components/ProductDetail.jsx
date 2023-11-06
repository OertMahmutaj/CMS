import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const navigate = useNavigate();

    const userId = localStorage.getItem("userId");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    useEffect(() => {

        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/product/${id}/details`);
                if (response.status === 200) {
                    const data = response.data;
                    setProduct(data);

                    if (data.owner._id === userId) {

                        setIsOwner(true);
                    }
                } else {
                    console.error("Error fetching product details");
                }
            } catch (error) {
                console.error("Axios error:", error);
            }
        };

        fetchProductDetails();
    }, [id]);

    const handleUpdateProduct = () => {

        navigate(`/product/${id}/update`);
    };

    const handleDeleteProduct = async () => {
        try {
            const response = await axios.delete(`http://localhost:8000/api/product/${id}/delete`);
            if (response.status === 200) {
                console.log("Product deleted successfully");
                navigate(`/product/1`);
            } else {
                console.error("Error deleting the product");
            }
        } catch (error) {
            console.error("Axios error:", error);
        }
    };


    return (
        <div>
            {product ? (
                <div>
                    <h2>{product.name}</h2>
                    <p>Description: {product.description}</p>
                    <p>Price: ${product.price}</p>
                    <p>Category: {product.category}</p>
                    <p>Number in Stock: {product.numberInStock}</p>
                    <p>Owner: {product.owner?.companyName || null}</p>
                    <img src={product.productImage} alt={product.name} width={100} height={100} />
                    {isLoggedIn && isOwner && (
                        <button onClick={handleUpdateProduct}>Update Product</button>
                    )}
                    {isLoggedIn && isOwner && (
                        <button onClick={handleDeleteProduct}>Delete Product</button>
                    )}
                </div>
            ) : (
                <p>Loading product details...</p>
            )}
        </div>
    );
}
