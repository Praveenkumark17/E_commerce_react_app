import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Slide, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import addproduct_style from "./addproduct.module.css";
import axios from "axios";

export default function Addproduct() {
  const [formData, setFormData] = useState({
            productname: "",
            quantity: "",
            category: "",
            price: "",
            description: "",
          });

  const [categorys, setCategorys] = useState([]);

  useEffect(() => {
    const getCategorys = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/auth/getcategory`
        );
        setCategorys(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    getCategorys();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    } else {
      setFormData((prevData) => ({
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
        .post(`${process.env.REACT_APP_API_URL}/api/auth/addproduct`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res.data);
          setFormData({
            productname: "",
            quantity: "",
            category: "",
            price: "",
            description: "",
          });
          document.getElementById("image").value = null;
          toast.success("product added success", {
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
      console.error("Error adding product:", error);
      toast.success(error.message, {
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
          className={`${addproduct_style.head} m-1 px-4 d-flex justify-content-between align-items-center`}
        >
          <p className="m-0 fs-3 fw-semibold">Product</p>
          <div>
            <Link to={"/admin/product"} className="btn btn-danger">
              Back
            </Link>
          </div>
        </div>
        <div className={`${addproduct_style.content} mx-1 mt-3 p-3`}>
        <form onSubmit={onhandlesubmit}>
            <div className="row">
              <div className="col-6">
                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    Category
                  </label>
                  <select
                    className="form-control"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">Select a category</option>
                    {categorys.map((data, index) => (
                      <option key={index} value={data.categoryname}>
                        {data.categoryname}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="quantity" className="form-label">
                    Quantity
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    placeholder="Enter Quantity"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="mb-3">
                  <label htmlFor="productname" className="form-label">
                    Product Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="productname"
                    name="productname"
                    value={formData.productname}
                    placeholder="Enter Product Name"
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="price" className="form-label">
                    Price
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="price"
                    name="price"
                    value={formData.price || ""}
                    placeholder="Enter Price"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="mb-3">
                  <label htmlFor="image" className="form-label">
                    Image
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="image"
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
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description || ""}
                    placeholder="Enter Description"
                    onChange={handleChange}
                  />
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
