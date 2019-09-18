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
    # task = models.ForeignKey('Task', on_delete=models.CASCADE)
    task = models.IntegerField(null=False, blank=False)
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    n_steps = models.IntegerField(null=True, blank=True)
    goal = models.IntegerField()
    is_goal = models.BooleanField()
    task_type = models.CharField(max_length=100)
    start_datetime = models.DateTimeField(default=timezone.now)
    end_datetime = models.DateTimeField(blank=True, null=True)

    def start(self, task_id:int , user_id:int , goal:int , task_type: str="exp_play"):
        user = User.objects.get(id=user_id)
        self.task = task_id
        self.user = user
        self.goal = goal
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
    next_state1 = models.FloatField()
    next_state2 = models.FloatField(null=True, blank=True)
    next_state3 = models.FloatField(null=True, blank=True)
    next_state4 = models.FloatField(null=True, blank=True)
    reward = models.IntegerField()
    timestamp = models.DateTimeField(default=timezone.now)

    def to_dict(self):
        return {"id": self.id, "state1":self.state1, "state2":self.state2,"state3":self.state3,"state4":self.state4,"intent_action":self.intent_action, "actual_action":self.actual_action}

class Evaluation(models.Model):
    play = models.ForeignKey('Play', on_delete=models.CASCADE)
    action = models.ForeignKey('Action', on_delete=models.CASCADE)
    evaluation = models.IntegerField()
    timestamp = models.DateTimeField(default=timezone.now)
    
    def to_list(self):
        return [self.id, self.play.id, self.play.user.id, self.play.task, self.action.state1, self.action.state2, self.action.state3, self.action.state4, self.action.intent_action, self.action.actual_action, self.action.next_state1, self.action.next_state2, self.action.next_state3, self.action.next_state4, self.timestamp]
