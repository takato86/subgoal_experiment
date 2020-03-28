from django.db import models
from django.utils import timezone
from django.core import validators
from django.core.exceptions import ValidationError


def validate_acceptance(value):
    if value == 0:
        raise ValidationError('同意いただけない場合は，問い合わせ先に連絡をしてください．', code="reject")


class User(models.Model):
    # mail = models.EmailField(verbose_name="メールアドレス")
    name = models.CharField(verbose_name='氏名', max_length=127)
    min_validator = validators.MinValueValidator(1, message='年齢は1以上で入力してください',)
    max_validator = validators.MaxValueValidator(120)
    age = models.PositiveSmallIntegerField(verbose_name='年齢',
                                           validators=[min_validator,
                                                       max_validator],
                                           default=20)
    SEX_CHOICES = ((0, '男性'), (1, '女性'), (2, '答えたくない'))
    sex = models.IntegerField(verbose_name='性別', choices=SEX_CHOICES,
                              default=0)
    ACCEPTANCE_CHOICES = ((0, '同意しません'), (1, '同意します'))
    is_acceptance = models.IntegerField(verbose_name='同意',
                                        choices=ACCEPTANCE_CHOICES, default=0,
                                        validators=[validate_acceptance])
    created_datetime = models.DateTimeField(default=timezone.now)


class FourroomsSubgoal(models.Model):
    task = models.IntegerField(null=False, blank=False)
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    order = models.IntegerField()
    state = models.FloatField()
    timestamp = models.DateTimeField(default=timezone.now)

    def to_list(self):
        return [self.id, self.task, self.user.id, self.order, self.state]


class PinballSubgoal(models.Model):
    task = models.IntegerField(null=False, blank=False)
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    order = models.IntegerField()
    x = models.FloatField()
    y = models.FloatField()
    rad = models.FloatField()
    timestamp = models.DateTimeField(default=timezone.now)

    def to_list(self):
        return [self.id, self.task, self.user.id, self.order, self.x, self.y, self.rad]
