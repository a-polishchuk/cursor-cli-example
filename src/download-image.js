import fs from 'fs';
import https from 'https';
import http from 'http';
import { URL } from 'url';

export function downloadImage(url, fileName) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(fileName);
        const protocol = new URL(url).protocol === 'https:' ? https : http;
        protocol.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => file.close(resolve));
        }).on('error', (err) => {
            fs.unlink(fileName, () => reject(err));
        });
    });
}
