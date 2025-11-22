import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

export async function getSnippet() {
  const q = query(collection(db, "snippets"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  const results: { id: string; data: any }[] = [];
  querySnapshot.forEach((doc) => {
    results.push({ id: doc.id, data: doc.data() });
  });
  return results;
}
