from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User


class Note(models.Model):
    title = models.CharField('Title', max_length=255)
    content = models.TextField('Content')
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name='Owner')
    shared_with = models.ManyToManyField(
        User,
        blank=True,
        related_name='shared_notes'
    )
    created_on = models.DateTimeField('Created on', auto_now_add=True)
    updated_on = models.DateTimeField('Updated on', auto_now=True)

    def __unicode__(self):
        return self.title
