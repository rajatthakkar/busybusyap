import React, { useEffect, useState } from 'react';
import { useProducts } from '../Context/ProductsContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebaseInit';
import { useAuth } from '../Context/AuthContext';

function Order() {
    const { currentCartUserRef, fetchUserRef } = useProducts();
    const [orders, setUserOrders] = useState([]);
const [totalAmount,setTotalAmount]=useState(0);
    const fetchOrders = async () => {
        if (currentCartUserRef) {
            const docRef = doc(db, "users", currentCartUserRef);
            await onSnapshot(docRef, (doc) => {
                const userData = doc.data();
                setUserOrders(userData.orders || []);
            });
        }
    };

    useEffect(() => {
        if (!currentCartUserRef) {
            fetchUserRef();
        }
    }, [currentCartUserRef, fetchUserRef]);

    useEffect(() => {
        fetchOrders();
    }, [currentCartUserRef]);

    return (
        <div className='bg-gray-100 min-h-screen'>
            <h1 className='font-bold text-3xl p-10 text-orange-500'>Your Orders</h1>
            <hr className='border-gray-300' />
                    {orders.length === 0 ? (
                        <h1 className='font-bold text-2xl text-red-600 text-center'>No orders yet! </h1>
                    ) : (
                        
            <div className='flex justify-center mt-10'>
                <div className='bg-white shadow-lg rounded-lg overflow-hidden w-2/3'>
                    {orders.map((order, index) => (
                        <div key={index} className='bg-orange-100 p-4'>
                            <p className='text-lg font-semibold'>Order Created on: <span className='font-bold'>{new Date(order.timestamp).toLocaleDateString()}</span></p>
                            <table className='w-full border-collapse'>
                                <thead className='bg-gray-300'>
                                    <tr>
                                        <th className='py-2 px-4 text-left' colSpan={4}>Product</th>
                                        <th className='py-2 px-4 text-left'>Title</th>
                                        <th className='py-2 px-4 text-left'>Price</th>
                                        <th className='py-2 px-4 text-left'>Quantity</th>
                                        <th className='py-2 px-4 text-left'></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.userCart.map((prod, index) => (
                                        <tr key={index}>
                                            <td colSpan={4} className='py-2 px-4'>{<img className="size-16 rounded border border-orange-500" src={prod.image}/>}</td>
                                            <td className='py-2 px-4'>{prod.title}</td>
                                            <td className='py-2 px-4'>$ {prod.price}</td>
                                            <td className='py-2 px-4'>{prod.quantity}</td>
                                            
                                        </tr>
                                    ))}
                                    <tr >
                                    <td></td> <td></td> <td></td>  <td></td>
                                        <td colSpan='3' className='py-2 px-4 text-right font-bold'>Total amount</td>
                                       
                                        <td className='py-2 px-4 font-bold'>$ {order.cartAmount}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            </div>)}
        </div>
    );
}

export default Order;
