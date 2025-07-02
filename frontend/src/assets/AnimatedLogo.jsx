import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import logo from "./chainGigs.svg"; // Use your SVG if available

export default function AnimatedLogo() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Spinning Glow Background */}
      <motion.div
        style={{
          position: "relative",
          width: 140,
          height: 140,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #3b82f6 30%, #a78bfa 100%)",
          boxShadow: "0 0 40px 10px #a78bfa55",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
      >
        {/* Glow Pulse */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "rgba(59,130,246,0.12)",
            zIndex: 1,
          }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />
        {/* Logo Fade-in */}
        <motion.img
          src={logo}
          alt="ChainGigs Logo"
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            zIndex: 2,
            boxShadow: "0 2px 12px #0002",
            background: "#fff",
            objectFit: "contain",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isMounted ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.7, type: "spring" }}
        />
      </motion.div>
      {/* Text Fade-in */}
      <motion.h1
        style={{
          marginTop: 24,
          fontWeight: 600,
          fontSize: "2rem",
          letterSpacing: "0.05em",
          color: "#22223b",
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={isMounted ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.1, duration: 0.6 }}
      >
        ChainGigs
      </motion.h1>
    </div>
  );
}