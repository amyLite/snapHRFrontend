import React from "react";

const Footer = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Snaphr.ai</h3>
            <p className="text-gray-400 text-sm font-light">Building smarter solutions for modern businesses. Simplify, automate, and scale with us.</p>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Products</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-gray-300 text-sm font-light">Resume Analyser</a></li>
              <li><a href="#" className="hover:text-gray-300 text-sm font-light">AI question generator</a></li>
              
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-gray-300 text-sm font-light">Blog</a></li>
              <li><a href="#" className="hover:text-gray-300 text-sm font-light">Help Center</a></li>
              <li><a href="#" className="hover:text-gray-300 text-sm font-light">API Docs</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-400 text-sm font-light">1234 SaaS Street, Tech City, 56789</p>
            <p className="text-gray-400 text-sm font-light">Email: support@saas.com</p>
            <p className="text-gray-400 text-sm font-light">Phone: +1 234 567 890</p>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-500 text-sm font-light">&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
