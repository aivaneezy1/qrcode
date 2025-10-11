import React from "react";
import Link from "next/link";

interface Params {
    id: string;
}

const page = async ({ params }: { params: Promise<Params> }) => {
    const { id } = await params
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/image/${id}`;
    const res = await fetch(apiUrl);

    if (!res.ok) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4 text-center">
                <h1 className="text-6xl md:text-7xl font-extrabold text-red-600 mb-4 drop-shadow-lg">
                    404
                </h1>
                <p className="text-lg md:text-xl text-gray-700 mb-6">
                    L'immagine che stai cercando non esiste.
                </p>
                <Link href="/">
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition transform hover:scale-105">
                        Torna alla Home
                    </button>
                </Link>
            </div>
        );
    }

    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const contentType = res.headers.get("Content-Type") || "image/webp";
    const imageSrc = `data:${contentType};base64,${base64}`;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-2 py-6">
            <div className="w-full max-w-full sm:max-w-2xl bg-white shadow-2xl rounded-2xl overflow-hidden p-2 sm:p-6">
                <img
                    src={imageSrc}
                    alt="Loaded Image"
                    className="w-full h-auto object-contain rounded-lg"
                />
            </div>
        </div>
    );
};

export default page;
