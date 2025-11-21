"use client";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

export default function Carousel({ images }: { images: string[] }) {
    const [current, setCurrent] = useState(0);

    const next = () => setCurrent((c) => (c + 1) % images.length);
    const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);

    return (
        <div className="relative w-full max-w-3xl mx-auto select-none">
            {/* Image */}
            <div className="overflow-hidden rounded-2xl shadow-xl">
                <img
                    key={current}
                    src={images[current]}
                    alt={`Slide ${current + 1}`}
                    className="w-full h-auto object-contain transition-transform duration-500 ease-in-out transform scale-100 hover:scale-105"
                />
            </div>

            {/* Prev Button */}
            <button
                onClick={prev}
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/70 backdrop-blur-md hover:bg-white/90 text-gray-800 p-4 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer"
                aria-label="Previous"
            >
                <ChevronLeftIcon className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
                onClick={next}
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/70 backdrop-blur-md hover:bg-white/90 text-gray-800 p-4 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer"
                aria-label="Next"
            >
                <ChevronRightIcon className="w-6 h-6" />
            </button>

            {/* Dots */}
            <div className="flex justify-center mt-4 space-x-3">
                {images.map((_, i) => (
                    <div
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`h-3 w-3 rounded-full cursor-pointer transition-all duration-300 ${i === current
                            ? "bg-blue-600 w-6 h-3 rounded-full"
                            : "bg-gray-400 w-3 h-3"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
