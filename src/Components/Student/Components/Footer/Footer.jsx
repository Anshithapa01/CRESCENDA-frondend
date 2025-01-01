import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 pb-1">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pb-20">
        <div className="pl-24 flex flex-co">
          <img src="crescenda-tr.png" alt="Crescenda Logo" className="w-20 h-20 mb-4" />
        </div>
        <div className='flex flex-col'>
        <h4 className="text-yellow-600 text-lg font-semibold">Quick Links</h4>
            <ul className="mt-2 space-y-2">
            <li><a href="/search" className="hover:text-white">More courses</a></li>
            <li><a href="/profile" className="hover:text-white">Profile</a></li>
            <li><a href="/aboutUs" className="hover:text-white">About Us</a></li>
            </ul>
        </div>
        <div className="flex flex-col">
          <div>
          <h4 className="text-yellow-600 text-lg font-semibold">Contact Us</h4>
          <p className="mt-2">(+65) 254 254 254</p>
          <p>info@crescenda.com</p>
        </div>
          <div className="flex items-center space-x-4 mt-4">
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
      </div>
      <hr/>
      <p className="text-center pt-1 pb-0">Copyright Crescenda 2024. All Rights Reserved.</p>
    </footer>
  );
}

export default Footer;