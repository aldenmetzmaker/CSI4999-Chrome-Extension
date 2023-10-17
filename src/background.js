console.log('Hello Background');

function extractVideoIdAndValidate(url) {
    const youtubeUrlPattern = /^https:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)$/;
    const match = url.match(youtubeUrlPattern);

    if (match) {
        // Valid YouTube URL, return ID
        return match[1];
    } else {
        // Invalid url, return null
        return null;
    }
}

const url = "https://www.youtube.com/watch?v=VNmdw9ZNr1I";
const videoId = extractVideoIdAndValidate(url);
console.log("url1", url);
if (videoId) {
    console.log("Valid YouTube URL. Video ID: " + videoId);
} else {
    console.log("Invalid YouTube URL.");
}

const url2 = "https://www.nopeeee.com/watch?v=aySX3E9txVw";
const videoId2 = extractVideoIdAndValidate(url2);
console.log("url2", url2);

if (videoId2) {
    console.log("Valid YouTube URL. Video ID: " + videoId);
} else {
    console.log("Invalid YouTube URL.");
}



export { }
