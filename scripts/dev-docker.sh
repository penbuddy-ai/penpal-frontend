#!/bin/bash

# S'assurer que le script est exécutable
# chmod +x scripts/dev-docker.sh

# Arrêter les conteneurs existants
echo "Arrêt des conteneurs existants..."
docker-compose -f docker-compose.dev.yml down

# Construire et démarrer le conteneur de développement
echo "Démarrage du conteneur de développement..."
docker-compose -f docker-compose.dev.yml up --build

# Pour exécuter en arrière-plan, ajoutez -d :
# docker-compose -f docker-compose.dev.yml up --build -d 