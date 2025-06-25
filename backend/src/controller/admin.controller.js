import {Song} from "../models/song.model.js";
import {Album} from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js";

const uploadToCloudinary = async (file) => {
    try{
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: "auto", // Automatically detect the resource type (image/audio)
        }
    )
    return result.secure_url; // Return the secure URL of the uploaded file);
    }
    catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        throw new Error("Failed to upload file to Cloudinary");
    }
}
export const createSong=async (req,res,next)=>{
    try {
        if(!req.files||!req.files.audioFile||!req.files.imageFile){
            return res.status(400).json({ message: "Audio file and image file are required" });
        }
        const {title,albumId,artist, duration} = req.body;
        const audioFile = req.files.audioFile;
        const imageFile = req.files.imageFile;

        const audioUrl = await uploadToCloudinary(audioFile);
        const imageUrl = await uploadToCloudinary(imageFile);
        const song=new Song({
            title,
            artist,
            album: albumId,
            imageUrl, // Assuming you are using a file upload middleware that saves the file and provides the path
            audioUrl, // Same as above
            duration, // Ensure duration is a number
            albumId:albumId||null
        });

        await song.save();
        if(albumId){
            await Album.findByIdAndUpdate(albumId, {
                $push: { songs: song._id }
            });
        }
        res.status(201).json(song)
    }
    catch (error) {
        console.error("Error creating song:", error);
        next(error);
    }
}

export const deleteSong = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Find the song by ID
        const song = await Song.findById(id);
        if(song.albumId) {
            await Album.findByIdAndUpdate(song.albumId, {
                $pull: { songs: song._id }
            });
        }
        await Song.findByIdAndDelete(id);
        res.status(200).json({ message: "Song deleted successfully" });
    } catch (error) {
        console.error("Error deleting song:", error);
        next(error);
    }
}

export const createAlbum = async (req, res, next) => {
    try {
        const { title, artist, releaseYear } = req.body;
        const { imageFile } = req.files;
        const imageUrl = await uploadToCloudinary(imageFile);

        const album = new Album({
            title,
            artist,
            imageUrl,
            releaseYear
        });

        await album.save();
        res.status(201).json(album);
    } catch (error) {
        console.error("Error creating album:", error);
        next(error);
    }
}

export const deleteAlbum = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Find the album by ID 
        // Delete all songs associated with the album
        await Song.deleteMany({ albumId: id });
        // Delete the album 
        await Album.findByIdAndDelete(id);
        res.status(200).json({ message: "Album deleted successfully" });    

    } catch (error) {
        console.error("Error deleting album:", error);
        next(error);
    }
}

export const checkAdmin = async (req, res, next) => {
    res.status(200).json({ isAdmin: true });
};