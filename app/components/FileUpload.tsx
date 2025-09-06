"use client";
import React, { useState } from "react";
import { IKUpload, ImageKitProvider } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";

interface FileuploadProps {
    onSuccess: (res: IKUploadResponse) => void;
    onProgress: (progress: number) => void;
    fileType?: "image" | "video"
}

export default function Fileupload({
    onSuccess,
    onProgress,
    fileType = "video"
}: FileuploadProps) {

    const [uploading, setUploading] = React.useState(false);
    const [error, setError] = useState<string | null>(null);

    const onError = (err: { message: string }) => {
        console.log("Error", err);
        setError(err.message);
        setUploading(false);
    };

    const handleSuccess = (res: IKUploadResponse) => {
        console.log("Success", res);
        setUploading(false);
        setError(null);
        onSuccess(res);
    };
    
    const handleProgress = (evt: ProgressEvent) => {
        if (evt.lengthComputable && onProgress) {
            const percentComplete = (evt.loaded / evt.total) * 100;
            onProgress(Math.round(percentComplete));
        }
    };

    const handleStartUpload = () => {
        setUploading(true);
        setError(null);
    };

    const validateFile = (file: File) => {
        if (fileType === "video") {
            if (!file.type.startsWith("video/")) {
                setError("Only video files are allowed");
                return false;
            }
            if (file.size > 1024 * 1024 * 100) {
                setError("Video size should be less than 100MB");
                return false;
            }
        } else {
            const validTypes = ["image/jpeg", "image/png", "image/webp"];
            if (!validTypes.includes(file.type)) {
                setError("Only JPEG, PNG and WebP images are allowed");
                return false;
            }
            if (file.size > 1024 * 1024 * 5) {
                setError("Image size should be less than 5MB");
                return false;
            }
        }
        return true;
    };

    const authenticator = async () => {
        try {
            console.log('Fetching authentication parameters...');
            const response = await fetch('/api/imagekit-auth');
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Auth endpoint error:', response.status, errorText);
                throw new Error(`Failed to get authentication parameters: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Authentication parameters received:', data);
            return data;
        } catch (error) {
            console.error('Authentication error:', error);
            setError('Failed to authenticate with ImageKit. Please try again.');
            throw error;
        }
    };

    return (
        <ImageKitProvider
            publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!}
            urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!}
            authenticator={authenticator}
        >
            <div className="space-y-2">
                <IKUpload
                    fileName={fileType === "video" ? "video-file" : "image-file"}
                    useUniqueFileName={true}
                    validateFile={validateFile}
                    onError={onError}
                    onSuccess={handleSuccess}
                    onUploadProgress={handleProgress}
                    onUploadStart={handleStartUpload}
                    folder={fileType === "video" ? "/videos" : "/images"}
                    responseFields={["name", "path", "url", "thumbnailUrl"]}
                    isPrivateFile={false}
                />
                {uploading && (
                    <div className="flex items-center justify-center w-full h-full">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                        <span className="ml-2 text-sm text-gray-600">Uploading...</span>
                    </div>
                )}
                {error && (
                    <div className="text-red-500 text-sm">
                        {error}
                    </div>
                )}
            </div>
        </ImageKitProvider>
    );
}