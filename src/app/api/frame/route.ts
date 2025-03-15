import { NextRequest, NextResponse } from 'next/server';
import { getFrameMessage, FrameRequest } from '@farcaster/core';
import { fetchRandomMeme, voteMeme, getMeme } from '@/services/memeService';

export async function POST(req: NextRequest) {
  try {
    const body: FrameRequest = await req.json();
    
    // Validate the frame message
    const { isValid, message } = await getFrameMessage(body);
    
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid frame message' }, { status: 400 });
    }

    const currentMemeId = message.frameData?.memeId;
    const buttonIndex = message.button;
    let nextMeme;
    let showResults = false;

    if (currentMemeId && buttonIndex !== 3) { // If not skip action
      // Handle vote actions
      if (buttonIndex === 1) {
        await voteMeme(currentMemeId, 'funny');
      } else if (buttonIndex === 2) {
        await voteMeme(currentMemeId, 'notFunny');
      }
      
      // Get updated meme data to show results
      const votedMeme = await getMeme(currentMemeId);
      nextMeme = votedMeme;
      showResults = true;
    } else {
      // Get new meme for skip action or initial load
      nextMeme = await fetchRandomMeme();
    }

    // Return the next frame
    return NextResponse.json({
      frames: {
        version: 'vNext',
        image: nextMeme.url,
        buttons: [
          {
            label: 'Funny 😂',
            action: 'post'
          },
          {
            label: 'Not Funny 😐',
            action: 'post'
          },
          {
            label: 'Skip ⏭️',
            action: 'post'
          }
        ],
        frameData: {
          memeId: nextMeme.id,
          createdAt: nextMeme.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Frame error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 