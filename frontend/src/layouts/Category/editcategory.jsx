import React, { useEffect, useState } from "react";
import { Slide, toast, ToastContainer } from "react-toastify";
import editcategory_style from "./editcategory.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

export default function Editcategory() {
  const [formData, setFormdata] = useState({});

  const [categoryid, setCategoryId] = useState(null);

  const navigate = useNavigate();

  const id = useSelector((state) => state.editcategoryinfo?.editcategory);

  useEffect(() => {
    const storedCategory = localStorage.getItem("editcategory")|| '';
    if (!storedCategory && id) {
      localStorage.setItem("editcategory", id.toString());
      setCategoryId(id.toString());
    } else {
      setCategoryId(storedCategory);
    }
  }, [id]);

  const onBack = () => {
    localStorage.removeItem("editcategory");
  };

  console.log("category id", categoryid);

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

  useEffect(() => {
    const getCategoryById = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/auth/getcategoryid/${categoryid}`
        );
        setFormdata(response.data);
      } catch (error) {
        console.error("Error fetching category by ID:", error);
      }
    };

    if (categoryid) {
      getCategoryById();
    }
  }, [categoryid]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormdata({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormdata({
        ...formData,
        [name]: value,
      });
    }
  };

  const onhandlesubmit = async (e) => {
    e.preventDefault();

    console.log("update", formData);

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      await axios
        .put(
          `${process.env.REACT_APP_API_URL}/api/auth/updatecategory/${categoryid}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          toast.info("product updated", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
            transition: Slide,
          });
          localStorage.removeItem("editcategory");
        })
        .catch((err) => {
          console.log(err.data);
          toast.error("product update failed", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
            transition: Slide,
          });
        });
      setTimeout(() => {
        navigate("/admin/category");
      }, 1000);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <>
      <div>
        <ToastContainer />
        <div
          className={`${editcategory_style.head} m-1 px-4 d-flex justify-content-between align-items-center`}
        >
          <p className="m-0 fs-3 fw-semibold">Category</p>
          <div>
            <Link
              to={"/admin/category"}
              onClick={() => onBack()}
              className="btn btn-danger"
            >
              Back
            </Link>
          </div>
        </div>
        <div className={`${editcategory_style.content} mx-1 mt-3 p-3`}>
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
                      src={
                        formData.image instanceof File
                          ? URL.createObjectURL(formData.image)
                          : formData.image.startsWith('https')?`${formData.image}`:`${process.env.REACT_APP_API_URL}/images/category/${formData.image}`
                      }
                      alt="Product"
                      className={`${editcategory_style.img} mt-3`}
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
                    disabled
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
              Update
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
