import React, { useState } from 'react';
import { useProducts } from '../Context/ProductsContext';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { increment, updateDoc } from 'firebase/firestore';

function ProductCard({ product }) {
    const { handleCartOperations, setUserCartAmount,handleIncreaseQuantity,productExistsInCart } = useProducts();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [buttonText, setButtonText] = useState('Add To Cart');

    const handleCart = async (prod) => {
        // debugger;
        if (!currentUser) {
            navigate('/signin');
            toast.error("Please sign in to continue");
            return;
        }
        if (productExistsInCart(prod)) {
            handleIncreaseQuantity(prod);
      toast.info("product quantity updated")
            return;
          }
        setUserCartAmount((prevState) => prevState + Number(product.price));
        setButtonText('Adding'); // Change button text to 'Adding'
        setTimeout(() => {
            setButtonText('Add To Cart'); // Change button text back to 'Add To Cart' after 1-2 seconds
        }, 1000); // Adjust the timeout duration as needed
        handleCartOperations("ADD_TO_CART", prod);
    }

    return (
        <div className='border rounded-lg overflow-hidden shadow-lg flex flex-col h-auto w-48'>
            <div className='h-40 overflow-hidden'>
                <img
                    src={product.image}
                    alt="product image"
                    className='w-full h-full object-contain'
                />
            </div>
            <div className='p-4'>
                <p className='text-lg font-semibold mb-2 text-gray-900 truncate'>{product.title}</p>
                <p className='text-gray-700 font-medium'>Price: ${product.price}</p>
                <button
                    onClick={() => handleCart(product)}
                    className='mt-4 py-2 px-4 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition duration-300 ease-in-out focus:outline-none'
                    disabled={buttonText === 'Adding'} // Disable button when 'Adding' text is displayed
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
}

export default ProductCard;
