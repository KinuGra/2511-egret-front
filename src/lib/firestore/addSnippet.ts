import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { Snippet } from "../../types/snippet";

export async function addSnippet(snippet: Snippet) {
  try {
    const docRef = await addDoc(collection(db, "snippets"), {
      title: snippet.title,
      content: snippet.content,
      snippetScore: snippet.snippetScore,
      createdAt: Timestamp.now(),
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
