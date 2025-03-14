'use client';
import { useState } from 'react';

export default function Poll() {
	const [vote, setVote] = useState<string | null>(null);

	const handleVote = (option: string) => {
		setVote(option);
		// Implement logic to handle the vote, e.g., send to a server
	};

	return (
		<div className='flex flex-col items-center gap-2'>
			<h1 className='mt-2'>Which is your favorite color?</h1>
			<div className='flex items-center gap-2'>
				<button
					onClick={() => handleVote('Green')}
					className='border border-green-500 py-1 px-2.5 rounded-3xl cursor-pointer'
				>
					Green
				</button>
				<button
					onClick={() => handleVote('Purple')}
					className='border border-purple-500 py-1 px-2.5 rounded-3xl cursor-pointer'
				>
					Purple
				</button>
			</div>
			{vote && <p>You voted for: {vote}</p>}
		</div>
	);
}
