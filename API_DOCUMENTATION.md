# API Documentation - Hub Operating System

## Base URL
```
http://localhost:5000/api
```

## Authentication

Toutes les routes (sauf `/auth/login` et `/auth/register`) nécessitent un token JWT dans le header :
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Routes

### POST /auth/login
Connexion d'un utilisateur.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "ceo"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "ceo",
    "avatar": null
  }
}
```

### POST /auth/register
Inscription d'un nouvel utilisateur.

**Request Body:**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123",
  "role": "admin"
}
```

**Response:** (même format que login)

### GET /auth/me
Récupère l'utilisateur actuellement connecté.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "ceo",
    "avatar": null
  }
}
```

### PUT /auth/profile
Met à jour le profil de l'utilisateur.

**Request Body:**
```json
{
  "name": "New Name",
  "email": "newemail@example.com",
  "avatar": "avatar_url"
}
```

---

## 👥 Clients Routes

### GET /clients
Récupère tous les clients.

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "client_id",
      "name": "Client Name",
      "company": "Company Name",
      "email": "client@example.com",
      "phone": "+237 699 123 456",
      "type": "enterprise",
      "status": "active",
      "revenue": 45000,
      "lastContact": "2024-01-15T00:00:00.000Z",
      "createdAt": "2024-01-15T00:00:00.000Z",
      "updatedAt": "2024-01-15T00:00:00.000Z"
    }
  ]
}
```

### GET /clients/:id
Récupère un client spécifique.

### POST /clients
Crée un nouveau client.

**Request Body:**
```json
{
  "name": "Client Name",
  "company": "Company Name",
  "email": "client@example.com",
  "phone": "+237 699 123 456",
  "type": "enterprise",
  "status": "active",
  "revenue": 0
}
```

### PUT /clients/:id
Met à jour un client.

### DELETE /clients/:id
Supprime un client.

---

## 🏢 Spaces Routes

### GET /spaces
Récupère tous les espaces.

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "space_id",
      "name": "Conference Room A",
      "type": "conference",
      "capacity": 20,
      "pricePerHour": 5000,
      "status": "available",
      "currentBooking": null,
      "createdAt": "2024-01-15T00:00:00.000Z"
    }
  ]
}
```

### GET /spaces/:id
Récupère un espace spécifique.

### POST /spaces
Crée un nouvel espace.

**Request Body:**
```json
{
  "name": "Conference Room A",
  "type": "conference",
  "capacity": 20,
  "pricePerHour": 5000,
  "status": "available"
}
```

### PUT /spaces/:id
Met à jour un espace.

### DELETE /spaces/:id
Supprime un espace.

---

## 📅 Bookings Routes

### GET /bookings
Récupère toutes les réservations.

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "booking_id",
      "spaceId": { "_id": "space_id", "name": "Room A", "type": "conference" },
      "spaceName": "Conference Room A",
      "clientId": { "_id": "client_id", "name": "Client Name", "company": "Company" },
      "clientName": "Client Name",
      "date": "2024-01-20T00:00:00.000Z",
      "startTime": "09:00",
      "endTime": "12:00",
      "status": "confirmed",
      "totalPrice": 15000,
      "createdAt": "2024-01-15T00:00:00.000Z"
    }
  ]
}
```

### GET /bookings/:id
Récupère une réservation spécifique.

### POST /bookings
Crée une nouvelle réservation.

**Request Body:**
```json
{
  "spaceId": "space_id",
  "clientId": "client_id",
  "date": "2024-01-20",
  "startTime": "09:00",
  "endTime": "12:00",
  "status": "pending",
  "totalPrice": 15000
}
```

### PUT /bookings/:id
Met à jour une réservation.

### DELETE /bookings/:id
Annule une réservation.

---

## 🎬 Projects Routes

### GET /projects
Récupère tous les projets média.

**Response:**
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "_id": "project_id",
      "title": "Video Production",
      "client": "Client Name",
      "clientId": { "_id": "client_id", "name": "Client Name", "company": "Company" },
      "type": "video",
      "status": "production",
      "deadline": "2024-02-15T00:00:00.000Z",
      "budget": 500000,
      "progress": 60,
      "assignee": "John Doe",
      "createdAt": "2024-01-15T00:00:00.000Z"
    }
  ]
}
```

### GET /projects/:id
Récupère un projet spécifique.

### POST /projects
Crée un nouveau projet.

**Request Body:**
```json
{
  "title": "Video Production",
  "clientId": "client_id",
  "type": "video",
  "status": "briefing",
  "deadline": "2024-02-15",
  "budget": 500000,
  "assignee": "John Doe"
}
```

### PUT /projects/:id
Met à jour un projet.

### DELETE /projects/:id
Supprime un projet.

---

## 🎓 Students Routes

### GET /students
Récupère tous les étudiants.

**Response:**
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "_id": "student_id",
      "name": "Student Name",
      "email": "student@example.com",
      "phone": "+237 699 123 456",
      "program": "Digital Marketing",
      "university": "University Name",
      "startDate": "2024-01-15T00:00:00.000Z",
      "endDate": "2024-06-15T00:00:00.000Z",
      "status": "active",
      "progress": 45,
      "mentor": "Mentor Name"
    }
  ]
}
```

### GET /students/:id
Récupère un étudiant spécifique.

### POST /students
Crée un nouvel étudiant.

**Request Body:**
```json
{
  "name": "Student Name",
  "email": "student@example.com",
  "phone": "+237 699 123 456",
  "program": "Digital Marketing",
  "university": "University Name",
  "startDate": "2024-01-15",
  "endDate": "2024-06-15",
  "status": "active",
  "mentor": "Mentor Name"
}
```

### PUT /students/:id
Met à jour un étudiant.

### DELETE /students/:id
Supprime un étudiant.

---

## 💰 Transactions Routes

### GET /transactions
Récupère toutes les transactions.

**Response:**
```json
{
  "success": true,
  "count": 20,
  "data": [
    {
      "_id": "transaction_id",
      "description": "Office supplies",
      "type": "expense",
      "category": "Office",
      "amount": 50000,
      "date": "2024-01-15T00:00:00.000Z",
      "status": "approved",
      "approvedBy": { "_id": "user_id", "name": "Admin", "email": "admin@example.com" },
      "createdAt": "2024-01-15T00:00:00.000Z"
    }
  ]
}
```

### GET /transactions/:id
Récupère une transaction spécifique.

### POST /transactions
Crée une nouvelle transaction.

**Request Body:**
```json
{
  "description": "Office supplies",
  "type": "expense",
  "category": "Office",
  "amount": 50000,
  "date": "2024-01-15",
  "status": "pending"
}
```

### PUT /transactions/:id/approve
Approuve une transaction.

**Response:** Retourne la transaction avec `status: "approved"` et `approvedBy` défini.

### PUT /transactions/:id
Met à jour une transaction.

### DELETE /transactions/:id
Supprime une transaction.

---

## 👔 Employees Routes

### GET /employees
Récupère tous les employés.

**Response:**
```json
{
  "success": true,
  "count": 12,
  "data": [
    {
      "_id": "employee_id",
      "name": "Employee Name",
      "email": "employee@example.com",
      "phone": "+237 699 123 456",
      "position": "Developer",
      "department": "IT",
      "salary": 500000,
      "joinDate": "2024-01-15T00:00:00.000Z",
      "status": "active",
      "performance": "good"
    }
  ]
}
```

### GET /employees/:id
Récupère un employé spécifique.

### POST /employees
Crée un nouvel employé.

**Request Body:**
```json
{
  "name": "Employee Name",
  "email": "employee@example.com",
  "phone": "+237 699 123 456",
  "position": "Developer",
  "department": "IT",
  "salary": 500000,
  "joinDate": "2024-01-15",
  "status": "active",
  "performance": "good"
}
```

### PUT /employees/:id
Met à jour un employé.

### DELETE /employees/:id
Supprime un employé.

---

## 📄 Documents Routes

### GET /documents
Récupère tous les documents.

**Response:**
```json
{
  "success": true,
  "count": 25,
  "data": [
    {
      "_id": "document_id",
      "name": "document.pdf",
      "category": "contracts",
      "type": "application/pdf",
      "size": 1024000,
      "filePath": "/uploads/document-1234567890.pdf",
      "uploadedBy": { "_id": "user_id", "name": "User", "email": "user@example.com" },
      "uploadDate": "2024-01-15T00:00:00.000Z"
    }
  ]
}
```

### GET /documents/:id
Récupère un document spécifique.

### POST /documents/upload
Upload un document.

**Request:** `multipart/form-data`
- `file`: Le fichier à uploader
- `name`: Nom du document (optionnel)
- `category`: Catégorie du document (optionnel)

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "document_id",
    "name": "document.pdf",
    "category": "general",
    "type": "application/pdf",
    "size": 1024000,
    "filePath": "/uploads/document-1234567890.pdf",
    "uploadedBy": "user_id",
    "uploadDate": "2024-01-15T00:00:00.000Z"
  }
}
```

### DELETE /documents/:id
Supprime un document (et le fichier associé).

---

## ✅ Tasks Routes

### GET /tasks
Récupère toutes les tâches.

**Response:**
```json
{
  "success": true,
  "count": 30,
  "data": [
    {
      "_id": "task_id",
      "title": "Complete project review",
      "description": "Review the video production project",
      "assigneeId": { "_id": "user_id", "name": "John Doe", "email": "john@example.com" },
      "assigneeName": "John Doe",
      "dueDate": "2024-01-20T00:00:00.000Z",
      "priority": "high",
      "status": "in_progress",
      "createdAt": "2024-01-15T00:00:00.000Z"
    }
  ]
}
```

### GET /tasks/:id
Récupère une tâche spécifique.

### POST /tasks
Crée une nouvelle tâche.

**Request Body:**
```json
{
  "title": "Complete project review",
  "description": "Review the video production project",
  "assigneeId": "user_id",
  "dueDate": "2024-01-20",
  "priority": "high",
  "status": "pending"
}
```

### PUT /tasks/:id
Met à jour une tâche.

### DELETE /tasks/:id
Supprime une tâche.

---

## 🔍 Health Check

### GET /health
Vérifie l'état du serveur.

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## ⚠️ Codes d'Erreur

- `400` - Bad Request (données invalides)
- `401` - Unauthorized (token manquant ou invalide)
- `403` - Forbidden (permissions insuffisantes)
- `404` - Not Found (ressource introuvable)
- `500` - Internal Server Error (erreur serveur)

**Format d'erreur:**
```json
{
  "success": false,
  "message": "Error message here"
}
```

