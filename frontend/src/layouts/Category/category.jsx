import React, { useState } from "react";
import category_style from "./category.module.css";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import {setEditCategory} from "../../redux/slices/editcategoryslice.js"

export default function Category() {
  const [category, setCategory] = useState([]);

  const dispatch = useDispatch();

  const [trigger,setTrigger] = useState(true);

  useEffect(() => {
    const getCategory = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/getcategory`);
        setCategory(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    getCategory();
    setTrigger(false);
  }, [trigger]);

  const onEdit = (id) =>{
    dispatch(setEditCategory(id))
  }

  const onDelete = (id) =>{
    const deleteCategory = async (id) => {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/auth/deletecategory/${id}`);
        setTrigger(true);
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    };

    deleteCategory(id);
    setTrigger(false);
  }

  return (
    <>
      <div>
        <div
          className={`${category_style.head} m-1 px-4 d-flex justify-content-between align-items-center`}
        >
          <p className="m-0 fs-3 fw-semibold">Category</p>
          <div>
            <Link to={"/admin/add_category"} className="btn btn-success">
              Add Category
            </Link>
          </div>
        </div>
        <div className={`${category_style.content} mx-1 mt-3`}>
          <div className={`${category_style.table} px-3`}>
            <table className="table table-striped table-hover">
              <thead className="text-center">
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">Brand</th>
                  <th scope="col">Category name</th>
                  <th scope="col">Description</th>
                  <th scope="col">Image</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {category.map((data,index) => (
                  <tr key={index} className="text-center align-middle">
                    <th>{index+1}</th>
                    <td>{data.brand}</td>
                    <td>{data.categoryname}</td>
                    <td>{data.description}</td>
                    <td>
                      <img
                        src={`${process.env.REACT_APP_API_URL}/images/category/${data.image}`}
                        alt={`${data.categoryname}`}
                        className={`${category_style.img}`}
                      />
                    </td>
                    <td>
                      <Link className="btn btn-primary mx-1" onClick={()=>onEdit(data._id)} to={'/admin/edit_category'}>Edit</Link>
                      <button className="btn btn-danger mx-1" onClick={()=>onDelete(data._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
