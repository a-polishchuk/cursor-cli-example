export const NO_IMAGE_FOUND = 'NO_IMAGE_FOUND';

export async function findImageUrl(fact) {
    const imagesResponse = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(fact)}&prop=images&format=json`);
    const imagesData = await imagesResponse.json();
    const pages = imagesData.query.pages;
    const pageId = Object.keys(pages)[0];
    const images = pages[pageId].images;
    if (images.length === 0) {
        return NO_IMAGE_FOUND;
    }

    const imageInfoResponse = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(images[0].title)}&prop=imageinfo&iiprop=url&format=json`);
    const imageInfoData = await imageInfoResponse.json();
    const imagePages = imageInfoData.query.pages;
    const imagePageId = Object.keys(imagePages)[0];
    const url = imagePages[imagePageId].imageinfo[0].url;

    return url;
}