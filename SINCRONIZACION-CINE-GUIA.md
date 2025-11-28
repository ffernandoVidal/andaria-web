# Guía de Implementación: Sincronización Automática con Cinestar

## Descripción del Sistema Actual

La página `cine.html` está diseñada para mostrar la cartelera de Cinestar Paseo Andaria de forma dinámica. Actualmente funciona con datos de ejemplo, pero puede sincronizarse automáticamente con el sitio oficial de Cinestar.

## ¿Por qué no se sincroniza automáticamente desde el navegador?

Por razones de seguridad, los navegadores implementan una política llamada **CORS (Cross-Origin Resource Sharing)** que impide que JavaScript haga peticiones directas a sitios externos como cinestar.com.gt desde tu página web.

## Soluciones para Sincronización Automática

### Opción 1: Backend con Web Scraping (RECOMENDADO)

Esta es la solución más profesional y confiable.

#### Requisitos:
- Servidor backend (Node.js, Python, PHP, etc.)
- Librerías de scraping

#### Implementación con Node.js:

1. **Instalar dependencias:**
```bash
npm install express axios cheerio node-cron
```

2. **Crear archivo `server.js`:**
```javascript
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cron = require('node-cron');

const app = express();
let cachedMovies = [];

// Función para hacer scraping de Cinestar
async function scrapeCinestar() {
    try {
        const response = await axios.get('https://cinestar.com.gt/theater/paseo-andaria/');
        const $ = cheerio.load(response.data);
        
        const movies = [];
        
        // Ajustar selectores según la estructura real del HTML de Cinestar
        $('.movie-item, .film-card').each((index, element) => {
            const title = $(element).find('.movie-title, h3, h2').text().trim();
            const genre = $(element).find('.movie-genre, .genre').text().trim();
            const rating = $(element).find('.rating, .clasificacion').text().trim();
            
            const showtimes = [];
            $(element).find('.showtime, .horario, a[href*="showtime"]').each((i, timeEl) => {
                showtimes.push($(timeEl).text().trim());
            });
            
            if (title) {
                movies.push({
                    title,
                    genre,
                    rating,
                    showtimes,
                    language: 'ESPAÑOL'
                });
            }
        });
        
        cachedMovies = movies;
        console.log(`✅ Cartelera actualizada: ${movies.length} películas`);
        return movies;
        
    } catch (error) {
        console.error('❌ Error al obtener cartelera:', error.message);
        return cachedMovies; // Retornar cache si falla
    }
}

// Endpoint API para obtener películas
app.get('/api/movies', async (req, res) => {
    res.json({
        success: true,
        movies: cachedMovies,
        lastUpdate: new Date()
    });
});

// Actualizar cada 6 horas (Cinestar actualiza los jueves)
cron.schedule('0 */6 * * *', () => {
    console.log('🔄 Actualizando cartelera...');
    scrapeCinestar();
});

// Actualización inicial
scrapeCinestar();

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
```

3. **Actualizar `cine-script.js`:**
```javascript
// Reemplazar la función loadMovieData() con:
async function loadMovieData(selectedDate = null) {
    const moviesGrid = document.getElementById('movies-grid');
    const loadingContainer = document.getElementById('loading-container');
    const errorMessage = document.getElementById('error-message');
    
    loadingContainer.style.display = 'block';
    moviesGrid.style.display = 'none';
    errorMessage.style.display = 'none';
    
    try {
        const response = await fetch('/api/movies');
        const data = await response.json();
        
        if (data.success && data.movies.length > 0) {
            displayMovies(data.movies);
            loadingContainer.style.display = 'none';
            moviesGrid.style.display = 'grid';
        } else {
            throw new Error('No se encontraron películas');
        }
    } catch (error) {
        console.error('Error:', error);
        loadingContainer.style.display = 'none';
        errorMessage.style.display = 'block';
    }
}
```

4. **Ejecutar servidor:**
```bash
node server.js
```

---

### Opción 2: Python con Flask

#### Implementación:

1. **Instalar dependencias:**
```bash
pip install flask requests beautifulsoup4 flask-cors
```

2. **Crear archivo `app.py`:**
```python
from flask import Flask, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
from datetime import datetime
import schedule
import time
import threading

app = Flask(__name__)
CORS(app)

cached_movies = []

def scrape_cinestar():
    global cached_movies
    try:
        url = 'https://cinestar.com.gt/theater/paseo-andaria/'
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        movies = []
        
        # Ajustar selectores según estructura HTML de Cinestar
        movie_elements = soup.find_all(['div', 'article'], class_=['movie-item', 'film-card'])
        
        for movie in movie_elements:
            title = movie.find(['h2', 'h3', 'h4']).text.strip() if movie.find(['h2', 'h3', 'h4']) else ''
            
            if title:
                movies.append({
                    'title': title,
                    'genre': '',
                    'rating': '',
                    'showtimes': [],
                    'language': 'ESPAÑOL'
                })
        
        cached_movies = movies
        print(f'✅ Cartelera actualizada: {len(movies)} películas')
        
    except Exception as e:
        print(f'❌ Error: {str(e)}')

@app.route('/api/movies')
def get_movies():
    return jsonify({
        'success': True,
        'movies': cached_movies,
        'lastUpdate': datetime.now().isoformat()
    })

def schedule_updates():
    schedule.every(6).hours.do(scrape_cinestar)
    while True:
        schedule.run_pending()
        time.sleep(3600)

if __name__ == '__main__':
    scrape_cinestar()  # Carga inicial
    
    # Iniciar actualizaciones en background
    threading.Thread(target=schedule_updates, daemon=True).start()
    
    app.run(debug=True, port=3000)
```

3. **Ejecutar:**
```bash
python app.py
```

---

### Opción 3: PHP (Sin servidor adicional)

Si tu hosting soporta PHP, esta es la opción más simple:

**Crear archivo `api/movies.php`:**
```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$url = 'https://cinestar.com.gt/theater/paseo-andaria/';
$html = file_get_contents($url);

if ($html === false) {
    echo json_encode(['success' => false, 'error' => 'No se pudo conectar']);
    exit;
}

// Parsear HTML y extraer datos
$movies = [];

// Usar regex o DOMDocument para extraer datos
$dom = new DOMDocument();
@$dom->loadHTML($html);

// Ajustar según estructura HTML de Cinestar
$xpath = new DOMXPath($dom);
$movieNodes = $xpath->query("//div[contains(@class, 'movie')]");

foreach ($movieNodes as $node) {
    $title = $xpath->query(".//h3", $node)->item(0);
    if ($title) {
        $movies[] = [
            'title' => $title->textContent,
            'genre' => '',
            'showtimes' => []
        ];
    }
}

echo json_encode([
    'success' => true,
    'movies' => $movies,
    'lastUpdate' => date('c')
]);
?>
```

**Actualizar JavaScript:**
```javascript
fetch('/api/movies.php')
    .then(res => res.json())
    .then(data => displayMovies(data.movies));
```

---

### Opción 4: Servicio Externo (Zapier, IFTTT)

Usar servicios de automatización que actualicen un archivo JSON:

1. Configurar Zapier para scraping semanal
2. Guardar resultado en Google Sheets o archivo JSON
3. Leer desde tu sitio web

---

## Consideraciones Importantes

### Legalidad
- Revisar términos de servicio de Cinestar
- El scraping debe ser respetuoso (no sobrecargar servidor)
- Considerar contactar a Cinestar para API oficial

### Caché
- Implementar sistema de caché (Redis, archivos)
- Actualizar solo cuando sea necesario (jueves según Cinestar)
- Reducir carga en servidor de Cinestar

### Manejo de Errores
- Mantener última cartelera válida en caso de fallo
- Mostrar mensaje al usuario si no hay datos
- Link directo a Cinestar como fallback

### Actualización Manual (Temporal)
Mientras implementas backend, puedes actualizar manualmente:

1. Crear archivo `movies-data.json`:
```json
{
  "movies": [
    {
      "title": "Película 1",
      "genre": "Acción",
      "showtimes": ["2:00 PM", "5:00 PM"]
    }
  ]
}
```

2. Cargar desde JavaScript:
```javascript
fetch('movies-data.json')
    .then(res => res.json())
    .then(data => displayMovies(data.movies));
```

---

## Recomendación Final

Para tu caso, recomiendo:

1. **Corto plazo:** Usar datos de ejemplo actualizados manualmente cada jueves
2. **Mediano plazo:** Implementar backend Node.js o Python con scraping
3. **Largo plazo:** Contactar Cinestar para API oficial o colaboración

## Soporte

Si necesitas ayuda con la implementación, considera:
- Contratar desarrollador backend
- Usar servicios de hosting con soporte PHP
- Implementar solución en la nube (AWS Lambda, Google Cloud Functions)

---

**Nota:** El archivo `cine-script.js` ya está preparado para recibir datos de cualquiera de estas implementaciones. Solo necesitas actualizar la función `loadMovieData()` para apuntar a tu endpoint.
