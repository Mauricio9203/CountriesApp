from flask import Blueprint, jsonify, request
import requests
#aquí definimos la ruta que se importará en el controlador
bp = Blueprint('countries', __name__)

#defimos una o más rutas con las funciones
@bp.route('/getCountries', methods=['GET'])
def metodosPost():


    # Configurar la URL de la API de Zendesk para obtener los registros
    url = f'https://restcountries.com/v3.1/all' 

    response = requests.get(url)
    data = response.json()
     
    # Enviar el archivo Excel como una respuesta de Ajax
    return jsonify(data)



