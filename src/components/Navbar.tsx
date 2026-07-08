"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [theme, setTheme] = useState('dark');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <header>
      <nav className="navbar-glass flex items-center justify-between px-6 py-3 mb-6">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2 text-white font-bold text-xl tracking-tight">
            <img src="/akc-logo.png" alt="AKC Logo" className="h-9 rounded-lg object-cover" />
            <span>AKC Car Wash</span>
          </Link>
          
          <div className="hidden md:flex flex-wrap gap-x-4 gap-y-2 items-center">
            <Link href="/" className="text-gray-300 hover:text-blue-500 font-medium transition-colors flex items-center whitespace-nowrap">
              <i className="bi bi-speedometer2 mr-1"></i> Dashboard
            </Link>
            
            <Link href="/workflow" className="text-gray-300 hover:text-blue-500 font-medium transition-colors flex items-center whitespace-nowrap">
              <i className="bi bi-kanban mr-1"></i> Workflow
            </Link>

            <Link href="/payments" className="text-gray-300 hover:text-blue-500 font-medium transition-colors flex items-center whitespace-nowrap">
              <i className="bi bi-credit-card mr-1"></i> Payments
            </Link>
            
            <Link href="/customers" className="text-gray-300 hover:text-blue-500 font-medium transition-colors flex items-center whitespace-nowrap">
              <i className="bi bi-person-badge mr-1"></i> Customers
            </Link>
            
            <Link href="/inventory" className="text-gray-300 hover:text-blue-500 font-medium transition-colors flex items-center whitespace-nowrap">
              <i className="bi bi-box-seam mr-1"></i> Inventory
            </Link>
            
            <Link href="/hr" className="text-gray-300 hover:text-blue-500 font-medium transition-colors flex items-center whitespace-nowrap">
              <i className="bi bi-people-fill mr-1"></i> HR & Staff
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-md hover:bg-gray-700/50 transition-colors text-gray-300"
            title="Toggle Theme"
          >
            {theme === 'light' ? (
              <i className="bi bi-moon-stars-fill text-gray-800"></i>
            ) : (
              <i className="bi bi-brightness-high-fill text-yellow-400"></i>
            )}
          </button>
          
          <button className="flex items-center text-gray-300 hover:text-white transition-colors">
             <i className="bi bi-person-circle mr-1"></i> Admin
          </button>

          <button 
            className="md:hidden text-gray-300 p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className="bi bi-list text-2xl"></i>
          </button>
        </div>
      </nav>

      {/* Mobile Menu (simplified for now) */}
      {isMenuOpen && (
        <div className="md:hidden glass-card mx-4 mb-4 flex flex-col space-y-3">
          <Link href="/" className="text-gray-300 hover:text-white"><i className="bi bi-speedometer2 mr-2"></i>Dashboard</Link>
          <Link href="/workflow" className="text-gray-300 hover:text-white"><i className="bi bi-kanban mr-2"></i>Workflow</Link>
          <Link href="/payments" className="text-gray-300 hover:text-white"><i className="bi bi-credit-card mr-2"></i>Payments</Link>
        </div>
      )}
    </header>
  );
}
