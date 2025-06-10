const express = require('express');
const axios = require('axios');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all('/proxy', async (req, res) => {
    try {
        const { url, method, headers, data, scrapeMode } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required.' });
        }

        if (scrapeMode) {
            let browser;
            try {
                browser = await puppeteer.launch({
                    headless: true,
                    args: ['--no-sandbox', '--disable-setuid-sandbox']
                });
                const page = await browser.newPage();
                await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 }); // 60 seconds timeout
                const htmlContent = await page.content();
                res.set('Content-Type', 'text/html');
                res.status(200).send(htmlContent);
            } catch (error) {
                console.error('Puppeteer scraping error:', error.message);
                const errorMessage = error.name === 'TimeoutError' ? `Scraping timed out after 60 seconds: ${url}` : `Scraping failed: ${error.message}`;
                res.status(500).json({ error: errorMessage });
            } finally {
                if (browser) {
                    await browser.close();
                }
            }
        } else {
            if (!method) {
                return res.status(400).json({ error: 'Method is required when not in scrape mode.' });
            }

            const newHeaders = { ...headers };
            if (data && (method.toLowerCase() === 'post' || method.toLowerCase() === 'put' || method.toLowerCase() === 'patch') && !newHeaders['Content-Type'] && !newHeaders['content-type']) {
                newHeaders['Content-Type'] = 'application/json';
            }

            const response = await axios({
                method: method.toLowerCase(),
                url: url,
                headers: newHeaders,
                data: data,
                timeout: 60000, // 60 seconds timeout for Axios requests
            });

            res.set(response.headers);
            res.status(response.status).send(response.data);
        }
    } catch (error) {
        console.error('Proxy error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 