import { useState } from "react";
import { MenuIcon, X } from "lucide-react"; // icons
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="p-2 text-gray-700 rounded-lg focus:outline-none"
      >
        {isOpen ? <X size={28} /> : <MenuIcon size={28} />}
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-3/4 bg-white shadow-lg z-50 p-6"
          >
            <ul className="space-y-6 text-lg font-medium">
              <li>
                <NavLink to="/" onClick={toggleMenu} className="block hover:text-[#E74040]">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/aboutus" onClick={toggleMenu} className="block hover:text-[#E74040]">
                  About
                </NavLink>
              </li>
              <li>
                <NavLink to="/contactus" onClick={toggleMenu} className="block hover:text-[#E74040]">
                contact us
                </NavLink>
              </li>
              <li>
                <NavLink to="/login" onClick={toggleMenu} className="block hover:text-[#E74040]">
                 login
                </NavLink>
              </li>
              <li>
                <NavLink to="/sign-up" onClick={toggleMenu} className="block hover:text-[#E74040]">
                  Sign Up
                </NavLink>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Menu;
