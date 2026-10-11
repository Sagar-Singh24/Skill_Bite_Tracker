# Skill Bite Tracker

Full-stack skill tracking app with React frontend and Spring Boot backend.

## Project Structure

```
Skill Bite Tracker/
├── frontend/          # React + Vite + Tailwind CSS
└── backend/           # Spring Boot + H2 + JWT
```

---

## Frontend (React)

### Setup & Run

```bash
cd frontend
npm install
npm run dev
```

Runs at: http://localhost:5173

### Structure

```
frontend/src/
├── components/
│   ├── Header.jsx         # App header with menu drawer & settings
│   ├── BottomNav.jsx      # Bottom navigation bar
│   ├── SceneBackground.jsx # Vinland visual effects layer
│   └── Toast.jsx          # Toast notification system
├── pages/
│   ├── AuthPage.jsx       # Login / Signup
│   ├── DashboardPage.jsx  # Stats, analytics, badges
│   ├── DailyPage.jsx      # Quiz + coding challenges
│   ├── LeaderboardPage.jsx
│   └── ProfilePage.jsx
├── data/
│   ├── questions.js       # All question banks + skill categories
│   └── codingProblems.js  # 200 coding problems
├── utils/
│   ├── api.js             # All backend API calls
│   └── audio.js           # Web Audio UI sounds
├── App.jsx                # Root component + state management
├── main.jsx               # Entry point
└── index.css              # Vinland theme styles + Tailwind
```

---

## Backend (Spring Boot)

### Requirements
- Java 17+
- Maven 3.8+

### Setup & Run

```bash
cd backend
mvn spring-boot:run
```

Runs at: http://localhost:8080

H2 Console: http://localhost:8080/h2-console  
(JDBC URL: `jdbc:h2:mem:skillbitedb`, user: `sa`, password: empty)

### API Endpoints

| Method | Endpoint                  | Auth     | Description              |
|--------|---------------------------|----------|--------------------------|
| POST   | /api/auth/signup          | Public   | Register new user        |
| POST   | /api/auth/login           | Public   | Login, returns JWT token |
| GET    | /api/answers              | Bearer   | Get user's answers       |
| POST   | /api/answers              | Bearer   | Save a new answer        |
| GET    | /api/questions/{category} | Bearer   | Get questions by category|

### Structure

```
backend/src/main/java/com/skillbite/
├── SkillBiteApplication.java      # Main entry point
├── SecurityConfig.java            # Spring Security + CORS + JWT
├── controller/
│   ├── AuthController.java        # /api/auth/**
│   ├── AnswerController.java      # /api/answers
│   └── QuestionController.java    # /api/questions/{category}
├── service/
│   ├── AuthService.java           # Signup / login logic
│   ├── AnswerService.java         # Answer CRUD
│   ├── JwtService.java            # JWT generate / validate
│   └── JwtAuthFilter.java         # JWT request filter
├── model/
│   ├── User.java                  # User entity
│   └── Answer.java                # Answer entity
├── repository/
│   ├── UserRepository.java
│   └── AnswerRepository.java
└── dto/
    ├── AuthRequest.java
    ├── AuthResponse.java
    ├── AnswerRequest.java
    └── AnswerResponse.java
```
