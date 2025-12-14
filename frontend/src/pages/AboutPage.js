// src/pages/AboutPage.js
import React from 'react';

const AboutPage = () => (
  <div className="about-page">
    <div className="about-panel">
      <h1 className="about-heading">About Lotus Leaf</h1>

      <p className="about-lead">
        Lotus Leaf is a Beirut-based label crafting everyday pieces with a luxury feel. 
        We blend soft, weighty fabrics with clean, street-inspired silhouettes so you can 
        look relaxed and put together at the same time.
      </p>

      <div className="about-columns">
        {/* BLOCK 1 – OUR STORY */}
        <section className="about-block">
          <h2 className="about-block-title">Our story</h2>
          <p>
            Born in Beirut, Lotus Leaf started from a simple idea: hoodies and sweatpants 
            that feel premium but still work for everyday life. Every drop is produced in 
            limited quantities, so your favorite set doesn&apos;t feel like everyone else&apos;s.
          </p>
        </section>

        {/* BLOCK 2 – WHAT WE STAND FOR */}
        <section className="about-block">
          <h2 className="about-block-title">What we stand for</h2>
          <ul>
            <li>Soft, durable fabrics that keep their shape wash after wash.</li>
            <li>Signature colors that mix and match across the whole collection.</li>
            <li>Clean cuts made to fit both lounge days and nights out.</li>
            <li>Small-batch production to keep each piece feel a bit more special.</li>
          </ul>
        </section>
      </div>
    </div>
  </div>
);

export default AboutPage;
