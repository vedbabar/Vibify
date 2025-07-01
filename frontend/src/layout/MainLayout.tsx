import { Outlet } from 'react-router-dom';
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup
} from "@/components/ui/resizable";
import LeftSidebar from './components/LeftSidebar';
import FriendsActivity from './components/FriendsActivity';
import AudioPlayer from './components/AudioPlayer';
import { PlaybackControls } from './components/PlaybackControls';
import { useAISidebarStore } from '@/stores/useAISidebarStore';
import AISidebar from "../pages/home/components/AISidebar";
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

const MainLayout = () => {
	const isMobile = false;
	const isAISidebarOpen = useAISidebarStore((state) => state.isOpen);
	const openAISidebar = useAISidebarStore((state) => state.open);
	const closeAISidebar = useAISidebarStore((state) => state.close);

	return (
		<div className='h-screen bg-black text-white flex flex-col relative overflow-hidden'>

			{/* 🌟 Animated Floating AI Button */}
			<AnimatePresence>
			{!isAISidebarOpen && (
				<motion.button
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.9 }}
					transition={{ duration: 0.2 }}
					onClick={openAISidebar}
					className='cursor-pointer fixed top-13 right-4 z-[1100] flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm text-xs'
				>
					<Sparkles className='w-3.5 h-3.5 animate-pulse' />
					<span className='font-medium'>Find Songs with AI</span>
				</motion.button>
			)}
			</AnimatePresence>


			{/* Layout */}
			<ResizablePanelGroup direction='horizontal' className='flex-1 flex h-full overflow-hidden p-2'>
				<AudioPlayer />

				{/* Left Sidebar */}
				<ResizablePanel defaultSize={20} minSize={isMobile ? 0 : 10} maxSize={30}>
					<LeftSidebar />
				</ResizablePanel>

				<ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />

				{/* Main Content */}
				<ResizablePanel defaultSize={isMobile ? 80 : 60}>
					<Outlet />
				</ResizablePanel>

				<ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />

				{/* Right Sidebar */}
				<ResizablePanel defaultSize={20} minSize={0} maxSize={25} collapsedSize={0}>
					<FriendsActivity />
				</ResizablePanel>
			</ResizablePanelGroup>

			{/* AI Sidebar Overlay */}
			<AISidebar isOpen={isAISidebarOpen} onClose={closeAISidebar} />

			<PlaybackControls />
		</div>
	);
};

export default MainLayout;
