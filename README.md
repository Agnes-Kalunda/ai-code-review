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

**Configure your frontend `.env` file:**
```env
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_ENVIRONMENT=development
```

```bash

npm start
```

The frontend application will be available at `http://localhost:3000`

## 🚀 Production Deployment (AWS EC2)

### Prerequisites
- AWS Account with EC2 access
- Domain name (optional)
- SSL certificate (recommended for production)
- OpenAI API key with sufficient credits

### Step 1: Launch EC2 Instance

1. Launch an Ubuntu 22.04 LTS EC2 instance (t3.medium recommended)
2. Configure security groups with the following inbound rules:
   - SSH (22) - Your IP
   - HTTP (80) - 0.0.0.0/0
   - HTTPS (443) - 0.0.0.0/0
   - Custom TCP (3000) - 0.0.0.0/0 (Frontend)
   - Custom TCP (8000) - 0.0.0.0/0 (Backend)

### Step 2: Connect to EC2 Instance

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### Step 3: Install Dependencies

```bash

sudo apt update && sudo apt upgrade -y


curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs


sudo apt install python3-pip python3-venv git nginx -y


node --version
npm --version
python3 --version
```

### Step 4: Deploy Application

```bash
git clone https://github.com/Agnes-Kalunda/ai-code-review.git
cd ai-code-review

# Setup backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt


nano .env
```

**Production `.env` configuration:**
```env
OPENAI_API_KEY=your-openai-api-key
DEBUG=False
SECRET_KEY=your-production-secret-key
ALLOWED_HOSTS=your-domain.com,your-ec2-ip
DATABASE_URL=your-database-url
```

```bash

python manage.py migrate
python manage.py collectstatic --noinput


pip install gunicorn
gunicorn backend.wsgi:application --bind 0.0.0.0:8000 --daemon


cd ../frontend


nano .env
```

**Frontend production `.env`:**
```env
REACT_APP_API_BASE_URL=http://your-ec2-ip:8000
REACT_APP_ENVIRONMENT=production
```

```bash

npm install
npm run build


sudo npm install -g serve
serve -s build -l 3000 -L
```


### Step 6: Access Your Application

- **Frontend**: `http://your-ec2-ip:3000` or `http://your-domain.com`
- **Backend API**: `http://your-ec2-ip:8000/api/`

## 🔧 Configuration

### OpenAI API Settings

**Supported Models:**
- `gpt-3.5-turbo` - Fast and cost-effective
- `gpt-4` - More advanced but higher cost
- `gpt-4-turbo` - Latest model with improved performance

**Backend Configuration (settings.py):**
```python
# OpenAI Configuration
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
OPENAI_MODEL = os.getenv('OPENAI_MODEL', 'gpt-3.5-turbo')
OPENAI_MAX_TOKENS = int(os.getenv('OPENAI_MAX_TOKENS', 1000))
OPENAI_TEMPERATURE = float(os.getenv('OPENAI_TEMPERATURE', 0.7))
```

### Rate Limiting

Configure API usage limits to control costs:

```python
API_RATE_LIMIT = '100/hour'  # 100 requests per hour per user
OPENAI_MONTHLY_BUDGET = 50   # $50 monthly budget limit
```

## 📚 API Documentation

### Base URL
- **Development**: `http://localhost:8000/api/`
- **Production**: `http://your-ec2-ip:8000/api/`


### OpenAI API Costs

Monitor your usage to control costs:

- **GPT-3.5-turbo**: ~$0.002 per 1K tokens
- **GPT-4**: ~$0.06 per 1K tokens
- **Average conversation**: 100-500 tokens

### Cost Optimization Tips

1. **Use GPT-3.5-turbo** for most queries
2. **Implement token limits** per request
3. **Cache common responses**
4. **Set monthly budget alerts**
5. **Monitor usage dashboard**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Agnes Kalunda** - *Initial work* - [Agnes-Kalunda](https://github.com/Agnes-Kalunda)

## 🙏 Acknowledgments

- OpenAI for providing the powerful GPT API
- Django and React communities
- AWS for cloud infrastructure
- All contributors to this project


## 🚀 Quick Start Commands

**Local Development:**
```bash
# Terminal 1 - Backend
cd backend && source venv/bin/activate && python manage.py runserver

# Terminal 2 - Frontend  
cd frontend && npm start
```

**Production Deployment:**
```bash
# Backend
cd backend && source venv/bin/activate && gunicorn backend.wsgi:application --bind 0.0.0.0:8000

# Frontend
cd frontend && serve -s build -l 3000 -L
```

**Access URLs:**
- Local: `http://localhost:3000`
- Production: `http://your-ec2-ip:3000`

