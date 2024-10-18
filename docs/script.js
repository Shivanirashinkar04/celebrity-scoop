document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');
    const searchInput = document.getElementById('search');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const sidebar = document.querySelector('.sidebar');
    const toggleSidebarButton = document.getElementById('toggle-sidebar');

    const currentsApiKey = 'C3_7qDNkI9dvZ9gDxjZNsrODmrMvcKc0SaZj5F8p6lwWBnYm';
    const worldNewsApiKey = '8430dc4c4ec24558a7fd47e5e3905f3a';
    const newsDataApiKey = 'pub_56596048a2a00b03066fc7c3e6e8e92f41911';

    const CURRENT_API_BASE_URL = 'https://api.currentsapi.services/v1/';
    const WORLD_NEWS_API_BASE_URL = 'https://api.worldnewsapi.com/';
    const NEWSDATA_API_BASE_URL = 'https://newsdata.io/api/1/news?apikey=';

    const fetchNews = async (category = 'general', query = '') => {
        newsContainer.innerHTML = '<p>Loading news...</p>';
        let urls = [];

        if (query) {
            urls = [
                `${NEWSDATA_API_BASE_URL}${newsDataApiKey}&q=${query}`,
                `${CURRENT_API_BASE_URL}search?apiKey=${currentsApiKey}&keywords=${query}`,
                `${WORLD_NEWS_API_BASE_URL}search-news?api-key=${worldNewsApiKey}&text=${query}`
            ];
        } else {
            switch (category) {
                case 'entertainment-india':
                    urls = [
                        `${NEWSDATA_API_BASE_URL}${newsDataApiKey}&category=entertainment`,
                        `${CURRENT_API_BASE_URL}search?apiKey=${currentsApiKey}&keywords=Bollywood`,
                        `${WORLD_NEWS_API_BASE_URL}search-news?api-key=${worldNewsApiKey}&text=Bollywood`
                    ];
                    break;
                case 'entertainment':
                    urls = [
                        `${NEWSDATA_API_BASE_URL}${newsDataApiKey}&category=entertainment`,
                        `${CURRENT_API_BASE_URL}search?apiKey=${currentsApiKey}&keywords=entertainment`,
                        `${WORLD_NEWS_API_BASE_URL}search-news?api-key=${worldNewsApiKey}&language=en`
                    ];
                    break;
                case 'business':
                    urls = [
                        `${NEWSDATA_API_BASE_URL}${newsDataApiKey}&category=business`,
                        `${CURRENT_API_BASE_URL}latest-news?apiKey=${currentsApiKey}&category=business`,
                        `${WORLD_NEWS_API_BASE_URL}search-news?api-key=${worldNewsApiKey}&text=business`
                    ];
                    break;
                case 'crime':
                    urls = [
                        `${NEWSDATA_API_BASE_URL}${newsDataApiKey}&category=crime`,
                        `${CURRENT_API_BASE_URL}latest-news?apiKey=${currentsApiKey}&category=crime`,
                        `${WORLD_NEWS_API_BASE_URL}search-news?api-key=${worldNewsApiKey}&text=crime`
                    ];
                    break;
                case 'domestic':
                    urls = [
                        `${NEWSDATA_API_BASE_URL}${newsDataApiKey}&category=domestic`,
                        `${CURRENT_API_BASE_URL}latest-news?apiKey=${currentsApiKey}&category=domestic`,
                        `${WORLD_NEWS_API_BASE_URL}search-news?api-key=${worldNewsApiKey}&text=domestic`
                    ];
                    break;
                case 'education':
                    urls = [
                        `${NEWSDATA_API_BASE_URL}${newsDataApiKey}&category=education`,
                        `${CURRENT_API_BASE_URL}latest-news?apiKey=${currentsApiKey}&category=education`,
                        `${WORLD_NEWS_API_BASE_URL}search-news?api-key=${worldNewsApiKey}&text=education`
                    ];
                    break;
                case 'lifestyle':
                    urls = [
                        `${NEWSDATA_API_BASE_URL}${newsDataApiKey}&category=lifestyle`,
                        `${CURRENT_API_BASE_URL}latest-news?apiKey=${currentsApiKey}&category=lifestyle`,
                        `${WORLD_NEWS_API_BASE_URL}search-news?api-key=${worldNewsApiKey}&text=lifestyle`
                    ];
                    break;
                case 'india-news':
                    urls = [
                        `${NEWSDATA_API_BASE_URL}${newsDataApiKey}&category=india-news`,
                        `${WORLD_NEWS_API_BASE_URL}search-news?api-key=${worldNewsApiKey}&text=India&source-countries=IN`,
                        `${CURRENT_API_BASE_URL}latest-news?apiKey=${currentsApiKey}&keywords=India`
                    ];
                    break;
                case 'world-news':
                    urls = [
                        `${NEWSDATA_API_BASE_URL}${newsDataApiKey}&category=world`,
                        `${WORLD_NEWS_API_BASE_URL}search-news?api-key=${worldNewsApiKey}&language=en`,
                        `${CURRENT_API_BASE_URL}latest-news?apiKey=${currentsApiKey}&category=world`
                    ];
                    break;
                default:
                    urls = [
                        `${NEWSDATA_API_BASE_URL}${newsDataApiKey}&category=${category}`,
                        `${CURRENT_API_BASE_URL}latest-news?apiKey=${currentsApiKey}&category=${category}`,
                        `${WORLD_NEWS_API_BASE_URL}search-news?api-key=${worldNewsApiKey}&text=${category}`
                    ];
            }
        }

        try {
            const responses = await Promise.all(
                urls.map(url =>
                    fetch(url, { method: 'GET', mode: 'cors' })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            return response.json();
                        })
                        .catch(error => {
                            console.error('Error fetching news:', error);
                            return null;
                        })
                )
            );

            const articles = responses
                .filter(response => response && (response.news || response.articles || response.results))
                .flatMap(response => response.news || response.articles || response.results);

            newsContainer.innerHTML = '';
            if (articles.length === 0) {
                newsContainer.innerHTML = '<p>No news available.</p>';
                return;
            }

            articles.forEach(article => {
                const newsItem = document.createElement('div');
                newsItem.className = 'news-item';
                newsItem.innerHTML = `
                    <h3>${article.title}</h3>
                    <p>${article.description}</p>
                    <p>Author: ${article.author || article.source_id || 'Unknown'}</p>
                    <img src="${article.image || article.image_url || article.urlToImage || ''}" alt="${article.title}">
                    <a href="${article.url || article.link}" target="_blank">Read more</a>
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
        fetchNews('', searchInput.value);
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
