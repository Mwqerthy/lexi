import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpenCheck, X, Menu } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';

const Header = ({ isMenuOpen, setIsMenuOpen }) => {
    return (
        <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
            <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
                <Link to="/" className="flex items-center">
                    <BookOpenCheck className="w-8 h-8 text-blue-600 mr-2" />
                    <h1 className="text-4xl font-bold text-gray-900" style={{ fontFamily: 'Kolly, sans-serif' }}>
                        LexiReader
                    </h1>
                </Link>
                <div className="hidden md:flex items-center space-x-6">
                    <Link to="/main" className="bg-blue-600 text-white px-6 py-3 rounded-xl text-2xl hover:bg-blue-700 transition duration-300">
                        Get Started for Free
                    </Link>
                </div>
                <button
                    className="md:hidden text-gray-600 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </nav>
            {isMenuOpen && (
                <div className="md:hidden bg-white py-2">
                    <Link to="/main" className="text-3xl block text-center py-2 bg-blue-600 text-white mx-4 rounded-xl hover:bg-blue-700 transition duration-300">
                        Get Started for Free
                    </Link>
                </div>
            )}
        </header>
    );
};

export default Header;
