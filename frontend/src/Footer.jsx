import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Instagram, Linkedin, BookOpenCheck } from 'lucide-react'

export default function Footer() {
    const ref = useRef(null)
    const isInView = useInView(ref, { triggerOnce: true, threshold: 0.1 })

    const fadeInUp = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <motion.footer
            className="bg-gray-100 py-12"
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto px-4">
                <motion.div
                    className="flex flex-col items-center justify-center text-center"
                    variants={fadeInUp}
                    transition={{ delay: 0.5 }}
                >
                    <div className="flex items-center justify-center mb-4">
                        <BookOpenCheck className="w-10 h-10 text-blue-600 mr-2" />
                        <h4 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: 'Kolly, sans-serif' }}>
                            LexiReader
                        </h4>
                    </div>
                    <p className="text-xl text-gray-600 mb-4">
                        Enhancing your reading experience with AI-powered insights.
                    </p>
                    <div className="flex space-x-4 justify-center">
                        <a href="https://www.instagram.com/molehill11/profilecard/?igsh=MWgyc21qM3E4Z3ZwdQ==" className="text-xl text-gray-400 hover:text-gray-600" target="_blank">
                            <Instagram className="w-8 h-8" target="_blank" />
                        </a>
                        <a href="https://www.linkedin.com/in/mikiyas-adane-6670bb255?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BGmV7ZPeOSCep04BOAAa5tw%3D%3D" className="text-xl text-gray-400 hover:text-gray-600" target="_blank">
                            <Linkedin className="w-8 h-8" />
                        </a>
                    </div>
                </motion.div>
                <motion.div
                    className="mt-12 pt-8 border-t border-gray-200"
                    variants={fadeInUp}
                    transition={{ delay: 0.4 }}
                >
                    <p className="text-center text-xl text-gray-600">
                        &copy; 2023 LexiReader. All rights reserved.
                    </p>
                </motion.div>
            </div>
        </motion.footer>
    )
}
