// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
	measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only on client side and if not already initialized
let app;
let db: Firestore;
let storage: FirebaseStorage;

if (typeof window !== 'undefined') {
	try {
		app = initializeApp(firebaseConfig);
		db = getFirestore(app);
		storage = getStorage(app);
	} catch (error) {
		console.error('Firebase initialization error:', error);
	}
}

export { db, storage };

// Helper function to get public URL
export const getStorageUrl = (path: string) => {
	return `https://firebasestorage.googleapis.com/v0/b/${
		process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
	}/o/${encodeURIComponent(path)}?alt=media`;
};
