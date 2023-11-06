import { useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Navbar({ cartItemCount }) {
  const cartId = localStorage.getItem('cartId');

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/">Home</Link> 
        <div className="cart">
          <Link to={`/cart/${cartId}`}> 
            <FaShoppingCart size={24} />
            {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
