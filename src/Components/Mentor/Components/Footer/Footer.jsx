import { faFacebook, faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-6 px-6">
      <div className="container mx-auto flex justify-between pl-10 pr-10">
        <div>
        <img  src="https://res.cloudinary.com/df1rw6pzl/image/upload/v1735300537/n2cqqo7pgl8iys1s2l8w.png" alt="Crescenda Logo" className="w-20 h-20 mb-4" />
          <p className="mt-2">An online education platform <br/>delivering courses and resources.</p>
          <div className="flex space-x-4 mt-4">
          <a href="#" className="text-gray-300 hover:text-white">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
          </div>
        </div>
        <div>
          <h4 className="text-yellow-600 text-lg font-semibold">Quick Links</h4>
          <ul className="mt-2 space-y-2">
            <li><a href="/mentor/profile" className="hover:text-white">Profile</a></li>
            <li><a href="/mentor/dashboard" className="hover:text-white">Dashboard</a></li>
            <li><a href="/mentor/aboutUs" className="hover:text-white">About Us</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-yellow-600 text-lg font-semibold">Contact Us</h4>
          <p className="mt-2">(+65) 254 254 254</p>
          <p>info@crescenda.com</p>
        </div>
      </div>
      <div className="text-center text-sm text-gray-500 mt-6">
        &copy; 2024 Crescenda. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
