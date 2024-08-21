import React, { useEffect, useState } from 'react';
import ProductCard from '../Components/ProductCard';
import { arrayUnion, collection, doc, getDoc, increment, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebaseInit';
import { useAuth } from '../Context/AuthContext';
import { useProducts } from '../Context/ProductsContext';
import { useParams } from 'react-router-dom';
import CartCard from '../Components/CartCard';
import { toast } from 'react-toastify';

function Cart() {
    const { currentUser } = useAuth();
    const { currentCartUserRef,usercartAmount,userData,handleCartOperations,fetchUserRef,fetchUserCart,userCart,setUserCart} = useProducts();
    const { userId } = useParams();
    const [cartAmount, setCartAmount] = useState(0);


useEffect(()=>{
if(!currentCartUserRef){
    fetchUserRef();
  }
fetchUserCart();
},[])

useEffect(()=>{
fetchUserCart();
},[currentCartUserRef])

useEffect(() => {
    // debugger;
    if (userCart.length) {
      let amount = userCart.reduce(
        (acc, prod) => acc + prod.quantity * prod.price,
        0
      );
      setCartAmount(amount.toFixed(2));
    // setLoading(false);
    }else{
        setCartAmount(0);
    }
   
  }, [userCart]);

    const handlePurchase = async () => {
      // setLoading(true);
      if(userCart.length===0){
        toast.info("No products in your cart!");
        return;
      }
        let purchaseData = [
          ...userData.orders,
          { userCart, cartAmount: parseFloat(cartAmount), timestamp: Date.now() },
        ];
        const currentUserRef = doc(db, "users", currentCartUserRef);
        await updateDoc(currentUserRef, {
          orders: purchaseData,
        });
        setUserCart([]);
        // After adding the products to orders, set the cart as empty
        await updateDoc(currentUserRef, { cart: [] });
        toast.success("Order placed successfully");
      };




  const handleDecreaseQuantity = async (prod) => {
    // Increment the quantity of the product in the cart array
   
        if(prod.quantity===1){
            handleCartOperations("REMOVE_CART_ITEM",prod);
          
        }else{
            const updatedCart = userCart.map((product) => {
        if (product.id === prod.id) {
        //check if prod recieved has quantity 1, then remove the product from cart and return
      
        return { ...product, quantity: product.quantity - 1 }; 
      }
         return product;
        });

    // Update the cart data in Firestore
    const currentUserRef = doc(db, "users", currentCartUserRef);
    await updateDoc(currentUserRef, { cart: updatedCart });
    setUserCart(updatedCart);
    toast.success(`Cart updated for product id- ${prod.id}`);
  }};


    return (
        <>
            <h1 className='font-bold text-3xl p-10 text-orange-500'>Your Cart</h1><hr />
            <div className='flex gap-5 justify-between items-center v-screen'>
                {/* Sidebar */}
                <div className='bg-orange-50 w-1/5 ml-10 flex flex-col justify-center items-center gap-2 p-5 rounded-xl'>
                    <h1 className='font-bold text-3xl'>Total Amount</h1>
                    <p>$ {cartAmount}</p>
                    <button onClick={() =>handlePurchase() } className='mt-4 py-2 px-4 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition duration-300 ease-in-out'>Purchase</button>
                </div>
                {/* Products */}
                <div className='w-full mr-10 flex flex-wrap gap-4 mt-16'>
                    {userCart.length === 0 ? (
                        <h1 className='font-bold text-2xl text-red-600'>Cart is empty! Shop Now</h1>
                    ) : (
                        userCart.map((cartProd) => (
                             <CartCard key={cartProd.id} product={cartProd}  handleDecreaseQuantity={handleDecreaseQuantity}/>
                            
                        ))
                    )}
                </div>
            </div>
        </>
    );
}

export default Cart;
