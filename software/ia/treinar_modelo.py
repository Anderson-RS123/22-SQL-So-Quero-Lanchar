import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras import layers, models
import matplotlib.pyplot as plt
import numpy as np
import os

# Caminho para as imagens de treinamento
dataset_path = 'C:/Users/Usuario/Pictures/coderace/Multi-Class Driver Behavior Image Dataset'

# Definindo os parâmetros
img_width, img_height = 224, 224
batch_size = 32  # Quantidade de fotos pegas por vez
epochs = 10   # Quantidades de épocas de treinamento

# Pré-processamento das imagens
datagen = ImageDataGenerator(
    rescale=1./255,           
    validation_split=0.2      # Retira 20% dos dados para a validação
)

# Treinamento
train_generator = datagen.flow_from_directory(
    dataset_path,
    target_size=(img_width, img_height),
    batch_size=batch_size,
    class_mode='categorical',
    subset='training'
)
print("Classes mapeadas:", train_generator.class_indices)

# Validacao
validation_generator = datagen.flow_from_directory(
    dataset_path,
    target_size=(img_width, img_height),
    batch_size=batch_size,
    class_mode='categorical',
    subset='validation'
)

# Exibir classes
print("Classes mapeadas:", train_generator.class_indices)

# Criando o modelo de rede neural CNN
model = models.Sequential([
    layers.Conv2D(32, (3,3), activation='relu', input_shape=(img_width, img_height, 3)),
    layers.MaxPooling2D(2,2),

    layers.Conv2D(64, (3,3), activation='relu'),
    layers.MaxPooling2D(2,2),

    layers.Conv2D(128, (3,3), activation='relu'),
    layers.MaxPooling2D(2,2),
    
    layers.Flatten(),
    layers.Dense(256, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(32, activation='relu'),
    layers.Dense(3, activation='softmax') 
])

# Compilando o modelo
model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Resumo do modelo
model.summary()

# Treinando o modelo
history = model.fit(
    train_generator,
    epochs=epochs,
    validation_data=validation_generator
)

# Salvando o modelo treinado
model.save('modelo_motorista.h5')

# Mostrando a acurácia em um gráfico
plt.plot(history.history['accuracy'], label='Acurácia Treino')
plt.plot(history.history['val_accuracy'], label='Acurácia Validação')
plt.title('Acurácia durante o treinamento')
plt.xlabel('Época')
plt.ylabel('Acurácia')
plt.legend()
plt.show()
