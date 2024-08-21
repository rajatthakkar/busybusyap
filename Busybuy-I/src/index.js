import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ProductProvider } from './Context/ProductsContext';
import { AuthProvider } from './Context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    
    <AuthProvider>
        <ProductProvider>
    <App />
    </ProductProvider>
</AuthProvider>

);
