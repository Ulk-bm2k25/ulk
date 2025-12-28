export const APP_CONFIG = {
USE_SIMULATION: true, // false : pour utiliser l'API Laravel et true pour mode developpeur noblie pas de simuler et ajouter le code api aussi c'est important mais pas obligatoire
API_BASE_URL: 'http://localhost:8000/api', // Assurez-vous d'ajouter l'URL de votre serveur  
STORAGE_KEYS: {
    TOKEN: 'auth_token',
    ROLE: 'auth_user_role'
  }
};