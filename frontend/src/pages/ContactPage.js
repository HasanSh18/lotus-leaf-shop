import React from 'react';
import { FaTiktok } from 'react-icons/fa6';

const ContactPage = () => (
  <section className="contact-page">
    <div className="contact-panel">
      <h2 className="contact-title">Contact information</h2>
      <p className="contact-lead">
        Our team is ready to assist you with orders, collaborations or wholesale.
        Reach us through any of the channels below.
      </p>

      {/* WhatsApp */}
      <div className="contact-row">
        <div className="contact-icon">📞</div>
        <div className="contact-text">
          <span className="contact-label">WhatsApp</span>
          <a
            href="https://wa.me/96171659649"
            target="_blank"
            rel="noreferrer"
            className="contact-value"
          >
            +961 71 659 649
          </a>
        </div>
      </div>

      {/* Email */}
      <div className="contact-row">
        <div className="contact-icon">✉️</div>
        <div className="contact-text">
          <span className="contact-label">Email</span>
          <a
            href="mailto:lotusleaf.leb@gmail.com"
            className="contact-value"
          >
            lotusleaf.leb@gmail.com
          </a>
        </div>
      </div>

      {/* Instagram */}
      <div className="contact-row">
        <div className="contact-icon">📷</div>
        <div className="contact-text">
          <span className="contact-label">Instagram</span>
          <a
            href="https://www.instagram.com/lotusleaf.leb?igsh=MTJ4MWdxNGM2YnhlOQ%3D%3D&utm_source=qr"
            target="_blank"
            rel="noreferrer"
            className="contact-value"
          >
            @lotusleaf
          </a>
        </div>
      </div>

      {/* TikTok */}
      <div className="contact-row">
        <div className="contact-icon contact-icon-tiktok">
          <FaTiktok />
        </div>
        <div className="contact-text">
          <span className="contact-label">TikTok</span>
          <a
            href="https://www.tiktok.com/@lotusleaf.leb?_r=1&_t=ZS-923eUEwZg4i"
            target="_blank"
            rel="noreferrer"
            className="contact-value"
          >
            @lotusleaf.leb
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default ContactPage;
