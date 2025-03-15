'use client';
import { useState, useEffect } from 'react';
import { fetchRandomMeme, voteMeme } from '@/services/memeService';

interface MemeState {
	id: string;
	url: string;
	title: string;

	votes: {
		funny: number;
		notFunny: number;
	};
	createdAt: number;
	updatedAt: number;
}

export default function MemeVote() {
	const [meme, setMeme] = useState<MemeState | null>(null);
	const [loading, setLoading] = useState(true);
	const [voted, setVoted] = useState(false);

	const loadNewMeme = async () => {
		setLoading(true);
		try {
			const newMeme = await fetchRandomMeme();
			setMeme(newMeme);
			setVoted(false);

			// Update frame metadata
			if (typeof window !== 'undefined') {
				const frameImage = document.querySelector(
					'meta[property="fc:frame:image"]'
				);
				const ogImage = document.querySelector(
					'meta[property="og:image"]'
				);

				if (frameImage) {
					frameImage.setAttribute(
						'content',
						newMeme.url
					);
				}
				if (ogImage) {
					ogImage.setAttribute(
						'content',
						newMeme.url
					);
				}
			}
		} catch (error) {
			console.error('Error loading meme:', error);
		}
		setLoading(false);
	};

	useEffect(() => {
		loadNewMeme();
	}, []);

	const handleVote = async (voteType: 'funny' | 'notFunny') => {
		if (!meme || voted) return;

		try {
			await voteMeme(meme.id, voteType);
			setVoted(true);
			// Load new meme after short delay to show vote confirmation
			setTimeout(loadNewMeme, 1500);
		} catch (error) {
			console.error('Error voting:', error);
		}
	};

	if (loading) {
		return (
			<div className='flex justify-center items-center h-screen'>
				Loading...
			</div>
		);
	}

	return (
		<div className='flex flex-col items-center gap-4 p-4 max-w-2xl mx-auto'>
			<h1 className='text-2xl font-bold'>Rate This Meme!</h1>

			{meme && (
				<div className='w-full'>
					<img
						src={meme.url}
						alt={meme.title}
						className='w-full h-auto rounded-lg shadow-lg'
					/>
					<p className='text-center mt-2 text-gray-600'>
						{meme.title}
					</p>
				</div>
			)}

			<div className='flex gap-4'>
				<button
					onClick={() => handleVote('funny')}
					disabled={voted}
					className={`px-6 py-2 rounded-full ${
						voted
							? 'bg-gray-300'
							: 'bg-green-500 hover:bg-green-600 cursor-pointer'
					} text-white transition-colors`}
				>
					Funny 😂
				</button>
				<button
					onClick={() => handleVote('notFunny')}
					disabled={voted}
					className={`px-6 py-2 rounded-full ${
						voted
							? 'bg-gray-300'
							: 'bg-red-500 hover:bg-red-600 cursor-pointer'
					} text-white transition-colors`}
				>
					Not Funny 😐
				</button>
				<button
					onClick={loadNewMeme}
					className='px-6 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors cursor-pointer'
				>
					Skip ⏭️
				</button>
			</div>

			{voted && (
				<p className='text-green-600'>
					Thanks for voting! Loading next meme...
				</p>
			)}
		</div>
	);
}
