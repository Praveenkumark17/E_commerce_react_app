import React, { useState } from "react";
import addbrand_style from "./addbrand.module.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { Slide, toast, ToastContainer } from "react-toastify";

export default function Addbrand() {
  const [formData, setFormData] = useState({
    owner: "",
    email: "",
    city: "",
    brand: "",
    phone: "",
    status: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onhandlesubmit = async (e) => {
    e.preventDefault();

    console.log("formdata", formData);

    try {
      await axios
        .post(`${process.env.REACT_APP_API_URL}/api/auth/addbrand`, formData)
        .then((res) => {
          console.log("Response:", res.data);
          setFormData({
            owner: "",
            email: "",
            city: "",
            brand: "",
            phone: "",
            status: "",
            description: "",
          });
          toast.success("Brand added successfully", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
            transition: Slide,
          });
        })
        .catch((err) => {
          toast.error(err.response?.data?.message || err.message, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
            transition: Slide,
          });
        });
    } catch (error) {
      console.error("Error posting data:", error);
      toast.error(error.message, {
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

  return (
    <>
      <div>
        <ToastContainer />
        <div
          className={`${addbrand_style.head} m-1 px-4 d-flex justify-content-between align-items-center`}
        >
          <p className="m-0 fs-3 fw-semibold">Brand</p>
          <div>
            <Link to={"/admin/brand"} className="btn btn-danger">
              Back
            </Link>
          </div>
        </div>
        <div className={`${addbrand_style.content} mx-1 mt-3 p-3`}>
          <form onSubmit={onhandlesubmit}>
            <div className="row">
              <div className="col-6">
                <div className="mb-3">
                  <label htmlFor="owner" className="fw-semibold form-label">
                    Owner Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="owner"
                    placeholder="Enter owner name"
                    name="owner"
                    onChange={handleChange}
                    value={formData.owner}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="fw-semibold form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter email address"
                    name="email"
                    onChange={handleChange}
                    value={formData.email}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="city" className="fw-semibold form-label">
                    City
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="city"
                    placeholder="Enter city"
                    name="city"
                    onChange={handleChange}
                    value={formData.city}
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="mb-3">
                  <label htmlFor="brandName" className="fw-semibold form-label">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="brandName"
                    placeholder="Enter brand name"
                    name="brand"
                    onChange={handleChange}
                    value={formData.brand}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="fw-semibold form-label">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    placeholder="Enter phone number"
                    name="phone"
                    onChange={handleChange}
                    value={formData.phone}
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="brandStatus"
                    className="fw-semibold form-label"
                  >
                    Brand Status
                  </label>
                  <select
                    className="form-select"
                    id="brandStatus"
                    name="status"
                    onChange={handleChange}
                    value={formData.status}
                  >
                    <option value="">Select Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <div className="mb-3">
                  <label
                    htmlFor="brandDescription"
                    className="fw-semibold form-label"
                  >
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="brandDescription"
                    rows="3"
                    placeholder="Enter brand description"
                    name="description"
                    onChange={handleChange}
                    value={formData.description}
                  ></textarea>
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
