# pylint:disable=no-member
from django.core.management.base import BaseCommand
from django.db.transaction import atomic
from ...models import Venue


class Command(BaseCommand):
    @atomic
    def handle(self, *args, **options):
        for venue in Venue.objects.all():
            venue.update_score()
        self.stdout.write('Updated venue scores', self.style.SUCCESS)
