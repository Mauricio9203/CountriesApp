
   
   function alertaSimple(icono,titulo,mensaje){
    Swal.fire(
      titulo,
      mensaje,
      icono
    )
  }

  function formatearNumeroConComas(numero) {
    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  
  function cambiarNombreDropdown(nombre){
    $("#desplegable_navbar").text(nombre)
  }
  

  function animacionCargando(tipoArchivo){
    Swal.fire({
      title: "<i class='fa-solid fa-circle-notch fa-spin fa-2x text-white'></i>",
      text: 'Descargando su archivo '+tipoArchivo,
      background: '#44000000',
      color: '#545454',
      allowOutsideClick: false, // Evita que el diálogo se cierre al hacer clic fuera de él
      showCancelButton: false,
      showConfirmButton: false
    })
  }


  
