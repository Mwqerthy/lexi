"use client"

import { useState, useEffect } from 'react'
import { BookOpenCheck } from 'lucide-react'

export default function Loader() {
    const [progress, setProgress] = useState(0)
    const [dotIndex, setDotIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prevProgress) => (prevProgress + 1) % 100)
        }, 20)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const dotInterval = setInterval(() => {
            setDotIndex((prev) => (prev + 1) % 4)
        }, 500)

        return () => clearInterval(dotInterval)
    }, [])

    const dots = '.'.repeat(dotIndex)

    return (
        <div className="flex flex-col items-center py-10  h-screen bg-white">
            <div className="relative w-24 h-24 mb-4">
                <BookOpenCheck
                    size={96}
                    className="text-blue-500"
                    strokeWidth={2}
                    style={{
                        strokeDasharray: 100,
                        strokeDashoffset: 100 - progress,
                    }}
                />
            </div>
            <div className="text-xl font-bold text-gray-700 flex ">
                <span className=" text-right">Lexi is thinking</span>
            </div>
            <div className="mt-4 flex space-x-2">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className={`w-3 h-3 rounded-full ${i === dotIndex % 3 ? 'bg-blue-500' : 'bg-gray-300'
                            } transition-colors duration-300`}
                    ></div>
                ))}
            </div>
        </div>
    )
}