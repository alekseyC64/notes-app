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
        parser.add_argument('user_count', type=int)
        parser.add_argument('note_count', type=int)

    def handle(self, *args, **options):
        if options.get('user_count') <= 0:
            raise CommandError('the number of users to generate must be > 0')
        if options.get('note_count') <= 0:
            raise CommandError('the number of notes to generate must be > 0')

        gen_random_users(options['user_count'])
        self.stdout.write('Generated {} user(s)'.format(
            options['user_count']))

        gen_random_notes(options['note_count'])
        self.stdout.write('Generated {} note(s)'.format(
            options['note_count']))
