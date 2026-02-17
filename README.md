# Manipulación segura de alimentos — Quiz

Juego tipo Duolingo/Preguntados para estudiar **Manipulación segura de alimentos**. Sin backend; el progreso se guarda en cookies (y en localStorage como respaldo).

## Cómo ejecutar

### Recomendado: servidor local (para que las cookies persistan)

Si abrís el archivo directamente (`file:///...`), las cookies pueden no guardarse. Para que el progreso se guarde correctamente, ejecutá un servidor local:

- **Windows:**  
  `py -m http.server 8000`

- **Mac/Linux:**  
  `python3 -m http.server 8000`

Luego abrí en el navegador: **http://localhost:8000**

(Abrí la carpeta del proyecto en la terminal antes de ejecutar el comando.)

### Sin servidor

Podés abrir `index.html` directamente. Si el navegador no permite cookies en `file://`, verás un aviso y el progreso se intentará guardar en **localStorage** como respaldo.

## Cómo resetear el progreso

En la **pantalla de inicio** del juego, hacé clic en **«Resetear progreso»**. Se borran las cookies del quiz y el respaldo en localStorage.

## Archivos

- `index.html` — Estructura y pantallas (inicio + quiz).
- `styles.css` — Estilos, tarjeta central, botones grandes, responsive y focus visible.
- `app.js` — Banco de preguntas, lógica del juego, cookies/localStorage, tipos single/multi/match/order, XP, racha, nivel y selección inteligente.

## Funcionalidades

- **Tipos de pregunta:** una correcta (radio), varias correctas (checkbox), unir con dropdown, ordenar con ▲ ▼.
- **Progreso:** XP (+10 por acierto), racha (se corta al errar), nivel (cada 100 XP).
- **Guardado:** cookies (365 días), serialización compacta y en varias cookies si hace falta; respaldo en localStorage si las cookies fallan.
- **Selección:** prioridad a preguntas nuevas; luego ponderado por fallos y recencia; se evitan las últimas 5 mostradas.
