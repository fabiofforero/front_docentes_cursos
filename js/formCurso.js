document.addEventListener("DOMContentLoaded", function () {
    cargarDocentes();

    var urlParams = new URLSearchParams(window.location.search);
    var cursoId = urlParams.get('id');

    if (cursoId) {
        cargarDatosCurso(cursoId);
    }

    $('#cursoForm').submit(function (e) {
        e.preventDefault();

        var id = $('#id').val();
        var nombre = $('#nombre').val();
        var docente = $('#docente').val();

        var cursoData = {
            id: id,
            nombre: nombre,
            docente: docente
        };

        var ajaxType = 'POST';
        var ajaxUrl = 'http://localhost:8081/cursos';

        if (cursoId) {
            ajaxType = 'PUT';
            ajaxUrl = `http://localhost:8081/cursos/${cursoId}`;
        }

        $.ajax({
            type: ajaxType,
            url: ajaxUrl,
            data: cursoData,
            dataType: 'json',
            success: function (response) {
                console.log('Respuesta del servidor:', response);

                alert(cursoId ? 'Curso actualizado exitosamente' : 'Curso registrado exitosamente');

                window.location.href = '../index.html';
            },
            error: function (error) {
                console.error('Error al registrar/editar curso:', error);

                alert(cursoId ? 'Error al actualizar curso' : 'Error al registrar curso ID en uso');
            }
        });
    });

    function cargarDatosCurso(id) {
        $.ajax({
            url: `http://localhost:8081/cursos/${id}`,
            method: 'get',
            dataType: 'json',
            success: function (curso) {
                $('#id').val(curso.id);
                $('#nombre').val(curso.nombre);
                $('#docente').val(curso.docente);
    
                $('#id').prop('disabled', true);
            },
            error: function (xhr) {
                console.log('Error en la solicitud AJAX (obtener detalles del curso):', xhr);
            }
        });
    }

    function cargarDocentes() {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8081/docentes',
            dataType: 'json',
            success: function (response) {
                $('#docente').empty();

                response.forEach(function (docente) {
                    $('#docente').append('<option value="' + docente.id + '">' + docente.nombre + '</option>');
                });
            },
            error: function (error) {
                console.error('Error al cargar docentes:', error);
            }
        });
    }
});
