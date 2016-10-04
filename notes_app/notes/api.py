from django.db.models import Q
from django.conf.urls import url
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from tastypie.authorization import Authorization
from tastypie.authentication import SessionAuthentication
from tastypie.exceptions import Unauthorized
from tastypie.http import HttpForbidden, HttpUnauthorized, HttpBadRequest
from tastypie.resources import ModelResource
from tastypie.utils import trailing_slash
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
        if bundle.obj.owner == bundle.request.user:
            return True
        else:
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
        authentication = SessionAuthentication()
        authorization = UserAuthorization()

    def prepend_urls(self):
        return [
            url(
                r'{}/login{}$'.format(
                    self._meta.resource_name,
                    trailing_slash()),
                self.wrap_view('login'), name='login'
            ),
            url(
                r'{}/logout{}$'.format(
                    self._meta.resource_name,
                    trailing_slash()),
                self.wrap_view('logout'), name='logout'
            ),
            url(
                r'{}/register{}$'.format(
                    self._meta.resource_name,
                    trailing_slash()),
                self.wrap_view('register'), name='register'
            ),
            url(
                r'{}/session{}$'.format(
                    self._meta.resource_name,
                    trailing_slash()),
                self.wrap_view('session'), name='session'
            ),
        ]

    def login(self, request, **kwargs):
        self.method_check(request, allowed=['post'])
        credentials = self.deserialize(
            request, request.body,
            format=request.META.get('CONTENT_TYPE', 'application/json')
        )
        username = credentials.get('username', '')
        password = credentials.get('password', '')

        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                return self.create_response(request, {
                    'id': request.user.id,
                    'username': request.user.username
                })
            else:
                return self.create_response(request, {
                    'error': 'User account is disabled'
                }, HttpForbidden)
        else:
            return self.create_response(request, {
                'error': 'Wrong username or password'
            }, HttpUnauthorized)

    def register(self, request, **kwargs):
        self.method_check(request, allowed=['post'])
        credentials = self.deserialize(
            request, request.body,
            format=request.META.get('CONTENT_TYPE', 'application/json')
        )
        username = credentials.get('username')
        password = credentials.get('password')
        if not username:
            return self.create_response(request, {
                'error': 'No username in the request'
            }, HttpBadRequest)
        if not password:
            return self.create_response(request, {
                'error': 'No password in the request'
            }, HttpBadRequest)
        if User.objects.filter(username=username).exists():
            return self.create_response(request, {
                'error': 'User already exists'
            }, HttpForbidden)
        User.objects.create_user(username, password=password)
        return self.create_response(request, {})

    def logout(self, request, **kwargs):
        self.method_check(request, allowed=['post'])
        if request.user and request.user.is_authenticated():
            logout(request)
            return self.create_response(request, {})
        else:
            return self.create_response(request, {}, HttpUnauthorized)

    def session(self, request, **kwargs):
        self.method_check(request, allowed=['get'])
        if request.user and request.user.is_authenticated():
            return self.create_response(request, {
                'id': request.user.id,
                'username': request.user.username
            })
        else:
            return self.create_response(request, {}, HttpUnauthorized)


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
        detail_allowed_methods = ['get', 'put', 'patch', 'delete']
        authentication = SessionAuthentication()

        validation = NoteValidation()

    def hydrate(self, bundle):
        bundle.obj.owner = bundle.request.user
        return bundle
