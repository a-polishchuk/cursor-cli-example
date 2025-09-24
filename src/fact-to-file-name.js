export function factToFileName(fact) {
    const fileName = fact
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, ' ')
        .split(' ')
        .filter(Boolean)
        .slice(0, 6)
        .join('-');
    return `output/${fileName}`;
}