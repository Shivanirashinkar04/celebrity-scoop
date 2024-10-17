document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');
    const searchInput = document.getElementById('search');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const currentsApiKey = 'C3_7qDNkI9dvZ9gDxjZNsrODmrMvcKc0SaZj5F8p6lwWBnYm';
    const worldNewsApiKey = '8430dc4c4ec24558a7fd47e5e3905f3a';

    const fetchNews = (category = 'general', query = '', apiKey = currentsApiKey) => {
        newsContainer.innerHTML = '<p>Loading news...</p>';
        let url = `https://api.currentsapi.services/v1/latest-news?apiKey=${apiKey}`;

        if (query) {
            url = `https://api.currentsapi.services/v1/search?apiKey=${apiKey}&keywords=${query}`;
        } else if (category === 'bollywood') {
            url = `https://api.currentsapi.services/v1/search?apiKey=${apiKey}&keywords=bollywood`;
        } else if (category === 'india-news') {
            url = `https://api.worldnewsapi.com/search-news?apiKey=${worldNewsApiKey}&country=IN`;
        } else if (category === 'world-news') {
            url = `https://api.worldnewsapi.com/search-news?apiKey=${worldNewsApiKey}`;
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

    fetchNews('general', '', currentsApiKey);
    searchInput.addEventListener('input', () => {
        fetchNews('general', searchInput.value, currentsApiKey);
    });

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            if (category === 'india-news' || category === 'world-news') {
                fetchNews(category, '', worldNewsApiKey);
            } else {
                fetchNews(category, '', currentsApiKey);
            }
        });
    });
});
