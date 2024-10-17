const fetchNews = (category = 'general', query = '', apiKey = currentsApiKey, isWorldNews = false) => {
    newsContainer.innerHTML = '<p>Loading news...</p>';
    let url = `https://api.currentsapi.services/v1/latest-news?apiKey=${apiKey}`;
    if (query) {
        url = `https://api.currentsapi.services/v1/search?apiKey=${apiKey}&keywords=${query}`;
    } else if (category === 'bollywood') {
        url = `https://api.currentsapi.services/v1/search?apiKey=${apiKey}&keywords=bollywood`;
    } else if (category === 'india-news') {
        url = `https://api.worldnewsapi.com/search-news?api-key=${worldNewsApiKey}&country=IN&text=India`;
    } else if (category === 'world-news') {
        url = `https://api.worldnewsapi.com/search-news?api-key=${worldNewsApiKey}&language=en&text=World`;
    } else {
        url += `&category=${category}`;
    }
    fetch(url, { method: 'GET', mode: 'cors' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            newsContainer.innerHTML = '';
            if (!data.news && !data.articles) {
                throw new Error('Invalid data format');
            }
            const articles = data.news || data.articles;
            articles.forEach(article => {
                const newsItem = document.createElement('div');
                newsItem.className = 'news-item';
                newsItem.innerHTML = `
                    <h3>${article.title}</h3>
                    <p>${article.description}</p>
                    <img src="${article.image || article.urlToImage}" alt="${article.title}">
                    <a href="${article.url}" target="_blank">Read more</a>
                `;
                newsContainer.appendChild(newsItem);
            });
        })
        .catch(error => {
            newsContainer.innerHTML = '<p>Error loading news</p>';
            console.error('Error fetching news:', error);
        });
};
