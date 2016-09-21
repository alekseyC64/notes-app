from django.db.models import Q
from django.contrib.auth.models import User
from tastypie.authorization import Authorization
from tastypie.authentication import BasicAuthentication
from tastypie.exceptions import Unauthorized
from tastypie.resources import ModelResource
from tastypie.validation import Validation
from tastypie import fields
from notes.models import Note


class NoteAuthorization(Authorization):

    # READ notes
    def read_list(self, object_list, bundle):
        if bundle.request.user.is_authenticated():
            return object_list.filter(
                Q(owner=bundle.request.user) |
                Q(shared_with=bundle.request.user.id))
        else:
            raise Unauthorized("Not allowed")

    # READ note
    def read_detail(self, object_list, bundle):
        return bundle.obj.owner == bundle.request.user or \
            bundle.obj.shared_with.filter(id=bundle.request.user.id).exists()

    def create_list(self, object_list, bundle):
        return Unauthorized("Not allowed")

    # CREATE note
    def create_detail(self, object_list, bundle):
        return bundle.obj.owner == bundle.request.user

    def update_list(self, object_list, bundle):
        return Unauthorized("Not allowed")

    # UPDATE note
    def update_detail(self, object_list, bundle):
        return bundle.obj.owner == bundle.request.user

    def delete_list(self, object_list, bundle):
        raise Unauthorized("Deletes not allowed")

    def delete_detail(self, object_list, bundle):
        raise Unauthorized("Deletes not allowed")


# Custom User Authorization
class UserAuthorization(Authorization):

    # CRUD User
    # CRUD User_list
    # /api/v1/user/
    def create_list(self, object_list, bundle):
        return object_list

    def read_list(self, object_list, bundle):
        return object_list

    def update_list(self, object_list, bundle):
        return object_list

    def delete_list(self, object_list, bundle):
        return object_list

    # CRUD User_detail
    # /api/v1/user/1/
    def create_detail(self, object_list, bundle):
        return True

    def read_detail(self, object_list, bundle):
        return True

    def update_detail(self, object_list, bundle):
        return bundle.obj.id == bundle.request.user.id

    def delete_detail(self, object_list, bundle):
        if bundle.obj.id == bundle.request.user.id:
            return True
        else:
            raise Unauthorized('Not yours data')


class NoteValidation(Validation):
    def is_valid(self, bundle, request=None):
        errors = {}
        if not bundle.data.get('title'):
            errors['title'] = 'Note title is empty/absent'
        if not bundle.data.get('content'):
            errors['content'] = 'Note content is empty/absent'
        return errors


# to POST User use this JSON or modify for others requests (PUT, PATCH)
# {
#     "email": "user@email.com",
#     "first_name": "FirstName",
#     "is_active": true,
#     "is_staff": false,
#     "is_superuser": false,
#     "last_name": "LastName",
#     "password": "demopass",
#     "username": "User"
# }
class UserResource(ModelResource):
    class Meta:
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        queryset = User.objects.all()
        resource_name = 'user'
        list_allowed_methods = ['get', 'post']
        detail_allowed_methods = ['get', 'put', 'patch', 'delete']
        authentication = BasicAuthentication()
        authorization = UserAuthorization()


class NoteResource(ModelResource):
    owner = fields.ForeignKey(UserResource, 'owner')
    shared_with = fields.ManyToManyField(
        UserResource, 'shared_with', full=True, null=True, blank=True)

    class Meta:
        queryset = Note.objects.all()
        resource_name = 'note'
        # fields = []
        authorization = NoteAuthorization()
        list_allowed_methods = ['get', 'post']
        detail_allowed_methods = ['get', 'put', 'patch']
        authentication = BasicAuthentication()
        validation = NoteValidation()

    def hydrate(self, bundle):
        bundle.obj.owner = bundle.request.user
        return bundle
