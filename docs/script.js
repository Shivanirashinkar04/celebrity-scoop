document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');
    const searchInput = document.getElementById('search');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const sidebar = document.querySelector('.sidebar'); // Sidebar element for collapse
    const toggleSidebarButton = document.getElementById('toggle-sidebar'); // Hamburger button
    const currentsApiKey = 'C3_7qDNkI9dvZ9gDxjZNsrODmrMvcKc0SaZj5F8p6lwWBnYm'; // Currents API key
    const worldNewsApiKey = '8430dc4c4ec24558a7fd47e5e3905f3a'; // World News API key

    // Function to fetch and display news
    const fetchNews = (category = 'general', query = '', apiKey = currentsApiKey, isWorldNews = false) => {
        newsContainer.innerHTML = '<p>Loading news...</p>';
        let url = `https://api.currentsapi.services/v1/latest-news?apiKey=${apiKey}`;
        
        if (query) {
            url = `https://api.currentsapi.services/v1/search?apiKey=${apiKey}&keywords=${query}`;
        } else if (category === 'bollywood') {
            url = `https://api.currentsapi.services/v1/search?apiKey=${apiKey}&keywords=bollywood`;
        } else if (category === 'india-news') {
            url = `https://api.worldnewsapi.com/search-news?api-key=${worldNewsApiKey}&text=India&source-countries=IN`;
        } else if (category === 'world-news') {
            url = `https://api.worldnewsapi.com/search-news?api-key=${worldNewsApiKey}&language=en`;
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

    // Load general news on page load
    fetchNews('general', '', currentsApiKey);

    // Search functionality
    searchInput.addEventListener('input', () => {
        fetchNews('general', searchInput.value, currentsApiKey);
    });

    // Toggle sidebar visibility when the hamburger button is clicked
    toggleSidebarButton.addEventListener('click', () => {
        sidebar.classList.toggle('show');
    });

    // Category buttons click event
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            if (category === 'world-news' || category === 'india-news') {
                fetchNews(category, '', worldNewsApiKey, true);
            } else {
                fetchNews(category, '', currentsApiKey);
            }

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
