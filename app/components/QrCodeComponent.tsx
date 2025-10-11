"use client";

import { useState, useRef, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "react-toastify";

const QrCodeComponent = () => {
    const [file, setFile] = useState<File | null>(null);
    const [qrValue, setQrValue] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [qrSize, setQrSize] = useState(300); // default size

    const qrRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Dynamically calculate QR code size based on container width
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const width = containerRef.current.offsetWidth;
                setQrSize(Math.min(width, 400)); // max 400px
            }
        };

        handleResize(); // initial size
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files?.[0] || null);
        setQrValue(null);
        setImageUrl(null);
    };
    // upload file
    const handleUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!file) {
            toast.error("Please select an image first!");
            return;
        }

        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append("image", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok && data.imageUrl) {
                toast.success("Image uploaded successfully!");
                setImageUrl(data.imageUrl);
                setQrValue(data.imageUrl);
            } else {
                toast.error("Upload failed. Try again.");
            }
        } catch (err) {
            toast.error("Error uploading image.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadQR = () => {
        if (!qrRef.current) return;

        const canvas = qrRef.current;
        const pngUrl = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");

        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = "qrcode.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
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

                {/* Instructions */}
                <div className="mb-6 text-gray-600 text-sm md:text-base space-y-1 md:space-y-2">
                    <p className="font-semibold text-gray-700">Istruzioni:</p>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Caricare un'immagine da mettere nel QR Code</li>
                        <li>Scaricare il QR Code generato</li>
                    </ol>
                </div>

                {/* File Input */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mb-4 w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition cursor-pointer"
                />

                {/* Upload Button */}
                <button
                    onClick={handleUpload}
                    disabled={!file || isLoading}
                    className="w-full px-6 py-3 mb-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition text-lg cursor-pointer"
                >
                    {isLoading ? "Caricamento..." : "Generare QR Code"}
                </button>

                {/* QR Code */}
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
