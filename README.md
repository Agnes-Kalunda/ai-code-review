# ai-code-assistant


A full-stack web application that provides AI-powered coding assistance using OpenAI's API. Get intelligent code suggestions, debugging help, code explanations, and programming guidance through an intuitive web interface.

## 🚀 Features

- **AI-Powered Code Assistance**: Leverages OpenAI's GPT models for intelligent coding help
- **Code Generation**: Generate code snippets and functions based on natural language descriptions
- **Code Explanation**: Get detailed explanations of complex code segments
- **Debugging Help**: AI-assisted debugging and error resolution
- **Code Optimization**: Suggestions for improving code performance and readability
- **Multiple Language Support**: Supports various programming languages (Python, JavaScript, Java, C++, etc.)
- **Interactive Chat Interface**: Conversational AI for programming questions and guidance
- **Code Formatting**: Automatic code formatting and syntax highlighting
- **Real-time Responses**: Fast AI responses powered by OpenAI's API
- **User-Friendly Interface**: Clean, responsive React frontend
- **Secure API Integration**: Secure handling of OpenAI API keys

## 🏗️ Architecture

```
ai-code-review/
├── frontend/          # React.js application
├── backend/           # Django API server with OpenAI integration
└── README.md         # Project documentation
```

### Frontend (React)
- **Framework**: React.js with hooks
- **Styling**: Tailwind CSS for responsive design

- **State Management**: React hooks for chat history and user sessions
- **Real-time UI**: Dynamic interface for AI interactions

### Backend (Django)
- **Framework**: Django with Django REST Framework
- **AI Integration**: OpenAI API integration for code assistance
- **Database**: PostgreSQL 
- **API**: RESTful API endpoints for AI interactions


## 📋 Prerequisites

Before running this application, make sure you have the following:

- **Node.js** (version 14.x or higher)
- **npm** or **yarn**
- **Python** (version 3.8 or higher)
- **pip** (Python package manager)
- **Git**
- **OpenAI API Key** (from [OpenAI Platform](https://platform.openai.com/))


## Live Link

This application was containerized and deployed in an AWS EC2 instance, for easier testing .
Live-link http://13.60.240.188/

## ⚙️ Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Agnes-Kalunda/ai-code-review.git
cd ai-code-review
```

### 2. Get OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy and securely store your API key

### 3. Backend Setup (Django)

```bash

cd backend


python3 -m venv venv


source venv/bin/activate

pip install -r requirements.txt

cp .env.example .env


nano .env
```

**Configure your `.env` file:**
```env
OPENAI_API_KEY=your-openai-api-key-here
DEBUG=True
SECRET_KEY=your-django-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
```

```bash

python manage.py migrate

 (optional)
python manage.py createsuperuser

python manage.py runserver 0.0.0.0:8000
```

The backend API will be available at `http://localhost:8000`

### 4. Frontend Setup (React)

```bash

cd frontend


npm install


cp .env.example .env


nano .env
```

**Configure  frontend `.env` file:**
```env
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_ENVIRONMENT=development
```

```bash

npm start
```

The frontend application will be available at `http://localhost:3000`
