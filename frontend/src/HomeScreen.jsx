import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { BookOpenCheck, BookOpen, Search, Zap } from 'lucide-react'; // Replace with your actual icon library
import { Tilt } from 'react-tilt'

export default function HomeScreen() {
    const controls = useAnimation(); // Initialize controls
    const fadeInUp = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };

    const staggeredFadeIn = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    useEffect(() => {
        // Start the animation immediately when the component mounts
        controls.start('visible');
    }, [controls]); // Added controls to dependency array

    return (
        <>
            {/* First Section */}
            <motion.section
                className="container mx-auto px-4 py-20 text-center"
                initial="hidden"
                animate={controls} // Use the controls object
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
            >
                <motion.div className="flex flex-col items-center mb-8" variants={fadeInUp}>
                    <BookOpenCheck className="w-16 h-16 text-blue-600 mb-4" />
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">LexiReader</h2>
                    <p className="text-2xl text-gray-600">Enhancing your reading experience with AI-powered insights.</p>
                </motion.div>
                <motion.div className="text-3xl text-gray-600 mb-8 h-20" variants={fadeInUp}>
                    <TypeAnimation
                        sequence={[
                            'Translate complex words instantly.',
                            2000,
                            'Get AI-powered insights as you read.',
                            2000,
                            'Enhance your reading experience.',
                            2000,
                        ]}
                        wrapper="span"
                        speed={50}
                        repeat={Infinity}
                    />
                </motion.div>
            </motion.section>

            {/* Second Section */}
            <motion.section
                className="py-40 bg-white"
                initial="hidden"
                animate={controls} // Use the controls object
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
            >
                <div className="container mx-auto px-4">
                    <h3 className="text-5xl font-bold text-center mb-12 text-gray-900">Our main features</h3>
                    <motion.div
                        className="text-2xl grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={{
                            visible: {
                                transition: { staggerChildren: 0.5 },
                            },
                        }}
                    >
                        {[
                            { icon: BookOpen, title: "Smart PDF Reader", description: "Advanced PDF viewing with AI-enhanced features" },
                            { icon: Search, title: "Contextual Word Lookup", description: "Get instant, context-aware definitions as you read" },
                            { icon: Zap, title: "AI-Powered Insights", description: "Gain deeper understanding with AI-generated explanations" },
                        ].map((feature, index) => (
                            <motion.div key={index} custom={index} variants={staggeredFadeIn}>
                                <Tilt className="Tilt" options={{ max: 35, scale: 1.05 }}>
                                    <div className="bg-[#f0f4f8] p-20 rounded-xl shadow-md h-full">
                                        <feature.icon className="w-12 h-12 text-blue-600 mb-4 mx-auto" />
                                        <h4 className="text-2xl font-semibold mb-2 text-gray-900 text-center">{feature.title}</h4>
                                        <p className="text-gray-600 text-center">{feature.description}</p>
                                    </div>
                                </Tilt>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.section>
        </>
    );
}
