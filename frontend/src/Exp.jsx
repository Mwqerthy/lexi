import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function ExperienceSection() {
    const ref = useRef(null)
    const isInView = useInView(ref, { triggerOnce: true, threshold: 0.1 })

    const fadeInUp = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <motion.section
            className="py-20 bg-white"
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto px-4">
                <motion.h3
                    className="text-5xl font-bold text-center mb-12 text-gray-900"
                    variants={fadeInUp}
                    transition={{ delay: 0.2 }}
                >
                    Experience the Future of Reading
                </motion.h3>

                <motion.div
                    className="bg-[#f0f4f8] p-8 rounded-xl shadow-lg"
                    variants={fadeInUp}
                    transition={{ delay: 0.4 }}
                >
                    <video width="auto" className='mx-auto' controls>
                        <source src="/v.mp4" type="video/mp4" />
                    </video>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                        <motion.div variants={fadeInUp} transition={{ delay: 0.8 }}>
                            <h4 className="text-2xl font-semibold mb-4 text-gray-900">Instant Translations</h4>
                            <p className="text-xl text-gray-600">
                                Select any word or phrase to get instant, contextual translations and definitions.
                            </p>
                        </motion.div>
                        <motion.div variants={fadeInUp} transition={{ delay: 1 }}>
                            <h4 className="text-2xl font-semibold mb-4 text-gray-900">AI-Powered Insights</h4>
                            <p className="text-xl text-gray-600">
                                Get AI-generated insights and explanations for complex concepts as you read.
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    )
}
