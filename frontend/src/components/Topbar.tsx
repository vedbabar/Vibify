import { Link } from 'react-router-dom';
import { UserButton, SignedOut} from '@clerk/clerk-react';
import SignInOAuthButtons from './SignInOAuthButtons';
import { LayoutDashboardIcon, Search, X } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/lib/utils';
import { buttonVariants } from './ui/button';
import { useState, useEffect, useRef } from 'react';
import { axiosInstance } from '@/lib/axios'; // Adjust the import path to match your file structure
import PlayButton from '@/pages/home/components/PlayButton';

// Define the Song interface based on your backend response
interface Song {
  _id: string;
  title: string;
  artist: string;
  imageUrl: string;
  audioUrl: string;
  duration: number;
  albumId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const Topbar = () => {
  const { isAdmin } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  console.log({ isAdmin });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      searchSongs(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Search function - using your existing axiosInstance
  const searchSongs = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      console.log('Searching for:', query); // Debug log
      
      const response = await axiosInstance.get(`/songs/search?q=${encodeURIComponent(query)}`);
      
      console.log('Search results:', response.data); // Debug log
      
      setSearchResults(response.data || []);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setShowResults(true); // Still show dropdown to display error state
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchSongs(searchQuery);
    }
  };

  // Handle song selection
  const handleSongSelect = (song: Song) => {
    // Add your logic here - play song, add to queue, navigate, etc.
    console.log('Selected song:', song);
    setShowResults(false);
    setSearchQuery('');
    
    // Example: Navigate to song or add to player
    // navigate(`/song/${song.id}`);
    // or dispatch to music player store
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    inputRef.current?.focus();
  };

  return (
    <div className='flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 backdrop-blur-md z-10'>
      <div className='flex gap-2 items-center'>
        <img src="https://cdn-icons-png.flaticon.com/512/9973/9973495.png" className='size-8' alt="Vibify"/>
        Vibify
      </div>

      {/* Search Bar */}
      <div className='flex-1 max-w-md mx-8 relative' ref={searchRef}>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4' />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for songs, artists, albums..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            onFocus={() => searchQuery && setShowResults(true)}
            className='w-full pl-10 pr-10 py-2 bg-zinc-800 border border-zinc-700 rounded-full 
                     text-white placeholder-gray-400 focus:outline-none focus:border-green-500 
                     focus:ring-1 focus:ring-green-500'
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white'
            >
              <X className='size-4' />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showResults && (
          <div className='absolute top-full left-0 right-0 mt-2 bg-zinc-800 border border-zinc-700 
                        rounded-lg shadow-lg max-h-96 overflow-y-auto z-50'>
            {isSearching ? (
              <div className='p-4 text-center text-gray-400'>
                Searching...
              </div>
            ) : searchResults.length > 0 ? (
              <div className='py-2'>
                {searchResults.map((song) => (

                  <div
                    key={song._id}
                    className='px-4 py-3 hover:bg-zinc-700 flex items-center gap-3 
                             transition-colors duration-200 group'
                  >
                    <img 
                      src={song.imageUrl} 
                      alt={song.title}
                      className='size-12 rounded object-cover'
                    />
                    <div className='flex-1 min-w-0 cursor-pointer' 
                         onClick={() => handleSongSelect(song)}>
                      <p className='text-white font-medium truncate'>{song.title}</p>
                      <p className='text-gray-400 text-sm truncate'>{song.artist}</p>
                      <p className='text-gray-500 text-xs truncate'>
                        {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                      </p>
                    </div>
                    <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                      <PlayButton song={song} />
                    </div>
                  </div>
                ))}
              </div>
            ) : searchQuery ? (
              <div className='p-4 text-center'>
                <p className='text-gray-400'>No songs found for "{searchQuery}"</p>
                {/* <p className='text-gray-500 text-xs mt-1'>Check console for debugging info</p> */}
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className='flex items-center gap-4'>
        {isAdmin && (
          <Link to={"/admin"} 
          className={cn(buttonVariants({ variant: "outline" }))}>
            <LayoutDashboardIcon className='size-4 mr-2' />
            Admin Dashboard
          </Link>
        )}
        <SignedOut>
          <SignInOAuthButtons />
        </SignedOut>
        <UserButton />
      </div>
    </div>
  );
};

export default Topbar;