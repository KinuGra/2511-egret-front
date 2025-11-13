import MarkdownText from "@/components/MarkdownText";
import styles from "./SnippetCard.module.css";
import { Snippet } from "@/types/snippet";

export default function SnippetCard({ title, content }: Snippet) {
	return (
		<>
			<div className={styles.container}>
				<div className={styles.card}>
					{title ? <div className={styles.title}>{title}</div> : null}
					<MarkdownText content={content} />
				</div>
			</div>
		</>
	);
}
