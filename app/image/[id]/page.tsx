import Carousel from "../Carousel";

interface Params {
    id: string;
}

export default async function Page({ params }: { params: Params }) {
    const { id } = await params;

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/image/${id}`,
        { cache: "no-store" }
    );

    if (!res.ok) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-4xl font-bold text-red-600 mb-4">404</h1>
                <p className="text-gray-700 mb-4">Image record not found</p>
            </div>
        );
    }

    const data = await res.json();

    // Extract the Base64 images from the document
    const images = data.photos.map((p: any) => p.imageBase64);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Carousel images={images} />
        </div>
    );
}
