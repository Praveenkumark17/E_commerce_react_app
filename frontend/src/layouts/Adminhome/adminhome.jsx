import React, { useEffect, useState } from "react";
import adminhome_style from "./adminhome.module.css";
import axios from "axios";

export default function Adminhome() {
  const [data, setData] = useState({});

  const [brand,setbrand] = useState();
  const [product,setproduct] = useState();
  const [category,setCategory] = useState();

  useEffect(() => {
    const user = localStorage.getItem("credentials");
    setData(JSON.parse(user));
  }, []);

  useEffect(() =>{
    const getbrands = async () =>{
        await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/getbrand`)
        .then(res=>{
            setbrand(res.data.length)
        })
        .catch(err=>{
            console.log(err.data)
        })
    }
    getbrands()
    const getproduct = async () =>{
        await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/getproduct`)
        .then(res=>{
            setproduct(res.data.length)
        })
        .catch(err=>{
            console.log(err.data)
        })
    }
    getproduct()
    const getcategory = async () =>{
        await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/getcategory`)
        .then(res=>{
            setCategory(res.data.length)
        })
        .catch(err=>{
            console.log(err.data)
        })
    }
    getcategory()
  },[])

  return (
    <>
      {data && (
        <div className={`${adminhome_style.body}`}>
          <div className={`${adminhome_style.box1}`}>
            <div className={`${adminhome_style.title}`}>
              <p className="fs-3 text-center pt-3 fw-semibold m-0">
                Welcome Back !
              </p>
              <p className="fs-1 text-center pt-2 fw-semibold">
                {data.username}
              </p>
            </div>
            <div className={`${adminhome_style.menus}`}>
                <div className={`${adminhome_style.boxes}`}>
                    <p className="fs-1 m-0">{brand}</p>
                    <p className="fs-4 fw-semibold m-0">Brand</p>
                </div>
                <div className={`${adminhome_style.boxes}`}>
                    <p className="fs-1 m-0">{product}</p>
                    <p className="fs-4 fw-semibold m-0">Product</p>
                </div>
                <div className={`${adminhome_style.boxes}`}>
                    <p className="fs-1 m-0">{category}</p>
                    <p className="fs-4 fw-semibold m-0">Category</p>
                </div>
            </div>
          </div>
          <div className={`${adminhome_style.box2}`}></div>
        </div>
      )}
    </>
  );
}
