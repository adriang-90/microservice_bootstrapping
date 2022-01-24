const express = require("express");
const azure = require('azure-storage');

const app = express();

const PORT = process.env.PORT;
const STORAGE_ACCOUNT_NAME = process.env.STORAGE_ACCOUNT_NAME;
const STORAGE_ACCESS_KEY = process.env.STORAGE_ACCESS_KEY;

// Helper function that connects to the azure-storage API
function createBlobService() {
  const blobService = azure.createBlobService(STORAGE_ACCOUNT_NAME, 
                      STORAGE_ACCESS_KEY);
  return blobService;
}

app.get("/video", (req, res) => {
  
  const videoPath = req.query.path;
  const blobService = createBlobService();
  const containerName = "videos";
  blobService.getBlobProperties(containerName, videoPath, (err, properties) => {
    if (err) {
      // ... error handling ...
      res.sendStatus(500);
      return;
    }

    res.writeHead(200, {
      "Content-Length": properties.contentLength,
      "Content-Type": "video/mp4",
    });

    blobService.getBlobToStream(containerName, videoPath, res, err => {
      if (err) {
        res.sendStatus(500);
        return;
      }
    });
  });
});

app.listen(PORT, () => {
  console.log('Microservice online');
});
// Loads the azure_storage package to interact with API
const express = require("express")
const azure = require('aws-s3');

const app = express();

//Throws an error if any of the required environment variables is missing.
if (!process.env.PORT) {
    throw new Error("Please specify the port number for the HTTP server with the environment variable PORT.");
}

if (!process.env.STORAGE_ACCOUNT_NAME) {
    throw new Error("Please specify the name of an Azure storage account in environment variable STORAGE_ACCOUNT_NAME.");
}

if (!process.env.STORAGE_ACCESS_KEY) {
    throw new Error("Please specify the access key to an Azure storage account in environment variable STORAGE_ACCESS_KEY.");
}

// Extracts environment variables to globals
const PORT = process.env.PORT;
const STORAGE_ACCOUNT_NAME = process.env.STORAGE_ACCOUNT_NAME;
const STORAGE_ACCESS_KEY = process.env.STORAGE_ACCESS_KEY;

console.log(`Serving videos from Azure storage account ${STORAGE_ACCOUNT_NAME}.`);


// Creates the Blob service API to communicate with Azure Storage.
function createBlobService() {
    const blobService = azure.createBlobService(STORAGE_ACCOUNT_NAME,
        STORAGE_ACCESS_KEY);
        return blobService;
}

// HTTP Get route for retrieving a video from azure_storage
app.get("/video", (req, res) => {
    // Specify the path to the video in storage as HTTP query parameter
    const videoPath = req.query.path;
    console.log(`Streaming video from path ${videoPath}.`);
    // Connects to the azure_storage API
    const blobService = createBlobService();
    // Hard-coded container name
    const containerName = "videos";
    // Retrieve the video's properties from azure_storage
    blobService.getBlobProperties(containerName, videoPath, (err, properties) => {
             if (err) {
                 // ... error handling ...
                 console.error(`Error occurred getting properties for video ${containerName}/${videoPath}.`);
                 console.error(err && err.stack || err);
                 res.sendStatus(500);
                 return;
             }
             // Writes HTTP headers to the response.
             res.writeHead(200, {
                 "Content-Length": properties.contentLength,
                 "Content-Type": "video/mp4",
             });
             // Streams the video from azure_storage
             blobService.getBlobToStream(containerName, videoPath, res, err => {
                    if (err) {
                        console.error(`Error occurred getting video ${containerName}/${videoPath} to stream.`);
                        console.error(err && err.stack || err);
                        res.sendStatus(500);
                        return;
                    }
                });
         });
});

app.listen(PORT, () => {
    console.log('Microservice online');
});

