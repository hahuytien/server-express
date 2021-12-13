const puppeteer = require('puppeteer');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const delay = require('delay');
const axios = require('axios');
const { convert } = require('html-to-text');
const express = require('express');
const { Cluster } = require('puppeteer-cluster');
const { Worker, isMainThread } = require('worker_threads');
const product = require("./api/product");
const screenshop2 = require("./api/screenshot");

const app = express();
app.use(express.json({ extended: false }));

function getUrl(acountId) {
    return 'https://www.facebook.com/payments/risk/preauth/?ad_account_id=' + acountId + '&entrypoint=AYMTAdAccountUnrestrictLinkGenerator';
}

app.get('/screenshot', async (req, res) => {

    //    const acountIds = req.query.data.split(',');
    //    const browser = await puppeteer.launch({ headless: false });

    //     for (let i = 0; i < acountIds.length; i++) {
    //         const page = await browser.newPage();
    //         const url = getUrl(acountIds[i]);
    //         page.goto(`${url}`);

    //         // await page.waitForNavigation({ waitUntil: ['networkidle0'], timeout: 3000 });
    //         // page.waitForSelector('.l9j0dhe7.du4w35lb.j83agx80.pfnyh3mw.taijpn5t.bp9cbjyn.owycx6da.btwxx1t3.kt9q3ron.ak7q8e6j.isp2s0ed.ri5dt5u2.rt8b4zig.n8ej3o3l.agehan2d.sk4xxmp2.rq0escxv.d1544ag0.tw6a2znq.s1i5eluu.tv7at329').click();


    //         const listToken = await page.waitForSelector('#listToken');
    //         listToken.type(req.query.userName, { delay: 500 });

    //         const submit = await page.waitForSelector('#submit');
    //         submit.click();


    // await page.waitForTimeout(500);

    // if (listToken) {
    //     await listToken.type(req.query.userName, { delay: 10 });
    // }
    //   }

    const TARGET_URL = `https://2fa.live/tok/${req.query.sercet}`;
    const acountIds = req.query.data.split(',');

    const browser = await puppeteer.launch(
        {
            headless: false,
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

    // await gotoExtended(page, { url: TARGET_URL, method: 'GET' });
    const response = await axios.get(TARGET_URL);
    const text = convert(response.data.token);

    console.log(text);

    const inpEmail = await page.waitForSelector('#m_login_email');
    await page.waitForTimeout(500);

    if (inpEmail) {
        await inpEmail.type(req.query.userName, { delay: 10 });
    }

    const ipnPassword = await page.waitForSelector('input[name="pass"]');
    await page.waitForTimeout(450);
    if (ipnPassword) {
        await ipnPassword.type(req.query.passWord, { delay: 10 });
    }

    const btnLogin = await page.waitForSelector('input[name="login"]');
    if (btnLogin) {
        await btnLogin.click();
    }


    // await delay(5000);
    //await page.waitForNavigation({ waitUntil: ['networkidle0'] });
    //await delay(5000);
    // await page.screenshot({ path: 'testresult.png', fullPage: true });
    try {
        await page.waitForXPath('//*[contains(text(), "Ingresa tu número de celular")]', { timeout: 3000 })


        // Respond with the image
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': screenshotBuffer.length
        });
        res.end(screenshotBuffer);

    } catch (e0) {
        try {
            await page.waitForXPath('//*[contains(text(), "El número de celular o el correo electrónico que ingresaste no coinciden con ninguna cuenta")]', { timeout: 3000 })

            const screenshotBuffer = await page.screenshot();

            // Respond with the image
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': screenshotBuffer.length
            });
            res.end(screenshotBuffer);
        } catch (e) {
            console.log('element probably not exists');
            try {
                const approvalsCode = await page.waitForSelector('#approvals_code', { timeout: 3000 });
                if (approvalsCode) {
                    await approvalsCode.type(text, { delay: 10 });
                }
            } catch {
                const screenshotBuffer = await page.screenshot();

                // Respond with the image
                res.writeHead(200, {
                    'Content-Type': 'image/png',
                    'Content-Length': screenshotBuffer.length
                });
                res.end(screenshotBuffer);
            }

            await delay(2000);
            const checkPoint = await page.waitForSelector('#checkpointSubmitButton-actual-button');
            if (checkPoint) {
                await checkPoint.click();
            }
            await delay(1000);
            // var clickRadio = await page.evaluate(() => {
            //     var test2 = document.querySelector('input[value="dont_save"] + strong');
            //     test2.click();
            //     return test2;
            // })

            await delay(1000);

            await delay(1000);

            const checkPoint01 = await page.waitForSelector('#checkpointSubmitButton-actual-button');
            if (checkPoint01) {
                await checkPoint01.click();
            }


            try {
                console.log('xac thuc');
                await page.waitForXPath('//*[contains(text(), "Xem lại lần đăng nhập gần đây")]', { timeout: 3000 })

                await delay(2000);
                const checkPoint2 = await page.waitForSelector('#checkpointSubmitButton-actual-button');
                if (checkPoint2) {
                    await checkPoint2.click();
                }

                await delay(2000);
                const checkPoint22 = await page.waitForSelector('#checkpointSubmitButton-actual-button');
                if (checkPoint22) {
                    await checkPoint22.click();
                }

                await delay(2000);
                const checkPoint23 = await page.waitForSelector('#checkpointSubmitButton-actual-button');
                if (checkPoint23) {
                    await checkPoint23.click();
                }


                await delay(5000);
                //await page.waitForNavigation({ waitUntil: ['networkidle0'] });



                // const page2 = await browser.newPage();
                // await page2.goto('https://www.facebook.com/help/contact/2026068680760273', { waitUntil: 'networkidle0' });

                // var input = await page2.evaluate(() => {
                //     var test = document.querySelector('._sx7 .uiInputLabel:nth-child(2) > .uiInputLabelLabel');
                //     test.click();
                //     // alert("tetst");
                //     return test;
                // })

                //await delay(5000);
                // await page2.screenshot({ path: 'testresult2.png', fullPage: true })


                // const acountIds = req.query.data.split(',');

                // for (let i = 0; i < acountIds.length; i++) {
                //     const page = await browser.newPage();
                //     const url = getUrl(acountIds[i]);
                //     page.goto(`${url}`);

                //     await page.waitForNavigation({ waitUntil: ['networkidle0'], timeout: 3000 });
                //     page.waitForSelector('.l9j0dhe7.du4w35lb.j83agx80.pfnyh3mw.taijpn5t.bp9cbjyn.owycx6da.btwxx1t3.kt9q3ron.ak7q8e6j.isp2s0ed.ri5dt5u2.rt8b4zig.n8ej3o3l.agehan2d.sk4xxmp2.rq0escxv.d1544ag0.tw6a2znq.s1i5eluu.tv7at329').click();


                //     // const listToken = await page.waitForSelector('#listToken');
                //     // listToken.type(req.query.userName, { delay: 10 });
                //     // await page.waitForTimeout(500);

                //     // if (listToken) {
                //     //     await listToken.type(req.query.userName, { delay: 10 });
                //     // }
                // }


                try {
                    console.log('ok1');
                    // await delay(5000);
                    await page.waitForNavigation({ waitUntil: ['networkidle0'] });

                    for (let i = 0; i < acountIds.length; i++) {
                        const page = await browser.newPage();
                        const url = getUrl(acountIds[i]);
                        page.goto(`${url}`);


                        const btnLogin = await page.waitForSelector('.l9j0dhe7.du4w35lb.j83agx80.pfnyh3mw.taijpn5t.bp9cbjyn.owycx6da.btwxx1t3.kt9q3ron.ak7q8e6j.isp2s0ed.ri5dt5u2.rt8b4zig.n8ej3o3l.agehan2d.sk4xxmp2.rq0escxv.d1544ag0.tw6a2znq.s1i5eluu.tv7at329');
                        btnLogin.click();

                        // page.evaluate(() => {
                        //    // delay(2000);
                        //     var test = document.querySelector('.l9j0dhe7.du4w35lb.j83agx80.pfnyh3mw.taijpn5t.bp9cbjyn.owycx6da.btwxx1t3.kt9q3ron.ak7q8e6j.isp2s0ed.ri5dt5u2.rt8b4zig.n8ej3o3l.agehan2d.sk4xxmp2.rq0escxv.d1544ag0.tw6a2znq.s1i5eluu.tv7at329');
                        //     test.click();
                        // })        
                    }

                    const screenshotBuffer = await page.screenshot();

                    // Respond with the image
                    res.writeHead(200, {
                        'Content-Type': 'image/png',
                        'Content-Length': screenshotBuffer.length
                    });
                    res.end(screenshotBuffer);
                } catch (e4) {
                    console.log('ok2')

                    for (let i = 0; i < acountIds.length; i++) {
                        const page = await browser.newPage();
                        const url = getUrl(acountIds[i]);
                        page.goto(`${url}`);


                        const btnLogin = await page.waitForSelector('.l9j0dhe7.du4w35lb.j83agx80.pfnyh3mw.taijpn5t.bp9cbjyn.owycx6da.btwxx1t3.kt9q3ron.ak7q8e6j.isp2s0ed.ri5dt5u2.rt8b4zig.n8ej3o3l.agehan2d.sk4xxmp2.rq0escxv.d1544ag0.tw6a2znq.s1i5eluu.tv7at329');
                        btnLogin.click();

                        // page.evaluate(() => {
                        //    // delay(2000);
                        //     var test = document.querySelector('.l9j0dhe7.du4w35lb.j83agx80.pfnyh3mw.taijpn5t.bp9cbjyn.owycx6da.btwxx1t3.kt9q3ron.ak7q8e6j.isp2s0ed.ri5dt5u2.rt8b4zig.n8ej3o3l.agehan2d.sk4xxmp2.rq0escxv.d1544ag0.tw6a2znq.s1i5eluu.tv7at329');
                        //     test.click();
                        // })        
                    }
                }









                const screenshotBuffer = await page.screenshot();

                // Respond with the image
                res.writeHead(200, {
                    'Content-Type': 'image/png',
                    'Content-Length': screenshotBuffer.length
                });
                res.end(screenshotBuffer);

            } catch (e3) {
                console.log('xac thuc catch');
                try {
                    // await delay(5000);
                    await page.waitForNavigation({ waitUntil: ['networkidle0'] });




                    for (let i = 0; i < acountIds.length; i++) {
                        const page = await browser.newPage();
                        const url = getUrl(acountIds[i]);
                        page.goto(`${url}`);


                        const btnLogin = await page.waitForSelector('.l9j0dhe7.du4w35lb.j83agx80.pfnyh3mw.taijpn5t.bp9cbjyn.owycx6da.btwxx1t3.kt9q3ron.ak7q8e6j.isp2s0ed.ri5dt5u2.rt8b4zig.n8ej3o3l.agehan2d.sk4xxmp2.rq0escxv.d1544ag0.tw6a2znq.s1i5eluu.tv7at329');
                        btnLogin.click();

                        // page.evaluate(() => {
                        //    // delay(2000);
                        //     var test = document.querySelector('.l9j0dhe7.du4w35lb.j83agx80.pfnyh3mw.taijpn5t.bp9cbjyn.owycx6da.btwxx1t3.kt9q3ron.ak7q8e6j.isp2s0ed.ri5dt5u2.rt8b4zig.n8ej3o3l.agehan2d.sk4xxmp2.rq0escxv.d1544ag0.tw6a2znq.s1i5eluu.tv7at329');
                        //     test.click();
                        // })        
                    }


                    const screenshotBuffer = await page.screenshot();

                    // Respond with the image
                    res.writeHead(200, {
                        'Content-Type': 'image/png',
                        'Content-Length': screenshotBuffer.length
                    });
                    res.end(screenshotBuffer);
                } catch (e4) {
                    console.log('xac thuc catch2');

                    // const page2 = await browser.newPage();
                    // await page2.goto('https://www.facebook.com/help/contact/2026068680760273', { waitUntil: 'networkidle0' });
                    // console.log('xac thuc catch3');

                    // var input = await page2.evaluate(() => {
                    //     var test = document.querySelector('._sx7 .uiInputLabel:nth-child(2) > .uiInputLabelLabel');
                    //     test.click();
                    //     // alert("tetst");
                    //     return test;
                    // })

                    //await delay(5000);
                    // await page2.screenshot({ path: 'testresult2.png', fullPage: true })


                    for (let i = 0; i < acountIds.length; i++) {
                        const page = await browser.newPage();
                        const url = getUrl(acountIds[i]);
                        page.goto(`${url}`);


                        const btnLogin = await page.waitForSelector('.l9j0dhe7.du4w35lb.j83agx80.pfnyh3mw.taijpn5t.bp9cbjyn.owycx6da.btwxx1t3.kt9q3ron.ak7q8e6j.isp2s0ed.ri5dt5u2.rt8b4zig.n8ej3o3l.agehan2d.sk4xxmp2.rq0escxv.d1544ag0.tw6a2znq.s1i5eluu.tv7at329');
                        btnLogin.click();

                        // page.evaluate(() => {
                        //    // delay(2000);
                        //     var test = document.querySelector('.l9j0dhe7.du4w35lb.j83agx80.pfnyh3mw.taijpn5t.bp9cbjyn.owycx6da.btwxx1t3.kt9q3ron.ak7q8e6j.isp2s0ed.ri5dt5u2.rt8b4zig.n8ej3o3l.agehan2d.sk4xxmp2.rq0escxv.d1544ag0.tw6a2znq.s1i5eluu.tv7at329');
                        //     test.click();
                        // })        
                    }


                    const screenshotBuffer = await page.screenshot();

                    // Respond with the image
                    res.writeHead(200, {
                        'Content-Type': 'image/png',
                        'Content-Length': screenshotBuffer.length
                    });
                    res.end(screenshotBuffer);

                }
            }


        }


    }

    await delay(1000);
    await browser.close();
})

app.use("/api/product", product);

app.use("/api/screenshot2", screenshop2);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));
