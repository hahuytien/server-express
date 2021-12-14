const express = require("express");
const router = express.Router();
const puppeteer = require('puppeteer');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const delay = require('delay');
const axios = require('axios');
const { convert } = require('html-to-text');

/**
 * GET product list.
 *
 * @return product list | empty.
 */
router.get("/", async (req, res) => {
//   try {
    const browser = await puppeteer.launch(
        {
            headless: true,
            args: ['--no-sandbox']
        }
    );
    const context = browser.defaultBrowserContext();
    context.overridePermissions("https://www.facebook.com", ["geolocation", "notifications"]);

    await delay(2000);
    const page = await browser.newPage();
    await page.goto(req.query.url, { waitUntil: 'networkidle0' });
    await page.setExtraHTTPHeaders({
        'Accept-Language': 'es-US'
    })
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36');
    await page.setJavaScriptEnabled(true);

    // const screenshotBuffer = await page.screenshot();

    // // Respond with the image
    // res.writeHead(200, {
    //     'Content-Type': 'image/png',
    //     'Content-Length': screenshotBuffer.length
    // });
    // res.end(screenshotBuffer);

    // await delay(1000);
    // await browser.close();
    res.json({
        status: 200,
        message: "Get data has successfully",
      });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send("Server error23123123");
//   }
});

module.exports = router;