rm -d -r exp/migrations/
rm -d -r db.sqlite3
python manage.py makemigrations exp
python manage.py migrate
python manage.py createsuperuser