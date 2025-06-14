from datetime import datetime
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

# Função de envio
def enviar_evento_mongodb(categoria, confidence):
    # URI de conexão com o MongoDB
    uri = "mongodb+srv://appUser:]5dd'_}Qc>!sxH8@cluster0.wov8qvh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

    # Cria cliente mongoDB
    client = MongoClient(uri, server_api=ServerApi('1'))
    db = client["monitoramentoCaminhoes"]
    collection = db["eventos"]

    # Monta o documento json para envio
    evento = {
        "emresaId": 1,
        "caminhaoId": 3,
        "motoristaId": 3,
        "motoristaNome": "Adailson",
        "timestamp": datetime.utcnow(),
        "tipoEvento": categoria
    }

    # Inserir no banco os dados
    result = collection.insert_one(evento)

    # Exibe o ID do registro
    print("Evento inserido com ID:", result.inserted_id)
