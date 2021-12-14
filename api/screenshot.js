const express = require('express'); // Adding Express
const app = express(); // Initializing Express
// const puppeteer = require('puppeteer'); // Adding Puppeteer
const chromium = require('chrome-aws-lambda');


// Wrapping the Puppeteer browser logic in a GET request
app.get('/', function (req, res) {

    try {
        browser = await chromium.puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });

        let page = await browser.newPage();

        await page.goto(event.url || 'https://example.com');

        result = await page.title();
    } catch (error) {
        return callback(error);
    } finally {
        if (browser !== null) {
            await browser.close();
        }
        res.json({
            status: 200,
            message: "Get data has successfully",
        });
    }

});


module.exports = app;