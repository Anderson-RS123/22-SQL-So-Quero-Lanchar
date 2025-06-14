from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
from envio_mongodb import enviar_evento_mongodb  #importar função para enviar os dados ao banco de dados

# Caminho da imagem de teste
img_path = 'img/sonoteste.jpeg'

# Caminho do modelo treinado
model_path = 'ia/modelo_motorista.h5'

# Ajuste do tamanho da imagem
img_width, img_height = 224, 224

# Carregar o modelo
model = load_model(model_path)

# Classificar as classes
class_labels = {
    0: 'com_sono',
    1: 'dirigindo_seguro',
    2: 'usando_celular'
}

# Classificação da imagem passada
def classificar_imagem(caminho_imagem):
    img = image.load_img(caminho_imagem, target_size=(img_width, img_height))
    img_array = image.img_to_array(img)
    img_array = img_array / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    pred = model.predict(img_array)
    confidencia = np.max(pred)
    classe_idx = np.argmax(pred)
    categoria = class_labels[classe_idx]

    print(f"Resultado: {categoria} (confiança: {confidencia*100:.2f}%)")
    
    return categoria, confidencia

# Execução do arquivo
if __name__ == "__main__":
    categoria, confidencia = classificar_imagem(img_path)
    enviar_evento_mongodb(categoria, confidencia)
