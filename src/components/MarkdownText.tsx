"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import styles from "./MarkdownText.module.css";

export default function MarkdownText({ content }: { content: string }) {
	return (
		<div className={styles.markdown}>
			<ReactMarkdown
				remarkPlugins={[remarkGfm, remarkBreaks]}
				rehypePlugins={[rehypeHighlight]}
			>
				{content}
			</ReactMarkdown>
		</div>
	);
}
