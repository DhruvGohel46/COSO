# COSO

COSO - College Social Platform
COSO is a comprehensive web-based social platform designed specifically for college students and administrators to connect, share events, and manage institutional activities. Built with modern web technologies, COSO serves as a centralized hub for college communities to stay informed and engaged.

Key Features
User Management System

Dual registration system supporting both students and administrators

Email-based authentication with role-based access control

Student approval workflow requiring admin verification

Custom user profiles with institute-specific information

Profile photo and document upload capabilities for verification


Event Management

Create and manage college events across three categories: Technical, Non-Technical, and Sports

Event filtering by type and academic year

Event flyer upload functionality

Comprehensive event details including date, description, and college information


Social Features

College post creation and sharing (admin-only posting)

Real-time feed displaying institutional updates and announcements

Social interaction capabilities for community engagement


Administrative Dashboard

Admin panel for student approval management

Institute-specific user management

Event and post moderation capabilities

Analytics and oversight tools for institutional administrators


Technology Stack
Backend Development

Django Framework: Primary web framework providing robust backend functionality

Django REST Framework: API development for seamless frontend-backend communication

SQLite Database: Data storage and management

Python: Core programming language


Frontend Development

HTML5: Semantic markup structure

CSS3: Modern styling and responsive design

JavaScript: Interactive functionality and dynamic content

Tailwind CSS: Utility-first CSS framework for rapid UI development

Security & Integration


CORS middleware for cross-origin resource sharing

Session-based authentication

File upload handling with size restrictions

Media file management for profile photos and event flyers

Project Structure
The application follows Django's Model-View-Template architecture with a clean separation of concerns. The project includes custom user models extending Django's AbstractUser, comprehensive API views for all major functionalities, and a responsive frontend design optimized for college environments.

COSO represents a modern approach to college community management, combining social networking features with institutional administration tools to create an integrated platform for academic communities.
 
