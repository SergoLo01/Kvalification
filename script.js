document.addEventListener('DOMContentLoaded', function () {
    initApp();
    setupEventListeners();
    loadSampleData();
});

// Глобальні змінні
let currentUser = null;
let currentChat = null;
let chats = [];
let sampleOffers = [];
let sampleRequests = [];

function initApp() {
    initModals();
    initTabs();
    checkAuthStatus();
}


function setupEventListeners() {
    // Кнопки авторизації
    document.getElementById('loginBtn').addEventListener('click', openAuthModal);
    document.getElementById('registerBtn').addEventListener('click', openAuthModal);

    // Форми
    document.getElementById('offerForm').addEventListener('submit', handleOfferSubmit);
    document.getElementById('requestForm').addEventListener('submit', handleRequestSubmit);
    document.getElementById('settingsForm').addEventListener('submit', handleSettingsSubmit);
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);

    // Пошук
    document.getElementById('searchBtn').addEventListener('click', handleSearch);
    document.getElementById('searchInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') handleSearch();
    });

    // Чат
    document.getElementById('sendMessageBtn').addEventListener('click', sendMessage);
    document.getElementById('chatMessageInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') sendMessage();
    });
}

function initModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');

    closeButtons.forEach(button => {
        button.addEventListener('click', function () {
            this.closest('.modal').classList.remove('active');
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', function (e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
}

function initTabs() {
    // Вкладки форми додавання
    const formTabs = document.querySelectorAll('.form-tabs .tab-btn');
    formTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const tabId = this.getAttribute('data-tab');

            document.querySelector('.form-tabs .tab-btn.active').classList.remove('active');
            this.classList.add('active');

            document.querySelector('.add-form .tab-content.active').classList.remove('active');
            document.getElementById(tabId + 'Tab').classList.add('active');
        });
    });

    // Вкладки авторизації
    const authTabs = document.querySelectorAll('.auth-tabs .auth-tab-btn');
    authTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const tabId = this.getAttribute('data-tab');

            document.querySelector('.auth-tabs .auth-tab-btn.active').classList.remove('active');
            this.classList.add('active');

            document.querySelector('.auth-tab-content.active').classList.remove('active');
            document.getElementById(tabId + 'Tab').classList.add('active');
        });
    });

    // Вкладки профілю
    const profileTabs = document.querySelectorAll('.profile-menu a');
    profileTabs.forEach(tab => {
        tab.addEventListener('click', function (e) {
            e.preventDefault();
            const tabId = this.getAttribute('href').substring(1);

            document.querySelector('.profile-menu li.active').classList.remove('active');
            this.parentElement.classList.add('active');

            document.querySelector('.profile-section.active').classList.remove('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

function checkAuthStatus() {
    // Заглушка для перевірки авторизації
    updateAuthUI(false);
}

function updateAuthUI(isLoggedIn) {
    const authButtons = document.querySelector('.auth-buttons');
    const profileSection = document.getElementById('profile');

    if (isLoggedIn) {
        authButtons.innerHTML = `<button id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Вийти</button>`;
        document.getElementById('logoutBtn').addEventListener('click', handleLogout);
        profileSection.style.display = 'block';
    } else {
        authButtons.innerHTML = `
            <button id="loginBtn">Увійти</button>
            <button id="registerBtn">Реєстрація</button>
        `;
        profileSection.style.display = 'none';
    }
}

function openAuthModal() {
    const modal = document.getElementById('authModal');
    modal.classList.add('active');

    if (this.id === 'registerBtn') {
        document.querySelector('.auth-tabs .auth-tab-btn[data-tab="register"]').click();
    }
}

function handleOfferSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('offerTitle').value;
    const category = document.getElementById('offerCategory').value;
    const description = document.getElementById('offerDescription').value;
    const condition = document.getElementById('offerCondition').value;
    const photo = document.getElementById('offerPhoto').files[0];

    if (!title || !category || !description) {
        showAlert('Будь ласка, заповніть обов\'язкові поля', 'error');
        return;
    }

    const newOffer = {
        id: Date.now(),
        title,
        category,
        description,
        condition,
        date: new Date().toLocaleDateString(),
        owner: 'Поточний користувач',
        location: 'Ваш район',
        rating: 0,
        reviews: 0,
        saved: false,
        image: photo ? URL.createObjectURL(photo) : 'https://via.placeholder.com/400x300?text=No+Image'
    };

    sampleOffers.unshift(newOffer);
    updateOffers();
    e.target.reset();
    showAlert('Пропозицію успішно додано!', 'success');
}

function handleRequestSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('requestTitle').value;
    const category = document.getElementById('requestCategory').value;
    const description = document.getElementById('requestDescription').value;
    const urgency = document.getElementById('requestUrgency').value;

    if (!title || !category || !description) {
        showAlert('Будь ласка, заповніть обов\'язкові поля', 'error');
        return;
    }

    const newRequest = {
        id: Date.now(),
        title,
        category,
        description,
        urgency,
        date: new Date().toLocaleDateString(),
        user: 'Поточний користувач',
        location: 'Ваш район',
        responses: 0
    };

    sampleRequests.unshift(newRequest);
    renderRequests(sampleRequests);
    e.target.reset();
    showAlert('Запит успішно опубліковано!', 'success');
}

function handleSettingsSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('userNameInput').value;
    const neighborhood = document.getElementById('userNeighborhood').value;

    if (!name || !neighborhood) {
        showAlert('Будь ласка, заповніть обов\'язкові поля', 'error');
        return;
    }

    document.getElementById('userName').textContent = name;
    document.getElementById('userLocation').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${neighborhood}`;
    showAlert('Налаштування успішно збережено!', 'success');
}

function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Заглушка для авторизації
    if (email && password) {
        document.getElementById('authModal').classList.remove('active');
        updateAuthUI(true);
        showAlert('Ви успішно увійшли в систему!', 'success');

        // Оновлення профілю
        document.getElementById('userName').textContent = 'Новий Користувач';
        document.getElementById('userNameInput').value = 'Новий Користувач';
        document.getElementById('userEmail').value = email;
        document.getElementById('userNeighborhood').value = 'Ваш район';
    } else {
        showAlert('Будь ласка, введіть email та пароль', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const neighborhood = document.getElementById('registerNeighborhood').value;

    if (!name || !email || !password || !confirmPassword || !neighborhood) {
        showAlert('Будь ласка, заповніть всі поля', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showAlert('Паролі не співпадають', 'error');
        return;
    }

    // Заглушка для реєстрації
    document.getElementById('authModal').classList.remove('active');
    updateAuthUI(true);
    showAlert('Реєстрація успішна! Ласкаво просимо!', 'success');

    // Оновлення профілю
    document.getElementById('userName').textContent = name;
    document.getElementById('userNameInput').value = name;
    document.getElementById('userEmail').value = email;
    document.getElementById('userNeighborhood').value = neighborhood;
    document.getElementById('userLocation').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${neighborhood}`;
}

function handleLogout() {
    updateAuthUI(false);
    showAlert('Ви успішно вийшли з системи', 'success');
}

function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    const category = document.getElementById('categoryFilter').value;

    const filteredOffers = sampleOffers.filter(offer => {
        const matchesSearch = offer.title.toLowerCase().includes(searchTerm) ||
            offer.description.toLowerCase().includes(searchTerm);
        const matchesCategory = category === 'all' || offer.category === category;
        return matchesSearch && matchesCategory;
    });

    renderOffers(filteredOffers);
}

function updateOffers() {
    renderOffers(sampleOffers);
    if (document.getElementById('profile').style.display !== 'none') {
        updateUserItems();
    }
}

function renderOffers(offers) {
    const container = document.getElementById('offersContainer');
    container.innerHTML = '';

    if (offers.length === 0) {
        container.innerHTML = '<p class="no-results">Нічого не знайдено. Спробуйте змінити параметри пошуку.</p>';
        return;
    }

    offers.forEach(offer => {
        const offerElement = document.createElement('div');
        offerElement.className = 'offer-card';
        offerElement.innerHTML = `
            <div class="offer-image" style="background-image: url('${offer.image}')"></div>
            <div class="offer-details">
                <h3 class="offer-title">${offer.title}</h3>
                <div class="offer-meta">
                    <span class="offer-category">${getCategoryName(offer.category)}</span>
                    <span class="offer-date">${offer.date}</span>
                </div>
                <p class="offer-description">${offer.description}</p>
                <div class="offer-actions">
                    <button class="view-offer-btn" data-id="${offer.id}">Детальніше</button>
                    <button class="save-offer-btn" data-id="${offer.id}">
                        <i class="far ${offer.saved ? 'fa-bookmark' : 'fa-bookmark'}"></i>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(offerElement);
    });

    document.querySelectorAll('.view-offer-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const offerId = parseInt(this.getAttribute('data-id'));
            viewOfferDetails(offerId);
        });
    });
}

function viewOfferDetails(offerId) {
    const offer = sampleOffers.find(o => o.id === offerId);
    if (!offer) return;

    document.getElementById('modalItemTitle').textContent = offer.title;
    document.getElementById('modalItemCategory').textContent = getCategoryName(offer.category);
    document.getElementById('modalItemCondition').textContent = getConditionName(offer.condition);
    document.getElementById('modalItemDescription').textContent = offer.description;
    document.getElementById('modalItemImage').src = offer.image;
    document.getElementById('modalItemOwner').textContent = offer.owner;
    document.getElementById('modalItemLocation').textContent = offer.location;

    document.getElementById('itemModal').classList.add('active');
}

function renderRequests(requests) {
    const container = document.getElementById('requestsContainer');
    container.innerHTML = '';

    if (requests.length === 0) {
        container.innerHTML = '<p class="no-results">Актуальних запитів немає.</p>';
        return;
    }

    requests.forEach(request => {
        const requestElement = document.createElement('div');
        requestElement.className = 'request-item';
        requestElement.innerHTML = `
            <div class="request-info">
                <h4 class="request-title">${request.title}</h4>
                <div class="request-meta">
                    <span>${request.user}</span>
                    <span>${request.date}</span>
                    <span class="request-urgency urgency-${request.urgency}">
                        ${getUrgencyName(request.urgency)}
                    </span>
                </div>
            </div>
            <div class="request-actions">
                <button data-id="${request.id}">Допомогти</button>
            </div>
        `;
        container.appendChild(requestElement);
    });
}

function updateUserItems() {
    const container = document.getElementById('userItemsContainer');
    container.innerHTML = '';

    const userOffers = sampleOffers.filter(offer => offer.owner === 'Поточний користувач');

    if (userOffers.length === 0) {
        container.innerHTML = '<p class="no-results">У вас немає активних пропозицій.</p>';
        return;
    }

    userOffers.forEach(offer => {
        const offerElement = document.createElement('div');
        offerElement.className = 'offer-card';
        offerElement.innerHTML = `
            <div class="offer-image" style="background-image: url('${offer.image}')"></div>
            <div class="offer-details">
                <h3 class="offer-title">${offer.title}</h3>
                <div class="offer-meta">
                    <span class="offer-category">${getCategoryName(offer.category)}</span>
                    <span class="offer-date">${offer.date}</span>
                </div>
                <div class="offer-actions">
                    <button class="view-offer-btn" data-id="${offer.id}">Детальніше</button>
                    <button class="delete-offer-btn" data-id="${offer.id}">Видалити</button>
                </div>
            </div>
        `;
        container.appendChild(offerElement);
    });
}

function updateUserRequests() {
    const container = document.getElementById('userRequestsContainer');
    container.innerHTML = '';

    const userRequests = sampleRequests.filter(request => request.user === 'Поточний користувач');

    if (userRequests.length === 0) {
        container.innerHTML = '<p class="no-results">У вас немає активних запитів.</p>';
        return;
    }

    userRequests.forEach(request => {
        const requestElement = document.createElement('div');
        requestElement.className = 'request-item';
        requestElement.innerHTML = `
            <div class="request-info">
                <h4 class="request-title">${request.title}</h4>
                <div class="request-meta">
                    <span>${request.date}</span>
                    <span class="request-urgency urgency-${request.urgency}">
                        ${getUrgencyName(request.urgency)}
                    </span>
                    <span>${request.responses} відповідей</span>
                </div>
            </div>
            <div class="request-actions">
                <button data-id="${request.id}">Закрити</button>
            </div>
        `;
        container.appendChild(requestElement);
    });
}

function updateExchanges() {
    const container = document.getElementById('exchangesContainer');
    container.innerHTML = '';

    const exchanges = [
        {
            id: 1,
            title: 'Обмін книг',
            partner: 'Олена Петренко',
            date: '15.05.2023',
            status: 'completed'
        },
        {
            id: 2,
            title: 'Послуги ремонту',
            partner: 'Іван Сидоренко',
            date: '10.05.2023',
            status: 'completed'
        }
    ];

    if (exchanges.length === 0) {
        container.innerHTML = '<p class="no-results">У вас ще немає історії обмінів.</p>';
        return;
    }

    exchanges.forEach(exchange => {
        const exchangeElement = document.createElement('div');
        exchangeElement.className = 'exchange-item';
        exchangeElement.innerHTML = `
            <div class="exchange-info">
                <h4 class="exchange-title">${exchange.title}</h4>
                <div class="exchange-meta">
                    <span>З ${exchange.partner}</span>
                    <span>${exchange.date}</span>
                </div>
            </div>
            <span class="exchange-status status-${exchange.status}">
                ${getStatusName(exchange.status)}
            </span>
        `;
        container.appendChild(exchangeElement);
    });
}

function loadSampleData() {
    // Статистика
    document.getElementById('usersCount').textContent = '127';
    document.getElementById('exchangesCount').textContent = '89';
    document.getElementById('neighborhoodsCount').textContent = '5';

    // Тестові пропозиції
    sampleOffers = [
        {
            id: 1,
            title: 'Диван для віддачі',
            category: 'furniture',
            description: 'Старий, але ще цілком придатний диван. Колір бежевий, розміри 200x90 см.',
            condition: 'used',
            image: 'https://via.placeholder.com/400x300?text=Диван',
            date: '12.05.2023',
            owner: 'Олена Петренко',
            location: 'Центр, вул. Головна 15',
            rating: 4.5,
            reviews: 3,
            saved: false
        },
        {
            id: 2,
            title: 'Послуги електрика',
            category: 'services',
            description: 'Можу допомогти з дрібними електророботами: заміна розеток, вимикачів, прокладання кабелю.',
            condition: '',
            image: 'https://via.placeholder.com/400x300?text=Електрик',
            date: '10.05.2023',
            owner: 'Іван Сидоренко',
            location: 'Західний район, вул. Лісова 8',
            rating: 4.8,
            reviews: 7,
            saved: true
        }
    ];

    // Тестові запити
    sampleRequests = [
        {
            id: 1,
            title: 'Потрібен дитячий велосипед',
            category: 'items',
            description: 'Шукаю дитячий велосипед для хлопчика 5 років. Можу обміняти на щось або взяти за символічну плату.',
            urgency: 'medium',
            date: '14.05.2023',
            user: 'Наталія Коваль',
            location: 'Центр, вул. Шевченка 10',
            responses: 2
        }
    ];

    // Оновлення UI
    renderOffers(sampleOffers);
    renderRequests(sampleRequests);

    if (document.getElementById('profile').style.display !== 'none') {
        updateUserItems();
        updateUserRequests();
        updateExchanges();
    }
}

// Допоміжні функції
function getCategoryName(category) {
    const categories = {
        'furniture': 'Меблі',
        'electronics': 'Електроніка',
        'clothes': 'Одяг',
        'books': 'Книги',
        'tools': 'Інструменти',
        'other': 'Інше',
        'items': 'Речі',
        'services': 'Послуги',
        'help': 'Допомога'
    };
    return categories[category] || category;
}

function getConditionName(condition) {
    const conditions = {
        'new': 'Новий',
        'like_new': 'Як новий',
        'good': 'Добрий',
        'used': 'Вживаний'
    };
    return conditions[condition] || condition;
}

function getUrgencyName(urgency) {
    const urgencies = {
        'low': 'Не терміново',
        'medium': 'Помірно терміново',
        'high': 'Дуже терміново'
    };
    return urgencies[urgency] || urgency;
}

function getStatusName(status) {
    const statuses = {
        'pending': 'В очікуванні',
        'completed': 'Завершено',
        'cancelled': 'Скасовано'
    };
    return statuses[status] || status;
}

function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    document.body.appendChild(alert);

    setTimeout(() => {
        alert.classList.add('fade-out');
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}