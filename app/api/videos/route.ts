import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        console.log("Connecting to database...");
        await connectToDatabase();
        console.log("Database connected, fetching videos...");

        const videos = await Video.find({}).sort({ createdAt: -1 }).limit(20);
        console.log(`Found ${videos.length} videos in database`);

        if (videos.length === 0) {
            console.log("No videos found, returning mock data");
            const mockVideos = [
                {
                    _id: "mock1",
                    title: "Welcome to Instagram Clone",
                    description: "This is a sample post to show how the app works! 🎉",
                    videoUrl: "https://media.istockphoto.com/id/1171483712/video/comic-pussycat-moves-in-blue-environment-in-stylish-rhythm.mp4?s=mp4-640x640-is&k=20&c=4-3TdwOHQR-_IvZu6kggD6BTDfwesXrrKPXjhx63XeA=",
                    thumbnailUrl: "https://via.placeholder.com/640x360/4F46E5/FFFFFF?text=Welcome+Video",
                    userId: "demo",
                    userEmail: "demo@example.com",
                    createdAt: new Date()
                },
                {
                    _id: "mock2",
                    title: "Another Sample Post",
                    description: "Upload your own videos to see them here! 📱",
                    videoUrl: "https://media.istockphoto.com/id/2158898087/video/feeding-problem-in-animals.mp4?s=mp4-640x640-is&k=20&c=msBmySpCDJJrTDkh5zEmI2zM63wFG2ekzy6XyR2LVoM=",
                    thumbnailUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPFbhM_EmP1dZZfwNBcT3-3S0PC-HLXaJ_zg&s",
                    userId: "demo",
                    userEmail: "demo@example.com",
                    createdAt: new Date(Date.now() - 86400000)
                }
            ];
            return NextResponse.json(mockVideos);
        }

        console.log("Returning real videos:", videos);
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
            userEmail: session.user?.email || 'user@example.com',
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

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const videoId = searchParams.get('id');

        if (!videoId) {
            return NextResponse.json(
                { error: "Video ID is required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const video = await Video.findById(videoId);

        if (!video) {
            return NextResponse.json(
                { error: "Video not found" },
                { status: 404 }
            );
        }

        if (video.userEmail !== session.user?.email) {
            return NextResponse.json(
                { error: "You can only delete your own videos" },
                { status: 403 }
            );
        }

        await Video.findByIdAndDelete(videoId);

        return NextResponse.json(
            { message: "Video deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting video:", error);
        return NextResponse.json(
            { error: "Failed to delete video" },
            { status: 500 }
        );
    }
}