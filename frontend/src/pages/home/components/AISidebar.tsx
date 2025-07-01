import { useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { Search, X, Play, Sparkles, Music, ExternalLink, Heart } from "lucide-react";

interface Video {
	videoId: string;
	title: string;
	thumbnail: string;
	channel: string;
}

const AISidebar = ({
	isOpen,
	onClose,
  }: {
	isOpen: boolean;
	onClose: () => void;
  }) => {
	const [prompt, setPrompt] = useState("");
	const [video, setVideo] = useState<Video | null>(null);
	const [loading, setLoading] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
  
	const handleSearch = async () => {
	  if (!prompt.trim()) return;
  
	  setLoading(true);
	  setIsPlaying(false); // Reset playing state when searching
	  try {
		const res = await axiosInstance.post("/ai-search", { prompt });
		setVideo(res.data);
	  } catch (err) {
		console.error("AI search error:", err);
		setVideo(null);
	  } finally {
		setLoading(false);
	  }
	};
  
	const handlePlay = () => {
	  setIsPlaying(true);
	};
  
	const handleKeyPress = (e: React.KeyboardEvent) => {
	  if (e.key === 'Enter') {
		handleSearch();
	  }
	};
  
	return (
	  <div
		className={`fixed top-0 right-0 w-96 h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl z-50 transform transition-all duration-500 ease-out ${
		  isOpen ? "translate-x-0" : "translate-x-full"
		}`}
	  >
		{/* Custom styles */}
		<style dangerouslySetInnerHTML={{
		  __html: `
			.scrollbar-custom::-webkit-scrollbar {
			  width: 6px;
			}
			.scrollbar-custom::-webkit-scrollbar-track {
			  background: rgba(71, 85, 105, 0.1);
			  border-radius: 3px;
			}
			.scrollbar-custom::-webkit-scrollbar-thumb {
			  background: linear-gradient(45deg, #6366f1, #8b5cf6);
			  border-radius: 3px;
			}
			.scrollbar-custom::-webkit-scrollbar-thumb:hover {
			  background: linear-gradient(45deg, #4f46e5, #7c3aed);
			}
			.glass-morphism {
			  backdrop-filter: blur(16px);
			  background: rgba(30, 41, 59, 0.7);
			  border: 1px solid rgba(148, 163, 184, 0.1);
			}
			.animate-pulse-soft {
			  animation: pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
			}
			@keyframes pulse-soft {
			  0%, 100% { opacity: 1; }
			  50% { opacity: 0.8; }
			}
			.animate-fade-in {
			  animation: fadeIn 0.6s ease-out forwards;
			}
			@keyframes fadeIn {
			  from {
				opacity: 0;
				transform: translateY(20px);
			  }
			  to {
				opacity: 1;
				transform: translateY(0);
			  }
			}
		  `
		}} />
  
		{/* Header */}
		<div className="relative overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-r bg-zinc-800 via-bg-zinc-800 to-bg-zinc-800 opacity-90"></div>
			<div className="relative p-5">
			  <div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
				  <div className="relative">
				  <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-md">
					<img
						src="https://cdn-icons-png.flaticon.com/512/9973/9973495.png" 
						alt="AI"
						className="w-full h-full object-cover"
					/>
					</div>
					<div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
				  </div>
				  <div>
					<h2 className="text-2xl font-bold text-white tracking-tight">AI Music Finder</h2>
				  </div>
				</div>
				<button 
				  onClick={onClose} 
				  className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-md flex items-center justify-center transition-all duration-200 hover:scale-110 hover:rotate-90 group"
				>
				  <X className="cursor-pointer w-8 h-8 bg-gray-800 text-white rounded-md" />
				</button>
			  </div>
			</div>
		  </div>
	
  
		{/* Content */}
		<div className="h-full overflow-y-auto scrollbar-custom pb-20">
		  <div className="p-6 space-y-6">
			{/* Search Section */}
			<div className="space-y-4">
			  <div className="relative group">
				<div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-xl opacity-20 group-focus-within:opacity-40 transition-opacity duration-300"></div>
				<div className="relative glass-morphism rounded-2xl p-1">
				  <div className="flex items-center">
					<div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
					  <Search className="w-5 h-5 text-indigo-400 group-focus-within:text-indigo-300 transition-colors duration-200" />
					</div>
					<input
					  type="text"
					  className="flex-1 bg-transparent text-white px-2 py-3 outline-none placeholder-slate-400 text-sm font-medium"
					  placeholder="Describe the song you're looking for..."
					  value={prompt}
					  onChange={(e) => setPrompt(e.target.value)}
					  onKeyPress={handleKeyPress}
					/>
				  </div>
				</div>
			  </div>
  
			  <button
				onClick={handleSearch}
				disabled={loading || !prompt.trim()}
				className="cursor-pointer w-full relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 flex items-center justify-center gap-3 shadow-lg hover:shadow-purple-500/25 group"
			  >
				<div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
				{loading ? (
				  <>
					<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
					<span>Searching...</span>
				  </>
				) : (
				  <>
					<Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
					<span>Find Music</span>
				  </>
				)}
			  </button>
			</div>
  
			{/* Results Section */}
			{video && (
			  <div className="space-y-6 animate-fade-in">
				<div className="flex items-center gap-3 text-emerald-400 text-sm font-semibold">
				  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
				  <Music className="w-4 h-4" />
				  <span>Perfect Match Found</span>
				</div>
				
				<div className="glass-morphism rounded-3xl overflow-hidden hover:scale-[1.02] transition-all duration-500 group shadow-2xl">
				  {/* Video/Thumbnail Container */}
				  <div className="relative overflow-hidden">
					{isPlaying ? (
					  // YouTube Player
					  <div className="relative">
						<iframe
						  width="100%"
						  height="208"
						  src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`}
						  title="YouTube video player"
						  allowFullScreen
						  className="w-full"
						  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						/>
						<div className="absolute top-3 right-3 glass-morphism rounded-full px-3 py-1 text-xs font-medium text-white opacity-90 flex items-center gap-1">
						  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
						  Now Playing
						</div>
					  </div>
					) : (
					  // Thumbnail with Play Overlay
					  <>
						<img
						  src={video.thumbnail}
						  alt={video.title}
						  className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-110"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
						<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
						  <div className="transform scale-75 group-hover:scale-100 transition-transform duration-300">
							<button 
							  onClick={handlePlay}
							  className="w-16 h-16 bg-white text-slate-900 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors duration-200 shadow-2xl hover:shadow-white/25"
							>
							  <Play className="w-7 h-7 ml-1" fill="currentColor" />
							</button>
						  </div>
						</div>
					  </>
					)}
					
					{/* AI Match Badge */}
					{!isPlaying && (
					  <div className="absolute top-4 right-4 glass-morphism rounded-full px-3 py-1 text-xs font-medium text-white opacity-90">
						AI Match
					  </div>
					)}
				  </div>
				  
				  {/* Song Details */}
				  <div className="p-6 space-y-4">
					<div className="space-y-2">
					  <h3 className="text-white font-bold text-xl leading-tight line-clamp-2 group-hover:text-indigo-300 transition-colors duration-300">
						{video.title}
					  </h3>
					  <div className="flex items-center gap-2 text-slate-300 text-sm">
						<div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
						  <Music className="w-3 h-3 text-white" />
						</div>
						<span className="font-medium">{video.channel}</span>
					  </div>
					</div>
				  </div>
				</div>
			  </div>
			)}
  
			{/* Empty State */}
			{!video && !loading && (
			  <div className="flex flex-col items-center justify-center py-20 px-6">
				<div className="relative mb-8">
				  <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl">
					<Music className="w-12 h-12 text-white" />
				  </div>
				  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-pink-400 to-red-400 rounded-full flex items-center justify-center">
					<Sparkles className="w-4 h-4 text-white" />
				  </div>
				</div>
				<div className="text-center space-y-4 max-w-sm">
				  <h3 className="text-2xl font-bold text-white">Discover Your Sound</h3>
				  <p className="text-slate-400 leading-relaxed">
					Describe any song in your mind and watch our AI work its magic to find the perfect match
				  </p>
				  <div className="flex items-center justify-center gap-2 text-indigo-400 text-sm font-medium pt-4">
					<div className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse"></div>
					<span>AI-powered music discovery</span>
					<div className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse"></div>
				  </div>
				</div>
			  </div>
			)}
		  </div>
		</div>
	  </div>
	);
  };
  
  export default AISidebar;