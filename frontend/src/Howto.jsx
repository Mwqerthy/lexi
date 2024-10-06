import React, { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ChevronRight, Upload, Search } from 'lucide-react'

export default function HowToPage() {
    const [activeStep, setActiveStep] = useState(0)

    const steps = [
        {
            title: 'Get Started',
            description: 'Click the "Get Started for Free" button to begin your journey with our PDF reader. This button is typically located at the top of the application interface.',
            icon: <ChevronRight className="w-6 h-6" />,
            image: '/4.jpg'
        },
        {
            title: 'Upload PDF',
            description: 'Select and upload your PDF file by clicking "New Pdf" button',
            icon: <Upload className="w-6 h-6" />,
            image: '/5.jpg'
        },
        {
            title: 'Look Up Words',
            description: 'Once your PDF is loaded, you can select words and  look up their meaning.  A contextual meaning will appear with a text-to-speech option.',
            icon: <Search className="w-6 h-6" />,
            image: '/6.jpg'
        }
    ]

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-12">How to Use Our PDF Reader</h1>

                {/* Desktop View */}
                <div className="hidden md:block">
                    {steps.map((step, index) => {
                        const ref = useRef(null)
                        const isInView = useInView(ref, { triggerOnce: true, threshold: 0.2 })

                        return (
                            <motion.div
                                key={index}
                                ref={ref}
                                className={`bg-white p-6 rounded-lg shadow-md mb-8 ${activeStep === index ? 'border-2 border-blue-500' : ''
                                    }`}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
                                transition={{ delay: index * 0.2 }}
                            >
                                <div className="flex items-start">
                                    <div className="w-1/2 pr-4">
                                        <div className="flex items-center mb-4">
                                            <div className="bg-blue-500 text-white rounded-full p-2 mr-4">
                                                {step.icon}
                                            </div>
                                            <h2 className="text-2xl font-semibold">{step.title}</h2>
                                        </div>
                                        <p className="text-gray-600">{step.description}</p>
                                    </div>
                                    <div className="w-1/2 pl-4">
                                        <img
                                            src={step.image}
                                            alt={`Step ${index + 1}: ${step.title}`}
                                            className="rounded-lg shadow-md w-full h-auto"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Mobile View */}
                <div className="md:hidden">
                    {steps.map((step, index) => {
                        const ref = useRef(null)
                        const isInView = useInView(ref, { triggerOnce: true, threshold: 0.2 })

                        return (
                            <motion.div
                                key={index}
                                ref={ref}
                                className="bg-white p-4 rounded-lg shadow-md mb-6"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
                                transition={{ delay: index * 0.2 }}
                            >
                                <div className="flex items-center mb-3">
                                    <div className="bg-blue-500 text-white rounded-full p-2 mr-3">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold">{step.title}</h3>
                                </div>
                                <p className="text-gray-600 mb-4">{step.description}</p>
                                <img
                                    src={step.image}
                                    alt={`Step ${index + 1}: ${step.title}`}
                                    className="rounded-lg shadow-md w-full h-auto"
                                />
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
