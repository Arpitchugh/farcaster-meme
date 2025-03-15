import Head from 'next/head';
import MemeVote from '@/app/components/MemeVote';

export default function Home() {
	return (
		<>
			<Head>
				<meta property='fc:frame' content='vNext' />
				<meta
					property='fc:frame:image'
					content='URL_to_current_meme'
				/>
				<meta
					property='fc:frame:button:1:action'
					content='post'
				/>
				<meta
					property='fc:frame:button:1'
					content='Funny 😂'
				/>
				<meta
					property='fc:frame:button:2:action'
					content='post'
				/>
				<meta
					property='fc:frame:button:2'
					content='Not Funny 😐'
				/>
				<meta
					property='fc:frame:button:3:action'
					content='post'
				/>
				<meta
					property='fc:frame:button:3'
					content='Skip ⏭️'
				/>
				<meta
					property='fc:frame:post_url'
					content='https://farcaster-meme.vercel.app/api/frame'
				/>
				<meta
					property='og:title'
					content='Meme Voter'
				/>
				<meta
					property='og:description'
					content='Vote on the funniest memes!'
				/>
				<meta
					property='og:image'
					content='URL_to_current_meme'
				/>
			</Head>
			<MemeVote />
		</>
	);
}
