import React, { useState } from "react";
import { Slide, toast, ToastContainer } from "react-toastify";
import editproduct_style from "./editproduct.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearProductEdit } from "../../redux/slices/editproductslice";

export default function Editproduct() {
  const [formData, setFormData] = useState({});

  const [productid, setProductid] = useState(null);

  const id = useSelector((state) => state.editproductinfo?.editproduct);

  useEffect(() => {
      const storedProduct = localStorage.getItem('editproduct')|| '';
      if (!storedProduct && id) {
        localStorage.setItem('editproduct', id.toString());
        setProductid(id.toString());
      } else {
        setProductid(storedProduct);
      }
    }, [id]);
  
    const onBack = () =>{
      localStorage.removeItem('editproduct');
    }

  console.log("product id", productid);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    const getProductById = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/auth/getproductid/${productid}`
        );
        setFormData(response.data);
      } catch (error) {
        console.error("There was an error fetching the product data!", error);
      }
    };

    if(productid){
      getProductById();
    }
  }, [productid]);

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
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
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
        .put(
          `${process.env.REACT_APP_API_URL}/api/auth/updateproduct/${productid}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          localStorage.removeItem('editproduct');
          toast.info("product updated", {
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
        navigate("/admin/product");
      }, 1000);
    } catch (error) {
      console.error("There was an error updating the product!", error);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      dispatch(clearProductEdit()); // Dispatch the clearEdit action to reset the editUserId
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
          className={`${editproduct_style.head} m-1 px-4 d-flex justify-content-between align-items-center`}
        >
          <p className="m-0 fs-3 fw-semibold">Product</p>
          <div>
            <Link to={"/admin/product"} onClick={()=>onBack()} className="btn btn-danger">
              Back
            </Link>
          </div>
        </div>
        <div className={`${editproduct_style.content} mx-1 mt-3 p-3`}>
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
                    disabled
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
                      src={
                        formData.image instanceof File
                          ? URL.createObjectURL(formData.image)
                          : formData.image.startsWith('https')?`${formData.image}`:`${process.env.REACT_APP_API_URL}/images/product/${formData.image}`
                      }
                      alt="Product"
                      className={`${editproduct_style.img} mt-3`}
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
              Update
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
