import Topbar from "@/components/Topbar";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useRef, useState } from "react";
import UsersList from "./components/UsersList";
import ChatHeader from "./components/ChatHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import MessageInput from "./components/MessageInput";

const formatTime = (date: string) => {
	return new Date(date).toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
};

const ChatPage = () => {
	const { user } = useUser();
	const { messages, selectedUser, fetchUsers, fetchMessages } = useChatStore();

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [showScrollToBottom, setShowScrollToBottom] = useState(false);

	useEffect(() => {
		if (user) fetchUsers();
	}, [fetchUsers, user]);

	useEffect(() => {
		if (selectedUser) fetchMessages(selectedUser.clerkId);
	}, [selectedUser, fetchMessages]);

	// Auto scroll to bottom on new messages
	useEffect(() => {
		if (messages.length > 0) {
			messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	// Toggle scroll-to-bottom button visibility
	useEffect(() => {
		const handleScroll = () => {
			if (!scrollContainerRef.current) return;

			const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
			const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
			setShowScrollToBottom(!isNearBottom);
		};

		const container = scrollContainerRef.current;
		if (container) container.addEventListener("scroll", handleScroll);

		return () => container?.removeEventListener("scroll", handleScroll);
	}, []);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<main className='h-full rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden relative'>
			<Topbar />

			<div className='grid lg:grid-cols-[300px_1fr] grid-cols-[80px_1fr] h-[calc(100vh-180px)]'>
				<UsersList />

				{/* chat message */}
				<div className='flex flex-col h-full relative'>
					{selectedUser ? (
						<>
							<ChatHeader />

							{/* Messages */}
							<ScrollArea className='h-[calc(100vh-340px)]'>
								<div className='p-4 space-y-4 overflow-auto' ref={scrollContainerRef}>
									{messages.map((message) => (
										<div
											key={message._id}
											className={`flex items-start gap-3 ${
												message.senderId === user?.id ? "flex-row-reverse" : ""
											}`}
										>
											<Avatar className='size-8'>
												<AvatarImage
													src={
														message.senderId === user?.id
															? user.imageUrl
															: selectedUser.imageUrl
													}
												/>
											</Avatar>

											<div
												className={`rounded-lg p-3 max-w-[70%]
												${message.senderId === user?.id ? "bg-blue-900" : "bg-zinc-800"}`}
											>
												<p className='text-sm'>{message.content}</p>
												<span className='text-xs text-zinc-300 mt-1 block'>
													{formatTime(message.createdAt)}
												</span>
											</div>
										</div>
									))}

									{/* bottom scroll marker */}
									<div ref={messagesEndRef} />
								</div>
							</ScrollArea>

							{/* Scroll to bottom button */}
							{showScrollToBottom && (
								<button
									onClick={scrollToBottom}
									className='absolute bottom-24 right-4 z-10 bg-emerald-500 hover:bg-emerald-600 text-black px-3 py-1 rounded-full text-sm shadow-md transition-all'
								>
									↓ Scroll to bottom
								</button>
							)}

							<MessageInput />
						</>
					) : (
						<NoConversationPlaceholder />
					)}
				</div>
			</div>
		</main>
	);
};
export default ChatPage;

const NoConversationPlaceholder = () => (
	<div className='flex flex-col items-center justify-center h-full space-y-6'>
		<img
			src='https://cdn-icons-png.flaticon.com/512/9973/9973495.png'
			alt='No Chat'
			className='size-16 animate-bounce'
		/>
		<div className='text-center'>
			<h3 className='text-zinc-300 text-lg font-medium mb-1'>No conversation selected</h3>
			<p className='text-zinc-500 text-sm'>Choose a friend to start chatting</p>
		</div>
	</div>
);
