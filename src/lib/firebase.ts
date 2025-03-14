// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyDxjoUev9lB_0QQBA2X9s1uFKkGG95es9k',
	authDomain: 'farcaster-meme.firebaseapp.com',
	projectId: 'farcaster-meme',
	storageBucket: 'farcaster-meme.firebasestorage.app',
	messagingSenderId: '838958265539',
	appId: '1:838958265539:web:58b6b8516dad4ade7d1e76',
	measurementId: 'G-MNCGRY2PYC',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
