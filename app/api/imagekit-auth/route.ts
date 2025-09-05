import ImageKit from "imagekit";
import { NextResponse } from "next/server";

const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!
});

export async function GET() {
    try {
        const authParameters = imagekit.getAuthenticationParameters();
        return NextResponse.json(authParameters);
    } catch (error) {
        console.error("ImageKit auth error:", error);
        return NextResponse.json(
            { error: "Something went wrong" }, 
            { status: 500 }
        );
    }
}