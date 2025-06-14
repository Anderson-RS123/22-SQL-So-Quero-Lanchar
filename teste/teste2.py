import torch
import timm
from PIL import Image
import torchvision.transforms as transforms
import torch.nn as nn

# Caminho para o modelo salvo
MODEL_PATH = 'modelo_vit.pth'

# Número de classes do seu dataset
NUM_CLASSES = 3

# Caminho da imagem a ser testada
IMAGE_PATH = 'C:/Users/Usuario/Desktop/trabalho2IA/com_sono/um-homem-cansado-boc.jpg'

# Transformação (mesmo usado no treino!)
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
])

# Carregar imagem
image = Image.open(IMAGE_PATH).convert('RGB')
image = transform(image).unsqueeze(0)  # Adiciona dimensão do batch

# Dispositivo
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Carregar modelo
model = timm.create_model('vit_base_patch16_224', pretrained=False)
model.head = nn.Linear(model.head.in_features, NUM_CLASSES)
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model = model.to(device)
model.eval()

# Predição
with torch.no_grad():
    image = image.to(device)
    output = model(image)
    predicted_class = torch.argmax(output, dim=1).item()

print(f"Classe prevista: {predicted_class}")
class_names = ['atento', 'com_celular', 'com_sono']
print(f"Classe prevista: {class_names[predicted_class]}")
