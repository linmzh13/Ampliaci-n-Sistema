const CLAVE = 'labstock-v2';
const $ = selector => document.querySelector(selector);
const avisar = texto => { $('#mensaje').textContent = texto; };
let inventario = new Inventario();
try {
  const guardado = localStorage.getItem(CLAVE);
  if (guardado !== null) inventario = Inventario.desdeJSON(JSON.parse(guardado));
} catch (error) { avisar('No se pudo cargar: ' + error.message); }

function guardar() {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(inventario));
    return 'Cambio guardado.';
  } catch {
    return 'Cambio en memoria. No se pudo guardar en este navegador.';
  }
}

function renderizar() {
  const todos = inventario.buscar();
  const disponibles = todos.reduce((s, e) => s + e.disponibles, 0);
  $('#resumen').textContent = `${todos.length} referencias / ${disponibles} unidades disponibles`;
  const filas = $('#filas');
  filas.replaceChildren();
  
  for (const e of inventario.buscar($('#busqueda').value)) {
    const fila = document.createElement('tr');
    
    for (const valor of [e.codigo, e.nombre, e.ubicacion, e.total]) {
      const celda = document.createElement('td');
      celda.textContent = valor;
      fila.append(celda);
    }
    
    const celdaDisponibles = document.createElement('td');
    if (e.disponibles <= 2) {
      celdaDisponibles.innerHTML = `${e.disponibles} <span style="color: #d93838; font-weight: bold; font-size: 0.85rem;">(¡Baja disponibilidad!)</span>`;
    } else {
      celdaDisponibles.textContent = e.disponibles;
    }
    fila.append(celdaDisponibles);

    const celdaPrestados = document.createElement('td');
    celdaPrestados.textContent = e.prestados;
    fila.append(celdaPrestados);

    const acciones = document.createElement('td');
    for (const accion of ['prestar', 'devolver']) {
      const boton = document.createElement('button');
      boton.textContent = accion === 'prestar' ? 'Prestar' : 'Devolver';
      boton.dataset.codigo = e.codigo;
      boton.dataset.accion = accion;
      boton.disabled = accion === 'prestar' ? e.disponibles === 0 : e.prestados === 0;
      acciones.append(boton);
    }
    fila.append(acciones);
    filas.append(fila);
  }
  
  if (!filas.children.length) {
    const fila = filas.insertRow();
    const celda = fila.insertCell();
    celda.colSpan = 7;
    celda.textContent = 'No hay equipos para mostrar.';
  }
}

$('#registro').addEventListener('submit', evento => {
  evento.preventDefault();
  try {
    const datos = new FormData(evento.currentTarget);
    inventario.agregar(new Equipo(
      datos.get('codigo'),
      datos.get('nombre'),
      Number(datos.get('total')),
      0,
      datos.get('ubicacion')
    ));
    avisar(guardar());
    evento.currentTarget.reset();
    $('#registro [name="ubicacion"]').value = 'Laboratorio Principal';
    renderizar();
  } catch (error) { avisar(error.message); }
});

$('#busqueda').addEventListener('input', renderizar);

$('#filas').addEventListener('click', evento => {
  const boton = evento.target.closest('button[data-accion]');
  if (!boton) return;
  try {
    inventario.mover(boton.dataset.codigo, boton.dataset.accion);
    avisar(guardar());
    renderizar();
  } catch (error) { avisar(error.message); }
});

renderizar();