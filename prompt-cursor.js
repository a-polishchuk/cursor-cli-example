export async function promptCursor(prompt) {
    const command = `timeout 40 cursor-agent --force --print --output-format text -p "${prompt}"`;
    const { exec } = await import('child_process');

    const llmResponse = await new Promise((resolve, reject) => {
        const child = exec(command, {}, (error, stdout, stderr) => {
            if (error) {
                if (error.code === 124) {
                    resolve(stdout.trim());
                }
                return reject(error);
            }
            if (stderr) {
                console.error('Stderr:', stderr);
            }
            resolve(stdout.trim());
        });
        child.stdin.end();
    });

    return llmResponse;
}