document.addEventListener("DOMContentLoaded", function () {
    cargarOcupaciones();

    var urlParams = new URLSearchParams(window.location.search);
    var docenteId = urlParams.get('id');

    if (docenteId) {
        cargarDatosDocente(docenteId);
    }

    $('#docenteForm').submit(function (e) {
        e.preventDefault();

        var id = $('#id').val();
        var nombre = $('#nombre').val();
        var ocupacion = $('#ocupacion').val();

        var docenteData = {
            id: id,
            nombre: nombre,
            ocupacion: ocupacion
        };

        var ajaxType = 'POST'; 
        var ajaxUrl = 'http://localhost:8081/docentes';

        if (docenteId) {
            ajaxType = 'PUT';
            ajaxUrl = `http://localhost:8081/docentes/${docenteId}`;
        }

        $.ajax({
            type: ajaxType,
            url: ajaxUrl,
            data: docenteData,
            dataType: 'json',
            success: function (response) {
                console.log('Respuesta del servidor:', response);

                alert(docenteId ? 'Docente actualizado exitosamente' : 'Docente registrado exitosamente');
                window.location.href = '../index.html';

            },
            error: function (error) {
                console.error('Error al registrar/editar docente:', error);

                alert(docenteId ? 'Error al actualizar docente' : 'Error al registrar docente Id en uso ');
            }
        });
    });

    function cargarDatosDocente(id) {
        $.ajax({
            url: `http://localhost:8081/docentes/${id}`,
            method: 'get',
            dataType: 'json',
            success: function (docente) {
                $('#id').val(docente.id);
                $('#nombre').val(docente.nombre);
                $('#ocupacion').val(docente.ocupacion);
    
                $('#id').prop('disabled', true);
            },
            error: function (xhr) {
                console.log('Error en la solicitud AJAX (obtener detalles del docente):', xhr);
            }
        });
    }
    

    function cargarOcupaciones() {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8081/ocupaciones',
            dataType: 'json',
            success: function (response) {
                $('#ocupacion').empty();

                response.forEach(function (ocupacion) {
                    $('#ocupacion').append('<option value="' + ocupacion.id + '">' + ocupacion.descripcion + '</option>');
                });
            },
            error: function (error) {
                console.error('Error al cargar ocupaciones:', error);
            }
        });
    }
});
