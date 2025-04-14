from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter

urlpatterns = [
    # Root API view
    path('', views.api_root, name='api-root'),
    
    # Authentication endpoints
    path('register/student/', views.StudentRegistrationView.as_view(), name='student-register'),
    path('register/admin/', views.AdminRegistrationView.as_view(), name='admin-register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    
    # Profile endpoints
    path('profile/', views.ProfileView.as_view(), name='profile'),
    
    # Admin endpoints
    path('admin/dashboard/', views.AdminDashboardView.as_view(), name='admin-dashboard'),
    path('admin/approve/<int:pk>/', views.ApproveStudentView.as_view(), name='approve-student'),
    path('admin/reject/<int:pk>/', views.RejectStudentView.as_view(), name='reject-student'),
    
    # Events endpoints
    path('events/', views.EventListCreateView.as_view(), name='event-list'),
    path('events/<int:pk>/', views.EventDetailView.as_view(), name='event-detail'),
    
    # Posts endpoints
    path('posts/', views.PostListCreateView.as_view(), name='post-list'),
    path('posts/<int:pk>/', views.PostDetailView.as_view(), name='post-detail'),
]
