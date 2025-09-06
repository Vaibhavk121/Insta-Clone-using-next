const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://Vaibhav123:Vaibhav123@mycluster.z4vvm.mongodb.net/NextApp?retryWrites=true&w=majority&appName=MyCLuster";

const videoSchema = new mongoose.Schema({
    title: String,
    description: String,
    videoUrl: String,
    thumbnailUrl: String,
    userId: String,
    controls: { type: Boolean, default: true },
    transformation: {
        height: { type: Number, default: 1920 },
        width: { type: Number, default: 1080 },
        quality: Number
    }
}, { timestamps: true });

const Video = mongoose.model('Video', videoSchema);

async function cleanupBlobVideos() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to database');

        const allVideos = await Video.find({});

        console.log(`Found ${allVideos.length} videos in database`);

        if (allVideos.length > 0) {
            const result = await Video.deleteMany({});

            console.log(`Deleted ${result.deletedCount} videos`)

            console.log(`Deleted ${result.deletedCount} videos with blob URLs`);
        }
        const remainingVideos = await Video.find({});
        console.log(`${remainingVideos.length} videos remaining in database`);

        await mongoose.disconnect();
        console.log('Cleanup complete');
    } catch (error) {
        console.error('Error during cleanup:', error);
    }
}

cleanupBlobVideos();