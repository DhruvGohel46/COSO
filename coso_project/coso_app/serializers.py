from rest_framework import serializers
from .models import User, Event, Post

class UserSerializer(serializers.ModelSerializer):
    """Base serializer for User model."""
    
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'is_student', 'is_admin', 'is_approved']
        read_only_fields = ['id', 'is_student', 'is_admin', 'is_approved']

class StudentRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for student registration."""
    
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'full_name', 'password', 'institute', 'course', 'year', 'profile_photo', 'student_id_doc']
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create(
            is_student=True,
            is_approved=False,  # Pending approval
            **validated_data
        )
        user.set_password(password)
        user.save()
        return user

class AdminRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for admin registration."""
    
    password = serializers.CharField(write_only=True)
    password_confirmation = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'full_name', 'password', 'password_confirmation', 'designation', 'admin_id', 'institute']
    
    def validate(self, data):
        # Check if passwords match
        if data['password'] != data['password_confirmation']:
            raise serializers.ValidationError({"password_confirmation": "Passwords do not match"})
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirmation')
        password = validated_data.pop('password')
        user = User.objects.create(
            is_admin=True,
            is_approved=True,  # Admins are auto-approved
            **validated_data
        )
        user.set_password(password)
        user.save()
        return user

class LoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    
    email = serializers.EmailField()
    password = serializers.CharField()

class StudentProfileSerializer(serializers.ModelSerializer):
    """Serializer for student profile."""
    
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'institute', 'course', 'year', 'profile_photo']
        read_only_fields = ['id', 'email']

class AdminProfileSerializer(serializers.ModelSerializer):
    """Serializer for admin profile."""
    
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'designation', 'admin_id', 'institute']
        read_only_fields = ['id', 'email']

class EventSerializer(serializers.ModelSerializer):
    """Serializer for events."""
    
    created_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'event_type', 'college_name', 'academic_year', 
                 'event_date', 'flyer', 'created_by', 'created_by_name', 'created_at']
        read_only_fields = ['id', 'created_by', 'created_at']
    
    def get_created_by_name(self, obj):
        return obj.created_by.full_name

class PostSerializer(serializers.ModelSerializer):
    """Serializer for college posts."""
    
    author_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = ['id', 'description', 'author', 'author_name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'author', 'created_at', 'updated_at']
    
    def get_author_name(self, obj):
        return obj.author.full_name

