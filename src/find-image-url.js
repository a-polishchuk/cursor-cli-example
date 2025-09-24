import axios from 'axios';

export async function findImageUrl(fact) {
    try {
        const imagesResponse = await axios.get(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(fact)}&prop=images&format=json`);
        const pages = imagesResponse.data.query.pages;
        const pageId = Object.keys(pages)[0];
        const images = pages[pageId].images;
        if (images.length === 0) {
            console.log('‼️ NO_IMAGE_FOUND');
            return;
        }

        const imageTitle = images[0].title;
        const imageInfoResponse = await axios.get(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(imageTitle)}&prop=imageinfo&iiprop=url&format=json`);
        const imagePages = imageInfoResponse.data.query.pages;
        const imagePageId = Object.keys(imagePages)[0];
        const url = imagePages[imagePageId].imageinfo[0].url;
        console.log(url);
    } catch (error) {
        console.error('Error:', error.message);
    }
}