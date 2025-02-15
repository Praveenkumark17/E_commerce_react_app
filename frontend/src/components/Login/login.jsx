import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import login_style from "./login.module.css";
import { Slide, toast, ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUsers } from "../../redux/slices/userslice";

export default function Login() {
  const [formdata, setFormdata] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onhandlechange = (e) => {
    const { name, value } = e.target;
    setFormdata({ ...formdata, [name]: value });
  };

  const onhandlesubmit = async (e) => {
    e.preventDefault();

    console.log(formdata);

    await axios
      .post(`${process.env.REACT_APP_API_URL}/api/auth/login`, formdata)
      .then((response) => {
        console.log("Login successful:", response);
        const res = response.data;
        dispatch(setUsers(res.finduser));
        if (res.finduser.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      })
      .catch((error) => {
        if (!error.response) {
          // Network error
          toast.error("Server error. Please try again later.", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
            transition: Slide,
          });
        } else {
          // Other errors
          console.error("There was an error logging in:", error);
          toast.error(error.response.data.message, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
            transition: Slide,
          });
        }
      });
  };

  return (
    <>
      <ToastContainer />
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className={`${login_style.box} d-flex`}>
          <div
            className={`${login_style.boxes} d-flex justify-content-center flex-column align-items-center`}
          >
            <p className="fs-5 fw-semibold">Sign In</p>
            <form onSubmit={onhandlesubmit} className={`${login_style.form}`}>
              <div className="input-group mb-3 d-none d-md-flex">
                <span className="input-group-text" id="email-addon-md">
                  <Icon icon="fontisto:email" width="24" height="24" />
                </span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  aria-label="Email"
                  name="email"
                  value={formdata.email}
                  onChange={onhandlechange}
                  aria-describedby="email-addon-md"
                />
              </div>
              <div className="input-group mb-3 input-group-sm d-md-none">
                <span className="input-group-text" id="email-addon-sm">
                  <Icon icon="fontisto:email" width="20" height="20" />
                </span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  aria-label="Email"
                  name="email"
                  value={formdata.email}
                  onChange={onhandlechange}
                  aria-describedby="email-addon-sm"
                />
              </div>

              <div className="input-group mb-3 d-none d-md-flex">
                <span className="input-group-text" id="password-addon-md">
                  <Icon icon="octicon:lock-24" width="24" height="24" />
                </span>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  aria-label="Password"
                  name="password"
                  value={formdata.password}
                  onChange={onhandlechange}
                  aria-describedby="password-addon-md"
                />
              </div>
              <div className="input-group mb-3 input-group-sm d-md-none">
                <span className="input-group-text" id="password-addon-sm">
                  <Icon icon="octicon:lock-24" width="20" height="20" />
                </span>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  aria-label="Password"
                  name="password"
                  value={formdata.password}
                  onChange={onhandlechange}
                  aria-describedby="password-addon-sm"
                />
              </div>

              <div className={` d-flex justify-content-between`}>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm d-md-none"
                >
                  Sign In
                </button>
                <button
                  type="submit"
                  className="btn btn-primary  d-none d-md-flex"
                >
                  Sign In
                </button>
                <div
                  className={`${login_style.account} d-flex align-items-center`}
                >
                  <p className="m-0">I didn't have an account?</p>&nbsp;
                  <Link type="submit" to={"/register"}>
                    Sign Up
                  </Link>
                </div>
              </div>
            </form>
          </div>
          <div
            className={`${login_style.boxes} d-lg-flex justify-content-center align-items-center d-none`}
          >
            <div className={login_style.img}></div>
          </div>
        </div>
      </div>
    </>
  );
}
