import React from 'react';

const ScrollSmooth = () => {
     const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
    return (
        <div>
      <button
        onClick={() => scrollToSection('about')}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Go to About
      </button>

      <div id="about" className="h-screen flex items-center justify-center bg-gray-200">
        <h2>About Section</h2>
      </div>
    </div>
    );
};

export default ScrollSmooth;