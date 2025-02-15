import React from "react";
import footer_style from "./footer.module.css";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <>
      <div className={footer_style.footer}>
        <div className={footer_style.footer_cont}>
          <div className={footer_style.securepay}>
            <div className={footer_style.footlog}>
              <i className="fa-duotone fa-solid fa-credit-card-front"></i>
            </div>
            <div className={footer_style.foothead}>
              <p>100% Secure payments</p>
            </div>
            <div className={footer_style.foottext}>
              <p>Moving your card details to a much more secured place.</p>
            </div>
          </div>
          <div className={footer_style.trustpay}>
            <div className={footer_style.footlog}>
              <i className="fa-regular fa-shield-check"></i>
            </div>
            <div className={footer_style.foothead}>
              <p>trustpay</p>
            </div>
            <div className={footer_style.foottext}>
              <p>100% Payment Protection. Easy Return Policy</p>
            </div>
          </div>
          <div className={footer_style.help}>
            <div className={footer_style.footlog}>
              <i className="fa-solid fa-headset"></i>
            </div>
            <div className={footer_style.foothead}>
              <p>help center</p>
            </div>
            <div className={footer_style.foottext}>
              <p>
                Got a question? Look no further. Browse our FAQs or submit your
                query here.
              </p>
            </div>
          </div>
          <div className={footer_style.app}>
            <div className={footer_style.footlog}>
              <i className="fa-duotone fa-solid fa-mobile"></i>
            </div>
            <div className={footer_style.foothead}>download app</div>
            <div className={footer_style.foottext}>
              <p>
                Download the app and get exciting app-only offers at your
                fingertips.
              </p>
            </div>
          </div>
          <div className={footer_style.info}>
            <div className={footer_style.foot_title}>Policy info</div>
            <div className={footer_style.foot_cont}>
              <Link >Privacy Policy</Link>
              <Link >Terms of Sale</Link>
              <Link >Terms of Use</Link>
              <Link >Report Abuse & Takedown Policy</Link>
              <Link >Certification</Link>
              <Link >FAQ</Link>
            </div>
          </div>
          <div className={footer_style.company}>
            <div className={footer_style.foot_title}>company</div>
            <div className={footer_style.foot_cont}>
              <Link >Impact@OpendoorMart</Link>
              <Link >Careers</Link>
              <Link >Blog</Link>
              <Link >Sitemap</Link>
              <Link >Contact Us</Link>
            </div>
          </div>
          <div className={footer_style.business}>
            <div className={footer_style.foot_title}>Business</div>
            <div className={footer_style.foot_cont}>
              <Link >Shopping App</Link>
              <Link >Sell on OpendoorMart</Link>
              <Link >Media Enquiries</Link>
            </div>
          </div>
          <div className={footer_style.applogo}>
            <div className={footer_style.foot_title}>available on</div>
            <div className={footer_style.foot_play}>
              <div className={footer_style.foot_img}></div>
            </div>
          </div>
          <div className={footer_style.payment}>
            <div className={footer_style.logtitle}>Payments</div>
            <div className={footer_style.logs}>
              <i className="fa-duotone fa-solid fa-credit-card"></i>
              <i className="fa-duotone fa-solid fa-credit-card-front"></i>
              <i className="fa-brands fa-cc-visa"></i>
              <i className="fa-brands fa-cc-mastercard"></i>
              <i className="fa-brands fa-cc-paypal"></i>
              <i className="fa-brands fa-cc-apple-pay"></i>
              <i className="fa-brands fa-cc-amazon-pay"></i>
              <i className="fa-brands fa-cc-amex"></i>
              <i className="fa-brands fa-google-pay"></i>
            </div>
          </div>
          <div className={footer_style.social}>
            <div className={footer_style.logtitle}>Social media</div>
            <div className={footer_style.logs}>
              <i className="fa-brands fa-square-facebook"></i>
              <i className="fa-brands fa-square-instagram"></i>
              <i className="fa-brands fa-square-x-twitter"></i>
              <i className="fa-brands fa-square-threads"></i>
              <i className="fa-brands fa-square-youtube"></i>
              <i className="fa-brands fa-linkedin"></i>
              <i className="fa-brands fa-telegram"></i>
              <i className="fa-brands fa-square-whatsapp"></i>
              <i className="fa-brands fa-square-pinterest"></i>
            </div>
          </div>
        </div>
        <div className={footer_style.copyright}>
          Copyright <i className="fa-regular fa-copyright"></i> 2025 OpenDoorMart
        </div>
      </div>
    </>
  );
}
