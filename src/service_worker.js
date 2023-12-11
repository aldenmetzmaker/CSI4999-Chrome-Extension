const KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
// //Extract YouTube tags from API result snippet (We can also get the Video Title here):

// //Determine which Youtube tag is most relevant (Possibly by matching with Video Title)

// //Load Queries from Saved Search Preferences (or use defaults)
// //By filling place holder characters with the string of the most relevant tag

// //Send Queries to Chatgpt through their API

// //Update Pop Up fields with the results of the query (possibly offer a search bar if 
// //the app determines that an error occured)


// TODO need to store the videoId in all cases. Right now only on next video/page visit
// need to also save when tab is revisited when left playing


//Current Build
//var time = 0;
chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  if (details.url) {
    const url = new URL(details.url);
    const videoId = url.searchParams.get("v");
    if (videoId) {
      console.log("Video ID has changed to: " + videoId);
      chrome.storage.local.set({ videoId: videoId }).then(() => {
        console.log("Video ID has been stored.");
      });

      fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${KEY}`)
        .then(response => response.json())
        .then(data => {
          chrome.storage.local.set({ "apiResponse": data.items }).then(() => {
          console.log("Response has been stored.", data.items);
          });
          try {
          chrome.runtime.sendMessage({ data });
          }catch(err){
            console.error("error sending message: ", err);
          }
        })
        .then(keyTag => { 
          chrome.storage.local.get(["apiResponse"]).then((result) => {
            // only call tagalgo if tags exist
            if (result.apiResponse[0].snippet.tags){
              keyTag = tagAlgorithm(result.apiResponse[0].snippet.tags, result.apiResponse[0].snippet.title);
              console.log("Response from tagAlgorithm", keyTag);
              chrome.storage.local.set({ "keywords": keyTag});
              try {
                chrome.runtime.sendMessage({ keyTag });
                }catch(err){
                  console.error("error sending message: ", err);
                }
            }
            else {
              // need to add functionality for when no tags are present. video title, video description? something to put it the openai request
            }
          })
        })
        .catch(error => {
          console.error("Error fetching data:", error);
        });
    }
  }
});

// add video title to parameters
function tagAlgorithm(tagArray, title)
{
  //Eliminate common meta tags and make a new string without them or empty their spots in the current array

  //Use === to compare strings

  //Tags to look for:
  //Anime, Video Game, Movie, TV show

  //Tags to remove:
  //Trailer, Netflix,
  
  //Potentially remove tags that are smaller than 3 characters?

  //console.log("Array Size: ", tagArray.length);
  //console.log("Tag Array: ", tagArray);

  //Initialize the points value of each tag to zero

  let pointArray = [tagArray.length];

  for (var i = 0; i < tagArray.length; i++)
  {
    pointArray[i] = 0;
  }

  //Split each tag string into an array of word strings

  let wordArray = [tagArray.length];

  for (var i = 0; i < tagArray.length; i++)
  {
    wordArray[i] = tagArray[i].split(" ");
  }

  //Split title into an array of word strings

  let titleArray = title.split(" ");

  //Compare strings to videotitle to find matching words

  for (var i = 0; i < tagArray.length; i++)
  {
    for (var j = 0; j < wordArray[i].length; j++)
    {
      for (var k = 0; k < titleArray.length; k++)
      {
        if (wordArray[i][j] === titleArray[k])
        {
          pointArray[i] = pointArray[i] + 1;
        }
      }
    }
  }

  //Compare strings with eachother to find repeating words

  for (var i = 0; i < tagArray.length; i++)
  {
    //console.log("Iteration: ", wordArray[i]);
    for (var j = tagArray.length - i - 1; j > 0; j--)
    {
      var flag = 0;
      for (var k = 0; k < wordArray[i].length; k++)
      {
        for (var l = 0; l < wordArray[j].length; l++)
        {
          if (i != j)
          {
            if (wordArray[i][k] === wordArray[j][l] && flag < 2)
            {
              if (wordArray[i].length > wordArray[j].length)
              {
                pointArray[i] = pointArray[i] + 1;
              }
              else
              {
                pointArray[j] = pointArray[j] + 1;
              }
            flag = flag + 1;
            }
          }
        }
        flag = 0;
      }
    }
  }

  //Give points to the first few tags and last few strings.

  if (tagArray.length > 5)
  {
    pointArray[0] = pointArray[0] + 3;
    pointArray[1] = pointArray[1] + 2;
    pointArray[2] = pointArray[2] + 1;
    pointArray[tagArray.length - 1] = pointArray[tagArray.length - 1] + 1;
    pointArray[tagArray.length - 2] = pointArray[tagArray.length - 2] + 1;
    pointArray[tagArray.length - 3] = pointArray[tagArray.length - 3] + 1;
  }

  //Evaluate the results and create a return list

  //console.log("Points Array: ", pointArray);

  var firstPlace = 0;
  var firstPosition = 0;
  var secondPlace = 0;
  var secondPosition = 0;
  var thirdPlace = 0;
  var thirdPosition = 0;
  let returnArray = [3];

  if (tagArray.length > 2)
  {
    for (var i = 0; i < tagArray.length; i++)
    {
      if (pointArray[i] > firstPlace)
      {
        thirdPlace = secondPlace;
        thirdPosition = secondPosition;
        secondPlace = firstPlace;
        secondPosition = firstPosition;
        firstPlace = pointArray[i];
        firstPosition = i;
      }
      else if (pointArray[i] <= firstPlace && pointArray[i] > secondPlace)
      {
        thirdPlace = secondPlace;
        thirdPosition = secondPosition;
        secondPlace = pointArray[i];
        secondPosition = i;
      }
      else if (pointArray[i] <= secondPlace && pointArray[i] > thirdPlace)
      {
        thirdPlace = pointArray[i];
        thirdPosition = i;
      }
    }
    returnArray[0] = tagArray[firstPosition];
    returnArray[1] = tagArray[secondPosition];
    returnArray[2] = tagArray[thirdPosition];
  }
  else if (tagArray.length = 2)
  {
    if (pointArray[0] > pointArray[1])
    {
      firstPlace = 0;
      secondPlace = 1;
    }
    else
    {
      firstPlace = 1;
      secondPlace = 0;
    }
    returnArray[0] = tagArray[firstPlace];
    returnArray[1] = tagArray[secondPlace];
    returnArray[2] = "empty";
  }
  else
  {
    returnArray[0] = tagArray[0];
    returnArray[1] = "empty";
    returnArray[2] = "empty";
  }

  //return value
  return returnArray;
}

export { }