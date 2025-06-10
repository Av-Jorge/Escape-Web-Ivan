# Daily English Practice

Aplicación web sencilla para repasar lecciones de inglés utilizando un sistema de repetición espaciada (SRS) simplificado. Se guarda toda la información de manera local usando IndexedDB.

## Estructura

- `index.html` – pantalla principal y registro de lecciones.
- `archive.html` – repositorio con búsqueda y repaso libre.
- `css/tailwind.css` – estilos de Tailwind CSS.
- `js/db.js` – funciones para interactuar con IndexedDB a través de la librería `idb`.
- `js/app.js` – lógica del SRS y de la interfaz.
- `assets/audio/` – carpeta para los audios grabados.

## Despliegue

Puedes publicar la carpeta en cualquier servicio de hosting estático como GitHub Pages, Netlify o Vercel. Solo necesitas servir los archivos tal cual.

## Ejemplo de lección

```json
{
  "date": "2025-06-10",
  "topic": "Countable vs. Uncountable",
  "items": [
    {
      "word": "how many",
      "type": "question word",
      "spanish": "¿cuántos?",
      "example": "___ oranges do you want?",
      "ipa": "haʊ ˈmeni",
      "esp_pron": "jaú méni"
    }
  ]
}
```

Pega el JSON en el cuadro de texto de la página principal para añadir la lección.
