document.addEventListener("DOMContentLoaded", function () {

    function listarCursosPorDocente(docenteId) {
        $.ajax({
            url: `http://localhost:8081/docentes/${docenteId}/cursos`,
            method: 'get',
            dataType: 'json',
            success: function (cursos) {
                console.log('Cursos obtenidos:', cursos);

                if (Array.isArray(cursos)) {
                    mostrarCursosEnTabla(cursos);
                } else {
                    console.log('Respuesta inesperada del servidor (cursos):', cursos);
                    alert('Error al obtener los cursos asociados al docente');
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log('Error en la solicitud AJAX (listarCursosPorDocente):', textStatus, errorThrown);
                alert('Error al obtener los cursos asociados al docente');
            }
        });
    }

    function mostrarCursosEnTabla(cursos) {
    var tableBody = document.getElementById('cursosAsociadosBody');
    tableBody.innerHTML = '';

    var cursosAsociadosTable = document.getElementById('cursosAsociadosTable');

    if (cursos.length === 0) {
        cursosAsociadosTable.classList.add('hidden-table');
        var emptyRow = document.createElement('tr');
        emptyRow.innerHTML = '<td colspan="3">El docente no tiene cursos asociados</td>';
        tableBody.appendChild(emptyRow);
    } else {
        cursosAsociadosTable.classList.remove('hidden-table');
        cursos.forEach(curso => {
            var row = document.createElement('tr');
            row.innerHTML = `<td>${curso.id}</td><td>${curso.nombre}</td><td>${curso.docente}</td>`;
            tableBody.appendChild(row);
        });
    }
}

    function obtenerDocentes() {
        $.ajax({
            url: 'http://localhost:8081/docentes',
            method: 'get',
            dataType: 'json',
            success: function (response) {
                mostrarDocentes(response);
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

    function mostrarDocentes(docentes) {
        var tableBody = document.getElementById('docentesBody');
        tableBody.innerHTML = '';

        docentes.forEach(docente => {
            obtenerDescripcionOcupacion(docente.ocupacion, function (descripcionOcupacion) {
                var row = document.createElement('tr');
                row.innerHTML = `<td>${docente.id}</td><td>${docente.nombre}</td><td>${descripcionOcupacion}</td><td><a href="../view/formularioDocente.html?id=${docente.id}" class="button editar">Editar</a> | <button class="button eliminar-docente" data-id="${docente.id}">Eliminar</button> | <button class="button listar-cursos" data-id="${docente.id}">Listar Cursos</button></td>`;
                tableBody.appendChild(row);
            });
        });

        document.getElementById('docentesTable').addEventListener('click', function (e) {
            if (e.target.classList.contains('listar-cursos')) {
                e.preventDefault();
                var docenteId = e.target.getAttribute('data-id');
                listarCursosPorDocente(docenteId);
            } else if (e.target.classList.contains('eliminar-docente')) {
                e.preventDefault();
                var docenteId = e.target.getAttribute('data-id');
                if (confirm('¿Estás seguro de que quieres eliminar a este docente?')) {
                    eliminarDocente(docenteId);
                }
            }
        });
    }

    function eliminarDocente(docenteId) {
        $.ajax({
            url: `http://localhost:8081/docentes/${docenteId}/cursos`,
            method: 'get',
            dataType: 'json',
            success: function (cursos) {
                if (cursos.length > 0) {
                    alert('No se puede eliminar al docente porque tiene cursos asociados.');
                } else {
                    realizarEliminacionDocente(docenteId);
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log('Error en la solicitud AJAX (verificarCursosDocente):', textStatus, errorThrown);
                alert('Error al verificar los cursos asociados al docente');
            }
        });
    }
    function realizarEliminacionDocente(docenteId) {
        $.ajax({
            url: 'http://localhost:8081/docentes/' + docenteId,
            method: 'delete',
            dataType: 'json',
            success: function (response) {
                updateTableDocentes();
                alert('Docente eliminado exitosamente');
            },
            error: function (xhr) {
                if (xhr.status === 200) {
                    updateTableDocentes();
                    alert('Docente eliminado exitosamente');
                } else {
                    console.log('Error en la solicitud AJAX (eliminarDocente):', xhr);
                    console.log('Respuesta completa:', xhr.responseText);
                    alert('Error al intentar eliminar al docente');
                }
            }
        });
    }

    function obtenerDescripcionOcupacion(idOcupacion, callback) {
        $.ajax({
            url: `http://localhost:8081/ocupaciones/${idOcupacion}`,
            method: 'get',
            dataType: 'json',
            success: function (response) {
                callback(response.descripcion);
            },
        });
    }

    function mostrarCursos(cursos) {
        var tableBody = document.getElementById('cursosBody');
        tableBody.innerHTML = '';

        cursos.forEach(curso => {
            obtenerNombreDocente(curso.docente, function (nombreDocente) {
                var row = document.createElement('tr');
                row.innerHTML = `<td>${curso.id}</td><td>${curso.nombre}</td><td>${nombreDocente}</td><td><a href="#" class="button editar" data-id="${curso.id}">Editar</a> | <a href="#" class="button eliminar" data-codigo="${curso.id}">Eliminar</a></td>`;
                tableBody.appendChild(row);
            });
        });
    }

    function obtenerNombreDocente(idDocente, callback) {
        $.ajax({
            url: `http://localhost:8081/docentes/${idDocente}`,
            method: 'get',
            dataType: 'json',
            success: function (response) {
                callback(response.nombre);
            },
        });
    }

    function updateTableDocentes() {
        obtenerDocentes();
    }


    document.getElementById('registrarLinkDocentes').addEventListener('click', function (e) {
        window.location.href = '../view/formularioDocente.html';
    });

    function eliminarCurso(codigo) {
        $.ajax({
            url: 'http://localhost:8081/cursos/' + codigo,
            method: 'delete',
            dataType: 'json',
            success: function (response) {
                updateTableCursos();
                alert('Curso eliminado exitosamente');
            },
            error: function (xhr) {
                if (xhr.status === 200) {
                    updateTableCursos();
                    alert('Curso eliminado exitosamente');
                } else {
                    console.log('Error en la solicitud AJAX (eliminarCurso):', xhr);
                    console.log('Respuesta completa:', xhr.responseText);
                    alert('Error al intentar eliminar el curso');
                }
            }
        });
    }

    function obtenerCursos() {
        $.ajax({
            url: 'http://localhost:8081/cursos',
            method: 'get',
            dataType: 'json',
            success: function (response) {
                console.log('Respuesta del backend (cursos):', response);
                mostrarCursos(response);
            },
            error: function (error) {
                console.log('Error en la solicitud AJAX (cursos):', error);
            }
        });
    }

    function updateTableCursos() {
        obtenerCursos();
    }

    document.getElementById('cursosTable').addEventListener('click', function (e) {
        if (e.target.classList.contains('editar')) {
            e.preventDefault();
            var cursoId = e.target.getAttribute('data-id');

            window.location.href = `../view/formularioCurso.html?id=${cursoId}`;
        } else if (e.target.classList.contains('eliminar')) {
            e.preventDefault();
            var codigo = e.target.getAttribute('data-codigo');
            if (confirm('¿Estás seguro de que quieres eliminar este curso?')) {
                eliminarCurso(codigo);
            }
        }
    });

    document.getElementById('registrarLinkCursos').addEventListener('click', function (e) {
        window.location.href = '../view/formularioCurso.html';
    });

    obtenerCursos();
    obtenerDocentes();

    $('#docenteForm').submit(function (e) {
        e.preventDefault();
        registrarDocente();
    });

    $('#cursoForm').submit(function (e) {
        e.preventDefault();
        registrarCurso();
    });
    
    
});
