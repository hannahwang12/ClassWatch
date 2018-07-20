-----------------------
DEPLOYMENT INSTRUCTIONS
-----------------------

ElasticBeanstalk (EB) takes a .zip file of the project in order to deploy. There is no automated way to do this, so we have to make it ourselves. This zipped folder is a full copy of the /uwclasswatch directory,
minus the /node_modules folders (there is one in the top level and one inside /client).

1. Copy in the new files

If you made changes to any of the React files, run "npm run build" inside of the /client directory. This will generate a new /build folder (and overwrite the previous one). Make sure any static assets (images) from
the verified.html/unverified.html pages are copied into the top level of the new /build folder. As of writing, this would only be the goose.jpg image used for the background. 

Inside uwclasswatch.zip, there is also a /client folder. Make sure everything in here has your edits by replacing them with your edited ones from outside the .zip folder. Most often, this is /src, /build, /extra, /public, and package.json. 

If you've made changes to server.js or scraper.js, replace the respective files inside of uwclasswatch.zip as well. Make sure the url variable in server.js is the URL of the EB instance. As well, make sure .ebextensions, .elasticbeanstalk, and .npmrc are all inside uwclasswatch.zip since EB needs these to run.


2. Upload to EB

Log into the AWS console. In the top right next to the username, set the region to "Central". (I think it's Ohio by default). In the top left, under Services, select "Elastic Beanstalk" under the heading "Compute". Select "uwclasswatch" (should be a big green box). In the center of the screen, click "Upload and Deploy", choose the uwclasswatch.zip file you made, and specify the new version label (probably the current version label + 0.1). Then deploy and wait. 