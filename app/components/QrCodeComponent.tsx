"use client";

import { useState, useRef, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "react-toastify";

const QrCodeComponent = () => {
    // Create a persistent sessionId
    if (typeof window !== "undefined") {
        if (!localStorage.getItem("sessionId")) {
            localStorage.setItem("sessionId", crypto.randomUUID());
        }
    }

    const [files, setFiles] = useState<File[]>([]);
    const [qrValue, setQrValue] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [qrSize, setQrSize] = useState(300);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const qrRef = useRef<HTMLCanvasElement | null>(null);

    // Responsive QR size based on container width
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const width = containerRef.current.offsetWidth;
                setQrSize(Math.min(width, 400));
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Handle multiple file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files || []);
        setFiles(selected);
        setQrValue(null);
    };

    // Upload multiple images
    const handleUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!files.length) {
            toast.error("Please select at least one image!");
            return;
        }

        try {
            setIsLoading(true);

            const sessionId = localStorage.getItem("sessionId");
            const formData = new FormData();

            // payload to send to the server
            files.forEach((file) => formData.append("images", file));
            formData.append("sessionId", sessionId!);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            console.log(data.message);
            if (response.ok && data.id) {

                toast.success(data.message);

                // This URL will be encoded inside the QR code
                const qrURL = `${process.env.NEXT_PUBLIC_BASE_URL}/image/${data.id}`;
                setQrValue(qrURL);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.error(err);
            toast.error("Error uploading images.");
        } finally {
            setIsLoading(false);
        }
    };

    // Download QR code as PNG
    const handleDownloadQR = () => {
        if (!qrRef.current) return;

        const pngUrl = qrRef.current
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");

        const link = document.createElement("a");
        link.href = pngUrl;
        link.download = "qrcode.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
            <div
                ref={containerRef}
                className="w-full max-w-md md:max-w-2xl bg-white shadow-2xl rounded-2xl p-6 md:p-12"
            >
                <h1 className="text-2xl md:text-4xl font-bold text-center mb-6 text-gray-800">
                    Generatore di QR Code
                </h1>

                <div className="mb-6 text-gray-600 text-sm md:text-base">
                    <p className="font-semibold text-gray-700">Istruzioni:</p>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Caricare una o più immagini</li>
                        <li>Generare il QR Code</li>
                        <li>Condividere il QR per mostrare la galleria</li>
                    </ol>
                </div>

                {/* FILE INPUT (multiple images allowed) */}
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="mb-4 w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition cursor-pointer"
                />

                {/* UPLOAD BUTTON */}
                <button
                    onClick={handleUpload}
                    disabled={!files.length || isLoading}
                    className="w-full px-6 py-3 mb-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition text-lg cursor-pointer"
                >
                    {isLoading ? "Caricamento..." : "Generare QR Code"}
                </button>

                {/* QR CODE RESULT */}
                <div className="mt-6 flex flex-col items-center w-full">
                    {qrValue && (
                        <>
                            <QRCodeCanvas
                                value={qrValue}
                                size={qrSize}
                                ref={qrRef}
                                includeMargin
                                className="mb-4 shadow-lg rounded-lg bg-white p-2 w-full max-w-full"
                            />

                            <button
                                onClick={handleDownloadQR}
                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-lg transition cursor-pointer"
                            >
                                Scarica QR Code
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QrCodeComponent;
