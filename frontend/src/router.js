import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/login";
import Register from "./components/Register/register";
import Admin from "./components/Admin_Dashboard/admin";
import User from "./components/User_Dashboard/user";
import { Provider } from "react-redux";
import Storage from "./redux/storage";
import Unauthorised from "./components/Error_page/401/unauthorised";
import Brand from "./layouts/Brand/brand";
import Category from "./layouts/Category/category";
import Product from "./layouts/Product/product";
import Adminhome from "./layouts/Adminhome/adminhome";
import Addbrand from "./layouts/Brand/addbrand";
import Editbrand from "./layouts/Brand/editbrand";
import Addproduct from "./layouts/Product/addproduct";
import Editproduct from "./layouts/Product/editproduct";
import Addcategory from "./layouts/Category/addcategory";
import Editcategory from "./layouts/Category/editcategory";
import Userhome from "./layout_user/User_Home/userhome";
import Userproduct from "./layout_user/User_Products/userproduct";
import About from "./layout_user/User_About/about";
import Contact from "./layout_user/User_Contact/contact";
import Usercart from "./layout_user/User_Cart/usercart";

export default function Routerrs() {
  return (
    <>
      <Provider store={Storage}>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Admin />}>
              <Route index element={<Adminhome />} />
              <Route path="brand" element={<Brand />} />
              <Route path="add_brand" element={<Addbrand />} />
              <Route path="edit_brand" element={<Editbrand />} />
              <Route path="product" element={<Product />} />
              <Route path="add_product" element={<Addproduct />} />
              <Route path="edit_product" element={<Editproduct />} />
              <Route path="category" element={<Category />} />
              <Route path="add_category" element={<Addcategory />} />
              <Route path="edit_category" element={<Editcategory />} />
            </Route>
            <Route path="/user" element={<User />}>
              <Route index element={<Userhome />} />
              <Route path="products" element={<Userproduct />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="cart" element={<Usercart />} />
            </Route>
            <Route path="/401" element={<Unauthorised />} />
          </Routes>
        </Router>
      </Provider>
    </>
  );
}
