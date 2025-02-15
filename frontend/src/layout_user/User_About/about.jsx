import React from "react";
import Footer from "../Footer/footer";
import ScrollToTop from "../../scrolltotop";

export default function About() {

  return (
    <>
    <ScrollToTop/>
      <div className="container my-5">
      <h1 className="text-center">About OpenDoorMart</h1>
      <p className="lead text-center mt-4">
        Welcome to OpenDoorMart! Our mission is to provide the best quality products at affordable prices. We pride ourselves on exceptional customer service and a wide range of products that cater to all your needs.
      </p>
      <p className="text-center fw-semibold mt-4">
        At OpenDoorMart, we believe in transparency, trust, and value. Our team is dedicated to bringing you the latest and greatest in the market, ensuring your shopping experience is smooth and enjoyable.
      </p>
      <p className="text-center fw-semibold mt-4">
        Thank you for choosing OpenDoorMart as your preferred shopping destination. We look forward to serving you and making your experience with us memorable.
      </p>
    </div>
      <Footer />
    </>
  );
}
