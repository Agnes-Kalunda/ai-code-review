from django.core.management.base import BaseCommand
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
