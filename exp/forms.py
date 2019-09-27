from django import forms

from .models import User

class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('age', 'sex', 'name', 'is_acceptance')
        widgets = {
            'sex': forms.RadioSelect(),
            'is_acceptance': forms.RadioSelect(),
        }