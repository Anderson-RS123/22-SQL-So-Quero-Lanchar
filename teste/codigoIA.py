import os
import torch
import torchvision.transforms as transforms
from torchvision.datasets import ImageFolder
from torch.utils.data import DataLoader
import timm
import torch.nn as nn
from torch.optim import Adam

# Caminho para os dados
DATA_DIR = 'C:/Users/Usuario/Desktop/trabalho2IA'

# Hiperparâmetros
BATCH_SIZE = 15 
NUM_CLASSES = 3  # <-- AJUSTADO
NUM_EPOCHS = 10
LR = 1e-4
IMG_SIZE = 224

# Transformações para pré-processamento
transform = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
])

# Dataset e DataLoader
dataset = ImageFolder(root=DATA_DIR, transform=transform)
dataloader = DataLoader(dataset, batch_size=BATCH_SIZE, shuffle=True)

# Modelo ViT pré-treinado
model = timm.create_model('vit_base_patch16_224', pretrained=True)
model.head = nn.Linear(model.head.in_features, NUM_CLASSES)  # <-- AJUSTADO

# Treinamento
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)
criterion = nn.CrossEntropyLoss()
optimizer = Adam(model.parameters(), lr=LR)

# Loop de treinamento
for epoch in range(NUM_EPOCHS):
    model.train()
    running_loss = 0.0
    for images, labels in dataloader:
        images, labels = images.to(device), labels.to(device)

        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        running_loss += loss.item()

    print(f"Época [{epoch+1}/{NUM_EPOCHS}] - Loss: {running_loss/len(dataloader):.4f}")

torch.save(model.state_dict(), 'modelo_vit.pth')

print("✅ Treinamento finalizado.")
