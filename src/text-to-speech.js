import gTTS from 'gtts';

export function generateTTS(text, outputPath = 'fact.mp3') {
    return new Promise((resolve, reject) => {
        const gtts = new gTTS(text, 'en');
        gtts.save(outputPath, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}