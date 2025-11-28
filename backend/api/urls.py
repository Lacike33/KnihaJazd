from django.urls import path, include

urlpatterns = [
    path('v1/dashboard/', include('dashboard.urls', namespace='dashboard')),
    # path('v2/', include('api.v2.urls', namespace='v2')),  # Future version
]