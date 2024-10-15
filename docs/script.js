document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');
    const searchInput = document.getElementById('search');
    const categoryButtons = document.querySelectorAll('.category-btn');

    const fetchNews = (category = 'entertainment', query = '') => {
        newsContainer.innerHTML = '<p>Loading news...</p>';
        const apiKey = 'b44a016286aa44d7b80af9e10902ec01';
        const url = `https://newsapi.org/v2/top-headlines?category=${category}&q=${query}&apiKey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                newsContainer.innerHTML = '';
                data.articles.forEach(article => {
                    const newsItem = document.createElement('div');
                    newsItem.className = 'news-item';
                    newsItem.innerHTML = `
                        <h3>${article.title}</h3>
                        <p>${article.description}</p>
                        <img src="${article.urlToImage}" alt="${article.title}">
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
        fetchNews('entertainment', searchInput.value);
    });

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            fetchNews(category);
        });
    });
});
