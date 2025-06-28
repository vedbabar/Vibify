import { Router } from "express";
import { getAllSongs,getMadeForYouSongs,getTrendingSongs,searchSongs } from "../controller/song.controller.js";
import { getFeaturedSongs } from "../controller/song.controller.js"; 
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";


const router = Router();

router.get("/", protectRoute, requireAdmin, getAllSongs);
router.get("/featured",getFeaturedSongs); 
router.get("/made-for-you",getMadeForYouSongs);
router.get("/trending", getTrendingSongs); 
router.get("/search",searchSongs)


export default router;