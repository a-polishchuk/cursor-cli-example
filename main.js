import { generateVideo } from './src/generate-video.js';
import { downloadImage } from './src/download-image.js';
import { generateTTS } from './src/text-to-speech.js';
import { factToFileName } from './src/fact-to-file-name.js';
import { promptCursor } from './src/prompt-cursor.js';
import { findImageUrl } from './src/find-image-url.js';

(async function () {
    console.log('🔍 fetching fact');
    const fact = await promptCursor('Give me one interesting history fact about this day of the year. Just one sentence, nothing else.');
    console.log('🔍', fact);

    console.log('🖼️ finding image url');
    //     const imageUrl = await promptCursor(`
    // Find a Wikipedia image related to this historical fact: "${fact}". 
    // Instructions:
    // - Search Wikipedia for the main subject of the fact
    // - Return ONLY the direct URL to a JPG/PNG image from Wikipedia
    // - No explanations, just the URL`);

    const imageUrl = await findImageUrl(fact);
    console.log('🖼️', imageUrl);

    if (imageUrl === 'NO_IMAGE_FOUND') {
        console.log('🖼️ no image found, skipping video generation');
        return;
    }

    const fileName = factToFileName(fact);

    console.log('🖼️ downloading background image');
    await downloadImage(imageUrl, `${fileName}.jpg`);

    console.log('🎤 generating text-to-speech audio track');
    await generateTTS(fact, `${fileName}.mp3`);

    console.log('🎥 generating tiktok video');
    await generateVideo(fact, fileName);
})()
    .then(() => console.log('🏁 Done!'))
    .catch((err) => console.error(err?.message));

