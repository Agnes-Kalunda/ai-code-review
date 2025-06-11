import os
import sys
import subprocess
from pathlib import Path

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e.stderr}")
        return False

def create_directory(path, description):
    """Create directory if it doesn't exist"""
    try:
        os.makedirs(path, exist_ok=True)
        print(f"✅ Created directory: {path}")
        return True
    except Exception as e:
        print(f"❌ Failed to create {path}: {e}")
        return False

def create_file(path, content, description):
    """Create file with content"""
    try:
        with open(path, 'w') as f:
            f.write(content)
        print(f"✅ Created {description}: {path}")
        return True
    except Exception as e:
        print(f"❌ Failed to create {path}: {e}")
        return False

def main():
    print("🚀 Setting up AI Code Review Backend...")
    print("=" * 50)
    

    if not os.path.exists('manage.py'):
        print("❌ Please run this script from the Django project root directory (where manage.py is located)")
        sys.exit(1)
    

    directories = [
        ('logs', 'logs directory'),
        ('media', 'media directory'),
        ('media/code_files', 'code files directory'),
        ('backendApp/services', 'services directory'),
        ('backendApp/management', 'management directory'),
        ('backendApp/management/commands', 'management commands directory'),
    ]
    
    for directory, description in directories:
        create_directory(directory, description)
    
    
    init_files = [
        'backendApp/services/__init__.py',
        'backendApp/management/__init__.py',
        'backendApp/management/commands/__init__.py',
    ]
    
    for init_file in init_files:
        create_file(init_file, '', f'__init__.py file')
    
    
    env_content = """# Django Settings
SECRET_KEY=your-very-secret-django-key-here-change-this-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here

# CORS Settings
CORS_ALLOW_ALL_ORIGINS=True
"""
    
    if not os.path.exists('.env'):
        create_file('.env', env_content, '.env file template')
        print("⚠️  Please edit .env file with your actual OpenAI API key!")
    else:
        print("✅ .env file already exists")
    
    
    clear_logs_command = """from django.core.management.base import BaseCommand
import os
from pathlib import Path

class Command(BaseCommand):
    help = 'Clear log files'
    
    def handle(self, *args, **options):
        BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
        logs_dir = os.path.join(BASE_DIR, 'logs')
        
        if os.path.exists(logs_dir):
            for log_file in os.listdir(logs_dir):
                if log_file.endswith('.log'):
                    file_path = os.path.join(logs_dir, log_file)
                    with open(file_path, 'w') as f:
                        f.write('')
                    self.stdout.write(f'Cleared {log_file}')
        
        self.stdout.write(self.style.SUCCESS('Log files cleared successfully'))
"""
    
    create_file('backendApp/management/commands/clear_logs.py', clear_logs_command, 'clear_logs management command')
    
    
    if os.path.exists('requirements.txt'):
        install_deps = input("📦 Install Python dependencies? (y/n): ").lower().strip() == 'y'
        if install_deps:
            run_command('pip install -r requirements.txt', 'Installing dependencies')
    
    
    django_setup = input("🔧 Run Django setup commands (makemigrations, migrate)? (y/n): ").lower().strip() == 'y'
    if django_setup:
        run_command('python manage.py makemigrations', 'Creating migrations')
        run_command('python manage.py migrate', 'Running migrations')
        
    
        create_superuser = input("👤 Create Django superuser? (y/n): ").lower().strip() == 'y'
        if create_superuser:
            print("🔄 Creating superuser...")
            os.system('python manage.py createsuperuser')
    
    
    test_setup = input("🧪 Test the setup? (y/n): ").lower().strip() == 'y'
    if test_setup:
        print("🔄 Testing Django configuration...")
        result = subprocess.run(['python', 'manage.py', 'check'], capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ Django configuration is valid!")
        else:
            print(f"❌ Django configuration issues: {result.stderr}")
    
    print("\n" + "=" * 50)
    print("🎉 Setup completed!")
    print("\nNext steps:")
    print("1. Edit .env file with your OpenAI API key")
    print("2. Run: python manage.py runserver")
    print("3. Visit: http://localhost:8000/api/reviews/")
    print("4. Visit admin: http://localhost:8000/admin/")
    print("\nAPI Endpoints:")
    print("- GET/POST /api/reviews/ - List/Create reviews")
    print("- GET /api/reviews/{id}/ - Get review details")
    print("- POST /api/reviews/{id}/analyze/ - Trigger analysis")
    print("- GET /api/reviews/stats/ - Get statistics")
    print("- GET /api/session/ - Session info")
    print("- GET /api/health/ - Health check")
    print("\nLogs will be saved in the 'logs/' directory")

if __name__ == '__main__':
    main()