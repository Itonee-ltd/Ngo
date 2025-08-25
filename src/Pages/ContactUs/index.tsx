import React from 'react';
import Navbar from '../home/navBar';
import Footer from '../home/Footer';

// Main App component (can be integrated into a larger application)
const ContactUs: React.FC = () => {
  return (
    <div>
    <Navbar/>
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col">
      {/* Header Section */}
      <div className="relative bg-[#96BB7C] bg-opacity-30 p-8 md:p-16 text-center overflow-hidden rounded-b-xl shadow-lg">
        {/* Subtle background elements (placeholders for actual phone imagery) */}
        <div className="absolute inset-0 opacity-20 z-0">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-40 h-40 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
        <h1 className="relative z-10 text-4xl md:text-6xl font-extrabold text-white uppercase tracking-wide">
          Get In Touch
        </h1>
      </div>

      {/* Main Content - Contact Form Section */}
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        <section className="bg-gray-800 rounded-xl shadow-xl p-6 md:p-10 mb-16 border border-gray-700">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-8">
            Let's Answer Your Queries
          </h2>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-gray-400 text-sm font-bold mb-2">
                FIRST NAME
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Enter your first name"
                className="shadow appearance-none border border-gray-700 rounded-lg w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 placeholder-gray-500"
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-gray-400 text-sm font-bold mb-2">
                LAST NAME
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Enter your last name"
                className="shadow appearance-none border border-gray-700 rounded-lg w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 placeholder-gray-500"
              />
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label htmlFor="email" className="block text-gray-400 text-sm font-bold mb-2">
                E-MAIL
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email address"
                className="shadow appearance-none border border-gray-700 rounded-lg w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 placeholder-gray-500"
              />
            </div>

            {/* Message */}
            <div className="md:col-span-2">
              <label htmlFor="message" className="block text-gray-400 text-sm font-bold mb-2">
                LEAVE A MESSAGE FOR US
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                placeholder="Type your message here..."
                className="shadow appearance-none border border-gray-700 rounded-lg w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 placeholder-gray-500 resize-y"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="bg-[#96BB7C] hover:bg-[#252B42        ] text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75"
              >
                SUBMIT
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
    <Footer/>
    </div>
  );
};

export default ContactUs;