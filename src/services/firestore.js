import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const USER_COLLECTION = "users";

export async function loadUserData(uid) {
  if (!uid) return null;
  try {
    const docRef = doc(db, USER_COLLECTION, uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.warn("Firestore read error, falling back to local storage:", error.message);
    return null;
  }
}

export async function saveUserData(uid, data) {
  if (!uid || !data) return;
  try {
    const docRef = doc(db, USER_COLLECTION, uid);
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    console.warn("Firestore write error:", error.message);
  }
}
