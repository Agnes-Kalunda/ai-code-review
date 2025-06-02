from rest_framework import viewsets
from .models import Code
from .serializers import CodeSerializer

class CodeViewSet(viewsets.ModelViewSet):
    queryset = Code.objects.all()
    serializer_class = CodeSerializer
