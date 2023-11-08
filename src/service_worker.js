// //Extract YouTube tags from API result snippet (We can also get the Video Title here):

// //Determine which Youtube tag is most relevant (Possibly by matching with Video Title)

// //Load Queries from Saved Search Preferences (or use defaults)
// //By filling place holder characters with the string of the most relevant tag

// //Send Queries to Chatgpt through their API

// //Update Pop Up fields with the results of the query (possibly offer a search bar if 
// //the app determines that an error occured)



// TODO need to store the videoId in all cases. Right now only on next video/page visit
// need to also save when tab is revisited when left playing
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
        chrome.storage.sync.set({ videoId }, function() {
            console.log("Video ID has been stored.");
        });
      }
    }
  });
export {}
