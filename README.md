# Ampliacion-Sistema

# LabStock: inventario de laboratorio (Ubicación)

## Ejecución

En esta carpeta ejecute `python -m http.server 8000` y abra `http://localhost:8000` en su navegador. Python se usa únicamente para servir los archivos.

## Novedades de esta versión

* **Ubicación:** Se añadió el atributo `ubicacion` a cada referencia de equipo (con valor por defecto `'Laboratorio Principal'` para datos anteriores).
* **Alerta de baja disponibilidad:** La interfaz muestra automáticamente una advertencia textual y visual cuando a una referencia le quedan 2 o menos unidades disponibles.
* **Búsqueda avanzada:** El campo de búsqueda filtra de manera integrada tanto por código, nombre como por ubicación del equipo.

## Evidencias

<img width="902" height="497" alt="Captura de pantalla 2026-11-03 182025" src="https://github.com/user-attachments/assets/34b010ff-1364-4e00-a591-d5ea0b4dddb9" />

<img width="890" height="485" alt="Captura de pantalla 2026-11-03 182038" src="https://github.com/user-attachments/assets/1e9c6df3-1482-4c6d-812b-f706c174106e" />
