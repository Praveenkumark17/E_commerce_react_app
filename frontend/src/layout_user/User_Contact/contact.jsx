import React from "react";
import Footer from "../Footer/footer";
import contact_style from "./contact.module.css";
import ScrollToTop from "../../scrolltotop";

export default function Contact() {

  return (
    <>
    <ScrollToTop/>
      <div className={`${contact_style.cont} container my-5`}>
        <h1 className="text-center">Contact Us</h1>
        <form>
          <div className={`${contact_style.row} row mx-auto`}>
            <div className="col-6">
              <input
                type="text"
                placeholder="Enter First name"
                className={contact_style.input}
              />
            </div>
            <div className="col-6">
              <input
                type="text"
                placeholder="Enter last name"
                className={contact_style.input}
              />
            </div>
            <div className="col-12">
              <input
                type="text"
                placeholder="Enter Email Id"
                className={contact_style.input}
              />
            </div>
            <div className="col-12">
              <textarea
                placeholder="Type in Your Mind..."
                className={contact_style.input}
              ></textarea>
            </div>
          </div>
          <button type="submit" className={contact_style.btn}>
            Submit
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}
