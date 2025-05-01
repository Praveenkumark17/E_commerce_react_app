import React, { useEffect, useState } from "react";
import usercart_style from "./usercart.module.css";
import Footer from "../Footer/footer";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setPrice } from "../../redux/slices/pricesclice";
import { setCartcount } from "../../redux/slices/countslice";
import { Slide, toast, ToastContainer } from "react-toastify";

export default function Usercart() {
  const [cart, setCart] = useState([]);

  const dispatcher = useDispatch();
  const [userdata, setUserdata] = useState({});
  const [localcart, setLocalcart] = useState({});

  const [prices, setPrices] = useState(0);
  const [deliveryfee, setDeliveryfee] = useState(0);

  const [cartTrigger,setcartTrigger] = useState(false);

  useEffect(() => {
    const getuserdata = localStorage.getItem("credentials");
    if (getuserdata) {
      setUserdata(JSON.parse(getuserdata));
    }

    const getlocalcart = JSON.parse(localStorage.getItem("localcart")) || {};
    if (getlocalcart) {
      setLocalcart(getlocalcart);
    }
  }, []);

  // Fetch Cart Effect
  useEffect(() => {
    console.log("Fetching cart");
    const fetchcart = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/auth/getcartemail/${userdata.email}`
        );
        console.log("cart fetched:", res.data);
        const cart = res.data;
        setCart(res.data);
        let price = 0;
        for (const item in cart) {
          if (cart[item].price && cart[item].email === userdata?.email) {
            price += cart[item].price;
          }
        }
        setPrices(price);
        setDeliveryfee(prices > 0 ? 20 : 0);
        const filteredCart = cart.filter(
          (item) => item.email === userdata?.email
        );
        dispatcher(setCartcount(filteredCart.length));
        console.log("price", price);
        dispatcher(setPrice(price.toFixed(2)));
      } catch (err) {
        console.log("Error fetching cart:", err.response.data);
      }
    };

    fetchcart();
    setcartTrigger(false);
  }, [localcart, dispatcher, userdata, prices,cartTrigger]);

  const handleAddToCart = async (product) => {
    try {
      const productWithEmail = { ...product, email: userdata.email };
      await axios
        .post(`${process.env.REACT_APP_API_URL}/api/auth/addcart`, productWithEmail)
        .then((res) => {
          console.log("cart response", res.data);
        })
        .catch(async (err) => {
          console.log(err.response.data.message);
        });
      const updatedAddedProducts = {
        ...localcart,
        [product.productname + "_" + userdata.email]: {
          id: product.productname,
          status: false,
          email: userdata.email,
        },
      };
      setLocalcart(updatedAddedProducts);
      localStorage.setItem("localcart", JSON.stringify(updatedAddedProducts));
    } catch (error) {
      console.error("Error adding product to cart:", error.message);
    }
  };

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const cartPlace = () => {
    if (isChecked) {
      toast.success("Your Order Placed Successfully", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Slide,
      });
    } else {
      toast.error("Agree to the Terms and Conditions.", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Slide,
      });
    }
  };

  const addupdateCart = async (data) => {
    const quantity = data.quantity;
    const price = data.price;

    const originalPricePerUnit = price / quantity;

    const newQuantity = quantity + 1;
    const newPrice = originalPricePerUnit * newQuantity;

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/auth/updatecart/${data._id}`, {
        quantity : newQuantity,
        price : newPrice
      }).then(res=>{
        console.log("Cart updated successfully:", res.data);
        setcartTrigger(true);
      })
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };
  const removeupdateCart = async (data) => {
    const quantity = data.quantity;
    const price = data.price;

    const originalPricePerUnit = price / quantity;

    const newQuantity = quantity - 1;
    const newPrice = originalPricePerUnit * newQuantity;

    if(newQuantity === 0){
      handleAddToCart(data);
    }
    else{
      try {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/auth/updatecart/${data._id}`, {
          quantity : newQuantity,
          price : newPrice
        }).then(res=>{
          console.log("Cart updated successfully:", res.data);
          setcartTrigger(true);
        })
      } catch (error) {
        console.error("Error updating cart:", error);
      }
    }
  };

  return (
    <>
      <div>
        <ToastContainer />
        <div className={`${usercart_style.cart} mx-5 mb-5`}>
          <div
            className={`${usercart_style.carttitle} d-flex justify-content-between align-items-center`}
          >
            <p className="mt-3 fs-4 fw-semibold">Your Orders</p>{" "}
          </div>
          <hr className="m-0" />
          <div className="my-5">
            <table className={`${usercart_style.table} mx-auto text-center`}>
              <thead className={`${usercart_style.thead}`}>
                <tr>
                  <th>Serial</th>
                  <th>Product</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className={`${usercart_style.tbody}`}>
                {cart && cart.length > 0 ? (
                  cart.map((data, index) => (
                    <tr key={index} className="fw-semibold">
                      <td style={{ fontWeight: "500" }}>{index + 1}</td>
                      <td>
                        <img
                         src={data.image?.startsWith('https')?`${data.image}`:`${process.env.REACT_APP_API_URL}/images/product/${data.image}`}
                          alt={data.productname}
                          className={`${usercart_style.cartimg}`}
                        />
                      </td>
                      <td>{data.productname}</td>
                      <td>₹ {data.price.toFixed(2)}</td>
                      <td>{data.category}</td>
                      <td>
                        <div className="d-flex gap-2 justify-content-center align-items-center">
                          <button
                            className={usercart_style.qutbtn1}
                            onClick={() => removeupdateCart(data)}
                          >
                            <Icon
                              icon="fluent:subtract-16-filled"
                              width="24"
                              height="24"
                            />
                          </button>
                          <input
                            className={usercart_style.qutinput}
                            type="text"
                            value={data.quantity}
                            disabled
                          />
                          <button
                            className={usercart_style.qutbtn2}
                            onClick={() => addupdateCart(data)}
                          >
                            <Icon icon="ic:round-add" width="24" height="24" />
                          </button>
                        </div>
                      </td>
                      <td>
                        <Icon
                          icon="iconamoon:trash-duotone"
                          width="20"
                          height="20"
                          style={{ color: "red", cursor: "pointer" }}
                          onClick={() => handleAddToCart(data)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="fs-4 mt-3 text-center fw-semibold"
                    >
                      No Orders
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <hr className="m-0" />
          <div className="mt-3 d-flex flex-column gap-2 fw-semibold">
            <p className="m-0">Sub Total: ₹ {prices.toFixed(2)}</p>
            <p className="m-0">Delivery fee: ₹ {deliveryfee.toFixed(2)}</p>
            <p className="m-0">Total: ₹ {(prices + deliveryfee).toFixed(2)}</p>
          </div>
        </div>

        <div className={`${usercart_style.contact} mx-5 mb-5`}>
          <div
            className={`${usercart_style.con} d-flex justify-content-between align-items-center`}
          >
            <p className="mt-3 fs-4 fw-semibold">Delivery Schedule</p>{" "}
          </div>
          <hr className="m-0" />
          <div className={`${usercart_style.conlist} mt-3`}>
            <div
              className={`${usercart_style.conactive}`}
              style={{ backgroundColor: "#cf9afd" }}
            >
              <p className="m-0 fw-semibold">Express</p>
              <p className="m-0 ">90 Min Express Delivery</p>
            </div>
            <div>
              <p className="m-0 fw-semibold">8am - 10pm</p>
              <p className="m-0 ">8am - 10pm</p>
            </div>
            <div>
              <p className="m-0 fw-semibold">Next Day</p>
              <p className="m-0 ">Next Day or Tomorrow</p>
            </div>
          </div>
        </div>
        <div className={`${usercart_style.contact} m-5`}>
          <div
            className={`${usercart_style.con} d-flex justify-content-between align-items-center`}
          >
            <p className="m-0 fs-4 fw-semibold">Contact Number</p>{" "}
            <button>Add Contact</button>
          </div>
          <hr className="m-0" />
          <div className={`${usercart_style.conlist} mt-3`}>
            <div
              className={`${usercart_style.conactive}`}
              style={{ backgroundColor: "#cf9afd" }}
            >
              <p className="m-0 fw-semibold">Primary</p>
              <p className="m-0 fw-semibold">+91 9874563210</p>
            </div>
            <div>
              <p className="m-0 fw-semibold">Secondary</p>
              <p className="m-0 fw-semibold">+91 8974563210</p>
            </div>
            <div>
              <p className="m-0 fw-semibold">Secondary</p>
              <p className="m-0 fw-semibold">+91 7856320149</p>
            </div>
          </div>
        </div>
        <div className={`${usercart_style.contact} mx-5 mb-5`}>
          <div
            className={`${usercart_style.con} d-flex justify-content-between align-items-center`}
          >
            <p className="m-0 fs-4 fw-semibold">Delivery Address</p>{" "}
            <button>Add Address</button>
          </div>
          <hr className="m-0" />
          <div className={`${usercart_style.conlist} mt-3`}>
            <div
              className={`${usercart_style.conactive}`}
              style={{ backgroundColor: "#cf9afd" }}
            >
              <p className="m-0 fw-semibold">Home</p>
              <p className="m-0 ">
                123 Evergreen Terrace, Springfield, Illinois, 62701, USA
              </p>
            </div>
            <div>
              <p className="m-0 fw-semibold">Office</p>
              <p className="m-0 ">456 Maple Street, Anytown, TX, 75001, USA</p>
            </div>
            <div>
              <p className="m-0 fw-semibold">Bussiness</p>
              <p className="m-0 ">789 Oak Avenue, Smallville, KS, 66002, USA</p>
            </div>
          </div>
        </div>
        <div className={`${usercart_style.contact} mx-5 mb-5`}>
          <div
            className={`${usercart_style.con} d-flex justify-content-between align-items-center`}
          >
            <p className="m-0 fs-4 fw-semibold">Cards</p>{" "}
            <button>Add Card</button>
          </div>
          <hr className="m-0" />
          <div className={`${usercart_style.conlist} mt-3`}>
            <div
              className={`${usercart_style.conactive}`}
              style={{ backgroundColor: "#cf9afd" }}
            >
              <p className="m-0 fw-semibold">
                <Icon icon="fontisto:paypal" width="36" height="24" />
              </p>
              <p className="m-0 fw-semibold">Card Number</p>
              <p className="m-0 fw-semibold fs-5 d-flex gap-3">
                <p className="m-0">****</p>
                <p className="m-0">****</p>
                <p className="m-0">****</p>
                <p className="m-0">0458</p>
              </p>
              <p className="m-0 fw-semibold">Jhon</p>
            </div>
            <div>
              <p className="m-0 fw-semibold">
                <Icon icon="fa-brands:cc-visa" width="40" height="30" />
              </p>
              <p className="m-0 fw-semibold">Card Number</p>
              <p className="m-0 fw-semibold fs-5 d-flex gap-3">
                <p className="m-0">****</p>
                <p className="m-0">****</p>
                <p className="m-0">****</p>
                <p className="m-0">5730</p>
              </p>
              <p className="m-0 fw-semibold">Jhon</p>
            </div>
            <div>
              <p className="m-0 fw-semibold">
                <Icon icon="cib:cc-mastercard" width="40" height="30" />
              </p>
              <p className="m-0 fw-semibold">Card Number</p>
              <p className="m-0 fw-semibold fs-5 d-flex gap-3">
                <p className="m-0">****</p>
                <p className="m-0">****</p>
                <p className="m-0">****</p>
                <p className="m-0">3497</p>
              </p>
              <p className="m-0 fw-semibold">Jhon</p>
            </div>
          </div>
          <div>
            <div className="form-check my-3">
              <input
                className="form-check-input"
                type="checkbox"
                onChange={handleCheckboxChange}
                id="flexCheckDefault"
              />
              <label className="form-check-label" htmlFor="flexCheckDefault">
                By making this purchase you agree to our{" "}
                <span className="text-primary">Terms and condition</span>
              </label>
            </div>
            <button
              className={`${usercart_style.button}`}
              onClick={() => cartPlace()}
            >
              Proced To Checkout
            </button>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
