import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import brand_style from "./brand.module.css";
import { useDispatch } from "react-redux";
import { Slide, toast } from "react-toastify";
import { setEditBrand } from "../../redux/slices/editbrandslice";

export default function Brand() {
  const [brands, setBrands] = useState([]);

  const [trigger, Settrigger] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/auth/getbrand`
        );
        setBrands(response.data);
      } catch (error) {
        console.error("There was an error fetching the brands!", error);
      }
    };
    fetchBrands();
    Settrigger(false);
  }, [trigger]);

  const onEdit = (id) => {
    dispatch(setEditBrand(id));
  };

  const onDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      await axios
        .delete(`${process.env.REACT_APP_API_URL}/api/auth/deletebrand/${id}`)
        .then((response) => {
          Settrigger(true);
          toast.error("Brand deleted", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
            transition: Slide,
          });
        })
        .catch((error) => {
          console.error("There was an error deleting the brand!", error);
          toast.error(error.response.data.message, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
            transition: Slide,
          });
        });
    }
  };

  console.log("brand", brands);

  return (
    <>
      <div>
        <div
          className={`${brand_style.head} m-1 px-4 d-flex justify-content-between align-items-center`}
        >
          <p className="m-0 fs-3 fw-semibold">Brand</p>
          <div>
            <Link to={"/admin/add_brand"} className="btn btn-success">
              Add Brand
            </Link>
          </div>
        </div>
        <div className={`${brand_style.content} mx-1 mt-3`}>
          <div className={`${brand_style.table} px-3 py-2`}>
            <table className="table table-striped table-hover">
              <thead className="text-center">
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">Owner name</th>
                  <th scope="col">Brand name</th>
                  <th scope="col">Phone</th>
                  <th scope="col">City</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {brands &&
                  brands.map((data, index) => {
                    return (
                      <tr key={index} className="align-middle text-center">
                        <th scope="row">{index + 1}</th>
                        <td>{data.owner}</td>
                        <td>{data.brand}</td>
                        <td>{data.phone}</td>
                        <td>{data.city}</td>
                        <td>
                          {data.status === "active" ? (
                            <div className={`${brand_style.active}`}>
                              {data.status}
                            </div>
                          ) : (
                            <div className={`${brand_style.inactive}`}>
                              {data.status}
                            </div>
                          )}
                        </td>
                        <td>
                          <Link
                            className="btn btn-primary mx-1"
                            to={"/admin/edit_brand"}
                            onClick={() => onEdit(data._id)}
                          >
                            Edit
                          </Link>
                          <Link
                            className="btn btn-danger mx-1"
                            onClick={() => onDelete(data._id)}
                          >
                            Delete
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
