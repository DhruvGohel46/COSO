from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
    """Define a model manager for User model with no username field."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError('The email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular User with the given email and password."""
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)

class User(AbstractUser):
    """Custom User model with email as the unique identifier."""
    
    username = None
    email = models.EmailField(_('email address'), unique=True)
    
    # Common fields for all users
    full_name = models.CharField(max_length=100)
    is_student = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)
    
    # Student specific fields
    institute = models.CharField(max_length=100, blank=True, null=True)
    course = models.CharField(max_length=100, blank=True, null=True)
    year = models.CharField(max_length=10, blank=True, null=True)
    profile_photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)
    student_id_doc = models.FileField(upload_to='student_ids/', blank=True, null=True)
    
    # Admin specific fields
    designation = models.CharField(max_length=100, blank=True, null=True)
    admin_id = models.CharField(max_length=20, blank=True, null=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']
    
    objects = UserManager()
    
    def __str__(self):
        return self.email

# Predefined list of institutes
INSTITUTE_CHOICES = [
    ('Engineering College of Technology', 'Engineering College of Technology'),
    ('Medical Sciences Institute', 'Medical Sciences Institute'),
    ('Business Management School', 'Business Management School'),
    ('Arts and Sciences University', 'Arts and Sciences University'),
    ('Law School', 'Law School'),
    ('Design Institute', 'Design Institute'),
]

# Event type choices
EVENT_TYPE_CHOICES = [
    ('Technical', 'Technical'),
    ('Non-Technical', 'Non-Technical'),
    ('Sports', 'Sports'),
]

class Event(models.Model):
    """Model for events."""
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    event_type = models.CharField(max_length=20, choices=EVENT_TYPE_CHOICES)
    college_name = models.CharField(max_length=100)
    academic_year = models.CharField(max_length=20)
    event_date = models.DateField()
    flyer = models.ImageField(upload_to='event_flyers/', blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title

class Post(models.Model):
    """Model for college posts."""
    
    description = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Post by {self.author.full_name} on {self.created_at.strftime('%Y-%m-%d')}"