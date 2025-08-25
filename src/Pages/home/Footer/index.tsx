// Footer.tsx
import React from 'react';

// Define an interface for the navigation link structure
interface NavLink {
  label: string;
  href: string;
}

// Define an interface for a footer section
interface FooterSection {
  title: string;
  links: NavLink[];
}

const Footer: React.FC = () => {
  // Data for the footer sections
  const footerSections: FooterSection[] = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Press', href: '#' },
        { label: 'Blog', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Cookie Policy', href: '#' },
        { label: 'Accessibility', href: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Support', href: '#' },
        { label: 'Documentation', href: '#' },
        { label: 'Community', href: '#' },
        { label: 'Partners', href: '#' },
      ],
    },
  ];

  return (
    <footer className="bg-white py-8 px-4 sm:px-6 lg:px-8 rounded-lg shadow-md mt-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Logo/Name Section */}
        <div className="flex flex-col items-start md:col-span-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 rounded-md">COMMUNITY</h2> {/* Adjusted based on image */}
          <p className="text-gray-600 text-sm">
            Building connections, empowering communities.
          </p>
        </div>

        {/* Dynamic Footer Sections */}
        {footerSections.map((section, index) => (
          <div key={index} className="flex flex-col items-start">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 rounded-md">{section.title}</h3>
            <ul className="space-y-2">
              {section.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm rounded-md"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact Information Section */}
        <div className="flex flex-col items-start">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 rounded-md">Contact Us</h3>
          <ul className="space-y-2">
            <li>
              <a href="tel:+1234567890" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm flex items-center rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +1 (234) 567-890
              </a>
            </li>
            <li>
              <a href="mailto:info@example.com" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm flex items-center rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-2 4v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7m18 0A2 2 0 0020 6H4a2 2 0 00-2 2v7a2 2 0 002 2h16a2 2 0 002-2V12z" />
                </svg>
                info@example.com
              </a>
            </li>
            <li>
              <p className="text-gray-600 text-sm flex items-start rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-1 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                123 Main Street, Suite 456, City, State, 12345
              </p>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm rounded-md">
        © {new Date().getFullYear()} COMMUNITY. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;