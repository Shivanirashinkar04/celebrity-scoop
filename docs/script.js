document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');
    const searchInput = document.getElementById('search');
    const categoryButtons = document.querySelectorAll('.category-btn');

    const fetchNews = (category = 'general', query = '') => {
        newsContainer.innerHTML = '<p>Loading news...</p>';
        const apiKey = 'C3_7qDNkI9dvZ9gDxjZNsrODmrMvcKc0SaZj5F8p6lwWBnYm'; // Currents API key
        let url = `https://api.currentsapi.services/v1/latest-news?apiKey=${apiKey}`;
        if (category === 'bollywood') {
            url = `https://api.currentsapi.services/v1/search?apiKey=${apiKey}&keywords=bollywood`;
        } else if (query) {
            url += `&keywords=${query}`;
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
                if (!data.news) {
                    throw new Error('Invalid data format');
                }
                data.news.forEach(article => {
                    const newsItem = document.createElement('div');
                    newsItem.className = 'news-item';
                    newsItem.innerHTML = `
                        <h3>${article.title}</h3>
                        <p>${article.description}</p>
                        <img src="${article.image}" alt="${article.title}">
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

    fetchNews();

    searchInput.addEventListener('input', () => {
        fetchNews('general', searchInput.value);
    });

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            if (category === 'bollywood') {
                fetchNews('bollywood');
            } else {
                fetchNews(category);
            }
        });
    });
});
