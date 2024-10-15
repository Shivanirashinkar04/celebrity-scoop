const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

const NEWS_API_KEY = 'b44a016286aa44d7b80af9e10902ec01';
const BASE_URL = 'https://newsapi.org/v2/everything';

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

const getNews = async (query) => {
    const url = `${BASE_URL}?q=${query}&apiKey=${NEWS_API_KEY}`;
    const response = await axios.get(url);
    return response.data;
};

app.get('/api/news', async (req, res) => {
    try {
        const response = await getNews('entertainment');
        res.json(response);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/api/bollywood', async (req, res) => {
    try {
        const response = await getNews('bollywood');
        res.json(response);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
