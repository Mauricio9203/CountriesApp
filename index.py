from flask import Flask, render_template

#importaciones de archivos de backend

from static.python.countries import bp as countries

# inicializamos la aplicación
app = Flask(__name__)
app.register_blueprint(countries)

# Agrega las rutas principales de la
#  aplicación Flask
@app.route('/')
def principal():
    return render_template('index.html')


@app.route('/formularios')
def formularios():
    return render_template('formularios.html')

@app.route('/countries')
def countries():
    return render_template('countries.html')

if __name__ == '__main__':
    app.run(debug=True, port=5017)
