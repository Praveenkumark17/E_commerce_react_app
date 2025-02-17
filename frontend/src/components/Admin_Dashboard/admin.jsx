import React, { useEffect, useState } from "react";
import admin_style from "./admin.module.css";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/userslice";

export default function Admin() {
  const [data, setData] = useState({
    image: "",
    username: "",
    role: ""
  });

  const [hasLoggedOut, setHasLoggedOut] = useState(false);
  

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const user = useSelector((state) => state.userinfo.users?.[0]);

  useEffect(() => {
    const savedData = localStorage.getItem("credentials")|| '';

    if (user && !hasLoggedOut) {
        localStorage.setItem("credentials", JSON.stringify(user));
        setData(user);
    } else if (!user && hasLoggedOut) {
        navigate("/"); // Example: navigating to the login page
    } else if (savedData) {
        const parsedData = JSON.parse(savedData);
        setData(parsedData);
        
        if (parsedData.role === "user") {
            navigate("/401");
        }
    } else {
        navigate("/401");
    }
}, [user, hasLoggedOut, navigate, setData]);


  console.log("admin", user);

  const onToggle = () => {
    const container = document.getElementById("container");
    const menu = document.getElementById("menu");
    const content = document.getElementById("content");
    container.classList.toggle(`${admin_style.box1}`);
    menu.classList.toggle(`${admin_style.menu1}`);
    content.classList.toggle(`${admin_style.content1}`);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "F11") {
        event.preventDefault();
        toggleFullScreen();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  const onlogout = (e) => {
    e.preventDefault();
    dispatch(logout())
    setHasLoggedOut(true);
    localStorage.removeItem("credentials");
    navigate("/");
  };

  const onBack = () =>{
    localStorage.removeItem('editbrand');
    localStorage.removeItem('editproduct');
    localStorage.removeItem("editcategory");
  }

  const onHome = () =>{
    navigate('/admin')
    localStorage.removeItem('editbrand');
    localStorage.removeItem('editproduct');
    localStorage.removeItem("editcategory");
  }

  console.log("API URL:",process.env.REACT_APP_API_URL)

  return (
    <div className={`${admin_style.body}`}>
      {data && (
        <div className={admin_style.box} id="container">
          <div className={`${admin_style.menu}`} id="menu">
            <div
              className="py-4 d-flex flex-column align-items-center justify-content-between"
              style={{ height: "100%" }}
            >
              <div className="mx-4">
                <div className={`text-light fs-4 d-flex justify-content-center gap-2 ${admin_style.logo}`}>
                <Icon icon="material-symbols:door-open-rounded" width="35" height="35" />
                  <p onClick={()=>onHome()}>OpendoorMart</p>
                  
                </div><hr style={{color:'white'}}/>
                <div className={`${admin_style.list} d-flex flex-column`}>
                  <p className="fs-5">Menu</p>
                  <ul className="">
                    <li><Link to={'/admin'} className={`${admin_style.link} d-flex gap-2`} onClick={()=>onBack()}><Icon icon="ant-design:home-filled" width="25" height="25"/>Home</Link></li>
                    <li><Link to={'/admin/brand'} className={`${admin_style.link} d-flex gap-2`} onClick={()=>onBack()}><Icon icon="fluent:ribbon-star-24-filled" width="25" height="25" />Brand</Link></li>
                    <li><Link to={'/admin/category'} className={`${admin_style.link} d-flex gap-2`} onClick={()=>onBack()}><Icon icon="material-symbols:category-rounded" width="25" height="25" />Category</Link></li>
                    <li><Link to={'/admin/product'} className={`${admin_style.link} d-flex gap-2`} onClick={()=>onBack()}><Icon icon="ant-design:product-filled" width="25" height="25" />Products</Link></li>
                  </ul>
                </div>
              </div>
              <div>
                <div>
                  <Link
                    className={`${admin_style.logout}`}
                    onClick={onlogout}
                  >
                    Log Out{" "}
                    <Icon icon="material-symbols:logout-rounded" width="25" height="25" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className={admin_style.content} id="content">
            <div
              className={`${admin_style.header} d-flex justify-content-between`}
            >
              <div className="d-flex">
                <button onClick={onToggle} className="btn ">
                  <Icon icon="gg:menu-left" height={25} width={25} />
                </button>
                <div className="d-flex align-items-center">
                  <div className={admin_style.icon}>
                    <Icon icon="tabler:search" width="24" height="24" />
                  </div>
                  <input
                    type="text"
                    placeholder={`Search`}
                    className={admin_style.input}
                  />
                </div>
              </div>
              <div className="d-flex gap-3 align-items-center">
                <div style={{ borderRadius: "50%" }}>
                  <Icon icon="twemoji:flag-india" width="30" height="30" />
                </div>
                <div>
                  <Icon icon="hugeicons:menu-square" width="24" height="24" />
                </div>
                <div>
                  <Icon icon="mage:bag-a" width="25" height="25" />
                </div>
                <div onClick={toggleFullScreen}>
                  <Icon icon="octicon:screen-full-16" width="25" height="25" />
                </div>
                <div>
                  <Icon icon="circum:dark" width="30" height="30" />
                </div>
                <div>
                  <Icon icon="line-md:bell-loop" width="24" height="24" />
                </div>
                <div
                  className={`${admin_style.profile} d-flex gap-3 align-items-center`}
                >
                  <div>
                    <div>
                      <img
                        className={admin_style.img}
                        src={data.image.startsWith('http')?`${process.env.REACT_APP_API_URL}/images/profile/${data.image}` : `${data.image}`}
                        alt={"img"}
                      />
                    </div>
                  </div>
                  <div className="lh-2">
                    <div>
                      <p className="m-0 fw-semibold">{data.username}</p>
                    </div>
                    <div>
                      <p className="m-0 fw-bold">{data.role.toUpperCase()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={`${admin_style.main}`}>
              <Outlet/>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
