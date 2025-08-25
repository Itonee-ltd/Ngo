import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { IoIosMenu } from "react-icons/io";
import Menu from "./menu";

const Navbar = () => {
  const navigate = useNavigate()
    return (
        <div className="flex justify-around item-center m-4">
           <div className="">Logo</div>
           <div className={`md:flex md:justify-between hidden `}>
           <ul className="mt-[10px]">
           <NavLink
                    to="/"
                    className={({ isActive }) => (isActive ? 'text-[#E74040] ml-4' : 'ml-4 text-[#252B42]')}
                  >
                    Home
            </NavLink>
            <NavLink
                    onClick={() => ""}
                    to="/aboutus"
                    className={({ isActive }) => (isActive ? 'text-[#E74040] ml-4' : 'ml-4 text-[#252B42]')}
                  >
                    About
            </NavLink>
            <NavLink
                    onClick={() => ""}
                    to="/contactus"
                    className={({ isActive }) => (isActive ? 'text-[#E74040] ml-4' : 'ml-4 text-[#252B42]')}
                  >
                    Contact Us
            </NavLink>
            
           </ul>
           <div className="flex items-center justify-center text-center">
            <NavLink
                    onClick={() => ""}
                    to="/login"
                    className={({ isActive }) => (isActive ? 'text-[#E74040] ml-4' : 'ml-4 text-[#96BB7C]')}
                  >
                    Login
             </NavLink>
             <button
                    onClick={() => navigate('/sign-up')}
                    className="bg-[#96BB7C] ml-4 text-white text-center py-2 text-white rounded-md lg:w-24"
                  >
                    <Link to={"/sign-up"}>Sign Up </Link>
            </button>
            </div>
           </div>
           <Menu/>
        </div>
    );
}

export default Navbar;