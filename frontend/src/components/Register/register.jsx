import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import register_style from "./register.module.css";
import { Slide, toast, ToastContainer } from "react-toastify";

export default function Register() {
  const [formdata, setFormdata] = useState({
    username: "",
    email: "",
    age: "",
    gender: "",
    mobile: "",
    password: "",
    image: "",
  });

  const onhandlechange = (e) => {
    const { name, value } = e.target;
    setFormdata({ ...formdata, [name]: value });
  };

  const onhandlefile = (e) => {
    setFormdata({ ...formdata, image: e.target.files[0] });
  };

  const onsubmit = async (e) => {
    e.preventDefault();

    console.log(formdata);

    const formData = new FormData();
    Object.keys(formdata).forEach((key) => {
      formData.append(key, formdata[key]);
    });

    await axios
      .post(`${process.env.REACT_APP_API_URL}/api/auth/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res.data);
        setFormdata({
          username: "",
          email: "",
          age: "",
          gender: "",
          mobile: "",
          password: "",
          image: "",
        });
        document.getElementById("image-sm").value = null;
        document.getElementById("image-lg").value = null;
        toast.success(res.data.message,{
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
          transition: Slide,
          })
      })
      .catch((err) => {
        console.log(err.response || err.message);
        toast.error(err.response && err.response.data && err.response.data.message ? err.response.data.message : "An error occurred", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
          transition: Slide,
          });
      });
  };

  return (
    <>
      <ToastContainer />
      <div
        className={`${register_style.main} container d-flex justify-content-center align-items-center`}
      >
        <div className={`${register_style.box} d-flex`}>
          <div
            className={`${register_style.boxes} d-none d-lg-flex justify-content-center align-items-center`}
          >
            <div className={`${register_style.img}`}></div>
          </div>
          <div
           className={`${register_style.boxes} d-flex justify-content-center align-items-center flex-column`}
          >
            <p className="fs-5 fw-semibold">Sign Up</p>
            <form onSubmit={onsubmit} className={`${register_style.form}`}>
              {/* small device */}
              <div className={`input-group input-group-sm d-md-none mb-3`}>
                <span className="input-group-text" id="username-addon-sm">
                  <Icon icon="lucide:user-round" width="20" height="20" />
                </span>
                <input
                  type="text"
                  className={` form-control`}
                  id="username-sm"
                  placeholder="Enter username"
                  aria-describedby="username-addon-sm"
                  name="username"
                  value={formdata.username}
                  onChange={onhandlechange}
                />
              </div>
              {/* large */}
              <div className={`input-group mb-3 d-none d-md-flex`}>
                <span className="input-group-text" id="username-addon-lg">
                  <Icon icon="lucide:user-round" width="24" height="24" />
                </span>
                <input
                  type="text"
                  className={` form-control`}
                  id="username-lg"
                  placeholder="Enter username"
                  aria-describedby="username-addon-lg"
                  name="username"
                  value={formdata.username}
                  onChange={onhandlechange}
                />
              </div>

              <div className={`input-group input-group-sm d-md-none mb-3`}>
                <span className="input-group-text" id="email-addon-sm">
                  <Icon icon="fontisto:email" width="20" height="20" />
                </span>
                <input
                  type="email"
                  className={` form-control`}
                  id="email-sm"
                  name="email"
                  placeholder="Enter email"
                  aria-describedby="email-addon-sm"
                  onChange={onhandlechange}
                  value={formdata.email}
                />
              </div>
              <div className={`input-group mb-3 d-none d-md-flex`}>
                <span className="input-group-text" id="email-addon-lg">
                  <Icon icon="fontisto:email" width="24" height="24" />
                </span>
                <input
                  type="email"
                  className={` form-control`}
                  id="email-lg"
                  name="email"
                  placeholder="Enter email"
                  aria-describedby="email-addon-lg"
                  onChange={onhandlechange}
                  value={formdata.email}
                />
              </div>

              <div className={`input-group input-group-sm d-md-none mb-3`}>
                <span className="input-group-text" id="age-addon-sm">
                  <Icon icon="solar:user-id-linear" width="20" height="20" />
                </span>
                <input
                  type="number"
                  className={` form-control`}
                  id="age-sm"
                  name="age"
                  placeholder="Enter age"
                  aria-describedby="age-addon-sm"
                  onChange={onhandlechange}
                  value={formdata.age}
                />
              </div>
              <div className={`input-group mb-3 d-none d-md-flex`}>
                <span className="input-group-text" id="age-addon-lg">
                  <Icon icon="solar:user-id-linear" width="24" height="24" />
                </span>
                <input
                  type="number"
                  className={` form-control`}
                  id="age-lg"
                  name="age"
                  placeholder="Enter age"
                  aria-describedby="age-addon-lg"
                  onChange={onhandlechange}
                  value={formdata.age}
                />
              </div>

              <div className={`input-group input-group-sm d-md-none mb-3`}>
                <label className="input-group-text" htmlFor="gender-sm">
                  <Icon icon="icons8:gender" width="20" height="20" />
                </label>
                <select
                  className="form-select"
                  id="gender-sm"
                  name="gender"
                  onChange={onhandlechange}
                  value={formdata.gender}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className={`input-group mb-3 d-none d-md-flex`}>
                <label className="input-group-text" htmlFor="gender-lg">
                  <Icon icon="icons8:gender" width="24" height="24" />
                </label>
                <select
                  className="form-select"
                  id="gender-lg"
                  name="gender"
                  onChange={onhandlechange}
                  value={formdata.gender}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className={`input-group input-group-sm d-md-none mb-3`}>
                <span className="input-group-text" id="mobile-addon-sm">
                  <Icon icon="radix-icons:mobile" width="20" height="20" />
                </span>
                <input
                  type="tel"
                  className={` form-control`}
                  id="mobile-sm"
                  name="mobile"
                  placeholder="Enter mobile number"
                  aria-describedby="mobile-addon-sm"
                  onChange={onhandlechange}
                  value={formdata.mobile}
                />
              </div>
              <div className={`input-group mb-3 d-none d-md-flex`}>
                <span className="input-group-text" id="mobile-addon-lg">
                  <Icon icon="radix-icons:mobile" width="24" height="24" />
                </span>
                <input
                  type="tel"
                  className={` form-control`}
                  id="mobile-lg"
                  name="mobile"
                  placeholder="Enter mobile number"
                  aria-describedby="mobile-addon-lg"
                  onChange={onhandlechange}
                  value={formdata.mobile}
                />
              </div>

              <div className={`input-group input-group-sm d-md-none mb-3`}>
                <span className="input-group-text" id="password-addon-sm">
                  <Icon icon="octicon:lock-24" width="20" height="20" />
                </span>
                <input
                  type="password"
                  className={` form-control`}
                  id="password-sm"
                  name="password"
                  placeholder="Enter password"
                  aria-describedby="password-addon-sm"
                  onChange={onhandlechange}
                  value={formdata.password}
                />
              </div>
              <div className={`input-group mb-3 d-none d-md-flex`}>
                <span className="input-group-text" id="password-addon-lg">
                  <Icon icon="octicon:lock-24" width="24" height="24" />
                </span>
                <input
                  type="password"
                  className={` form-control`}
                  id="password-lg"
                  name="password"
                  placeholder="Enter password"
                  aria-describedby="password-addon-lg"
                  onChange={onhandlechange}
                  value={formdata.password}
                />
              </div>

              <div className={`input-group input-group-sm d-md-none mb-3`}>
                <label className="input-group-text" htmlFor="image-sm">
                  <Icon icon="mynaui:image" width="20" height="20" />
                </label>
                <input
                  type="file"
                  className={`form-control`}
                  id="image-sm"
                  name="image"
                  onChange={onhandlefile}
                />
              </div>
              <div className={`input-group mb-3 d-none d-md-flex`}>
                <label className="input-group-text" htmlFor="image-lg">
                  <Icon icon="mynaui:image" width="24" height="24" />
                </label>
                <input
                  type="file"
                  className={`form-control`}
                  id="image-lg"
                  name="image"
                  onChange={onhandlefile}
                />
              </div>

              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-primary btn-sm d-md-none">
                  Sign up
                </button>
                <button type="submit" className="btn btn-primary btn d-none d-md-inline-block">
                  Sign up
                </button>
                <div className={`${register_style.account} d-flex align-items-center`}>
                  <p className="m-0">Already have an account?</p>&nbsp;
                  <Link type="submit" to={"/"}>
                    Sign In
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
