
/*
// 1. Send a message to the service worker requesting the user's data
chrome.runtime.sendMessage('get-user-data', (response) => {
    // 3. Got an asynchronous response with the data from the service worker
    console.log('received user data', response);
    //initializeUI(response);
  });
  */

chrome.runtime.onStartup.sendMessage('authenticate YT API', (response) => {
    console.log('received user data', response);
    //initializeUI(response);
  });


chrome.tabs.onUpdated.sendMessage('use YT API', (response) => {
    console.log('received YT API response', response);
    //initializeUI(response);
  });

export {}
