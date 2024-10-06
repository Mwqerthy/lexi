import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom';
export default function CallToAction() {
    const ref = useRef(null)
    const isInView = useInView(ref, { triggerOnce: true, threshold: 0.1 })

    const fadeInUp = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <motion.section
            className="py-40 bg-white text-center"
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 1 }}
        >
            <div className="container mx-auto px-4">
                <motion.a
                    className="bg-blue-600 text-white px-8 py-4 rounded-xl text-3xl hover:bg-blue-700 transition duration-300 inline-block"
                    variants={fadeInUp}
                >
                    <Link to="/main">Try it for free</Link>

                </motion.a>
            </div>
        </motion.section>
    )
}
