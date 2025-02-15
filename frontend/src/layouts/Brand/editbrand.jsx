import React, { useEffect, useState } from "react";
import { Slide, toast, ToastContainer } from "react-toastify";
import edit_style from "./editbrand.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { clearBrandEdit } from "../../redux/slices/editbrandslice";

export default function Editbrand() {
  const [formData, setFormData] = useState({});

  const [brandId, setBrandid] = useState(null);

  const id = useSelector((state) => state.editbrandinfo.editbrand);

  useEffect(() => {
    const storedBrand = localStorage.getItem('editbrand')|| '';
    if (!storedBrand && id) {
      localStorage.setItem('editbrand', id.toString());
      setBrandid(id.toString());
    } else {
      setBrandid(storedBrand);
    }
  }, [id]);

  const onBack = () =>{
    localStorage.removeItem('editbrand');
  }

  const dispatch = useDispatch();

  const navigate = useNavigate();

  console.log("id", formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onhandlesubmit = async (e) => {
    e.preventDefault();

    try {
      await axios
        .put(`${process.env.REACT_APP_API_URL}/api/auth/updatebrand/${brandId}`, formData)
        .then((res) => {
          console.log("Brand updated successfully", res.data);
          toast.info("Brand Updated", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
            transition: Slide,
          });
          localStorage.removeItem('editbrand');
          setTimeout(() => {
            navigate("/admin/brand");
          }, 1000);
        })
        .catch((err) =>
          toast.error(err.response.data.message, { position: "top-center" })
        );
    } catch (error) {
      console.error("Error updating brand", error);
      toast.error(error.response.data, {
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

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/auth/getbrandid/${brandId}`
        );
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching brand data", error);
      }
    };

    if (brandId) {
      fetchBrand();
    }
  }, [brandId]);

  useEffect(() => {
    const handlePopState = () => {
      dispatch(clearBrandEdit()); // Dispatch the clearEdit action to reset the editUserId
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [dispatch]);

  return (
    <>
      <div>
        <ToastContainer />
        <div
          className={`${edit_style.head} m-1 px-4 d-flex justify-content-between align-items-center`}
        >
          <p className="m-0 fs-3 fw-semibold">Brand</p>
          <div>
            <Link to={"/admin/brand"} onClick={()=>onBack()} className="btn btn-danger">
              Back
            </Link>
          </div>
        </div>
        <div className={`${edit_style.content} mx-1 mt-3 p-3`}>
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
                    disabled
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
                  <label htmlFor="brandStatus" className="fw-semibold form-label">
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
                  <label htmlFor="brandDescription" className="fw-semibold form-label">
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
              Update
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
