from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np

# ======== CONFIGURAÇÕES ========

# Caminho da imagem que você quer testar
img_path = 'C:/Users/Usuario/Downloads/celular2.jpeg'   # <- Substitua pelo caminho da sua imagem

# Caminho do modelo treinado
model_path = 'modelo_motorista.h5'

# Tamanho da imagem (deve ser o mesmo do treinamento)
img_width, img_height = 224, 224

# ======== CARREGAR O MODELO ========

model = load_model(model_path)

# ======== MAPEAMENTO DAS CLASSES ========
# Atenção: Use o mesmo mapeamento que apareceu no treinamento
# Exemplo:
class_labels = {
    0: 'com_sono',
    1: 'dirigindo_seguro',
    2: 'usando_celular'
}

# ======== PRÉ-PROCESSAMENTO DA IMAGEM ========

# Carregar a imagem e redimensionar
img = image.load_img(img_path, target_size=(img_width, img_height))

# Converter para array
img_array = image.img_to_array(img)

# Normalizar os pixels (igual ao treinamento)
img_array = img_array / 255.0

# Expandir dimensão para simular um batch de tamanho 1
img_array = np.expand_dims(img_array, axis=0)

# ======== FAZER A PREDIÇÃO ========

# Predição
pred = model.predict(img_array)

# Obter a maior probabilidade
confidence = np.max(pred)

# Obter o índice da classe predita
class_idx = np.argmax(pred)

# ======== VERIFICAR RESULTADO ========

#if confidence >= 0.8:
categoria = class_labels[class_idx]
print(f"Resultado: {categoria} (confiança: {confidence*100:.2f}%)")
#else:
#    print(f"Resultado: OUTRA IMAGEM (confiança muito baixa: {confidence*100:.2f}%)")
