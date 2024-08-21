import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { db } from "../config/firebaseInit";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

// Creating a context
const ProductsContext = createContext();

// Initial state for cart
const initialCartState = {
  items: [],
};

// Action types
const ADD_TO_CART = "ADD_TO_CART";
const REMOVE_CART_ITEM = "REMOVE_CART_ITEM";
const UPDATE_CART_ITEM_INC = "UPDATE_CART_ITEM_INC";
const UPDATE_CART_ITEM_DEC = "UPDATE_CART_ITEM_DEC";

// Reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    case REMOVE_CART_ITEM:
      const updatedItems = state.items.filter(
        (item) => item.id !== action.payload.id
      );
      return {
        ...state,
        items: updatedItems,
      };
    case UPDATE_CART_ITEM_INC:
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    case UPDATE_CART_ITEM_DEC:
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
      };
    default:
      return state;
  }
};

// Context provider component
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [toShowproducts, setToShowProducts] = useState([]);
  const [cart, dispatch] = useReducer(cartReducer, initialCartState);
  const [currentCartUserRef, setCurrentCartUserRef] = useState();
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState({});
  const [usercartAmount, setUserCartAmount] = useState(0);
  const [price, setPrice] = useState(750);
  const [menCat, setMenCat] = useState(false);
  const [womenCat, setwomenCat] = useState(false);
  const [jewellery, setjewellery] = useState(false);
  const [electronics, setElectronics] = useState(false);
  const [searchProd, setSearch] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filteredItems, setFilteredItems] = useState(products);
  const [filteredItemsByCat, setFilteredItemsByCat] = useState([]);
  const [userCart, setUserCart] = useState([]);

  let filters = [
    "jewelery",
    "electronics",
    "men's clothing",
    "women's clothing",
  ];
  // const {setLoading}=useAuth();

  const fetchUserRef = async () => {
    // setLoading(true);
    if (currentUser) {
      const userRef = collection(db, "users");
      const userSnapshot = await getDocs(userRef);
      // console.log(userSnapshot);
      const userData = userSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // console.log(userData);
      const currentUserData = userData.find(
        (user) => user.userId === currentUser?.uid
      );
      console.log(currentUserData, ".....current user data");
      setUserData(currentUserData);
      const currentUserRef = doc(db, "users", currentUserData.id);
      setCurrentCartUserRef(currentUserData.id);
    }
    // setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // setLoading(true);
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        setProducts(data);
        setToShowProducts(data);
        setFilteredItems(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
    fetchUserCart();
    // setLoading(false);
  }, []);

  useEffect(() => {
    //  setLoading(true);

    fetchUserRef();
    // setLoading(false);
  }, [currentUser]);

  useEffect(() => {
    const fetchUserData = async () => {
      // setLoading(true);
      if (currentCartUserRef) {
        await onSnapshot(doc(db, "users", currentCartUserRef), (doc) => {
          console.log(doc.data());
          const data = doc.data();

          console.log(userData, "---user data line 360 of pc");
          setUserCartAmount(doc.data().cartAmount);
          // console.log("user cart---", data);
        });
      }
      // setLoading(false);
    };
    fetchUserData();
  }, [currentCartUserRef]);

  // useEffect(()=>{
  //   if(products.length && menCat){
  //     let prodFilterByCat=products.filter((prod)=>{
  //       return prod.category==="men's clothing";
  //     })
  //     setToShowProducts(prodFilterByCat);
  //   }else{
  //     setToShowProducts(products);
  //   }
  // },[menCat])

  // useEffect(()=>{
  //   if(products.length && womenCat){
  //     let prodFilterByCat=products.filter((prod)=>{
  //       return prod.category==="women's clothing";
  //     })
  //     setToShowProducts(prodFilterByCat);
  //   }else{
  //     setToShowProducts(products);
  //   }
  // },[womenCat])

  // useEffect(()=>{
  //   if(products.length && jewellery){
  //     let prodFilterByCat=products.filter((prod)=>{
  //       return prod.category==="jewelery";
  //     })
  //     setToShowProducts(prodFilterByCat);
  //   }else{
  //     setToShowProducts(products);
  //   }
  // },[jewellery])

  // useEffect(()=>{
  //   if(products.length && electronics){
  //     let prodFilterByCat=products.filter((prod)=>{
  //       return prod.category==="electronics";
  //     })
  //     setToShowProducts(prodFilterByCat);
  //   }else{
  //     setToShowProducts(products);
  //   }
  // },[electronics])

  useEffect(() => {
    if (products.length && searchProd.trim() !== "") {
      let prodBySearch = products.filter(
        (prod) =>
          prod.title
            .trim()
            .toLowerCase()
            .includes(searchProd.trim().toLowerCase()) ||
          prod.id.toString().includes(searchProd.trim())
      );
      setFilteredItems(prodBySearch);
    } else {
      setFilteredItems(products);
    }
  }, [products, searchProd]);

  const fetchUserCart = async () => {
    // debugger;
    if (currentCartUserRef) {
      // setLoading(true);
      await onSnapshot(doc(db, "users", currentCartUserRef), (doc) => {
        console.log(doc.data());
        const data = doc.data().cart;
        setUserCart(data);
        console.log("user cart---", data);
      });
      // setLoading(false);
    }
  };

  const handleIncreaseQuantity = async (prod) => {
    // Increment the quantity of the product in the cart array
    const updatedCart = userCart.map((product) => {
      if (product.id === prod.id) {
        return { ...product, quantity: (product.quantity || 1) + 1 }; // Ensure quantity is initialized to 1 if undefined
      }
      return product;
    });

    // Update the cart data in Firestore
    const currentUserRef = doc(db, "users", currentCartUserRef);
    await updateDoc(currentUserRef, { cart: updatedCart });
    // await updateDoc(currentCartUserRef,{cartAmount:increment(prod.price)})
    setUserCart(updatedCart);
    toast.success(`Cart updated for product id- ${prod.id}`);
  };

  const productExistsInCart = (prod) => {
    return userCart.find((product) => product.id === prod.id);
  };
  const handleCartOperations = async (actionType, product) => {
    try {
      switch (actionType) {
        case ADD_TO_CART:
          const currentUserRef = doc(db, "users", currentCartUserRef);
          const docu = await getDoc(currentUserRef);
          const userData = docu.data();
          console.log("add to cart user ref line 157 ", docu.data());
          const prodExists = userData.cart.findIndex(
            (cartItem) => cartItem.id === product.id
          );
          // console.log(prodExists);
          //if product already exists, update the quantity(yet to implement)
          // if (prodExists !== -1) {
          //   toast.info("Product already exists! Check your cart");
          //   return;
          // }
          await updateDoc(currentUserRef, {
            cart: arrayUnion({ ...product, quantity: 1 }),
          });
          await updateDoc(currentUserRef, {
            cartAmount: increment(product.price),
          });
          // console.log(currentUserRef,"......currentuserref.data");
          dispatch({ type: actionType, payload: product });
          toast.success("Product added to cart");
          break;
        case REMOVE_CART_ITEM:
          // console.log(product, "--remove prod");
          // let temp = { ...product, quantity: 1 };
          const currentUserRef2 = doc(db, "users", currentCartUserRef);

          await updateDoc(currentUserRef2, { cart: arrayRemove(product) });
          //   await updateDoc(currentUserRef2, {
          //     cartAmount: increment(-(product.price*product.quantity))
          // });
          toast.success("Product removed from cart");
          dispatch({ type: actionType, payload: product });
          break;
        case UPDATE_CART_ITEM_INC:
          const incProductIndex = cart.items.findIndex(
            (item) => item.id === product.id
          );
          if (incProductIndex !== -1) {
            const incProduct = cart.items[incProductIndex];
            await updateDoc(currentCartUserRef, {
              cart: arrayRemove(incProduct),
            });
            await updateDoc(currentCartUserRef, {
              cart: arrayUnion({
                ...incProduct,
                quantity: incProduct.quantity + 1,
              }),
            });
            await updateDoc(currentUserRef, {
              cartAmount: increment(Number(product.price)),
            });
            toast.success("Product quantity updated in cart");
            dispatch({ type: actionType, payload: product });
          }
          break;
        case UPDATE_CART_ITEM_DEC:
          const decProductIndex = cart.items.findIndex(
            (item) => item.id === product.id
          );
          if (decProductIndex !== -1) {
            const decProduct = cart.items[decProductIndex];
            if (decProduct.quantity > 1) {
              await updateDoc(currentCartUserRef, {
                cart: arrayRemove(decProduct),
              });
              await updateDoc(currentCartUserRef, {
                cart: arrayUnion({
                  ...decProduct,
                  quantity: decProduct.quantity - 1,
                }),
              });
              await updateDoc(currentUserRef, {
                cartAmount: increment(-Number(product.price)),
              });
              toast.success("Product quantity updated in cart");
              dispatch({ type: actionType, payload: product });
            }
          }
          break;

        default:
          toast.error("Invalid action!");
        // console.error("Invalid action type");
      }
    } catch (error) {
      toast.error("Error updating cart");

      console.error("Error updating cart:", error);
    }
  };

  const fetchProductByPrice = () => {
    if (products.length) {
      let prodFilterByPrice = filteredItemsByCat.filter((prod) => {
        return prod.price <= price;
      });
      // setToShowProducts(prodFilterByPrice);
      setFilteredItems(prodFilterByPrice);
    }
  };

  const handleFilters = (category) => {
    //if selected filters already has the choosen category,then remove the category
    if (selectedFilters.includes(category)) {
      let filters = selectedFilters.filter((f) => f == category);
      setSelectedFilters(filters);
    }
    //if the filter is new and does not already exist in selected filters array
    else {
      setSelectedFilters([...selectedFilters, category]);
    }
  };

  const filterItems = () => {
    if (selectedFilters.length > 0) {
      let tempItems = selectedFilters.map((selectedCat) => {
        let temp = products.filter(
          (prod) => prod.category === selectedCat && prod.price <= price
        );
        return temp;
      });
      console.log(
        "filters in tempItems on already existing codn---",
        tempItems.flat()
      );
      setFilteredItems(tempItems.flat());
      setFilteredItemsByCat(tempItems.flat());
      console.log(
        "filters in filteredItems on already existing codn---",
        filteredItems
      );
    } else {
      setFilteredItems([...products]);

      console.log(
        "filters in tempItems on new filter addition codn---",
        filteredItems
      );
    }
  };

  useEffect(() => {
    if (!selectedFilters.length) {
      setFilteredItemsByCat(products);
    }
    filterItems();
  }, [selectedFilters, products]);
  return (
    <ProductsContext.Provider
      value={{
        products,
        setProducts,
        cart,
        handleCartOperations,
        currentCartUserRef,
        setUserCartAmount,
        usercartAmount,
        setUserData,
        userData,
        fetchUserRef,
        price,
        setPrice,
        fetchProductByPrice,
        setToShowProducts,
        toShowproducts,
        setMenCat,
        setwomenCat,
        setElectronics,
        setjewellery,
        setSearch,
        searchProd,
        filters,
        selectedFilters,
        filteredItems,
        handleFilters,
        handleIncreaseQuantity,
        productExistsInCart,
        fetchUserCart,
        userCart,
        setUserCart
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

// Custom hook to consume the context
export const useProducts = () => useContext(ProductsContext);
