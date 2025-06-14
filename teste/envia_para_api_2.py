import requests

url = "http://localhost:5000/avaliar_motorista"
imagem_path = "foto_motorista.jpg"

dados = {
    "empresaId": "ABC001",
    "caminhaoId": "BRA2E19",
    "motoristaId": "MOT_007",
    "motoristaNome": "João Silva"
}

with open(imagem_path, 'rb') as img:
    files = {'foto': img}
    resposta = requests.post(url, files=files, data=dados)
    print(resposta.json())
