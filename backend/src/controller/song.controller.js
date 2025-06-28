import {Song} from '../models/song.model.js';
import axios from "axios";

export const getAllSongs = async (req, res, next) => {
    try {
        const songs = await Song.find().sort({ createdAt: -1 });
        res.status(200).json(songs);
    } catch (error) {
        console.error("Error fetching songs:", error);
        next(error);
    }
}

export const getFeaturedSongs = async (req, res, next) => { 
    try {
        const songs = await Song.aggregate([
            { $sample: { size: 6 } },
            { $project:{
                _id: 1,
                title: 1,
                artist: 1,
                imageUrl: 1,
                audioUrl: 1,
            }
             },
            { $limit: 10 }
        ]);
        res.json(songs);
    } catch (error) {
        console.error("Error fetching featured songs:", error);
        next(error);
    }
}

export const getMadeForYouSongs = async (req, res, next) => {
    try {
        const songs = await Song.aggregate([
            { $sample: { size: 4 } },
            { $project:{
                _id: 1,
                title: 1,
                artist: 1,
                imageUrl: 1,
                audioUrl: 1,
            }
             },
            { $limit: 10 }
        ]);
        res.json(songs);
    } catch (error) {
        console.error("Error fetching featured songs:", error);
        next(error);
    }
}

export const getTrendingSongs = async (req, res, next) => {
	try {
		const songs = await Song.aggregate([
			{
				$sample: { size: 4 },
			},
			{
				$project: {
					_id: 1,
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);

		res.json(songs);
	} catch (error) {
		next(error);
	}
};


export const searchSongs = async (req, res, next) => {
	try {
		const query = req.query.q;

		if (!query || query.trim() === "") {
			return res.status(400).json({ error: "Search query is required" });
		}

		const songs = await Song.find({
			$or: [
				{ title: { $regex: query, $options: "i" } },
				{ artist: { $regex: query, $options: "i" } }
			]
		}).limit(10); // you can increase or remove the limit

		res.status(200).json(songs);
	} catch (error) {
		console.error("Error searching songs:", error.message);
		next(error); // pass to error middleware
	}
};