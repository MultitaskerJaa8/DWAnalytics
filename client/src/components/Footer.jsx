const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-primary-900 to-primary-800 text-white mt-auto border-t-4 border-accent-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Column 1: About */}
          <div>
            <h3 className="text-lg font-bold mb-3 text-accent-500">Digital Workforce Analytics</h3>
            <p className="text-sm text-blue-100 leading-relaxed">
              A modern KPI-based performance evaluation platform for Government of India departments, 
              promoting transparency and data-driven workforce management.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-3 text-accent-500">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.india.gov.in" target="_blank" rel="noopener noreferrer" 
                   className="text-blue-100 hover:text-white transition-colors flex items-center">
                  <span className="mr-2">→</span> National Portal of India
                </a>
              </li>
              <li>
                <a href="https://digitalindia.gov.in" target="_blank" rel="noopener noreferrer" 
                   className="text-blue-100 hover:text-white transition-colors flex items-center">
                  <span className="mr-2">→</span> Digital India Initiative
                </a>
              </li>
              <li>
                <a href="https://meity.gov.in" target="_blank" rel="noopener noreferrer" 
                   className="text-blue-100 hover:text-white transition-colors flex items-center">
                  <span className="mr-2">→</span> MeitY, Govt. of India
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h3 className="text-lg font-bold mb-3 text-accent-500">Support & Resources</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-blue-100 flex items-center">
                <span className="mr-2">📧</span> support@workforce.gov.in
              </li>
              <li className="text-blue-100 flex items-center">
                <span className="mr-2">📞</span> 1800-123-4567 (Toll Free)
              </li>
              <li className="text-blue-100 flex items-center">
                <span className="mr-2">🕒</span> Mon-Fri, 9:00 AM - 6:00 PM
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-sm text-blue-100">
                © {currentYear} Digital Workforce Performance Analytics Platform
              </p>
              <p className="text-xs text-blue-200 mt-1">
                Developed under e-Governance Initiative | Government of India
              </p>
            </div>
            <div className="flex space-x-6 text-sm">
              <button onClick={() => window.open('/privacy-policy', '_blank')} 
                      className="text-blue-100 hover:text-white transition-colors">
                Privacy Policy
              </button>
              <span className="text-blue-700">|</span>
              <button onClick={() => window.open('/terms-of-service', '_blank')} 
                      className="text-blue-100 hover:text-white transition-colors">
                Terms of Service
              </button>
              <span className="text-blue-700">|</span>
              <button onClick={() => window.open('/accessibility', '_blank')} 
                      className="text-blue-100 hover:text-white transition-colors">
                Accessibility
              </button>
            </div>
          </div>
        </div>

        {/* Government Emblem Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-blue-200 italic">
            🇮🇳 Content owned, maintained, and updated by respective Government Departments
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;