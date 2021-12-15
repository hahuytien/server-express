const express = require('express'); // Adding Express
const app = express(); // Initializing Express
// const puppeteer = require('puppeteer'); // Adding Puppeteer
const chromium = require('chrome-aws-lambda');
const PCR = require("puppeteer-chromium-resolver");
const delay = require('delay');
const axios = require('axios');
const { convert } = require('html-to-text');

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

            const context = browser.defaultBrowserContext();
            context.overridePermissions("https://www.facebook.com", ["geolocation", "notifications"]);

            await delay(2000);
            const page = await browser.newPage();
            await page.goto('https://www.facebook.com/', { waitUntil: 'networkidle0' });

            await page.setExtraHTTPHeaders({
                'Accept-Language': 'es-US'
            })

            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36');
            await page.setJavaScriptEnabled(true);

            const screenshotBuffer = await page.screenshot();

            // Respond with the image
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': screenshotBuffer.length
            });
            res.end(screenshotBuffer);

            await browser.close();

        });






        // const browser = await puppeteer.launch(
        //     {
        //         headless: true,
        //         args: ["--no-sandbox", "--disable-setuid-sandbox"]
        //     }
        // );

        // const page = await browser.newPage();
        // await page.goto("https://www.facebook.com/");

        // const screenshotBuffer = await page.screenshot();

        // // Respond with the image
        // res.writeHead(200, {
        //     'Content-Type': 'image/png',
        //     'Content-Length': screenshotBuffer.length
        // });
        // res.end(screenshotBuffer);

        // await browser.close();
    })()
        .catch(err => res.sendStatus(500));
});


module.exports = app;