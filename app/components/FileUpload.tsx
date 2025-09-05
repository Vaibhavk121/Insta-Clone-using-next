"use client";
import React, { useState } from "react";
import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";


interface FileuploadProps {
    onSuccess: (res: IKUploadResponse) => void;
    onProgress: (progress: number) => void;
    fileType?: "image" | "video"
}

export default function Fileupload({
    onSuccess,
    onProgress,
    fileType = "image"
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
            if (!file.type.startsWith("video")) {
                setError("Only videos are allowed");
                return false;
            }
            if (file.size > 1024 * 1024 * 100) {
                setError("Video size should be less than 100MB");
                return false;
            }
            else {
                const validTypes = ["image/jpeg", "image/png", "image/webp"]
                if (!validTypes.includes(file.type)) {
                    setError("Only jpeg, png and webp images are allowed");
                    return false;
                }
                if (file.size > 1024 * 1024 * 5) {
                    setError("Image size should be less than 5MB");
                    return false;
                }
            }
            return false;
        }

        return true;
    };

    return (
        <div className="space-y-2" >
            <IKUpload
                fileName={fileType === "video" ? "video-file" : "image-file"}
                useUniqueFileName={true}
                validateFile={validateFile}
                onError={onError}
                onSuccess={handleSuccess}
                onUploadProgress={handleProgress}
                onUploadStart={handleStartUpload}
                folder={fileType === "video" ? "/videos" : "/images"}
            />
            {
                uploading && (
                    <div className="flex items-center justify-center w-full h-full">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                )
            }
            {
                error && (
                    <div className="text-error">
                        {error}
                    </div>
                )
            }
        </div>
    )

}