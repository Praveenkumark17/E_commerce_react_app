import React, { useEffect, useRef, useState } from "react";
import userhome_style from "./userhome.module.css";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer/footer";
import { setPrice } from "../../redux/slices/pricesclice";
import { useDispatch, useSelector } from "react-redux";
import { setCartcount, setFavcount } from "../../redux/slices/countslice";

export default function Userhome() {
  const [time, setTime] = useState(87400);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [userdata, setUserdata] = useState({});
  const [localcart, setLocalcart] = useState({});
  const [localfav, setLocalfav] = useState({});

  const dispatcher = useDispatch();

  const favtrigger = useSelector((state) => state.countinfo.favtrigger);

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

  const navigate = useNavigate();

  // Timer Effect
  useEffect(() => {
    console.log("Starting timer");
    const timer = setInterval(() => {
      setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => {
      console.log("Clearing timer");
      clearInterval(timer);
    };
  }, []);

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

  const days = String(Math.floor(time / (24 * 60 * 60))).padStart(2, "0");
  const hours = String(
    Math.floor((time % (24 * 60 * 60)) / (60 * 60))
  ).padStart(2, "0");
  const minutes = String(Math.floor((time % (60 * 60)) / 60)).padStart(2, "0");
  const seconds = String(time % 60).padStart(2, "0");

  const onLink = (categoryName) => {
    navigate(`/user/products?category=${categoryName}`);
  };

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

      // Update the state with the new product information
      setLocalcart(updatedAddedProducts);
      console.log("Updated localcart", updatedAddedProducts);
      setLocalcart(updatedAddedProducts);
      localStorage.setItem("localcart", JSON.stringify(updatedAddedProducts));
    } catch (error) {
      console.error("Error adding product to cart:", error.message);
    }
  };

  const handleAddTofav = async (product) => {
    console.log("product", product);

    try {
      const productWithEmail = { ...product, email: userdata.email };
      await axios
        .post(`${process.env.REACT_APP_API_URL}/api/auth/addfav`, productWithEmail)
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
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
      localStorage.setItem("localfav", JSON.stringify(updatedAddedProducts));
    } catch (error) {
      console.error("Error adding product to cart:", error.message);
    }
  };

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

  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <>
      <div className={`${userhome_style.body}`}>
        <div
          id="carouselExampleIndicators"
          className={`${userhome_style.slide} carousel slide`}
          data-bs-ride="true"
        >
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <div className={`${userhome_style.img1} d-flex px-5`}>
                <div
                  className="d-flex align-items-start justify-content-center flex-column w-50"
                  style={{ margin: "0 0 0 5%" }}
                >
                  <p className="fs-1 fw-semibold" style={{ width: "80%" }}>
                    Free Home Delivery Within 24 Hours Now.
                  </p>
                  <p className="fw-semibold" style={{ textAlign: "justify" }}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Iste repellendus et esse fugiat eligendi saepe cumque
                    debitis atque voluptas maiores quod error necessitatibus eos
                    vitae odit dolores harum non fugit possimus velit.
                  </p>
                  <div className="d-flex gap-3 mt-2">
                    <button
                      className={`${userhome_style.slidebtn} d-flex gap-2`}
                      type="submit"
                    >
                      <Icon icon="solar:cart-3-bold" width="24" height="24" />{" "}
                      Shop Now
                    </button>
                    <button
                      className={`${userhome_style.slidebtn1} d-flex gap-2`}
                      type="submit"
                    >
                      <Icon icon="bxs:offer" width="24" height="24" /> Get Offer
                    </button>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-center w-50">
                  <div className={`${userhome_style.slideimg1}`}></div>
                </div>
              </div>
            </div>
            {/* <div className="carousel-item">
              
            </div> */}
            <div className="carousel-item">
              <div className={`${userhome_style.img3} d-flex px-5`}>
                <div className="d-flex align-items-center justify-content-center w-50">
                  <div className={`${userhome_style.slideimg3}`}></div>
                </div>
                <div
                  className="d-flex align-items-start justify-content-center flex-column w-50"
                  style={{ margin: "0 0 0 5%" }}
                >
                  <p className="fs-1 fw-semibold" style={{ width: "80%" }}>
                    Free Home Delivery Within 24 Hours Now.
                  </p>
                  <p className="fw-semibold" style={{ textAlign: "justify" }}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Iste repellendus et esse fugiat eligendi saepe cumque
                    debitis atque voluptas maiores quod error necessitatibus eos
                    vitae odit dolores harum non fugit possimus velit.
                  </p>
                  <div className="d-flex gap-3 mt-2">
                    <button
                      className={`${userhome_style.slidebtn} d-flex gap-2`}
                      type="submit"
                    >
                      <Icon icon="solar:cart-3-bold" width="24" height="24" />
                      Shop Now
                    </button>
                    <button
                      className={`${userhome_style.slidebtn1} d-flex gap-2`}
                      type="submit"
                    >
                      <Icon icon="bxs:offer" width="24" height="24" />
                      Get Offer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
        <div className="my-5">
          <p className="m-0 my-4 d-flex justify-content-center fs-1 fw-semibold">
            Category
          </p>
          <div className={`${userhome_style.cathead} mx-auto`}>
            <button
              className={userhome_style.catbtn1}
              onClick={() => scrollLeft()}
            >
              <Icon icon="mingcute:arrow-left-line" width="24" height="24" />
            </button>
            <button
              className={userhome_style.catbtn2}
              onClick={() => scrollRight()}
            >
              <Icon icon="mingcute:arrow-right-line" width="24" height="24" />
            </button>
            <div
              className={`${userhome_style.cat} d-flex gap-3 mb-5`}
              ref={scrollRef}
            >
              {categories.map((data, index) => (
                <div
                  className={`${userhome_style.catimgmain}`}
                  onClick={() => onLink(data.categoryname)}
                >
                  <img
                    key={index}
                    className={`${userhome_style.catimg}`}
                    src={`${process.env.REACT_APP_API_URL}/images/category/${data.image}`}
                    alt={data.categoryname}
                  />
                  <div
                    className={`${userhome_style.catimgtext} fs-5 fw-semibold`}
                  >
                    {data.categoryname}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <p className="mb-5 d-flex justify-content-center fs-2 fw-semibold">
            Recently Added Products
          </p>

          <div>
            <div className={`${userhome_style.rows} mb-5`}>
              {products
                .filter((data) => data.category === "Biscuit")
                .slice(-10) // Get the last 10 items
                .reverse() // Reverse the order
                .map((data, index) => (
                  <div className={`${userhome_style.cols}`} key={index}>
                    <div className={userhome_style.imgparent}>
                      <div className={userhome_style.imgchild1}>new</div>
                      <div
                        className={`${
                          localfav[data.productname + "_" + userdata.email]
                            ?.status &&
                          localfav[data.productname + "_" + userdata.email]
                            ?.email === userdata.email
                            ? userhome_style.imgchild22
                            : userhome_style.imgchild2
                        }`}
                      >
                        <Icon
                          icon="line-md:heart-filled"
                          width="24"
                          height="24"
                          onClick={() => handleAddTofav(data)}
                        />
                      </div>
                      <img
                        src={`${process.env.REACT_APP_API_URL}/images/product/${data.image}`}
                        alt=""
                        className={`${userhome_style.proimg}`}
                      />
                    </div>
                    <div
                      className="d-flex justify-content-center fw-semibold"
                      style={{ fontSize: "17px" }}
                    >
                      {data.productname}
                    </div>
                    <p className="d-flex justify-content-center fw-semibold">
                      {data.price}₹
                    </p>
                    <button
                      className={`${
                        localcart[data.productname + "_" + userdata.email]
                          ?.email === userdata.email &&
                        localcart[data.productname + "_" + userdata.email]
                          ?.status
                          ? userhome_style.probutton1
                          : userhome_style.probutton
                      } d-flex align-items-center justify-content-center gap-2`}
                      type="button"
                      onClick={() => handleAddToCart(data)}
                    >
                      <Icon icon="solar:cart-3-bold" width="20" height="20" />{" "}
                      {localcart[data.productname + "_" + userdata.email]
                        ?.status &&
                      localcart[data.productname + "_" + userdata.email]
                        ?.email === userdata.email
                        ? "Added"
                        : "Add"}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className={`${userhome_style.img2} d-flex px-5`}>
          <div
            className="d-flex align-items-center text-center justify-content-center flex-column w-50"
            style={{ margin: "0 0 0 5%" }}
          >
            <p className="fs-1 fw-semibold" style={{ width: "80%" }}>
              Shop the Sale of the Season! Discounts Up to 50% Off!
            </p>
            <p className="fw-semibold">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste
              repellendus et esse fugiat eligendi saepe cumque debitis atque
              voluptas maiores quod.
            </p>
            <div className="d-flex gap-4">
              <div>
                <p className="m-0 fs-2 fw-bold">{days}</p>
                <p className="fw-semibold">Days</p>
              </div>
              <div>
                <p className="m-0 fs-3 fw-semibold">:</p>
              </div>
              <div>
                <p className="m-0 fs-2 fw-bold">{hours}</p>
                <p className="fw-semibold">Hours</p>
              </div>
              <div>
                <p className="m-0 fs-3 fw-semibold">:</p>
              </div>
              <div>
                <p className="m-0 fs-2 fw-bold">{minutes}</p>
                <p className="fw-semibold">Minutes</p>
              </div>
              <div>
                <p className="m-0 fs-3 fw-semibold">:</p>
              </div>
              <div>
                <p className="m-0 fs-2 fw-bold"> {seconds}</p>
                <p className="fw-semibold">Seconds</p>
              </div>
            </div>
            <div className="d-flex gap-3 mt-2">
              <button
                className={`${userhome_style.slidebtn} d-flex gap-2`}
                type="submit"
              >
                <Icon icon="solar:cart-3-bold" width="24" height="24" />
                Shop Now
              </button>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-center w-50">
            <div className={`${userhome_style.slideimg2}`}></div>
          </div>
        </div>
        <div>
          <p className="m-5 d-flex justify-content-center fs-1 fw-semibold">
            Cakes
          </p>
          <div>
            <div className={`${userhome_style.rows} mb-5`}>
              {products
                .filter((data) => data.category === "Cakes")
                .slice(-5) // Get the last 10 items
                .map((data, index) => (
                  <div className={`${userhome_style.cols}`} key={index}>
                    <div className={userhome_style.imgparent}>
                      <div className={userhome_style.imgchild1}>new</div>
                      <div
                        className={`${
                          localfav[data.productname + "_" + userdata.email]
                            ?.status &&
                          localfav[data.productname + "_" + userdata.email]
                            ?.email === userdata.email
                            ? userhome_style.imgchild22
                            : userhome_style.imgchild2
                        }`}
                      >
                        <Icon
                          icon="line-md:heart-filled"
                          width="24"
                          height="24"
                          onClick={() => handleAddTofav(data)}
                        />
                      </div>
                      <img
                        src={`${process.env.REACT_APP_API_URL}/images/product/${data.image}`}
                        alt=""
                        className={`${userhome_style.proimg}`}
                      />
                    </div>
                    <div
                      className="d-flex justify-content-center fw-semibold"
                      style={{ fontSize: "17px" }}
                    >
                      {data.productname}
                    </div>
                    <p className="d-flex justify-content-center fw-semibold">
                      {data.price}₹
                    </p>
                    <button
                      className={`${
                        localcart[data.productname + "_" + userdata.email]
                          ?.status &&
                        localcart[data.productname + "_" + userdata.email]
                          ?.email === userdata.email
                          ? userhome_style.probutton1
                          : userhome_style.probutton
                      } d-flex align-items-center justify-content-center gap-2`}
                      type="button"
                      onClick={() => handleAddToCart(data)}
                    >
                      <Icon icon="solar:cart-3-bold" width="20" height="20" />{" "}
                      {localcart[data.productname + "_" + userdata.email]
                        ?.status &&
                      localcart[data.productname + "_" + userdata.email]
                        ?.email === userdata.email
                        ? "Added"
                        : "Add"}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div>
          <div className={`${userhome_style.offercard} mb-5`}>
            <div
              className="d-flex justify-content-center flex-column"
              style={{ marginLeft: "70px" }}
            >
              <p className=" text-light fs-2 fw-semibold">
                Get 30% Discount For Subscriber
              </p>
              <p className="m-0 text-light fw-semibold">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Tempore, accusantium.
              </p>
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <div className={`${userhome_style.subbutton}`}>
                <p className="m-0 ps-5 text-secondary">Enter email id</p>
                <button>Subscribe</button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </>
  );
}
