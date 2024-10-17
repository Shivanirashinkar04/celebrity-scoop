document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');
    const searchInput = document.getElementById('search');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const sidebar = document.querySelector('.sidebar');
    const toggleSidebarButton = document.getElementById('toggle-sidebar');

    const currentsApiKey = 'C3_7qDNkI9dvZ9gDxjZNsrODmrMvcKc0SaZj5F8p6lwWBnYm';
    const worldNewsApiKey = '8430dc4c4ec24558a7fd47e5e3905f3a';

    const CURRENT_API_BASE_URL = 'https://api.currentsapi.services/v1/';
    const WORLD_NEWS_API_BASE_URL = 'https://api.worldnewsapi.com/';

    const fetchNews = async (category = 'general', query = '', apiKey = currentsApiKey) => {
        newsContainer.innerHTML = '<p>Loading news...</p>';
        let url;
        if (query) {
            url = `${CURRENT_API_BASE_URL}search?apiKey=${apiKey}&keywords=${query}`;
        } else if (category === 'bollywood') {
            url = `${CURRENT_API_BASE_URL}search?apiKey=${apiKey}&keywords=Bollywood`;
        } else if (category === 'india-news') {
            url = `${WORLD_NEWS_API_BASE_URL}search-news?api-key=${worldNewsApiKey}&text=India&source-countries=IN`;
        } else if (category === 'world-news') {
            url = `${WORLD_NEWS_API_BASE_URL}search-news?api-key=${worldNewsApiKey}&language=en`;
        } else {
            url = `${CURRENT_API_BASE_URL}latest-news?apiKey=${apiKey}&category=${category}`;
        }
        try {
            const response = await fetch(url, { method: 'GET', mode: 'cors' });
            if (response.status === 429) {
                throw new Error('Too many requests. Please try again later.');
            }
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            newsContainer.innerHTML = '';
            const articles = data.news || data.articles;
            if (!articles) {
                throw new Error('Invalid data format');
            }
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
        } catch (error) {
            newsContainer.innerHTML = `<p>Error loading news: ${error.message}</p>`;
            console.error('Error fetching news:', error);
        }
    };

    // Load general news on page load
    fetchNews();

    // Search functionality
    searchInput.addEventListener('input', () => {
        fetchNews('general', searchInput.value);
    });

    // Toggle sidebar visibility when the hamburger button is clicked
    toggleSidebarButton.addEventListener('click', () => {
        sidebar.classList.toggle('show');
    });

    // Category buttons click event
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            fetchNews(category);
            // Hide the sidebar after selecting a category on smaller screens
            if (window.innerWidth <= 600) {
                sidebar.classList.remove('show');
            }
        });
    });

    // Handle resizing of the window to ensure the sidebar behaves correctly
    window.addEventListener('resize', () => {
        if (window.innerWidth > 600) {
            sidebar.classList.remove('show'); // Always show the sidebar on larger screens
        }
    });
});
