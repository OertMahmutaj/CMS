import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ShowProducts({ updateCartItemCount }) {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesCount, setPagesCount] = useState(1);
  const { page } = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const cartId = localStorage.getItem("cartId");

  const handleQuickAddToCart = (product) => {
    axios
      .post(`http://localhost:8000/api/cart/add-to-cart`, {
        cartId,
        productId: product._id,
        quantity: 1,
      }, { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          console.log("Product added to the cart");
          const updatedCartItemCount = response.data.cart.items.length;
          updateCartItemCount(updatedCartItemCount);
        } else {
          console.error("Error adding product to the cart");
        }
      })
      .catch((error) => {
        console.log("Axios error:", error);
        const errorMessage = error.response?.data.message || "An error occurred while adding to the cart.";
        setProducts((prevProducts) => {
          const updatedProducts = prevProducts.map((p) => {
            if (p._id === product._id) {
              return { ...p, error: errorMessage };
            }
            return p;
          });
          return updatedProducts;
        });
      });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/product?page=${page}`
        );

        if (response.status === 200) {
          const data = response.data;
          setProducts(data.products);
          setPagesCount(data.pagesCount);
        } else {
          console.error("Error fetching products");
        }
      } catch (error) {
        console.error("Axios error:", error);
      }
    };

    fetchProducts();
  }, [page]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}/details`);
  };

  return (
    <div>
      <h2>Products</h2>
      <div className="products-list">
        {products.map((product) => (
          <div key={product._id} className="product-item">
            <img src={product.productImage} alt={product.name} width={100} height={100} />
            <h3>Name: {product.name}</h3>
            <p>Description: {product.description}</p>
            <p>Price: ${product.price}</p>
            <p>Quantity: {product.numberInStock}</p>
            <p>Category: {product.category}</p>
            <p>Owner: {product.owner.companyName}</p>
            {product.error && <p style={{ color: "red" }}>{product.error}</p>}
            <button onClick={() => handleViewProduct(product._id)}>View</button>
            <button onClick={() => handleQuickAddToCart(product)}>Quick Add to Cart</button>
          </div>
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: pagesCount }).map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
