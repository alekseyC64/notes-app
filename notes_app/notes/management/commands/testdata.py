from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from notes.models import Note
import random
import _randomdata as randomdata


def gen_random_users(user_count):
    """Puts a set of random users of given length into the db."""
    username_tpl = 'demo_user_{:0>2}'
    first_name = 'demo'
    last_name = 'demo'
    email_tpl = 'demo{}@example.com'
    password = 'demo'
    for i in xrange(user_count):
        User.objects.get_or_create(username=username_tpl.format(i), defaults={
                'password': make_password(password),
                'first_name': first_name,
                'last_name': last_name,
                'email': email_tpl.format(i),
                'is_active': True
        })


def gen_random_notes(note_count):
    """Puts a set of random notes of given length into the db."""
    user_count = User.objects.all().count()
    Note.objects.bulk_create([
        Note(
            title=randomdata.random_title(),
            content=randomdata.random_text(),
            owner_id=random.randrange(1, user_count+1))
        for _ in xrange(note_count)
    ])


class Command(BaseCommand):
    help = 'Generates test data for the application'

    def add_arguments(self, parser):
        parser.add_argument(
            '-u', '--usercount', type=int,
            help='number of users to generate')
        parser.add_argument(
            '-n', '--notecount', type=int,
            help='number of notes to put into the database')

    def handle(self, *args, **options):
        user_count = options.get('usercount')
        note_count = options.get('notecount')
        if user_count:
            if user_count < 0:
                raise CommandError('the number of users can\'t be negative')
            else:
                gen_random_users(user_count)
                self.stdout.write('Generated {} user(s)'.format(user_count))
        if note_count:
            if note_count < 0:
                raise CommandError('the number of notes can\'t be negative')
            else:
                gen_random_notes(note_count)
                self.stdout.write('Generated {} note(s)'.format(note_count))
        if not (user_count or note_count):
            self.stdout.write('No arguments passed. Use -h to get help.')
