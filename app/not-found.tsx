import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4">
            <h1 className="text-8xl font-extrabold text-red-600 mb-4 drop-shadow-lg">
                404
            </h1>
            <p className="text-2xl text-gray-700 mb-6 text-center">
                Ops! La pagina che stai cercando non esiste.
            </p>

            <Link href="/">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition transform hover:scale-105">
                    Torna alla Home
                </button>
            </Link>
        </div>
    );
}
