from django.core.exceptions import ValidationError
import re

class PasswordStrengthValidator:
    def __init__(self, min_length=12):
        self.min_length = min_length

    def validate(self, password, user=None):
        if len(password) < self.min_length:
            raise ValidationError(
                f'Password must be at least {self.min_length} characters long.'
            )
        
        if not re.search(r'[A-Z]', password):
            raise ValidationError(
                'Password must contain at least one uppercase letter.'
            )
            
        if not re.search(r'[a-z]', password):
            raise ValidationError(
                'Password must contain at least one lowercase letter.'
            )
            
        if not re.search(r'[0-9]', password):
            raise ValidationError(
                'Password must contain at least one number.'
            )
            
        if not re.search(r'[^A-Za-z0-9]', password):
            raise ValidationError(
                'Password must contain at least one special character.'
            )

    def get_help_text(self):
        return (
            'Your password must contain at least one uppercase letter, '
            'one lowercase letter, one number, and one special character.'
        )