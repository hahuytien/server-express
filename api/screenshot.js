const express = require('express'); // Adding Express
const app = express(); // Initializing Express
// const puppeteer = require('puppeteer'); // Adding Puppeteer
const chromium = require('chrome-aws-lambda');
const PCR = require("puppeteer-chromium-resolver");

const option = {
    revision: "",
    detectionPath: "",
    folderName: ".chromium-browser-snapshots",
    defaultHosts: ["https://storage.googleapis.com", "https://npm.taobao.org/mirrors"],
    hosts: [],
    cacheRevisions: 2,
    retry: 3,
    silent: false
};


// Wrapping the Puppeteer browser logic in a GET request
app.get('/', function (req, res) {

    (async () => {
        // Launching the Puppeteer controlled headless browser and navigate to the Digimon website
        chromium.puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
            ignoreHTTPSErrors: true
        }).then(async function (browser) {
            const page = await browser.newPage();
            await page.goto('https://example.com/');

            // Targeting the DOM Nodes that contain the Digimon names
            // const digimonNames = await page.$$eval('#digiList tbody tr td:nth-child(2) a', function (digimons) {
            //     // Mapping each Digimon name to an array
            //     return digimons.map(function (digimon) {
            //         return digimon.innerText;
            //     });
            // });

            // Closing the Puppeteer controlled headless browser
            // await browser.close();

            // Sending the Digimon names to Postman
            // res.send(digimonNames);

            // await page.close()

            // res.json({
            //     status: 200,
            //     message: "Get data has successfully",
            // });
            const screenshotBuffer = await page.screenshot();

            // Respond with the image
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': screenshotBuffer.length
            });
            res.end(screenshotBuffer);

            await browser.close();

        });
    })()
        .catch(err => res.sendStatus(500));
});


module.exports = app;