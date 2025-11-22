"use client";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

export default function Carousel({ images }: { images: string[] }) {
    const [current, setCurrent] = useState(0);

    const next = () => setCurrent((c) => (c + 1) % images.length);
    const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);

    return (
        <div className="relative w-full max-w-3xl mx-auto select-none">
            <div className="flex items-center">
                {/* Prev Button */}
                <button
                    onClick={prev}
                    className="bg-white/70 backdrop-blur-md hover:bg-white/90 text-gray-800 p-2 rounded-full shadow transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    aria-label="Previous"
                >
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>

                {/* Image */}
                <div className="overflow-hidden rounded-2xl shadow-xl mx-2 flex-1">
                    <img
                        key={current}
                        src={images[current]}
                        alt={`Slide ${current + 1}`}
                        className="w-full h-auto object-contain transition-transform duration-500 ease-in-out transform scale-100 hover:scale-105"
                    />
                </div>

                {/* Next Button */}
                <button
                    onClick={next}
                    className="bg-white/70 backdrop-blur-md hover:bg-white/90 text-gray-800 p-2 rounded-full shadow transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    aria-label="Next"
                >
                    <ChevronRightIcon className="w-6 h-6" />
                </button>
            </div>

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