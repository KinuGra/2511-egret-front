import MarkdownText from "@/components/MarkdownText";
import styles from "./SnippetCard.module.css";
import { Snippet } from "@/types/snippet";

type Props = Snippet & { scoreFromAWS?: number | null };

export default function SnippetCard({ title, content, scoreFromAWS }: Props) {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.card}>
          {typeof scoreFromAWS === "number" ? (
            <div className={styles.badge}>{Math.round(scoreFromAWS)} pt</div>
          ) : null}
          {title ? <div className={styles.title}>{title}</div> : null}
          <MarkdownText content={content} />
        </div>
      </div>
    </>
  );
}
