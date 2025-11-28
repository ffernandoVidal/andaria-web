// Script para cargar y sincronizar la cartelera de Cinestar Paseo Andaria
// Este script carga la información de películas de forma dinámica

document.addEventListener('DOMContentLoaded', function() {
    initCinePage();
});

function initCinePage() {
    generateDates();
    loadMovieData();
}

// Generar selector de fechas (próximos 14 días)
function generateDates() {
    const datesContainer = document.getElementById('dates-container');
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        const dateBtn = document.createElement('button');
        dateBtn.className = 'date-btn' + (i === 0 ? ' active' : '');
        dateBtn.setAttribute('data-date', formatDate(date));
        
        const dayName = date.toLocaleDateString('es-GT', { weekday: 'short' });
        const dayNumber = date.getDate();
        const monthName = date.toLocaleDateString('es-GT', { month: 'short' });
        
        dateBtn.innerHTML = `
            <div class="day">${dayName}</div>
            <div class="date">${dayNumber}</div>
            <div class="month">${monthName}</div>
        `;
        
        dateBtn.addEventListener('click', function() {
            // Remover active de todos
            document.querySelectorAll('.date-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            // Añadir active al seleccionado
            this.classList.add('active');
            // Recargar películas para esta fecha
            loadMovieData(this.getAttribute('data-date'));
        });
        
        datesContainer.appendChild(dateBtn);
    }
}

function formatDate(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

// Cargar datos de películas
// NOTA: Debido a CORS, no podemos hacer fetch directo a cinestar.com.gt desde el navegador
// Esta es una implementación con datos de ejemplo que muestra cómo funcionaría
function loadMovieData(selectedDate = null) {
    const moviesGrid = document.getElementById('movies-grid');
    const loadingContainer = document.getElementById('loading-container');
    const errorMessage = document.getElementById('error-message');
    
    // Mostrar loading
    loadingContainer.style.display = 'block';
    moviesGrid.style.display = 'none';
    errorMessage.style.display = 'none';
    
    // Simular carga de datos
    setTimeout(() => {
        try {
            // Aquí iría la lógica para obtener datos reales
            // Por ahora, usamos datos de ejemplo basados en la estructura de Cinestar
            const movies = getExampleMovies();
            
            if (movies && movies.length > 0) {
                displayMovies(movies);
                loadingContainer.style.display = 'none';
                moviesGrid.style.display = 'grid';
            } else {
                throw new Error('No movies found');
            }
        } catch (error) {
            console.error('Error loading movies:', error);
            loadingContainer.style.display = 'none';
            errorMessage.style.display = 'block';
        }
    }, 1500);
}

// Función con datos actuales de Cinestar Paseo Andaria (Actualizado: 26 Nov 2025)
function getExampleMovies() {
    return [
        {
            title: 'Wicked: Por Siempre',
            genre: 'Musical / Fantasía / Drama',
            rating: 'PG',
            language: 'ESPAÑOL',
            formats: ['CXC', '3D'],
            showtimes: ['03:00 PM', '06:00 PM', '09:00 PM'],
            poster: 'https://image.tmdb.org/t/p/w500/c5Tqxeo1UpBvnAc3csUm7j3hlQl.jpg'
        },
        {
            title: 'Depredador: Tierras Salvajes',
            genre: 'Ciencia Ficción / Acción / Thriller',
            rating: 'NR',
            language: 'ESPAÑOL',
            formats: ['2D'],
            showtimes: ['02:00 PM', '03:30 PM', '04:30 PM', '06:00 PM', '07:00 PM', '08:30 PM', '09:30 PM'],
            poster: 'https://image.tmdb.org/t/p/w500/6FmZ4FmUfOVn7E5lC8JK5yw7Kdo.jpg'
        },
        {
            title: 'Los Ilusionistas 3: Ahora me ves, ahora no',
            genre: 'Thriller / Misterio / Crimen',
            rating: 'PG-13',
            language: 'ESPAÑOL',
            formats: ['2D'],
            showtimes: ['01:30 PM', '04:00 PM', '06:30 PM', '09:00 PM'],
            poster: 'https://image.tmdb.org/t/p/w500/kJr0yTi4TzXay9KYkyKawjssFhG.jpg'
        },
        {
            title: 'Jujutsu Kaisen: Ejecución',
            genre: 'Drama / Thriller / Anime',
            rating: 'NR',
            language: 'ESPAÑOL',
            formats: ['2D'],
            showtimes: ['01:15 PM', '04:30 PM', '06:30 PM', '08:25 PM'],
            poster: 'https://image.tmdb.org/t/p/w500/9w0Gn0EjYhDzOjGmE0Rp86qKNgc.jpg'
        },
        {
            title: 'Zoopocalipsis',
            genre: 'Aventura / Animación / Familia',
            rating: 'NR',
            language: 'ESPAÑOL',
            formats: ['2D'],
            showtimes: ['01:00 PM', '03:05 PM', '05:10 PM'],
            poster: 'https://image.tmdb.org/t/p/w500/kfd2SZz6LxBQONNFKV8NmW6PzPu.jpg'
        },
        {
            title: 'Chainsaw Man: La Película - Arco de Reze',
            genre: 'Anime / Acción / Fantasía',
            rating: 'NR',
            language: 'ESPAÑOL',
            formats: ['2D'],
            showtimes: ['01:00 PM', '03:10 PM'],
            poster: 'https://image.tmdb.org/t/p/w500/vRd0gipJzgaoJOaIHu2KJLyb21K.jpg'
        },
        {
            title: 'Terror en Shelby Oaks',
            genre: 'Terror / Misterio / Suspenso',
            rating: 'NR',
            language: 'ESPAÑOL',
            formats: ['2D'],
            showtimes: ['07:15 PM', '09:30 PM'],
            poster: 'https://image.tmdb.org/t/p/w500/8TGFHJdKcFPjqhLzPDTKqOy0JWu.jpg'
        },
        {
            title: 'HARRY POTTER - Cáliz de Fuego',
            genre: 'Aventura / Familia / Fantasía',
            rating: 'NR',
            language: 'ESPAÑOL',
            formats: ['2D'],
            showtimes: ['08:30 PM'],
            poster: 'https://image.tmdb.org/t/p/w500/fECBtHlr0RB3foNHDiCBXeg9Bv9.jpg'
        },
        {
            title: 'EL MAGO DE OZ 1939',
            genre: 'Clásico / Familia / Musical',
            rating: 'NR',
            language: 'ESPAÑOL',
            formats: ['2D'],
            showtimes: ['02:15 PM'],
            poster: 'https://image.tmdb.org/t/p/w500/6zbF73SpmRpJViJPjQE3MSLdIxT.jpg'
        },
        {
            title: 'El Sobreviviente',
            genre: 'Thriller / Acción / Ciencia Ficción',
            rating: 'NR',
            language: 'ESPAÑOL',
            formats: ['2D'],
            showtimes: ['05:30 PM'],
            poster: 'https://image.tmdb.org/t/p/w500/4OTYefcAlaShn6TGVK33UxLW9R7.jpg'
        }
    ];
}

// Mostrar películas en el DOM
function displayMovies(movies) {
    const moviesGrid = document.getElementById('movies-grid');
    moviesGrid.innerHTML = '';
    
    movies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        moviesGrid.appendChild(movieCard);
    });
}

// Crear card de película
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    
    // Crear badges de formato
    let badgesHTML = '';
    if (movie.formats && movie.formats.length > 0) {
        movie.formats.forEach(format => {
            const badgeClass = format.toLowerCase().replace(' ', '-');
            badgesHTML += `<span class="badge badge-${badgeClass}">${format}</span>`;
        });
    }
    if (movie.language) {
        badgesHTML += `<span class="badge badge-español">${movie.language}</span>`;
    }
    
    // Crear botones de horarios
    let showtimesHTML = '';
    if (movie.showtimes && movie.showtimes.length > 0) {
        movie.showtimes.forEach(time => {
            showtimesHTML += `<button class="showtime-btn">${time}</button>`;
        });
    }
    
    card.innerHTML = `
        <div class="movie-poster">
            ${movie.poster 
                ? `<img src="${movie.poster}" alt="${movie.title}" loading="lazy">` 
                : '<i class="fas fa-film placeholder"></i>'
            }
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${movie.title}</h3>
            <div class="movie-badges">
                ${badgesHTML}
            </div>
            ${movie.genre ? `<p class="movie-genre"><i class="fas fa-tags"></i> ${movie.genre}</p>` : ''}
            ${movie.rating ? `<p class="movie-rating"><i class="fas fa-star"></i> Clasificación: ${movie.rating}</p>` : ''}
            ${movie.showtimes && movie.showtimes.length > 0 ? `
                <div class="showtimes">
                    ${showtimesHTML}
                </div>
            ` : ''}
        </div>
    `;
    
    return card;
}

// Función para actualizar datos reales desde el servidor
// IMPORTANTE: Para sincronización real, necesitarás un backend que haga scraping o use la API de Cinestar
function fetchRealMovieData() {
    /* 
    IMPLEMENTACIÓN BACKEND REQUERIDA:
    
    Opción 1: Backend con Web Scraping (Node.js, Python, PHP)
    - Crear un endpoint en tu servidor: /api/cinestar-movies
    - El servidor hace scraping de https://cinestar.com.gt/theater/paseo-andaria/
    - Retorna los datos en formato JSON
    - El frontend hace fetch a tu API
    
    Ejemplo con Node.js + Express + Axios + Cheerio:
    
    app.get('/api/cinestar-movies', async (req, res) => {
        try {
            const response = await axios.get('https://cinestar.com.gt/theater/paseo-andaria/');
            const $ = cheerio.load(response.data);
            
            const movies = [];
            $('.movie-item').each((i, elem) => {
                movies.push({
                    title: $(elem).find('.movie-title').text(),
                    genre: $(elem).find('.movie-genre').text(),
                    showtimes: $(elem).find('.showtime').map((i, el) => $(el).text()).get()
                    // ... más campos
                });
            });
            
            res.json(movies);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching data' });
        }
    });
    
    Luego desde el frontend:
    
    fetch('/api/cinestar-movies')
        .then(res => res.json())
        .then(movies => displayMovies(movies))
        .catch(error => console.error('Error:', error));
    
    
    Opción 2: Usar CORS Proxy (No recomendado para producción)
    - Usar servicio como cors-anywhere
    - fetch('https://cors-anywhere.herokuapp.com/https://cinestar.com.gt/theater/paseo-andaria/')
    
    
    Opción 3: Actualización Manual Diaria/Semanal
    - Crear un admin panel donde actualizas manualmente la cartelera
    - Guardar en base de datos o archivo JSON
    - Cargar desde tu propio servidor
    */
    
    // Ejemplo de fetch a tu propio backend:
    /*
    fetch('/api/cinestar-movies')
        .then(response => response.json())
        .then(data => {
            displayMovies(data.movies);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('error-message').style.display = 'block';
        });
    */
}

// Exportar funciones si se necesitan en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadMovieData,
        displayMovies,
        createMovieCard
    };
}
