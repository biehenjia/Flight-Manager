// Firebase client initializer for Vite (dynamic imports, safe if SDK missing)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let _auth = null;
let _db = null;
let _initialized = false;

export async function initFirebase() {
  if (_initialized) return { auth: _auth, db: _db };
  if (!firebaseConfig.apiKey) {
    _initialized = true;
    return { auth: null, db: null };
  }

  try {
    const { initializeApp, getApps } = await import("firebase/app");
    const { getAuth } = await import("firebase/auth");
    const { getFirestore } = await import("firebase/firestore");

    const apps = getApps();
    if (!apps.length) {
      initializeApp(firebaseConfig);
    } else if (!apps[0]?.options?.apiKey && firebaseConfig.apiKey) {
      initializeApp(firebaseConfig);
    }

    _auth = getAuth();
    _db = getFirestore();
  } catch (err) {
    _auth = null;
    _db = null;
  }

  _initialized = true;
  return { auth: _auth, db: _db };
}

export function isFirebaseConfigured() {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
}

export function getAuthInstance() {
  if (!_initialized) throw new Error("Call initFirebase() before getAuthInstance()");
  return _auth;
}

export function getDbInstance() {
  if (!_initialized) throw new Error("Call initFirebase() before getDbInstance()");
  return _db;
}

// Authentication helpers
export async function signInWithGoogle() {
  const { auth } = await initFirebase();
  if (!auth) throw new Error('Firebase auth not available')
  const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth')
  const provider = new GoogleAuthProvider()
  return signInWithPopup(auth, provider)
}

export async function signOutUser() {
  const { auth } = await initFirebase();
  if (!auth) return
  const { signOut } = await import('firebase/auth')
  return signOut(auth)
}

export async function onAuthStateChangedListener(cb) {
  const { auth } = await initFirebase();
  if (!auth) return () => {}
  const { onAuthStateChanged } = await import('firebase/auth')
  return onAuthStateChanged(auth, cb)
}

// Firestore bookmark helpers (per-user under `users/{uid}/bookmarks/{id}`)
export async function saveBookmarkForUser(uid, id, bookmark) {
  if (!uid) throw new Error('uid required')
  const { db } = await initFirebase()
  if (!db) throw new Error('Firestore not available')
  const { doc, setDoc, serverTimestamp } = await import('firebase/firestore')
  const ref = doc(db, 'users', uid, 'bookmarks', id)
  await setDoc(ref, { ...bookmark, updatedAt: serverTimestamp() })
}

export async function getBookmarksForUser(uid) {
  if (!uid) return []
  const { db } = await initFirebase()
  if (!db) return []
  const { collection, getDocs } = await import('firebase/firestore')
  const col = collection(db, 'users', uid, 'bookmarks')
  const snap = await getDocs(col)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function removeBookmarkForUser(uid, id) {
  if (!uid) throw new Error('uid required')
  const { db } = await initFirebase()
  if (!db) throw new Error('Firestore not available')
  const { doc, deleteDoc } = await import('firebase/firestore')
  const ref = doc(db, 'users', uid, 'bookmarks', id)
  await deleteDoc(ref)
}
