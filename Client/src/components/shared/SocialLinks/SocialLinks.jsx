// src/components/shared/SocialLinks/SocialLinks.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const SocialLinks = () => {
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/social-links`,
        );
        setSocialLinks(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Social links load failed:", err);
        setLoading(false);
      }
    };
    fetchLinks();
  }, []);

  if (loading || !socialLinks || socialLinks.length === 0) return null;

  return (
    <div className="fixed right-3 bottom-0 md:top-[60%] -translate-y-1/2 z-[999] flex flex-col items-center gap-4 md:gap-5">
      {socialLinks.map((link) => (
        <a
          key={link._id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="
            block transform transition-all duration-300 
            hover:scale-125 active:scale-110
            focus:outline-none focus:ring-2 focus:ring-emerald-400/50 rounded-full
          "
          title={link.name}
        >
          <img
            src={link.icon}
            alt={link.name}
            className="
              w-12 h-12 md:w-16 md:h-16 
              object-contain 
              drop-shadow-xl 
              rounded-full
            "
          />
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
