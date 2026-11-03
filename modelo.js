class Equipo {
  #prestados;
  constructor(codigo, nombre, total, prestados = 0, ubicacion = 'Laboratorio Principal') {
    if (!codigo.trim() || !nombre.trim() || !ubicacion.trim())
      throw new Error('Complete codigo, nombre y ubicacion.');
    if (!Number.isInteger(total) || total < 1 ||
        !Number.isInteger(prestados) || prestados < 0 || prestados > total)
      throw new Error('Cantidades invalidas.');
    this.codigo = codigo.trim().toUpperCase();
    this.nombre = nombre.trim();
    this.total = total;
    this.#prestados = prestados;
    this.ubicacion = ubicacion.trim();
  }
  get disponibles() { return this.total - this.#prestados; }
  get prestados() { return this.#prestados; }
  prestar() {
    if (this.disponibles === 0) throw new Error('Sin unidades disponibles.');
    this.#prestados++;
  }
  devolver() {
    if (this.#prestados === 0) throw new Error('No hay prestamos.');
    this.#prestados--;
  }
  toJSON() {
    return { codigo: this.codigo, nombre: this.nombre,
      total: this.total, prestados: this.#prestados, ubicacion: this.ubicacion };
  }
}

class Inventario {
  #equipos = new Map();
  agregar(equipo) {
    if (!(equipo instanceof Equipo)) throw new Error('Se requiere un Equipo.');
    if (this.#equipos.has(equipo.codigo)) throw new Error('Codigo duplicado.');
    this.#equipos.set(equipo.codigo, equipo);
  }
  buscar(texto = '') {
    const q = texto.trim().toLowerCase();
    return [...this.#equipos.values()].filter(e =>
      (e.codigo + ' ' + e.nombre + ' ' + e.ubicacion).toLowerCase().includes(q));
  }
  mover(codigo, accion) {
    const equipo = this.#equipos.get(codigo);
    if (!equipo) throw new Error('Equipo inexistente.');
    if (accion === 'prestar') equipo.prestar();
    else if (accion === 'devolver') equipo.devolver();
    else throw new Error('Accion invalida.');
  }
  toJSON() { return [...this.#equipos.values()]; }
  static desdeJSON(datos) {
    if (!Array.isArray(datos)) throw new Error('Formato invalido.');
    const inventario = new Inventario();
    datos.forEach(d => inventario.agregar(
      new Equipo(d.codigo, d.nombre, d.total, d.prestados, d.ubicacion || 'Laboratorio Principal')));
    return inventario;
  }
}