import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        await connectToDatabase();
        const videos = await Video.find({}).sort({ createdAt: -1 }).limit(20);
        
        // If no videos exist, return some mock data for demonstration
        if (videos.length === 0) {
            const mockVideos = [
                {
                    _id: "mock1",
                    title: "Welcome to Instagram Clone",
                    description: "This is a sample post to show how the app works! 🎉",
                    videoUrl: "",
                    thumbnailUrl: "",
                    userId: "demo",
                    createdAt: new Date()
                },
                {
                    _id: "mock2", 
                    title: "Another Sample Post",
                    description: "Upload your own videos to see them here! 📱",
                    videoUrl: "",
                    thumbnailUrl: "",
                    userId: "demo",
                    createdAt: new Date(Date.now() - 86400000) // 1 day ago
                }
            ];
            return NextResponse.json(mockVideos);
        }
        
        return NextResponse.json(videos);
    } catch (error) {
        console.error("Error fetching videos:", error);
        return NextResponse.json(
            { error: "Failed to fetch videos" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { title, description, videoUrl, thumbnailUrl } = body;

        if (!title || !videoUrl) {
            return NextResponse.json(
                { error: "Title and video URL are required" },
                { status: 400 }
            );
        }

        await connectToDatabase();
        
        const video = new Video({
            title,
            description,
            videoUrl,
            thumbnailUrl,
            userId: session.user?.id,
            createdAt: new Date()
        });

        await video.save();
        
        return NextResponse.json(video, { status: 201 });
    } catch (error) {
        console.error("Error creating video:", error);
        return NextResponse.json(
            { error: "Failed to create video" },
            { status: 500 }
        );
    }
}