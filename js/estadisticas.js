import { estadisticasPorGenero } from "./api.js";

const $ = selector => document.querySelector(selector);

function mostrarMensaje(texto, esError = false) {
    $("#estado").textContent = texto;
    $("#estado").classList.toggle("error", esError);
}

function celda(texto) {
    const td = document.createElement("td");
    td.textContent = texto;
    return td;
}

function pintarFilas(filas) {
    const cuerpo = $("#cuerpo-estadisticas");
    cuerpo.replaceChildren();
    for (const fila of filas) {
        const tr = document.createElement("tr");
        const nota = fila.notaMedia === null || fila.notaMedia === undefined
            ? "Sin nota"
            : String(fila.notaMedia);
        tr.append(celda(fila.genero), celda(fila.total), celda(nota));
        cuerpo.append(tr);
    }
}

async function cargarEstadisticas(filtros = {}) {
    mostrarMensaje("...Cargando");
    try {
        const filas = await estadisticasPorGenero(filtros);
        pintarFilas(filas);
        mostrarMensaje(
            filas.length ? `${filas.length} géneros` : "No hay géneros que cumplan el filtro."
        );
    } catch (error) {
        $("#cuerpo-estadisticas").replaceChildren();
        mostrarMensaje(error.message, true);
    }
}

$("#form-estadisticas").addEventListener("submit", evento => {
    evento.preventDefault();
    const valores = Object.fromEntries(new FormData(evento.target));
    const filtros = Object.fromEntries(
        Object.entries(valores).filter(([, valor]) => valor !== "")
    );
    cargarEstadisticas(filtros);
});

cargarEstadisticas();
