"use client";

import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

const WhatsAppButton = () => {
    return (
        <motion.a
            href="https://wa.me/9779851352794"
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center justify-center p-3 rounded-full bg-[#25D366] text-white shadow-lg cursor-pointer transition-transform hover:scale-110"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
            {/* Pulsing Shadow Effect */}
            <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping"></span>

            {/* Heartbeat Icon */}
            <div className="relative animate-pulse">
                <FaWhatsapp className="w-8 h-8 md:w-10 md:h-10" />
            </div>
        </motion.a>
    );
};

export default WhatsAppButton;
