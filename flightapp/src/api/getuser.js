import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export async function getUser(uid) {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function writeUser(uid, data) {
  const ref = doc(db, 'users', uid);
  await setDoc(ref, data, { merge: true });
}