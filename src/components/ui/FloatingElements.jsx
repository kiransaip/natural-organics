import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const FloatingElements = () => {
  return (
    <div className="floating-container">
      {/* Decorative Blob 1 */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="blob blob-1"
      />
      
      {/* Decorative Blob 2 */}
      <motion.div
        animate={{
          y: [0, 40, 0],
          x: [0, -30, 0],
          rotate: [0, -10, 5, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="blob blob-2"
      />

      {/* Floating Image 1 (Leaf) */}
      <motion.img
        src="https://cdn-icons-png.flaticon.com/512/3201/3201018.png"
        alt="floating leaf"
        className="floating-img float-1"
        animate={{
          y: [-20, 20, -20],
          x: [-10, 10, -10],
          rotate: [0, 15, -15, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating Image 2 (Tomato) */}
      <motion.img
        src="https://cdn-icons-png.flaticon.com/512/1202/1202125.png"
        alt="floating tomato"
        className="floating-img float-2"
        animate={{
          y: [0, -30, 0],
          x: [20, 0, 20],
          rotate: [-10, 10, -10],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />
      
      {/* Floating Image 3 (Broccoli) */}
      <motion.img
        src="https://cdn-icons-png.flaticon.com/512/2329/2329976.png"
        alt="floating broccoli"
        className="floating-img float-3"
        animate={{
          y: [30, -10, 30],
          rotate: [5, -5, 5],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      
      {/* Floating Image 4 (Pepper) */}
      <motion.img
        src="https://cdn-icons-png.flaticon.com/512/1202/1202123.png"
        alt="floating pepper"
        className="floating-img float-4"
        animate={{
          y: [-15, 20, -15],
          x: [-20, 10, -20],
          rotate: [-15, 10, -15],
        }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      {/* Floating Image 5 (Carrot) */}
      <motion.img
        src="https://cdn-icons-png.flaticon.com/512/1514/1514935.png"
        alt="floating carrot"
        className="floating-img float-5"
        animate={{
          y: [20, -20, 20],
          x: [10, -10, 10],
          rotate: [10, -20, 10],
        }}
        transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <style>{`
        .floating-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
          z-index: -1;
        }
        .blob-1 {
          top: -10%;
          right: -5%;
          width: 500px;
          height: 500px;
          background: var(--primary);
        }
        .blob-2 {
          bottom: -10%;
          left: -10%;
          width: 600px;
          height: 600px;
          background: var(--secondary);
        }
        .floating-img {
          position: absolute;
          z-index: -1;
          opacity: 0.6;
          pointer-events: none;
          filter: drop-shadow(0 10px 10px rgba(0,0,0,0.1));
        }
        .float-1 {
          top: 15%;
          left: 5%;
          width: 60px;
        }
        .float-2 {
          top: 60%;
          right: 8%;
          width: 80px;
          opacity: 0.4;
        }
        .float-3 {
          bottom: 20%;
          left: 15%;
          width: 70px;
          opacity: 0.5;
        }
        .float-4 {
          top: 25%;
          right: 25%;
          width: 55px;
          opacity: 0.45;
        }
        .float-5 {
          bottom: 15%;
          right: 35%;
          width: 65px;
          opacity: 0.55;
        }
      `}</style>
    </div>
  );
};

export default FloatingElements;
