import React from "react";
import product_style from "./product.module.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setEditProduct } from "../../redux/slices/editproductslice";

export default function Product() {

  const [products, setProducts] = useState([]);

  const [trigger,setTrigger] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/getproduct`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    getProducts();
    setTrigger(false)
  }, [trigger]);

  const onEdit = (id) =>{
  
    dispatch(setEditProduct(id))

  }

  const onDelete = (id) =>{
    const deleteProduct = async (id) => {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/auth/deleteproduct/${id}`);
        setTrigger(true);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    };

    deleteProduct(id);
    setTrigger(true);
  }

  return (
    <>
      <div>
        <div
          className={`${product_style.head} m-1 px-4 d-flex justify-content-between align-items-center`}
        >
          <p className="m-0 fs-3 fw-semibold">Product</p>
          <div>
            <Link to={"/admin/add_product"} className="btn btn-success">
              Add Product
            </Link>
          </div>
        </div>
        <div className={`${product_style.content} mx-1 mt-3`}>
          <div className={`${product_style.table} px-3`}>
            <table className="table table-striped table-hover">
              <thead className="text-center">
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">Category</th>
                  <th scope="col">Product</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Price</th>
                  <th scope="col">Image</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((data,index) => (
                    <tr key={index} className="text-center align-middle">
                        <th>{index+1}</th>
                        <td>{data.category}</td>
                        <td>{data.productname}</td>
                        <td>{data.quantity}</td>
                        <td>₹{data.price}</td>
                        <td>
                            <img className={product_style.img} src={data.image.startsWith('https')?`${data.image}`:`${process.env.REACT_APP_API_URL}/images/product/${data.image}`} alt={data.productname}/>
                        </td>
                        <td>
                            <Link className="btn btn-primary" onClick={()=>onEdit(data._id)} to={'/admin/edit_product'}>Edit</Link>
                            <button className="btn btn-danger ms-2" onClick={()=>onDelete(data._id)}>Delete</button>
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
