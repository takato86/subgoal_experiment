from django import forms

from .models import User

class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('name', 'is_acceptance')
        widgets = {
            'acceptance': forms.RadioSelect(),
        }
        # fields = ('age', 'mail', 'sex')
        # widgets = {
        #     'sex': forms.RadioSelect(),
        # }