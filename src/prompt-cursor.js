export async function promptCursor(prompt, model = 'gpt-5') {
    const command = `cursor-agent --print --output-format text --model "${model}" -p "${prompt}"`;
    const { exec } = await import('child_process');

    const llmResponse = await new Promise((resolve, reject) => {
        const child = exec(command, {}, (error, stdout, stderr) => {
            if (error) {
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

