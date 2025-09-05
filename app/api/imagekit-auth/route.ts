import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";

export async function GET(request: NextRequest) {
    try {
        // Check if environment variables are present
        const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
        const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
        const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

        if (!publicKey || !privateKey || !urlEndpoint) {
            console.error("Missing ImageKit environment variables:", {
                publicKey: !!publicKey,
                privateKey: !!privateKey,
                urlEndpoint: !!urlEndpoint
            });
            return NextResponse.json(
                { error: "ImageKit configuration is incomplete" },
                { status: 500 }
            );
        }

        const imagekit = new ImageKit({
            publicKey,
            privateKey,
            urlEndpoint
        });

        const authenticationParameters = imagekit.getAuthenticationParameters();
        console.log("Generated auth parameters successfully");
        return NextResponse.json(authenticationParameters);
    } catch (error) {
        console.error("ImageKit auth error:", error);
        return NextResponse.json(
            { error: "Failed to generate authentication parameters" },
            { status: 500 }
        );
    }
}