import { db } from '../lib/firebase';
import {
	collection,
	doc,
	setDoc,
	getDoc,
	updateDoc,
	query,
	orderBy,
	limit,
	getDocs,
} from 'firebase/firestore';

interface RedditMemeResponse {
	postLink: string;
	subreddit: string;
	title: string;
	url: string;
	nsfw: boolean;
	spoiler: boolean;
	author: string;
	ups: number;
	preview: string[];
}

interface Meme {
	id: string;
	url: string;
	title: string;
	votes: {
		funny: number;
		notFunny: number;
	};
	createdAt: number; // Unix timestamp
	updatedAt: number; // Unix timestamp
}

async function isImageAvailable(url: string): Promise<boolean> {
	try {
		const response = await fetch(url, { method: 'HEAD' });
		return response.ok;
	} catch {
		return false;
	}
}

export async function fetchRandomMeme(): Promise<Meme> {
	let validMeme = false;
	let data: RedditMemeResponse;

	while (!validMeme) {
		try {
			const response = await fetch(
				'https://meme-api.com/gimme'
			);
			data = await response.json();

			// Skip NSFW or spoiler content
			if (data.nsfw || data.spoiler) {
				continue;
			}

			// Validate if image is accessible
			const imageExists = await isImageAvailable(data.url);
			if (!imageExists) {
				continue;
			}

			validMeme = true;
		} catch (error) {
			console.error('Error fetching meme:', error);
			// If there's an error, wait a bit before retrying
			await new Promise(resolve => setTimeout(resolve, 1000));
		}
	}

	// Extract just the post ID from the postLink URL
	const postId = data!.postLink.split('/').pop()!;

	// Check if meme exists in Firebase
	const memeRef = doc(db, 'memes', postId);
	const memeDoc = await getDoc(memeRef);

	if (!memeDoc.exists()) {
		// Initialize new meme in Firebase with timestamp
		await setDoc(memeRef, {
			id: postId,
			url: data!.url,
			title: data!.title,
			votes: {
				funny: 0,
				notFunny: 0,
			},
			createdAt: Date.now(), // Add creation timestamp
		});
	}

	return {
		id: postId,
		url: data!.url,
		title: data!.title,
		votes: memeDoc.exists()
			? memeDoc.data().votes
			: { funny: 0, notFunny: 0 },
		createdAt: memeDoc.exists()
			? memeDoc.data().createdAt
			: Date.now(),
		updatedAt: memeDoc.exists()
			? memeDoc.data().updatedAt
			: Date.now(),
	};
}

export async function voteMeme(
	memeId: string,
	vote: 'funny' | 'notFunny'
): Promise<void> {
	const memeRef = doc(db, 'memes', memeId);
	const memeDoc = await getDoc(memeRef);

	if (memeDoc.exists()) {
		const currentVotes = memeDoc.data().votes;
		await updateDoc(memeRef, {
			[`votes.${vote}`]: currentVotes[vote] + 1,
			updatedAt: Date.now(), // Update the timestamp when voted
		});
	}
}

export async function getTopMemes(): Promise<Meme[]> {
	const memesRef = collection(db, 'memes');
	const q = query(memesRef, orderBy('votes.funny', 'desc'), limit(10));
	const querySnapshot = await getDocs(q);

	return querySnapshot.docs.map(doc => doc.data() as Meme);
}

export async function getMeme(memeId: string): Promise<Meme> {
	const memeRef = doc(db, 'memes', memeId);
	const memeDoc = await getDoc(memeRef);

	if (!memeDoc.exists()) {
		throw new Error('Meme not found');
	}

	return memeDoc.data() as Meme;
}
