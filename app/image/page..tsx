
import React from 'react';

import Link from "next/link";
const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-4">
            <h1 className="text-6xl font-bold text-red-500 mb-4">Immagine non trovata</h1>
            <p className="text-lg text-gray-700 mb-6">
                L'immagine che stai cercando non esiste.
            </p>
            {/*TORNA ALLA HOME PAGE */}
            <Link href="/">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer">
                    Torna alla Home
                </button>
            </Link>
        </div>
    );
};

export default NotFoundPage;
