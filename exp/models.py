from django.db import models
from django.utils import timezone
from django.core import validators

class User(models.Model):
    age = models.PositiveSmallIntegerField(verbose_name='年齢', validators=[validators.MinValueValidator(1, message='年齢は1以上で入力してください',), validators.MaxValueValidator(120)])
    mail = models.EmailField(verbose_name="メールアドレス")
    SEX_CHOICES = ((0, '男性'), (1, '女性'), (2, '答えたくない'))
    sex = models.IntegerField(verbose_name='性別', choices = SEX_CHOICES, default=0)
    created_datetime = models.DateTimeField(default=timezone.now)

class Task(models.Model):
    title = models.CharField(max_length=127)
    description = models.TextField()
    registered_date = models.DateTimeField(default=timezone.now)
    modified_date = models.DateTimeField(blank=True, null=True)
    removed_date = models.DateTimeField(blank=True, null=True)

    def register(self):
        self.registered_date = timezone.now()
        self.save()
    
    def remove(self):
        self.removed_date = timezone.now()
        self.save()

    def __str__(self):
        return self.title

class Play(models.Model):
    task = models.ForeignKey('Task', on_delete=models.CASCADE)
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    n_steps = models.IntegerField(null=True, blank=True)
    is_goal = models.BooleanField()
    task_type = models.CharField(max_length=100)
    start_datetime = models.DateTimeField(default=timezone.now)
    end_datetime = models.DateTimeField(blank=True, null=True)

    def start(self, task_id=0, user_id=0, task_type="exp_play"):
        print(Task.objects.all())
        print(task_id)
        print(user_id)
        task = Task.objects.get(id=task_id)
        user = User.objects.get(id=user_id)
        self.task = task
        self.user = user
        self.task_type = task_type
        self.is_goal = False
        self.n_steps = 0
        self.start_datetime = timezone.now()
        self.save()
        return self.id

    def finish(self, n_steps, is_goal):
        self.n_steps = n_steps
        self.is_goal = is_goal
        self.end_datetime = timezone.now()
        self.save()

class Action(models.Model):
    play = models.ForeignKey('Play', on_delete=models.CASCADE)
    state1 = models.FloatField()
    state2 = models.FloatField(null=True, blank=True)
    state3 = models.FloatField(null=True, blank=True)
    state4 = models.FloatField(null=True, blank=True)
    intent_action = models.IntegerField()
    actual_action = models.IntegerField()
    timestamp = models.DateTimeField(default=timezone.now)

class Evaluation(models.Model):
    play = models.ForeignKey('Play', on_delete=models.CASCADE)
    state1 = models.FloatField()
    state2 = models.FloatField()
    state3 = models.FloatField()
    state4 = models.FloatField()
    action = models.IntegerField()
    evaluation = models.IntegerField()
    timestamp = models.DateTimeField(default=timezone.now)





