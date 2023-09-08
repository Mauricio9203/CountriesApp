//variables globales
var excel;
var organizacion = "";
var nombreOrganizacion = "";
var datosGrafico;


$(document).ready(function () {
cambiarNombreDropdown($("#nombrePagina").val())
obtenerCountries();
});



$("#obtenerCountries").click(function () {
  obtenerCountries();
});

$("#descargarExcel").click(function () {
  let nuevoExcel = []
  excel.forEach(element => {
    let capital = "";
    if(element["capital"] === undefined){
      capital = ""
    }else{
      capital = element["capital"].join(", ")
    }

    let lenguajes = ""
    if(element["languages"] === undefined){
      lenguajes = ""
    }else{
      let valores = Object.values(element["languages"]);
      lenguajes = valores.join(", ");
    }
   
      nuevoExcel.push(
      {
        "Name" : element["name"]["common"],
        "Population" : element["population"],
        "Area" : element["area"],
        "Continent" : element["continents"][0],
        "Capitals" : capital,
        "Languages" : lenguajes,
        "Google Maps" : element["maps"]["googleMaps"],
        "Coat of Arms SVG" : element["coatOfArms"]["svg"],
        "Coat of Arms PNG" : element["coatOfArms"]["png"],
        "Flag SVG" : element["flags"]["svg"],
        "Flag PNG" : element["flags"]["png"],
      },
    )
  });
  transformarJsonToExcel(nuevoExcel);
});



function validarFormulario(){
  let subdominio = $("#subdominio").val()
  let usuario =$("#usuario").val()
  let contrasena = $("#contrasena").val()
  organizacion = subdominio

  if(subdominio != "" && usuario != "" && contrasena != ""){
    setTimeout(obtenerCountries(), 2000);
   
  }else{
    alertaSimple("info","No ha ingresado todos los datos","Por favor, ingrese los datos solicitados para inciar la aplicación.") 
  }
}


function obtenerCountries() {
  $("#descargarExcel").hide();
  $(".hide").hide();
  if ($.fn.DataTable.isDataTable("#miTabla")) {
    $("#miTabla").DataTable().destroy();
    $("#miTabla").empty();
  }
  $("#div_tabla").hide(1000);
  $("#div_cargando").show(1000);
  $("#textoCargando").show(1000);
  var datos = {
    subdominio: $("#subdominio").val(),
    usuario: $("#usuario").val(),
    contrasena: $("#contrasena").val(),
  };

  $.ajax({
    url: "/getCountries",
    type: "GET",
    dataType: "json",
    data: datos,
    success: function (data) {
      let datos = data;
      if (data["error"] != undefined) {
        alertaSimple("error","Ups!","There was an error, please try again later.") 
        $("#div_cargando").hide(1000);
        $("#textoCargando").hide(1000);
      } else {
        setTimeout(function() {
          table.order([[0, 'asc']]).draw();
        }, 2000);
        $("#descargarExcel").show(1000);
        $(".hide").show(1000);
        $("#div_tabla").show(1000);
        $("#div_cargando").hide(1000);
        $("#textoCargando").hide(1000);
        setTimeout(() => {
          datosGrafico = datos
          cargarGraficoPoblacion()
          cargarGraficoArea()
        }, 1000);

        
        

        //datos = datos;
        excel = datos;
        //transformarJsonToExcel(data)
        var table = $("#miTabla").DataTable({
          /*
          language: {
            url: "https://cdn.datatables.net/plug-ins/1.11.3/i18n/en_en.json",
          },
          */
          responsive: true,
          scrollX: true,
          autoWidth: true,
          scrollY: 500,
          pageLength: 100,
          stripeClasses: ['bg-white', 'bg-light'],
          scrollCollapse: true, // Altura en píxeles
          // Definir las columnas del DataTable coatOfArms
          columns: [
            { title: "Name", data: function (row) { return row.name['common']; }},
            { title: "Population", data: function (row) { 
              return formatearNumeroConComas(row["population"]); }
            },
            { title: "Area", data: function (row) { 
              return `${formatearNumeroConComas(row["area"])} km<sup>2</sup>`; }
            },
            { title: "Continent", data: function (row) { 
              return row.continents[0]; }
            },
            { title: "Capitals", data: function (row) { 
              if(row.capital === undefined){
                return ""
              }else{
                return row.capital.join(", "); 
              }
            }},
            { title: "Languages", data: function (row) { 
              if(row.languages === undefined){
                return ""
              }else{
                let valores = Object.values(row.languages );
                return valores.join(", "); 
              }
            }},
            { title: "Coat of Arms", data: function (row) { 
              if(row.coatOfArms.svg === undefined){
                return ""
              }else{
                return `<div class="center-image"><img src=${row.coatOfArms.svg} alt="Coat of Arms" class="img-fluid zoom-effect-img" style="max-width: 30px;"></div>`;
              }
            }},
            { title: "Flag", data: function (row) { 
              if(row.flags.svg === undefined){
                return ""
              }else{
                
                return `<div class="center-image"><img src=${row.flags.svg} alt="Escudo" class="img-fluid zoom-effect-img" style="max-width: 30px;"></div>`;
              }
            }},
            { title: "Maps", data: function (row) { 
              if(row.maps === undefined){
                return ""
              }else{
                
                return `<a class="btn btn-sm btn-success" target="_blank" href=${row.maps.googleMaps}><i class="fa-solid fa-map-location-dot"></i> Google Maps</a>`; 
              }
            }}
          ],
        });

        // Agregar las filas del objeto JSON al DataTable
        table.rows.add(datos).draw();
      }
    },
    error: function (xhr, status, error) {
      $("#div_cargando").hide(1000);
      $("#textoCargando").hide(1000);

      if (navigator.onLine) {
        alertaSimple("error","Error","There was an error, please try again later.")  
      } else {
        alertaSimple("info","Without Internet","Please, check your internet connection")  
      }
      
    },
  });
}

function transformarJsonToExcel(datos) {
    // Crea un objeto de libro de Excel a partir de los datos del JSON
    var workbook = XLSX.utils.book_new();
    var worksheet = XLSX.utils.json_to_sheet(datos);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Countries");

    // Descarga el archivo Excel generado
    XLSX.writeFile(workbook, "Countries.xlsx");
  }



  function cargarGraficoPoblacion() {
    // Cargar la biblioteca de Google Charts
    google.charts.load('current', { 'packages': ['corechart'] });
  
    // Configurar la función de callback una vez que la biblioteca se cargue
    google.charts.setOnLoadCallback(dibujarGraficoPoblacion);
  }
  
  
  function dibujarGraficoPoblacion() {
    let datosFormateados = []
    datosFormateados.push(['País', 'Población'])

    let datosOrdenar = []

    datosGrafico.forEach(pais => {
      datosOrdenar.push([pais["name"]["common"], pais["population"]])
    });

    //sort desc
    datosOrdenar.sort((a, b) => b[1] - a[1]);
    let primerosDiez = datosOrdenar.slice(0, 10);

    primerosDiez.forEach(element => {
      datosFormateados.push([element[0], element[1]])
    });

    // Crear un objeto de datos
    var data = google.visualization.arrayToDataTable(datosFormateados);
  
    // Configurar las opciones del gráfico
    var options = {
      title: 'Most Populous Countries',
      pieHole: 0.4, // Agujero en el gráfico de pastel (0 para un gráfico de pastel completo)
      chartArea: {
        width: '70%', // Ajustar el ancho del gráfico al 100% del contenedor
        height: '80%' // Ajustar la altura del gráfico al 80% del contenedor
    },
    legend: {
      position: 'none', // Cambiar la posición de la leyenda (puede ser 'top', 'bottom', 'left', 'right', 'none')
    },
    colors: ['#00C7A9']
    };

    
  
    // Crear una instancia del gráfico y asignarla a un elemento HTML
    var chart = new google.visualization.BarChart(document.getElementById('graficoPoblacion'));
    // Dibujar el gráfico con los datos y opciones
    chart.draw(data, options);
  }

 
  function cargarGraficoArea() {
    // Cargar la biblioteca de Google Charts
    google.charts.load('current', { 'packages': ['corechart'] });
  
    // Configurar la función de callback una vez que la biblioteca se cargue
    google.charts.setOnLoadCallback(dibujarGraficoArea);
  }
  
  
  function dibujarGraficoArea() {   
    let datosFormateados = []
    datosFormateados.push(['País', 'área'])

    let datosOrdenar = []

    datosGrafico.forEach(pais => {
      datosOrdenar.push([pais["name"]["common"], pais["area"]])
    });

    //sort desc
    datosOrdenar.sort((a, b) => b[1] - a[1]);
    let primerosDiez = datosOrdenar.slice(0, 10);

    primerosDiez.forEach(element => {
      datosFormateados.push([element[0], element[1]])
    });

    // Crear un objeto de datos
    var data = google.visualization.arrayToDataTable(datosFormateados);
  
    // Configurar las opciones del gráfico
    var options = {
      title: 'Countries with the most territory',
      pieHole: 0.4, // Agujero en el gráfico de pastel (0 para un gráfico de pastel completo)
      chartArea: {
        width: '70%', // Ajustar el ancho del gráfico al 100% del contenedor
        height: '80%' // Ajustar la altura del gráfico al 80% del contenedor
      },
      legend: {
        position: 'none', // Cambiar la posición de la leyenda (puede ser 'top', 'bottom', 'left', 'right', 'none')
      }
    };

    // Crear una instancia del gráfico y asignarla a un elemento HTML
    var chart = new google.visualization.BarChart(document.getElementById('graficoArea'));
  
    // Dibujar el gráfico con los datos y opciones
    chart.draw(data, options);

  }


  