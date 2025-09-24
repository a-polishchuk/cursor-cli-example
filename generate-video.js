import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

export async function generateVideo(text, fileName) {
    const audioPath = `${fileName}.mp3`;
    const audioDuration = await getAudioDuration(audioPath);
    const videoDuration = Math.max(audioDuration, 10);

    return new Promise((resolve, reject) => {
        ffmpeg()
            .input('./assets/bg.jpg')
            .inputOptions(['-loop 1'])
            .input(audioPath)
            .videoFilters([
                // Fit image inside 1080x1920, preserve aspect, pad to center
                "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920",

                // Ken Burns effect: zoom from 1.0 to 1.1 over DURATION seconds at 30 fps
                `zoompan=z='zoom+0.0007':d=${videoDuration * 30}:s=1080x1920`,

                `drawtext=fontfile=./fonts/SeymourOne-Regular.ttf:text='follow for more facts':fontcolor=white:fontsize=50:borderw=6:x=(w-text_w)/2:y=300`,

                `drawtext=fontfile=./fonts/CalSans-Regular.ttf:text='${wrapText(text).replace(/'/g, "\\'")}':fontcolor=gold:fontsize=70:borderw=8:x=(w-text_w)/2:y=(h-text_h)/2-100:box=1:boxcolor=black@0.5:boxborderw=40`,

                `drawtext=fontfile=./fonts/ComicRelief-Regular.ttf:text='check the description':fontcolor=white:fontsize=50:borderw=6:x=(w-text_w)/2:y=(h-text_h)/2+250`,
                `drawtext=fontfile=./fonts/ComicRelief-Regular.ttf:text='for more details':fontcolor=white:fontsize=50:borderw=6:x=(w-text_w)/2:y=(h-text_h)/2+300`
            ])
            // -t: Set video duration in seconds
            // -r 30: Set frame rate to 30 fps
            // -pix_fmt yuv420p: Use YUV420P pixel format for better compatibility
            .outputOptions(['-t', videoDuration, '-r 30', '-pix_fmt yuv420p'])
            .output(`${fileName}.mp4`)
            .on('end', () => resolve())
            .on('error', (err) => reject(err))
            .run();
    });
}

async function getAudioDuration(audioPath) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(audioPath, (err, metadata) => {
            if (err) reject(err);
            else resolve(metadata.format.duration);
        });
    });
}

function wrapText(text, maxLineLength = 28) {
    const words = text.split(' ');
    let lines = [];
    let currentLine = '';
    for (const word of words) {
        if ((currentLine + word).length > maxLineLength) {
            lines.push(currentLine.trim());
            currentLine = '';
        }
        currentLine += word + ' ';
    }
    if (currentLine) lines.push(currentLine.trim());
    return lines.join('\n');
}