from django.contrib.auth import get_user_model

User = get_user_model()

def generate_username(email):
    """
    Generate a unique username from email
    """
    base_username = email.split('@')[0]
    unique_username = base_username
    counter = 1
    while User.objects.filter(user_name=unique_username).exists():
        unique_username = f"{base_username}{counter}"
        counter += 1
    return unique_username