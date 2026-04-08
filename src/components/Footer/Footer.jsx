"use client";
import "./Footer.css";
import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+971'
  });

  useGSAP(
    () => {
      const textElements = footerRef.current.querySelectorAll(".footer-text");

      textElements.forEach((element) => {
        const textContent = element.querySelector(".footer-text-content");
        gsap.set(textContent, {
          y: "100%",
        });
      });

      ScrollTrigger.create({
        trigger: footerRef.current,
        start: "top 80%",
        onEnter: () => {
          textElements.forEach((element, index) => {
            const textContent = element.querySelector(".footer-text-content");
            gsap.to(textContent, {
              y: "0%",
              duration: 0.8,
              delay: index * 0.1,
              ease: "power3.out",
            });
          });
        },
      });
    },
    { scope: footerRef }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="footer" ref={footerRef}>
      <div className="footer-background">
        <Image src="/spotlight-banner.webp" alt="" fill style={{ objectFit: 'cover' }} />
        <div className="footer-overlay"></div>
      </div>

      <div className="footer-content">
        {/* Left Side - Inquiry Form */}
        <div className="footer-left">
          <div className="footer-text">
            <div className="footer-text-content">
              <h2 className="footer-title">REGISTER YOUR INTEREST</h2>
            </div>
          </div>

          <div className="footer-features">
            <span>• Lifestyle</span>
            <span>• Gallery</span>
            <span>• Prices</span>
            <span>• Masterplan</span>
          </div>

          <form className="footer-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            
            <input
              type="email"
              name="email"
              placeholder="Your e-mail"
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            <div className="phone-input">
              <select 
                name="countryCode" 
                value={formData.countryCode}
                onChange={handleChange}
                className="country-code"
              >
                <option value="+91">🇮🇳 +91</option>
                <option value="+971">🇦🇪 +971</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
              </select>
              <input
                type="tel"
                name="phone"
                placeholder="Phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="footer-submit-btn">
              <span className="download-icon">↓</span>
              DOWNLOAD BROCHURE
            </button>
          </form>
        </div>

        {/* Right Side - Social Links & Building Image */}
        <div className="footer-right">
          <div className="footer-building-image">
            <Image src="/img8.png" alt="Building" fill style={{ objectFit: 'cover' }} />
          </div>

          <div className="footer-socials">
            <div className="footer-text">
              <div className="footer-text-content">
                <p className="socials-header">( Connect With Us )</p>
              </div>
            </div>

            <div className="footer-social-links">
              <div className="footer-social">
                <a href="mailto:inquiry@centuriongroup.ae">
                  <div className="footer-text">
                    <div className="footer-text-content">
                      <h3>Email</h3>
                    </div>
                  </div>
                </a>
              </div>
              
              <div className="footer-social">
                <a href="https://www.linkedin.com/company/104596029/admin/dashboard/" target="_blank" rel="noopener noreferrer">
                  <div className="footer-text">
                    <div className="footer-text-content">
                      <h3>LinkedIn</h3>
                    </div>
                  </div>
                </a>
              </div>
              
              <div className="footer-social">
                <a href="https://www.youtube.com/channel/UC-CSu6CI0Fahyk4Exg-jsmg" target="_blank" rel="noopener noreferrer">
                  <div className="footer-text">
                    <div className="footer-text-content">
                      <h3>YouTube</h3>
                    </div>
                  </div>
                </a>
              </div>
              
              <div className="footer-social">
                <a href="https://www.instagram.com/centurionproperties.ae/" target="_blank" rel="noopener noreferrer">
                  <div className="footer-text">
                    <div className="footer-text-content">
                      <h3>Instagram</h3>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="footer-bottom">
        <div className="footer-text">
          <div className="footer-text-content">
            <p>&copy; 2025 Centurion Properties. All Rights Reserved</p>
          </div>
        </div>
        {/* <div className="footer-scroll-indicator">
          <span>SCROLL</span>
          <div className="scroll-arrow">↓</div>
        </div> */}
      </div>
    </div>
  );
};

export default Footer;
