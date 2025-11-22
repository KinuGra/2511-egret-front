"use client";

import { useEffect, useState } from "react";
import MarkdownText from "@/components/MarkdownText";

interface NotificationProps {
	title: string;
	content: string;
	snippetScore: number;
	onClose?: () => void;
}

export default function Notification({
	title,
	content,
	snippetScore,
	onClose,
}: NotificationProps) {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		// Trigger animation on mount
		setIsVisible(true);
		
		// Auto-close after 5 seconds (optional, but typical for notifications)
		const timer = setTimeout(() => {
			handleClose();
		}, 5000);

		return () => clearTimeout(timer);
	}, []);

	const handleClose = () => {
		setIsVisible(false);
		// Wait for animation to finish before calling onClose
		setTimeout(() => {
			onClose?.();
		}, 300);
	};

	return (
		<div
			className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ease-out ${
				isVisible ? "translate-y-0" : "-translate-y-full"
			}`}
		>
			<div className="bg-gray-200/60 backdrop-blur-md shadow-2xl rounded-b-2xl border-b border-white/40 py-4 px-2 md:py-6 md:px-4">
				{/* Label */}
				<div className="text-xs md:text-sm text-gray-600 font-semibold mb-2 px-2">
					他プレイヤーの投稿
				</div>
				
				{/* Main Content */}
				<div className="flex items-center gap-2 md:gap-6">
					{/* Title Area: 20% */}
					<div className="w-[20%] flex items-center justify-center border-r-2 border-gray-100 pr-2 md:pr-6">
						<h3 className="text-base md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 truncate w-full text-center">
							{title}
						</h3>
					</div>

					{/* Content Area: 60% */}
					<div className="w-[60%] flex items-center justify-start overflow-hidden">
						<div className="text-sm md:text-base lg:text-xl xl:text-2xl text-gray-700 line-clamp-3 whitespace-normal break-words w-full font-medium leading-snug">
							<MarkdownText
								content={content}
								components={{
									p: ({ node, ...props }) => <span {...props} className="mr-2" />,
									h1: ({ node, ...props }) => <span {...props} className="font-bold mr-2" />,
									h2: ({ node, ...props }) => <span {...props} className="font-bold mr-2" />,
									h3: ({ node, ...props }) => <span {...props} className="font-bold mr-2" />,
									ul: ({ node, ...props }) => <span {...props} className="mr-2" />,
									ol: ({ node, ...props }) => <span {...props} className="mr-2" />,
									li: ({ node, ...props }) => <span {...props} className="mr-2 after:content-[','] last:after:content-['']" />,
									pre: ({ node, ...props }) => <span {...props} className="mx-1" />,
									code: ({ node, ...props }) => (
										<span
											{...props}
											className="bg-gray-100 rounded px-1 py-0.5 font-mono text-[0.9em] text-blue-600"
										/>
									),
								}}
							/>
						</div>
					</div>

					{/* Score Area: 20% */}
					<div className="w-[20%] flex flex-col items-center justify-center border-l-2 border-gray-100 pl-2 md:pl-6">
						<span className=" text-[10px] md:text-xs lg:text-sm text-[crimson] font-bold uppercase tracking-widest">
							Score
						</span>
						<span className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-[crimson] leading-none tracking-tighter">
							{snippetScore}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}