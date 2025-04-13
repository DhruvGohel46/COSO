from django.urls import path
from . import views

urlpatterns = [
    # Authentication endpoints
    path('auth/register/student/', views.StudentRegistrationView.as_view(), name='student-registration'),
    path('auth/register/admin/', views.AdminRegistrationView.as_view(), name='admin-registration'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/logout/', views.LogoutView.as_view(), name='logout'),
    
    # Profile endpoints
    path('profile/', views.ProfileView.as_view(), name='profile'),
    
    # Admin dashboard endpoint
    path('admin/dashboard/', views.AdminDashboardView.as_view(), name='admin-dashboard'),
    path('admin/approve-student/<int:pk>/', views.ApproveStudentView.as_view(), name='approve-student'),
    path('admin/reject-student/<int:pk>/', views.RejectStudentView.as_view(), name='reject-student'),
    
    # Event endpoints
    path('events/', views.EventListCreateView.as_view(), name='event-list-create'),
    path('events/<int:pk>/', views.EventDetailView.as_view(), name='event-detail'),
    
    # Post endpoints
    path('posts/', views.PostListCreateView.as_view(), name='post-list-create'),
    path('posts/<int:pk>/', views.PostDetailView.as_view(), name='post-detail'),
]