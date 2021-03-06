# Generated by Django 3.0.3 on 2020-03-18 05:56

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import exp.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=127, verbose_name='氏名')),
                ('age', models.PositiveSmallIntegerField(default=20, validators=[django.core.validators.MinValueValidator(1, message='年齢は1以上で入力してください'), django.core.validators.MaxValueValidator(120)], verbose_name='年齢')),
                ('sex', models.IntegerField(choices=[(0, '男性'), (1, '女性'), (2, '答えたくない')], default=0, verbose_name='性別')),
                ('is_acceptance', models.IntegerField(choices=[(0, '同意しません'), (1, '同意します')], default=0, validators=[exp.models.validate_acceptance], verbose_name='同意')),
                ('created_datetime', models.DateTimeField(default=django.utils.timezone.now)),
            ],
        ),
        migrations.CreateModel(
            name='PinballSubgoal',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('task', models.IntegerField()),
                ('order', models.IntegerField()),
                ('x', models.FloatField()),
                ('y', models.FloatField()),
                ('rad', models.FloatField()),
                ('timestamp', models.DateTimeField(default=django.utils.timezone.now)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='exp.User')),
            ],
        ),
        migrations.CreateModel(
            name='FourroomsSubgoal',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('task', models.IntegerField()),
                ('order', models.IntegerField()),
                ('state', models.FloatField()),
                ('timestamp', models.DateTimeField(default=django.utils.timezone.now)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='exp.User')),
            ],
        ),
    ]
