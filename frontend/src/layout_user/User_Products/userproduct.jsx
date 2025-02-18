import React, { useEffect, useState } from "react";
import userproduct_style from "./userproduct.module.css";
import Footer from "../Footer/footer";
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setPrice } from "../../redux/slices/pricesclice";
import { setCartcount, setFavcount } from "../../redux/slices/countslice";

export default function Userproduct() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const location = useLocation();

  const [userdata, setUserdata] = useState({});
  const [localcart, setLocalcart] = useState({});
  const [localfav, setLocalfav] = useState({});

  const dispatcher = useDispatch();

  const favtrigger = useSelector((state)=>state.countinfo.favtrigger);

  useEffect(() => {
    const getuserdata = localStorage.getItem("credentials");
    if (getuserdata) {
      setUserdata(JSON.parse(getuserdata));
    }

    const getlocalcart = JSON.parse(localStorage.getItem("localcart")) || {};
    if (getlocalcart) {
      setLocalcart(getlocalcart);
    }

    const favdata = localStorage.getItem("localfav");
    if (favdata) {
      setLocalfav(JSON.parse(favdata));
    }
  }, [favtrigger]);

  const handleAddToCart = async (product) => {
    try {
      const productWithEmail = { ...product, email: userdata.email };
      await axios
        .post(`${process.env.REACT_APP_API_URL}/api/auth/addcart`, productWithEmail)
        .then((res) => {
          console.log(res.data);
        })
        .catch(async (err) => {
          console.log(err.response.data.message);
        });
      const existingProductKey = Object.keys(localcart).find(
        (key) =>
          localcart[key].id === product.productname &&
          localcart[key].email === userdata.email
      );
      const updatedAddedProducts = {
        ...localcart,
        [product.productname + "_" + userdata.email]: existingProductKey
          ? {
              id: product.productname,
              status: !localcart[existingProductKey].status,
              email: userdata.email,
            }
          : {
              id: product.productname,
              status: true,
              email: userdata?.email || "", // Ensure email is set if userdata.email is undefined
            },
      };
      setLocalcart(updatedAddedProducts);
      localStorage.setItem("localcart", JSON.stringify(updatedAddedProducts));
    } catch (error) {
      console.error("Error adding product to cart:", error.message);
    }
  };

  const handleAddTofav = async (product) => {
    try {
      const productWithEmail = { ...product, email: userdata.email };
      await axios
        .post(`${process.env.REACT_APP_API_URL}/api/auth/addfav`, productWithEmail)
        .then((res) => {
          console.log(res.data);
        })
        .catch(err => {
          console.log(err.response.data.message);
        });
      const existingProductKey = Object.keys(localfav).find(
        (key) =>
          localfav[key].id === product.productname &&
          localfav[key].email === userdata.email
      );
      const updatedAddedProducts = {
        ...localfav,
        [product.productname + "_" + userdata.email]: existingProductKey
          ? {
              id: product.productname,
              status: !localfav[existingProductKey].status,
              email: userdata.email,
            }
          : {
              id: product.productname,
              status: true,
              email: userdata?.email || "", // Ensure email is set if userdata.email is undefined
            },
      };

      let countWithStatusTrue = 0;
      for (const key in updatedAddedProducts) {
        if (
          updatedAddedProducts[key].status === true &&
          updatedAddedProducts[key].email === userdata.email
        ) {
          countWithStatusTrue++;
        }
      }

      dispatcher(setFavcount(countWithStatusTrue));

      // Update the state with the new product information
      setLocalfav(updatedAddedProducts);
      console.log("Updated localfav", updatedAddedProducts);
      setLocalfav(updatedAddedProducts);
      localStorage.setItem("localfav", JSON.stringify(updatedAddedProducts));
    } catch (error) {
      console.error("Error adding product to cart:", error.message);
    }
  };

  useEffect(() => {
    const handleScrollToCategory = () => {
      const query = new URLSearchParams(location.search);
      const category = query.get("category");
      if (category) {
        const element = document.getElementById(category);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    // Delay to ensure elements are rendered
    setTimeout(handleScrollToCategory, 500);

    return () => {
      // Clean-up function
      clearTimeout(handleScrollToCategory);
    };
  }, [location]);

  // Fetch Categories Effect
  useEffect(() => {
    console.log("Fetching categories");
    const fetchCategory = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/auth/getcategory`
        );
        console.log("Categories fetched:", res.data);
        setCategories(res.data);
      } catch (err) {
        console.log("Error fetching categories:", err.response.data);
      }
    };

    fetchCategory();
  }, []);

  // Fetch Products Effect
  useEffect(() => {
    console.log("Fetching Products");
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/auth/getproduct`
        );
        console.log("product fetched:", res.data);
        setProducts(res.data);
      } catch (err) {
        console.log("Error fetching products:", err.response.data);
      }
    };

    fetchProducts();
  }, []);

  // Fetch Cart Effect
  useEffect(() => {
    console.log("Fetching cart");
    const fetchcart = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/getcart`);
        console.log("cart fetched:", res.data);
        const cart = res.data;
        const filteredCart = cart.filter(
          (item) => item.email === userdata?.email
        );
        dispatcher(setCartcount(filteredCart.length));
        let price = 0;
        for (const item in cart) {
          if (cart[item].price && cart[item].email === userdata?.email) {
            price += cart[item].price;
          }
        }
        console.log("price", price);
        dispatcher(setPrice(price.toFixed(2)));
      } catch (err) {
        console.log("Error fetching cart:", err.response.data);
      }
    };

    fetchcart();
  }, [localcart, dispatcher, userdata]);

  return (
    <>
      <div>
        {categories.map((data, index) => (
          <div key={index}>
            <p
              className="m-0 my-4 fs-2 fw-semibold text-center"
              id={data.categoryname}
            >
              {data.categoryname}
            </p>
            <div>
              <div className={`${userproduct_style.rows} mb-5`}>
                {products
                  .filter((product) => product.category === data.categoryname)
                  .map((product, productIndex) => (
                    <div
                      className={`${userproduct_style.cols}`}
                      key={productIndex}
                    >
                      <div className={userproduct_style.imgparent}>
                        <div className={userproduct_style.imgchild1}>new</div>
                        <div
                          className={`${
                            localfav[product.productname + "_" + userdata.email]?.status &&
                            localfav[product.productname + "_" + userdata.email]?.email ===
                              userdata.email
                              ? userproduct_style.imgchild22
                              : userproduct_style.imgchild2
                          }`}
                        >
                          <Icon
                            icon="line-md:heart-filled"
                            width="24"
                            height="24"
                            onClick={() => handleAddTofav(product)}
                          />
                        </div>
                        <img
                          src={product.image?.startsWith('https')?`${product.image}`:`${process.env.REACT_APP_API_URL}/images/product/${product.image}`}
                          alt={product.productname}
                          className={`${userproduct_style.proimg}`}
                        />
                      </div>
                      <div
                        className="d-flex justify-content-center fw-semibold"
                        style={{ fontSize: "17px" }}
                      >
                        {product.productname}
                      </div>
                      <p className="d-flex justify-content-center fw-semibold">
                        {product.price}₹
                      </p>
                      <button
                        className={`${
                          localcart[product.productname + "_" + userdata.email]?.status &&
                          localcart[product.productname + "_" + userdata.email]?.email ===
                            userdata.email
                            ? userproduct_style.probutton1
                            : userproduct_style.probutton
                        } d-flex align-items-center justify-content-center gap-2`}
                        type="button"
                        onClick={() => handleAddToCart(product)}
                      >
                        <Icon icon="solar:cart-3-bold" width="20" height="20" />{" "}
                        {localcart[product.productname + "_" + userdata.email]?.status &&
                        localcart[product.productname + "_" + userdata.email]?.email === userdata.email
                          ? "Added"
                          : "Add"}
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
}
