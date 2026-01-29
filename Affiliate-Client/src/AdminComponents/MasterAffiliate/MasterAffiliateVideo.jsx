// components/SuperAffiliateVideo.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const MasterAffiliateVideo = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/master-affiliate-video`);
      setVideos(res.data || []);
    } catch (err) {
      console.log("No videos yet");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-2xl">Loading Videos...</div>;
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="mt-10 w-full bg-gradient-to-r from-green-400 via-lime-500 to-yellow-400 text-black font-bold text-center text-xl py-3 rounded-md"
      >
        🎥 Video Tutorial — How to Use Master Affiliate System
      </motion.div>

      <div className="mt-10">
        {videos.length === 0 && (
          <div className="text-center py-20 text-xl text-gray-400">
            No videos added yet. Add some from Admin Panel.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {videos.map((video, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300"
            >
              <video
                controls
                poster="/placeholder.jpg"
                className="w-full h-100 object-cover"
              >
                <source src={video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MasterAffiliateVideo;
