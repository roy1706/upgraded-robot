// Variables globales
let frasesDB = {};
let categoriaActual = 'amor'; // Categoría por defecto

// Elementos del DOM
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const categoryButtons = document.querySelectorAll('.category-btn');
const randomButton = document.getElementById('random-btn');
const nextButton = document.getElementById('next-btn');

// Cargar frases desde JSON
async function cargarFrases() {
    try {
        const categorias = ['amor', 'tristeza', 'sabiduria', 'motivacion', 'amistad'];
        
        // Cargar todas las categorías en paralelo
        const promises = categorias.map(categoria => 
            fetch(`frases/${categoria}.json`)
                .then(response => response.json())
                .then(data => {
                    frasesDB[categoria] = data;
                })
        );

        await Promise.all(promises);
        mostrarFraseAleatoria(); // Mostrar una frase al cargar

    } catch (error) {
        console.error("Error cargando frases:", error);
        quoteText.textContent = "Error al cargar las frases. Recarga la página.";
    }
}

// Mostrar frase aleatoria de la categoría actual
function mostrarFraseAleatoria() {
    const frases = frasesDB[categoriaActual];
    if (!frases || frases.length === 0) {
        quoteText.textContent = "No hay frases disponibles en esta categoría.";
        return;
    }

    const indiceAleatorio = Math.floor(Math.random() * frases.length);
    const frase = frases[indiceAleatorio];

    // Animación de transición
    quoteText.style.opacity = 0;
    quoteAuthor.style.opacity = 0;

    setTimeout(() => {
        quoteText.textContent = frase.texto;
        quoteAuthor.textContent = frase.autor || "Anónimo";
        
        // Restaurar opacidad con animación
        quoteText.style.opacity = 1;
        quoteAuthor.style.opacity = 1;
    }, 300);
}

// Event Listeners
function configurarEventos() {
    // Botones de categoría
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            categoriaActual = button.dataset.category;
            mostrarFraseAleatoria();
        });
    });

    // Botón aleatorio
    randomButton.addEventListener('click', mostrarFraseAleatoria);

    // Botón siguiente
    nextButton.addEventListener('click', mostrarFraseAleatoria);

    // Compartir frase (opcional)
    document.getElementById('share-btn')?.addEventListener('click', compartirFrase);
}

// Función para compartir (opcional)
function compartirFrase() {
    const texto = `${quoteText.textContent} - ${quoteAuthor.textContent}`;
    if (navigator.share) {
        navigator.share({
            title: 'Frase inspiradora',
            text: texto,
            url: window.location.href
        }).catch(err => console.log('Error al compartir:', err));
    } else {
        // Fallback para navegadores sin soporte de Web Share API
        navigator.clipboard.writeText(texto)
            .then(() => alert('¡Frase copiada al portapapeles!'))
            .catch(err => console.error('Error al copiar:', err));
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cargarFrases();
    configurarEventos();
});