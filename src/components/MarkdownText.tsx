"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import styles from "./MarkdownText.module.css";

import type { Components } from "react-markdown";

interface MarkdownTextProps {
	content: string;
	components?: Components;
	className?: string;
}

export default function MarkdownText({
	content,
	components,
	className,
}: MarkdownTextProps) {
	return (
		<div className={`${styles.markdown} ${className || ""}`}>
			<ReactMarkdown
				remarkPlugins={[remarkGfm, remarkBreaks]}
				rehypePlugins={[rehypeHighlight]}
				components={components}
			>
				{content}
			</ReactMarkdown>
		</div>
	);
}
