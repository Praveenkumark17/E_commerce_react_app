import React, { useState } from "react";
import addcategory_style from "./addcategory.module.css";
import { Slide, toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

export default function Addcategory() {
  const [formData, setFormdata] = useState({
    brand: "",
    image: null,
    categoryname: "",
    description: "",
  });

  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const getBrand = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/auth/getbrand`
        );
        console.log(response.data);
        setBrands(response.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    getBrand();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormdata((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    } else {
      setFormdata((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const onhandlesubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      await axios
        .post(`${process.env.REACT_APP_API_URL}/api/auth/addcategory`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log("Category added successfully:", res.data);
          setFormdata({
            brand: "",
            categoryname: "",
            description: "",
          });
          document.getElementById("categoryImage").value = null;
          toast.success("category added successfully", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
            transition: Slide,
          });
        })
        .catch(err=>{
            console.log(err.data);
            toast.error(err.response.data.message, {
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
      console.error("Error adding category:", error);
    }
  };

  return (
    <>
      <div>
        <ToastContainer />
        <div
          className={`${addcategory_style.head} m-1 px-4 d-flex justify-content-between align-items-center`}
        >
          <p className="m-0 fs-3 fw-semibold">Category</p>
          <div>
            <Link to={"/admin/category"} className="btn btn-danger">
              Back
            </Link>
          </div>
        </div>
        <div className={`${addcategory_style.content} mx-1 mt-3 p-3`}>
          <form onSubmit={onhandlesubmit}>
            <div className="row">
              <div className="col-6">
                <div className="mb-3">
                  <label htmlFor="brandName" className="fw-semibold form-label">
                    Brand Name
                  </label>
                  <select
                    className="form-control"
                    id="brandName"
                    name="brand"
                    onChange={handleChange}
                    value={formData.brand}
                  >
                    <option value="">Select a brand</option>
                    {brands.map((data, index) => (
                      <option key={index} value={data.brand}>
                        {data.brand}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="categoryImage"
                    className="fw-semibold form-label"
                  >
                    Category Image
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="categoryImage"
                    name="image"
                    onChange={handleChange}
                  />
                  {formData.image && (
                    <img
                      src={URL.createObjectURL(formData.image)}
                      alt="Selected"
                      className="mt-3"
                      style={{
                        width: "100px",
                        maxHeight: "100px",
                        objectFit: "cover",
                        borderRadius:'10px'
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="col-6">
                <div className="mb-3">
                  <label
                    htmlFor="categoryName"
                    className="fw-semibold form-label"
                  >
                    Category Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="categoryName"
                    placeholder="Enter category name"
                    name="categoryname"
                    onChange={handleChange}
                    value={formData.categoryname}
                  />
                </div>
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
