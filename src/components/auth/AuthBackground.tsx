"use client";

import { motion } from "framer-motion";

export const AuthBackground = () => {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Abstract Doodles - Reference Style */}

            {/* Top Left Swirls */}
            <motion.svg
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="absolute top-20 left-10 w-32 h-32 text-gray-400/20"
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path d="M10,50 Q25,25 50,50 T90,50" />
                <circle cx="20" cy="20" r="5" fill="currentColor" className="text-apricot" />
                <circle cx="80" cy="80" r="3" />
            </motion.svg>

            {/* Bottom Left Geometric Block */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="absolute bottom-0 left-20 w-48 h-64 bg-[#F2EFE9] rounded-t-full"
            />
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="absolute bottom-0 left-40 w-32 h-40 bg-apricot rounded-t-lg opacity-80"
            >
                {/* Polka dot pattern overlay */}
                <div className="w-full h-full opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
            </motion.div>

            {/* Right Side Elements */}
            <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1 }}
                className="absolute top-40 right-10"
            >
                <div className="w-12 h-12 border-2 border-gray-300 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-sumi rounded-full"></div>
                </div>
            </motion.div>

            {/* Floating Plus Signs */}
            <div className="absolute top-1/4 left-1/3 text-gray-300 text-4xl font-thin">+</div>
            <div className="absolute bottom-1/3 right-1/2 text-gray-200 text-6xl font-thin rotate-12">+</div>

        </div>
    );
};
