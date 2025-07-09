import React, { useState } from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="App-footer">
      <img
        src="./icons/bug-solid.svg"
        alt="science"
        style={{ height: "3em", verticalAlign: "middle" }}
      />
      <img
        src="./icons/discord-brands.svg"
        alt="science"
        style={{ height: "3em", verticalAlign: "middle" }}
      />
      <img
        src="./icons/font-awesome-brands-solid.svg"
        alt="science"
        style={{ height: "3em", verticalAlign: "middle" }}
      />
    </footer>
  );
};

export default Footer;
