from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import get_object_or_404
from .models import User, Event, Post
from .serializers import (
    StudentRegistrationSerializer, AdminRegistrationSerializer, LoginSerializer,
    StudentProfileSerializer, AdminProfileSerializer, EventSerializer, PostSerializer
)

# Custom permissions
class IsStudent(permissions.BasePermission):
    """Permission to check if user is a student."""
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_student and request.user.is_approved

class IsAdmin(permissions.BasePermission):
    """Permission to check if user is an admin."""
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_admin

class IsOwnerOrAdmin(permissions.BasePermission):
    """Permission to check if user is the owner or an admin."""
    
    def has_object_permission(self, request, view, obj):
        # Admin can do anything
        if request.user.is_admin:
            return True
        
        # Check if the object has a created_by field (Event) or author field (Post)
        if hasattr(obj, 'created_by'):
            return obj.created_by == request.user
        elif hasattr(obj, 'author'):
            return obj.author == request.user
        
        return False

# Authentication views
class StudentRegistrationView(generics.CreateAPIView):
    """View for student registration."""
    
    serializer_class = StudentRegistrationSerializer

class AdminRegistrationView(generics.CreateAPIView):
    """View for admin registration."""
    
    serializer_class = AdminRegistrationSerializer

class LoginView(APIView):
    """View for user login."""
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            user = authenticate(request, username=email, password=password)
            
            if user is not None:
                if user.is_student and not user.is_approved:
                    return Response(
                        {"error": "Your student account is pending approval."},
                        status=status.HTTP_403_FORBIDDEN
                    )
                
                login(request, user)
                
                # Return user data based on role
                if user.is_student:
                    user_data = StudentProfileSerializer(user).data
                    role = 'student'
                else:
                    user_data = AdminProfileSerializer(user).data
                    role = 'admin'
                
                return Response({
                    "message": f"{role.capitalize()} login successful",
                    "user": user_data,
                    "role": role
                })
            else:
                return Response(
                    {"error": "Invalid email or password"},
                    status=status.HTTP_401_UNAUTHORIZED
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    """View for user logout."""
    
    def post(self, request):
        logout(request)
        return Response({"message": "Logged out successfully"})

# Profile view
class ProfileView(APIView):
    """View for user profile."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        if request.user.is_student:
            serializer = StudentProfileSerializer(request.user)
        else:
            serializer = AdminProfileSerializer(request.user)
        
        return Response(serializer.data)
    
    def put(self, request):
        if request.user.is_student:
            serializer = StudentProfileSerializer(request.user, data=request.data, partial=True)
        else:
            serializer = AdminProfileSerializer(request.user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Profile updated successfully",
                "user": serializer.data
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Admin dashboard views
class AdminDashboardView(APIView):
    """View for admin dashboard."""
    
    permission_classes = [IsAdmin]
    
    def get(self, request):
        # Get pending students for this admin's institute
        pending_students = User.objects.filter(
            is_student=True,
            is_approved=False,
            institute=request.user.institute
        )
        
        admin_data = AdminProfileSerializer(request.user).data
        pending_data = StudentProfileSerializer(pending_students, many=True).data
        
        return Response({
            "admin_details": admin_data,
            "institute": request.user.institute,
            "pending_approvals": pending_data,
            "total_pending": len(pending_data)
        })

class ApproveStudentView(APIView):
    """View to approve a student."""
    
    permission_classes = [IsAdmin]
    
    def post(self, request, pk):
        student = get_object_or_404(User, pk=pk, is_student=True, is_approved=False)
        
        # Check if student belongs to admin's institute
        if student.institute != request.user.institute:
            return Response(
                {"error": "You can only approve students from your institute"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        student.is_approved = True
        student.save()
        
        return Response({
            "message": "Student approved successfully",
            "student_id": student.id
        })

class RejectStudentView(APIView):
    """View to reject a student."""
    
    permission_classes = [IsAdmin]
    
    def post(self, request, pk):
        student = get_object_or_404(User, pk=pk, is_student=True, is_approved=False)
        
        # Check if student belongs to admin's institute
        if student.institute != request.user.institute:
            return Response(
                {"error": "You can only reject students from your institute"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Delete the student account
        student.delete()
        
        return Response({"message": "Student rejected successfully"})

# Event views
class EventListCreateView(generics.ListCreateAPIView):
    """View to list and create events."""
    
    queryset = Event.objects.all().order_by('-created_at')
    serializer_class = EventSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Apply filters
        event_type = self.request.query_params.get('type')
        academic_year = self.request.query_params.get('academic_year')
        
        if event_type:
            queryset = queryset.filter(event_type=event_type)
        if academic_year:
            queryset = queryset.filter(academic_year=academic_year)
        
        return queryset
    
    def perform_create(self, serializer):
        if not self.request.user.is_authenticated:
            raise permissions.PermissionDenied("You must be logged in to create an event")
        
        serializer.save(created_by=self.request.user)

class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View to retrieve, update, and delete events."""
    
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

# Post views
class PostListCreateView(generics.ListCreateAPIView):
    """View to list and create posts."""
    
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    
    def perform_create(self, serializer):
        # Only admins can create posts
        if not self.request.user.is_admin:
            raise permissions.PermissionDenied("Only admins can create posts")
        
        serializer.save(author=self.request.user)

class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View to retrieve, update, and delete posts."""
    
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]