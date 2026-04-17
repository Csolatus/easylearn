# EasyLearn

## Membres du groupe
- Lucas
- Matthieu
- Lam
- Thomas

---

## Procédure d'installation

### Prérequis
- Docker et Docker Compose installés sur votre machine.
- Ollama installé et lancé localement (nécessaire pour l'IA).
- Modèle requis : `ollama pull llama3`

### 1. Cloner et configurer
Ouvrez un terminal et exécutez les commandes suivantes :

```bash
git clone [https://github.com/Csolatus/easylearn.git](https://github.com/Csolatus/easylearn.git)
cd easylearn
# Créer le fichier d'environnement à partir de l'exemple
cp .env.example .env
## 2. Lancer l'application
Démarrez l'ensemble des services avec Docker Compose :

```bash
docker-compose up --build
> **Note concernant la base de données :** L'export de la base de données est inclus dans `/database/init.sql`. Il est automatiquement importé par Docker lors de ce premier lancement. Aucune action manuelle n'est requise.

## 3. Accéder aux services
Une fois les conteneurs démarrés, les services sont accessibles ici :

* **Application (Frontend) :** http://localhost:3000
* **API & Documentation (Swagger) :** http://localhost:8000/docs