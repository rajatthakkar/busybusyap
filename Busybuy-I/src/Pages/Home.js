import React, { useEffect, useState } from 'react';
import ProductCard from '../Components/ProductCard';
import { useProducts } from '../Context/ProductsContext';

function Home() {
    const { toShowproducts,price, setPrice,setMenCat,setwomenCat,setElectronics,setjewellery,fetchProductByPrice,setSearch, searchProd,filters,selectedFilters,filteredItems,handleFilters } = useProducts(); 
    const handleProdByPrice=()=>{
    fetchProductByPrice();
    }
    useEffect(()=>{
handleProdByPrice();
    },[price]);

    const handleCat1=()=>{
        setMenCat((prev)=>!prev);
    }
    const handleCat2=()=>{
        setwomenCat((prev)=>!prev);
    }
    const handleCat3=()=>{
        setjewellery((prev)=>!prev);
    }
    const handleCat4=()=>{
        setElectronics((prev)=>!prev);
    }

    return (
        
        <div className="container mx-auto px-4 pt-5">
            <div className='flex justify-center items-center mb-5'>
                <input type='text' placeholder='Search by Name or Product Id' onChange={(e)=>setSearch(e.target.value)} value={searchProd} className='w-2/5 h-full p-5 rounded-xl max-xl border mt-2 border-blue-400' />
            </div>
            <div className='flex gap-5 justify-between items-start'>
                {/* Sidebar filters */}
                <div className='bg-blue-50 w-1/5 flex flex-col justify-center items-center gap-2 p-5 rounded-xl'>
                    <h1 className='font-bold text-3xl'>Filters</h1>
                    <p className='font-bold text-xl'>Price: $ {price}</p>
                    <input type='range' value={price} onChange={(e) => setPrice(e.target.value)} min={0} max={750} />
                    <p className='font-bold text-xl'>Category</p>
                    <div className='flex flex-col justify-start items-start'>
                      
                        {filters.map((category,index)=>(
                            <button onClick={()=>handleFilters(category)} className={`${selectedFilters?.includes(category)?"bg-orange-500":"bg-slate-300"} rounded p-2 m-2 font-bold text-white`} key={index}>{category}</button>
                        ))}
                    </div>
                </div>
    
                <div className='w-4/5 flex flex-wrap gap-4'>
                    {filteredItems.map((prod,index) => (
                        <ProductCard key={prod.id} product={prod}/>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;
