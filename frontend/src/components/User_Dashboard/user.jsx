import React, { useEffect, useState } from "react";
import user_style from "./user.module.css";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/userslice";
import { setFavcount } from "../../redux/slices/countslice";
import axios from "axios";

export default function User() {
  const [userdata, setUserdata] = useState({
    image: "",
    username: "",
    role: "",
  });

  const [hasLoggedOut, setHasLoggedOut] = useState(false);

  const user = useSelector((state) => state.userinfo.users?.[0]);
  const price = useSelector((state) => state.priceinfo.price);

  const [cartcount, setCartcount] = useState(0);
  const [favcount, setfavcount] = useState(0);
  const cartcounts = useSelector((state) => state.countinfo.cartcount);
  const getfavcount = useSelector((state) => state.countinfo.favcount);

  const [localfav, setLocalfav] = useState([]);

  const [favdata, setFavdata] = useState([]); //come from local

  const [getfavdata, setgetFavdata] = useState([]); //come from database

  useEffect(() => {
    const favdata = localStorage.getItem("localfav");
    if (favdata) {
      setLocalfav(JSON.parse(favdata));
    }
  }, []);

  const dispatcher = useDispatch();
  const favdataFromStorage = localStorage.getItem("localfav");
  useEffect(() => {
    if (favdataFromStorage) {
      const parsedFavdata = JSON.parse(favdataFromStorage);
      setFavdata(Object.values(parsedFavdata));
      console.log("favdata", parsedFavdata);
      let countWithStatusTrue = 0;
      for (const key in parsedFavdata) {
        if (
          parsedFavdata[key].status === true &&
          parsedFavdata[key].email === userdata.email
        ) {
          countWithStatusTrue++;
        }
      }

      // Update the Redux store with the count
      dispatcher(setFavcount(countWithStatusTrue));
    }
  }, [dispatcher, userdata, favdataFromStorage]);

  useEffect(() => {
    if (cartcounts !== null) {
      setCartcount(cartcounts);
    }
  }, [cartcounts]);

  useEffect(() => {
    if (getfavcount !== null) {
      setfavcount(getfavcount);
    }
  }, [getfavcount]);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    const savedData = localStorage.getItem("credentials") || "";

    if (user && !hasLoggedOut) {
      localStorage.setItem("credentials", JSON.stringify(user));
      setUserdata(user);
    } else if (!user && hasLoggedOut) {
      navigate("/"); // Example: navigating to the login page
    } else if (savedData) {
      const parsedData = JSON.parse(savedData);
      setUserdata(parsedData);

      if (parsedData.role === "admin") {
        navigate("/401");
      }
    } else {
      navigate("/401");
    }
  }, [user, hasLoggedOut, navigate, setUserdata]);

  const onlogout = (e) => {
    dispatch(logout());
    setHasLoggedOut(true);
    localStorage.removeItem("credentials");
  };

  useEffect(() => {
    const getfav = async () => {
      await axios
        .get(`${process.env.REACT_APP_API_URL}/api/auth/getfav`)
        .then((res) => {
          console.log("get fav data", res.data);
          setgetFavdata(res.data);
        })
        .catch((err) => {
          console.log(err.response.data.message);
        });
    };
    getfav();
  }, [favdata, localfav]);

  // const handledeleteTofav = async (product) => {
  //   console.log("product", product);

  //   try {
  //     const productWithEmail = { ...product, email: userdata.email };
  //     await axios
  //       .delete(
  //         `${process.env.REACT_APP_API_URL}/api/auth/deletefav/${product._id}`,
  //         productWithEmail
  //       )
  //       .then((res) => {
  //         console.log(res.data);
  //       })
  //       .catch((err) => {
  //         console.log(err.response.data.message);
  //       });
  //     const existingProductKey = Object.keys(localfav).find(
  //       (key) =>
  //         localfav[key].id === product.productname &&
  //         localfav[key].email === userdata.email
  //     );

  //     console.log("exist data", existingProductKey);
  //       const updatedAddedProducts = {
  //         ...localfav,
  //         [product.productname + "_" + userdata.email]:{
  //               id: product.productname,
  //               status: false,
  //               email: userdata?.email || "", // Ensure email is set if userdata.email is undefined
  //             },
  //       };

  //     let countWithStatusTrue = 0;
  //     for (const key in updatedAddedProducts) {
  //       if (
  //         updatedAddedProducts[key].status === true &&
  //         updatedAddedProducts[key].email === userdata.email
  //       ) {
  //         countWithStatusTrue++;
  //       }
  //     }

  //     dispatcher(setFavcount(countWithStatusTrue));
  //     dispatcher(setFavtrigger(true));

  //     // Update the state with the new product information
  //     // setLocalfav(updatedAddedProducts);
  //     // console.log("Updated localfav", updatedAddedProducts);
  //     setLocalfav(updatedAddedProducts);
  //     localStorage.setItem("localfav", JSON.stringify(updatedAddedProducts));
  //   } catch (error) {
  //     console.error("Error adding product to cart:", error.message);
  //   }
  // };

  return (
    <>
      {userdata ? (
        <div className={`${user_style.body}`}>
          <div className={`${user_style.nav}`}>
            <div className="d-flex">
              <Link
                className={`${user_style.link} fs-4 fw-semibold d-flex align-items-center`}
                to={"/user"}
              >
                <Icon
                  icon="material-symbols:door-open-rounded"
                  width="40"
                  height="40"
                />
                <p className="m-0">OpendoorMart</p>
              </Link>
              <div className="dropdown">
                <div
                  className={`${user_style.profile} d-flex align-items-center ms-3`}
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={`${process.env.REACT_APP_API_URL}/images/profile/${userdata.image}`}
                    alt="hi"
                    className={`${user_style.img} rounded-circle`}
                  />
                  <div className="ms-3">
                    <p className="m-0 fs-6 fw-semibold">{userdata.username}</p>
                    <p className="m-0 fw-bold">{userdata.role.toUpperCase()}</p>
                  </div>
                </div>
                <ul
                  className={`dropdown-menu mt-2 fw-semibold py-0 ${user_style.listmenu}`}
                  style={{ backgroundColor: "#EEEEEE" }}
                >
                  <Link
                    className={`${user_style.menulist} m-0 ps-4 dropdown-item d-flex gap-2 fw-semibold align-items-center`}
                  >
                    <Icon icon="prime:user-edit" width="25" height="25" />
                    Edit Profile
                  </Link>
                  <Link
                    className={`${user_style.menulist} m-0 ps-4 dropdown-item d-flex gap-2 fw-semibold align-items-center`}
                  >
                    <Icon
                      icon="fa-regular:address-card"
                      width="23"
                      height="23"
                    />
                    Add Address
                  </Link>
                  <Link
                    className={`${user_style.menulist} m-0 ps-4 dropdown-item d-flex gap-2 fw-semibold align-items-center`}
                  >
                    <Icon icon="octicon:key-16" width="23" height="23" />
                    Change Password
                  </Link>
                  <Link
                    className={`${user_style.logout} m-0 ps-4 dropdown-item d-flex gap-2 fw-semibold align-items-center`}
                    onClick={() => onlogout()}
                    to={"/"}
                  >
                    <Icon
                      icon="material-symbols:logout-rounded"
                      width="20"
                      height="20"
                    />
                    Log out
                  </Link>
                </ul>
              </div>
            </div>
            <div
              className="d-flex align-items-center"
              style={{ width: "40vw" }}
            >
              <input
                className={`${user_style.input} fw-semibold`}
                type="text"
                placeholder="Search Something..."
              />
              <div
                className={`${user_style.inlogo} d-flex align-items-center justify-content-center`}
              >
                <Icon icon="iconamoon:search-bold" width="24" height="24" />
              </div>
            </div>
            <div
              className={`${user_style.cart} d-flex align-items-center gap-4`}
            >
              <div
                className={`${user_style.barcart} rounded-circle p-1 position-relative`}
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasRight"
                aria-controls="offcanvasRight"
              >
                <Icon icon="tabler:heart-filled" width="30" height="30" />
                <span
                  className={`position-absolute top-0 start-100 translate-middle badge rounded-pill ${user_style.pop}`}
                >
                  {favcount > 9 ? "9+" : favcount}
                </span>
              </div>
              <Link
                to={"/user/cart"}
                className={`${user_style.barcart} rounded-circle p-1 position-relative`}
              >
                <Icon icon="solar:cart-3-bold" width="30" height="30" />
                <span
                  className={`position-absolute top-0 start-100 translate-middle badge rounded-pill ${user_style.pop}`}
                >
                  {cartcount > 9 ? "9+" : cartcount}
                </span>
              </Link>
              <div>
                <div>
                  <p className="m-0 fw-semibold">Total Price</p>
                </div>
                <div>
                  <p className="m-0 fw-semibold">₹ {price}</p>
                </div>
              </div>
            </div>
          </div>
          <div className={`${user_style.content}`}>
            <div
              className={`${user_style.header} d-flex align-items-center justify-content-between mx-5`}
            >
              <div className="d-flex gap-4 fw-semibold">
                <Link to={"/user"} className={`${user_style.underline_button}`}>
                  Home
                </Link>
                <Link
                  to={"/user/products"}
                  className={`${user_style.underline_button}`}
                >
                  Product
                </Link>
                <Link
                  to={"/user/about"}
                  className={`${user_style.underline_button}`}
                >
                  About
                </Link>
                <Link
                  to={"/user/contact"}
                  className={`${user_style.underline_button}`}
                >
                  Contact
                </Link>
              </div>
              <div className="d-flex gap-4 fw-semibold">
                <div className="d-flex gap-1 align-items-center">
                  <Icon
                    icon="mynaui:mobile"
                    width="40"
                    height="40"
                    style={{ color: "#3B1E54" }}
                  />
                  (+91) {userdata.mobile}
                </div>
                <div className="d-flex gap-1 align-items-center">
                  <Icon
                    icon="material-symbols:alternate-email"
                    width="40"
                    height="40"
                    style={{ color: "#3B1E54" }}
                  />
                  {userdata.email}
                </div>
              </div>
            </div>
            <div className={`${user_style.main}`}>
              <div className={`${user_style.main_content}`}>
                <Outlet />
              </div>
            </div>
            <div
              className="offcanvas offcanvas-end"
              tabIndex="-1"
              id="offcanvasRight"
              aria-labelledby="offcanvasRightLabel"
            >
              <div className="offcanvas-header">
                <h4
                  className="offcanvas-title mx-auto"
                  id="offcanvasRightLabel"
                >
                  Favorite Items ({favcount})
                </h4>
                <button
                  type="button"
                  className="btn-close rounded-circle"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                  style={{ position: "absolute", right: "15px" }}
                ></button>
              </div>
              <div className={`${user_style.favbody} offcanvas-body`}>
                {getfavdata.length > 0 ? (
                  getfavdata
                    .filter((data) => data.email === userdata.email)
                    .map((data, index) => (
                      <div key={index} className={user_style.favmain}>
                        <img
                          src={data.image?.startsWith('https')?`${data.image}`:`${process.env.REACT_APP_API_URL}/images/profile/${data.image}`}
                          alt={data.productname}
                          className={user_style.favimg}
                        />
                        <div className={user_style.favtext}>
                          <p className="m-0">{data.productname}</p>
                          <p className="m-0">{data.category}</p>
                          <p>Price: ₹{data.price}</p>
                          <div className="d-flex gap-2">
                            <button className={user_style.add}>
                              Add{" "}
                              <Icon
                                icon="solar:cart-3-bold"
                                width="20"
                                height="20"
                              />
                            </button>
                            <button
                              className={user_style.remove}
                              // onClick={() => handledeleteTofav(data)}
                            >
                              Remove
                              <Icon
                                icon="iconamoon:trash-duotone"
                                width="20"
                                height="20"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="fs-4 text-center w-100">No Favorites Found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        navigate("/404")
      )}
    </>
  );
}
