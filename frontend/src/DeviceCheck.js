import React, { useEffect, useState } from "react";
import device_style from "./devicecheck.module.css";

const DeviceCheck = ({ children }) => {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkDevice = () => {
      setIsDesktop(window.innerWidth >= 1440); // Assuming 1440px+ is a desktop
    };

    checkDevice(); // Check on initial load
    window.addEventListener("resize", checkDevice); // Update on resize

    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  return isDesktop ? (
    children
  ) : (
    <>
    <div className={`${device_style.main} text-center d-flex flex-column justify-content-center align-items-center`}>
        <div className={device_style.img}></div>
        <p className={device_style.p}>This application only support on desktop device</p>
    </div>
    </>
  );
};

export default DeviceCheck;
