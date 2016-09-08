from django.contrib.auth.models import User
from tastypie.authorization import Authorization
from tastypie.exceptions import Unauthorized
from tastypie.resources import ModelResource
from notes.models import Note


class NoteAuthorization(Authorization):
    # READ notes
    def read_list(self, object_list, bundle):
        if bundle.request.user.is_authenticated:
            return object_list.filter(owner=bundle.request.user)
        else:
            raise Unauthorized("Not allowed")

    # READ note
    def read_detail(self, object_list, bundle):
        return bundle.obj.owner == bundle.request.user

    def create_list(self, object_list, bundle):
        return Unauthorized("Not allowed")

    # CREATE note
    def create_detail(self, object_list, bundle):
        return bundle.obj.user == bundle.request.user

    def update_list(self, object_list, bundle):
        return Unauthorized("Not allowed")

    # UPDATE note
    def update_detail(self, object_list, bundle):
        return bundle.obj.owner == bundle.request.user

    def delete_list(self, object_list, bundle):
        raise Unauthorized("Deletes not allowed")

    def delete_detail(self, object_list, bundle):
        raise Unauthorized("Deletes not allowed")


class NoteResource(ModelResource):
    class Meta:
        queryset = Note.objects.all()
        resource_name = 'note'
        authorization = NoteAuthorization()
        list_allowed_methods = ['get', 'post']
        detail_allowed_methods = ['get', 'patch']


class UserResource(ModelResource):
    class Meta:
        fields = ['username']
        queryset = User.objects.all()
        resource_name = 'user'
