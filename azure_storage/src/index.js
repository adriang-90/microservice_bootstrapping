// Loads the azure_storage package to interact with API
const express = require("express")
const azure = require('azure-storage');

const app = express();

const PORT = process.env.PORT;
// Gets the name of storage account from env variable
const STORAGE_ACCESS_NAME = process.env.STORAGE_ACCOUNT_NAME;
// Gets the name of access key from env variable
const STORAGE_ACCESS_KEY = process.env.STORAGE_ACCESS_KEY;

// Helper function that connects to azure_storage API
function createBlobService() {
    const blobService = azure.createBlobService(STORAGE_ACCESS_NAME,
        STORAGE_ACCESS_KEY);
        return blobService;
}

// HTTP Get route for retrieving a video from azure_storage
app.get("/video", (req, res) => {
    // Specify the path to the video in storage as HTTP query parameter
    const videoPath = req.query.path;
    // Connects to the azure_storage API
    const blobService = createBlobService();
    // Hard-coded container name
    const containerName = "videos";
    // Retrieve the video's properties from azure_storage
    blobService.getBlobProperties(containerName, videoPath,
         (err, properties) => {
             if (err) {
                 // ... error handling ...
                 res.sendStatus(500);
                 return;
             }
             // Writes content length and mime type to the HTTP response headers
             res.writeHead(200, {
                 "Content-Length": properties.contentLength,
                 "Content-Type": "video/mp4",
             });
             // Streams the video from azure_storage
             blobService.getBlobToStream(containerName,
                videoPath, res, err => {
                    if (err) {
                        //... error handling ...
                        res.sendStatus(500);
                        return;
                    }
                });
         });
});

app.listen(PORT, () => {
    console.log('Microservice online');
});
