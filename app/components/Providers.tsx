"use client";
import { ImageKitProvider } from "imagekitio-next";
import { SessionProvider } from "next-auth/react";


const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;



export default function Providers({ children }: { children: React.ReactNode }) {

    const authenticator = async () => {
        try {
            const response = await fetch("/api/imagekit-auth");

            if (!response.ok) {
                const errortext = await response.text();
                throw new Error(errortext);
            }
            const data = await response.json();
            const { signature, expire, token } = data;
            return { signature, expire, token };

        } catch (err) {
            console.log(err);
            throw new Error("Authentication error: " + err);
        }
    }

    return (
        <SessionProvider>
            <ImageKitProvider
                urlEndpoint={urlEndpoint!}
                publicKey={publicKey!}
                authenticator={authenticator}
            >
                {children}
            </ImageKitProvider>
        </SessionProvider>
    )
}