from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

# URI de conexão com o MongoDB Atlas
uri = "mongodb+srv://appUser:]5dd'_}Qc>!sxH8@cluster0.wov8qvh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Cria cliente MongoDB
client = MongoClient(uri, server_api=ServerApi('1'))

# Banco e coleção padrão
db = client["monitoramentoCaminhoes"]
collection = db["eventos"]

def get_collection():
    """Retorna a coleção de eventos"""
    return collection
