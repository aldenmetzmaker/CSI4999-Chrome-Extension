// import { gapi } from 'gapi-script';

chrome.runtime.onInstalled.addListener(() => {
    console.log('Chrome extension successfully installed!');
    return;
  });
// //Video ID Extraction Component

// function extractVideoIdAndValidate(url) {
//     const youtubeUrlPattern = /^https:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)$/;
//     const match = url.match(youtubeUrlPattern);

//     if (match) {
//         // Valid YouTube URL, return ID
//         return match[1];
//     } else {
//         // Invalid url, return null
//         return null;
//     }
// }

// const url = "https://www.youtube.com/watch?v=VNmdw9ZNr1I";
// const videoId = extractVideoIdAndValidate(url);
// console.log("url1", url);
// if (videoId) {
//     console.log("Valid YouTube URL. Video ID: " + videoId);
// } else {
//     console.log("Invalid YouTube URL.");
// }

// const url2 = "https://www.nopeeee.com/watch?v=aySX3E9txVw";
// const videoId2 = extractVideoIdAndValidate(url2);
// console.log("url2", url2);

// if (videoId2) {
//     console.log("Valid YouTube URL. Video ID: " + videoId);
// } else {
//     console.log("Invalid YouTube URL.");
// }


// //API Search Component

// function authenticate() {
//     return gapi.auth2.getAuthInstance()
//         .signIn({scope: "https://www.googleapis.com/auth/youtube.readonly"})
//         .then(function() { console.log("Sign-in successful"); },
//               function(err) { console.error("Error signing in", err); });
//   }

//   //Authenticate our request with our API key
//   function loadClient() {
//     gapi.client.setApiKey("AIzaSyCudj37bf7-uNT8tYA1GscfijHf-dRlfs4");
//     return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
//         .then(function() { console.log("GAPI client loaded for API"); },
//               function(err) { console.error("Error loading GAPI client for API", err); });
//   }

//     // Make sure the client is loaded and sign-in is complete before calling this method.
//     function execute() {
//         return gapi.client.youtube.videos.list({
//           "part": [
//             "snippet"
//           ],
//           "id": [
//             videoId
//           ]
//         })
//         .then(function(response) {
//             // Handle the results here (response.result has the parsed body).
//             console.log("Response", response);
//           },
//           function(err) { console.error("Execute error", err); });
// }
// gapi.load("client:auth2", function() {
// gapi.auth2.init({client_id: "512767973123-mi2m0u98008nuukrofge6di7oqtjtumg.apps.googleusercontent.com"});
// });

//End of API Search Component

//Extract YouTube tags from API result snippet (We can also get the Video Title here):

//Determine which Youtube tag is most relevant (Possibly by matching with Video Title)

//Load Queries from Saved Search Preferences (or use defaults)
//By filling place holder characters with the string of the most relevant tag

//Send Queries to Chatgpt through their API

//Update Pop Up fields with the results of the query (possibly offer a search bar if 
//the app determines that an error occured)

export { }
