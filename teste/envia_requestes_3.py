from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import io
from datetime import datetime
from db.conexao import get_collection

app = Flask(__name__)

# Carrega modelo
model = tf.keras.models.load_model('modelo_motorista.keras')
classes = ['com_sono', 'distraido', 'normal']  # Ajuste conforme seu dataset

def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize((224, 224))  # ajuste ao tamanho do seu modelo
    img_array = np.array(img) / 255.0
    return np.expand_dims(img_array, axis=0)

@app.route('/avaliar_motorista', methods=['POST'])
def avaliar_motorista():
    if 'foto' not in request.files:
        return jsonify({'erro': 'Imagem não enviada'}), 400

    foto = request.files['foto']
    imagem_bytes = foto.read()
    imagem = preprocess_image(imagem_bytes)

    pred = model.predict(imagem)[0]
    indice = np.argmax(pred)
    resultado = classes[indice]

    # Salvar no banco
    collection = get_collection()
    evento = {
        "empresaId": request.form.get("empresaId"),
        "caminhaoId": request.form.get("caminhaoId"),
        "motoristaId": request.form.get("motoristaId"),
        "motoristaNome": request.form.get("motoristaNome"),
        "timestamp": datetime.utcnow(),
        "tipoEvento": resultado
    }
    collection.insert_one(evento)

    return jsonify({
        "classificacao": resultado,
        "confianca": float(pred[indice])
    })

if __name__ == '__main__':
    app.run(debug=True)
