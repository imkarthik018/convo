# Full-Stack ChatGPT Conversation Manager

This project consists of a **Spring Boot** backend and a **React** frontend that work together to manage ChatGPT conversations with CRUD operations.

## Project Structure

```
convo/
├── springapp/          # Spring Boot Backend (Port 8081)
│   └── src/main/java/com/examly/springapp/
│       ├── controller/       # REST API Controllers
│       ├── service/          # Business Logic
│       ├── repository/       # Data Access Layer
│       ├── model/            # Entity Models
│       └── configuration/   # Security & CORS Config
└── reactapp/          # React Frontend (Port 3001)
    └── src/
        ├── App.jsx           # Main Component
        ├── services/api.js   # API Integration
        └── App.css           # Styling
```

## Features

### Backend (Spring Boot)

- ✅ Create, Read, Update, Delete Conversations
- ✅ Filter by Category
- ✅ Sort by Time
- ✅ MySQL Database Integration
- ✅ JWT Security Configuration
- ✅ CORS Enabled for React App

### Frontend (React)

- ✅ Add/Edit/Delete Conversations
- ✅ View All Conversations
- ✅ Filter by Category (General, Education, Coding, Career)
- ✅ Sort by Time
- ✅ Real-time Loading States
- ✅ Error Handling
- ✅ User Feedback Messages

## Prerequisites

- **Java 17+**
- **Node.js 16+**
- **MySQL Server**
- **Maven**

## Setup Instructions

### 1. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE chatgpt_manager;
```

Or the database will be created automatically if `createDatabaseIfNotExist=true` is set in `application.properties`.

Update database credentials in `springapp/src/main/resources/application.properties`:

```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 2. Backend Setup (Spring Boot)

Navigate to the backend directory:

```bash
cd springapp
```

Build and run the Spring Boot application:

```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on **http://localhost:8081**

### 3. Frontend Setup (React)

Open a new terminal, navigate to the React app:

```bash
cd reactapp
```

Install dependencies (if not already installed):

```bash
npm install
```

Start the React development server:

```bash
npm start
```

The frontend will start on **http://localhost:3001**

## API Endpoints

The backend exposes the following REST API endpoints:

| Method | Endpoint                               | Description                      |
| ------ | -------------------------------------- | -------------------------------- |
| POST   | `/api/chats/addConversation`           | Create a new conversation        |
| GET    | `/api/chats/allConversations`          | Get all conversations            |
| GET    | `/api/chats/byCategory?category={cat}` | Get conversations by category    |
| GET    | `/api/chats/sortedByTime`              | Get conversations sorted by time |
| PUT    | `/api/chats/updateConversation/{id}`   | Update a conversation            |
| DELETE | `/api/chats/deleteConversation/{id}`   | Delete a conversation            |

## Conversation Model

```json
{
  "id": 1,
  "prompt": "What is React?",
  "response": "React is a JavaScript library for building user interfaces.",
  "category": "Coding",
  "timestamp": "2024-01-15T10:30:00"
}
```

## Usage

1. **Add a Conversation**: Enter a prompt and response, select a category, and click "Add Conversation"
2. **Edit a Conversation**: Click the "Edit" button on any conversation card
3. **Delete a Conversation**: Click the "Delete" button and confirm
4. **Filter**: Use the dropdown to filter by category or sort by time

## CORS Configuration

The backend is configured to allow requests from:

- `http://localhost:3000`
- `http://localhost:3001`
- Examly cloud domain

To modify CORS settings, edit:

- `springapp/src/main/java/com/examly/springapp/configuration/SecurityConfig.java`
- `springapp/src/main/java/com/examly/springapp/configuration/CorsConfiguration.java`

## Troubleshooting

### Backend won't start

- Verify MySQL is running
- Check database credentials in `application.properties`
- Ensure port 8081 is not in use

### Frontend can't connect to backend

- Verify backend is running on port 8081
- Check browser console for CORS errors
- Ensure API URL in `reactapp/src/services/api.js` points to `http://localhost:8081`

### Database connection issues

- Ensure MySQL is installed and running
- Create the database manually if auto-creation fails
- Check connection string in `application.properties`

## Technologies Used

**Backend:**

- Spring Boot 3.0.1
- Spring Data JPA
- MySQL
- Spring Security
- JWT

**Frontend:**

- React 18
- Axios
- React Router

## License

This project is for educational purposes.
