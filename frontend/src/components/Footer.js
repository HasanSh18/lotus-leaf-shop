import React from 'react';
import { Container } from 'react-bootstrap';
import {
  FaInstagram,
  FaWhatsapp,
  FaFacebook
} from 'react-icons/fa';
import { FaTiktok } from 'react-icons/fa6'; // 👈 NEW

const Footer = () => {
  return (
    <footer className="footer">
      <Container className="footer-inner">
        {/* Left side: small text */}
        <div className="footer-left">
          <div className="footer-logo-text">LOTUS LEAF</div>
          <small className="footer-copy">
            © {new Date().getFullYear()} Lotus Leaf. All rights reserved.
          </small>
        </div>

        {/* Right side: social icons */}
        <div className="footer-social">
          <span className="footer-follow-text">Follow us on</span>

          <a
            href="https://www.instagram.com/lotusleaf.leb?igsh=MTJ4MWdxNGM2YnhlOQ%3D%3D&utm_source=qr"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>

          <a
            href="https://www.tiktok.com/@lotusleaf.leb?_r=1&_t=ZS-923eUEwZg4i"
            target="_blank"
            rel="noreferrer"
            aria-label="TikTok"
          >
            <FaTiktok />
          </a>
<a
    href="https://www.facebook.com/share/1FXxJghbJn/?mibextid=wwXIfr"
    target="_blank"
    rel="noreferrer"
    aria-label="Facebook"
  >
    <FaFacebook />
  </a>
         
        
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
