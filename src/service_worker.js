

//   function extractVideoIdAndValidate(url) {
//     const youtubeUrlPattern = /^https:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)$/;
//     const match = url.match(youtubeUrlPattern);

//     if (match) {
//       // Valid YouTube URL, return ID
//       return match[1];
//     } else {
//       // Invalid url, return null
//       return null;
//     }
//   }

//   const url = "https://www.youtube.com/watch?v=VNmdw9ZNr1I";
//   const videoId = extractVideoIdAndValidate(url);
//   console.log("url1", url);
//   if (videoId) {
//     console.log("Valid YouTube URL. Video ID: " + videoId);
//   } else {
//     console.log("Invalid YouTube URL.");
//   }

//   const url2 = "https://www.nopeeee.com/watch?v=aySX3E9txVw";
//   const videoId2 = extractVideoIdAndValidate(url2);
//   console.log("url2", url2);

//   if (videoId2) {
//     console.log("Valid YouTube URL. Video ID: " + videoId);
//   } else {
//     console.log("Invalid YouTube URL.");
//   }

// //Extract YouTube tags from API result snippet (We can also get the Video Title here):

// //Determine which Youtube tag is most relevant (Possibly by matching with Video Title)

// //Load Queries from Saved Search Preferences (or use defaults)
// //By filling place holder characters with the string of the most relevant tag

// //Send Queries to Chatgpt through their API

// //Update Pop Up fields with the results of the query (possibly offer a search bar if 
// //the app determines that an error occured)
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.requestCurrentURL) {
      // Use chrome.scripting.executeScript to get the current URL
      chrome.scripting.executeScript({
        target: {tabId: sender.tab.id},
        function: (url) => {
          return window.location.href;
        },
      }, (result) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          return;
        }
        
        const currentURL = result[0].result;
        console.log("Current URL: " + currentURL);
      });
    }
  });
  chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    if (details.url) {
      const url = new URL(details.url);
      const videoId = url.searchParams.get("v");
      if (videoId) {
        console.log("Video ID has changed to: " + videoId);
      }
    }
  });
export {}
