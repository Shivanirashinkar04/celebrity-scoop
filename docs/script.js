document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');
    const searchInput = document.getElementById('search');
    const categoryButtons = document.querySelectorAll('.category-btn');

    const fetchNews = (category = 'general', query = '') => {
        newsContainer.innerHTML = '<p>Loading news...</p>';
        const apiKey = '871b28d063f882c3e0cc3e15904caa92';
        let url = `https://gnews.io/api/v4/top-headlines?token=${apiKey}&topic=${category}`;
        if (query) url += `&q=${query}`;

        fetch(url, { method: 'GET', mode: 'cors' })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                newsContainer.innerHTML = '';
                if (!data.articles) {
                    throw new Error('Invalid data format');
                }
                data.articles.forEach(article => {
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
            fetchNews(category);
        });
    });
});
