import { generateVideo } from './generate-video.js';
import { generateTTS } from './text-to-speech.js';
import { factToFileName, OUTPUT_DIR } from './fact-to-file-name.js';
import { promptCursor } from './prompt-cursor.js';
import fs from 'fs';

(async function () {
    console.log('🔍 fetching fact...');
    const dateString = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    const fact = await promptCursor(`Give me one interesting historical fact happened on ${dateString}. Fit it to one sentence.`);
    if (!fact) {
        console.log('‼️ no fact found');
        return;
    }
    console.log('🔍 done:', fact);

    if (!fs.existsSync(`./${OUTPUT_DIR}`)) {
        fs.mkdirSync(`./${OUTPUT_DIR}`);
        console.log('🗃️ created output directory');
    }

    console.log('🎤 generating text-to-speech audio track...');
    const fileName = factToFileName(fact);
    await generateTTS(fact, `${fileName}.mp3`);
    console.log('🎤 done');

    console.log('🎥 generating tiktok video...');
    await generateVideo(fact, fileName);
})()
    .then(() => console.log('🏁 Done!'))
    .catch((err) => console.error(err?.message));

