# Guide de Démarrage - Backend Hub Operating System

## 🚀 Installation et Configuration

### 1. Prérequis
- Node.js (v18 ou supérieur)
- MongoDB (local ou MongoDB Atlas)
- npm ou yarn

### 2. Installation des dépendances

```bash
cd backend
npm install
# ou
yarn install
```

### 3. Configuration de l'environnement

Créez un fichier `.env` à la racine du dossier `backend` :

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/hub-operating-system

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

**Important:** Changez `JWT_SECRET` pour un secret unique et sécurisé en production !

### 4. Démarrer MongoDB

**Local:**
```bash
# macOS/Linux
sudo systemctl start mongod
# ou
mongod

# Windows
net start MongoDB
```

**MongoDB Atlas:**
- Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Créez un cluster gratuit
- Récupérez la connection string
- Remplacez `MONGODB_URI` dans `.env`

### 5. Démarrer le serveur

**Mode développement (avec auto-reload):**
```bash
npm run dev
```

**Mode production:**
```bash
npm start
```

Le serveur démarre sur `http://localhost:5000`

---

## 📝 Création du premier utilisateur

Vous pouvez créer un utilisateur via l'API :

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "password123",
    "role": "ceo"
  }'
```

**Rôles disponibles:**
- `ceo` - CEO - Strategic Admin
- `coo` - COO - Operational Admin
- `cto` - CTO - Technical Admin
- `media_manager` - Media Content Manager
- `admin` - Admin / Secretariat

---

## 🔗 Connexion Frontend

### Configuration du Frontend

1. Créez un fichier `.env.local` à la racine du projet frontend :

```env
VITE_API_URL=http://localhost:5000/api
```

2. Redémarrez le serveur de développement frontend :

```bash
npm run dev
```

### Test de connexion

1. Ouvrez `http://localhost:5173/login`
2. Connectez-vous avec les identifiants créés
3. Le token JWT sera automatiquement stocké dans `localStorage`

---

## 📁 Structure du Projet

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Configuration MongoDB
│   ├── controllers/              # Contrôleurs (logique métier)
│   │   ├── authController.js
│   │   ├── clientController.js
│   │   ├── spaceController.js
│   │   ├── bookingController.js
│   │   ├── projectController.js
│   │   ├── studentController.js
│   │   ├── transactionController.js
│   │   ├── employeeController.js
│   │   ├── documentController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── auth.js              # Middleware d'authentification
│   │   └── errorHandler.js      # Gestion des erreurs
│   ├── models/                  # Modèles MongoDB
│   │   ├── User.js
│   │   ├── Client.js
│   │   ├── Space.js
│   │   ├── Booking.js
│   │   ├── Project.js
│   │   ├── Student.js
│   │   ├── Transaction.js
│   │   ├── Employee.js
│   │   ├── Document.js
│   │   └── Task.js
│   ├── routes/                  # Routes Express
│   │   ├── auth.js
│   │   ├── clients.js
│   │   ├── spaces.js
│   │   ├── bookings.js
│   │   ├── projects.js
│   │   ├── students.js
│   │   ├── transactions.js
│   │   ├── employees.js
│   │   ├── documents.js
│   │   └── tasks.js
│   └── server.js                # Point d'entrée
├── uploads/                     # Dossier pour les fichiers uploadés
├── .env                         # Variables d'environnement (à créer)
├── .env.example                 # Exemple de configuration
├── package.json
└── README.md
```

---

## 🧪 Tester les Routes

### Avec curl

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "role": "ceo"
  }'
```

**Récupérer les clients (avec token):**
```bash
curl -X GET http://localhost:5000/api/clients \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Avec Postman

1. Importez la collection d'API (à créer)
2. Configurez l'environnement avec `base_url = http://localhost:5000/api`
3. Utilisez la route `/auth/login` pour obtenir un token
4. Ajoutez le token dans les variables d'environnement
5. Testez les autres routes

---

## 🔒 Sécurité

- ✅ Toutes les routes sont protégées par JWT (sauf `/auth/login` et `/auth/register`)
- ✅ Les mots de passe sont hashés avec bcrypt
- ✅ CORS est configuré pour le frontend
- ✅ Validation des données avec Mongoose
- ✅ Gestion des erreurs centralisée

**À faire en production:**
- Utiliser HTTPS
- Changer `JWT_SECRET` pour un secret fort
- Configurer les limites de rate limiting
- Ajouter la validation des entrées avec express-validator
- Configurer les logs appropriés

---

## 📚 Documentation Complète

Voir `API_DOCUMENTATION.md` pour la documentation complète de toutes les routes.

---

## 🐛 Dépannage

### Erreur de connexion MongoDB
- Vérifiez que MongoDB est démarré
- Vérifiez la `MONGODB_URI` dans `.env`
- Pour MongoDB Atlas, vérifiez que votre IP est autorisée

### Erreur CORS
- Vérifiez que `FRONTEND_URL` dans `.env` correspond à l'URL du frontend
- Par défaut: `http://localhost:5173`

### Token invalide
- Vérifiez que le token n'a pas expiré (30 jours par défaut)
- Vérifiez que le header `Authorization: Bearer <token>` est correct

### Erreur 404 sur les routes
- Vérifiez que le serveur est démarré
- Vérifiez que vous utilisez le bon préfixe `/api`
- Vérifiez que la route existe dans `server.js`

---

## ✅ Checklist de Démarrage

- [ ] Node.js installé
- [ ] MongoDB installé et démarré
- [ ] Dépendances installées (`npm install`)
- [ ] Fichier `.env` créé et configuré
- [ ] Serveur démarré (`npm run dev`)
- [ ] Premier utilisateur créé
- [ ] Frontend configuré avec `VITE_API_URL`
- [ ] Test de connexion réussi

---

## 🎉 Prochaines Étapes

1. **Créer des données de test** - Utilisez le script `seed.js` (à créer)
2. **Tester toutes les routes** - Utilisez Postman ou curl
3. **Connecter le frontend** - Les composants sont prêts, il suffit de les connecter
4. **Ajouter la validation** - Utilisez express-validator pour valider les entrées
5. **Ajouter les tests** - Créez des tests unitaires et d'intégration

---

**Besoin d'aide ?** Consultez la documentation API ou ouvrez une issue sur le repository.

