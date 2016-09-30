from __future__ import unicode_literals
from django.contrib.auth.models import User
from django.test import TestCase
from tastypie.test import ResourceTestCaseMixin


class UserResourceTest(ResourceTestCaseMixin, TestCase):
    fixtures = ['test_users.json']

    def setUp(self):
        super(UserResourceTest, self).setUp()

        self.username = 'admin'
        self.password = 'admin13'
        self.user = User.objects.get(username=self.username)

        self.api_list = '/api/v1/user/'
        self.api_detail = '/api/v1/user/1/'
        self.api_login = '/api/v1/user/login/'
        self.api_logout = '/api/v1/user/logout/'
        self.api_register = '/api/v1/user/register/'
        self.api_user_id = '1'
        self.post_data = {
            'email': 'test@email.com',
            'first_name': 'test',
            'is_active': 'true',
            'is_staff': 'false',
            'is_superuser': 'false',
            'last_name': 'test',
            'password': 'test',
            'username': 'test'
        }
        self.put_data = {
            'first_name': 'testPut'
        }
        self.patch_data = {
            'last_name': 'testPatch'
        }

    def get_credentials(self, username='admin', password='admin13'):
        return self.create_basic(
            username=username,
            password=password)

    def setup_session(self, username='admin', password='admin13'):
        self.api_client.client.login(username=username, password=password)

    # Test List
    def test_get_list_json(self):
        """Authenticated User should get back a list of users."""
        self.setup_session()
        resp = self.api_client.get(
            self.api_list,
            format='json',
        )
        total_count = User.objects.all().count()
        self.assertValidJSONResponse(resp)
        self.assertEqual(len(self.deserialize(resp)['objects']), total_count)
        self.assertHttpOK(resp)

    def test_post_list_and_delete_detail(self):
        """Authorized Users can POST list and DELETE detail"""
        self.setup_session()
        users_before = User.objects.all().count()

        # create
        self.assertHttpCreated(
            self.api_client.post(
                self.api_list,
                format='json',
                data=self.post_data,
            )
        )
        new_user = User.objects.get(first_name=self.post_data['first_name'], email=self.post_data['email'])
        new_user.set_password(self.post_data['password'])
        new_user.save()
        users_after = User.objects.all().count()
        self.assertEqual((users_before + 1), users_after)

        # delete
        self.setup_session(self.post_data['username'], self.post_data['password'])
        self.assertEqual(User.objects.count(), users_after)
        self.assertHttpAccepted(
            self.api_client.delete(
                '/api/v1/user/{0}/'.format(new_user.id),
                format='json')
        )
        self.assertEqual(User.objects.count(), users_before)

    def test_delete_another_detail(self):
        """Users can't DELETE another users"""
        # create
        self.setup_session(username='iggy', password='iggy')
        self.assertHttpCreated(
            self.api_client.post(
                self.api_list,
                format='json',
                data={
                    'email': 'newtest@email.com',
                    'first_name': 'newtest',
                    'is_active': 'true',
                    'is_staff': 'false',
                    'is_superuser': 'false',
                    'last_name': 'test',
                    'password': 'test',
                    'username': 'test'
                }
            )
        )

        # delete
        new_user = User.objects.get(first_name='newtest', email='newtest@email.com')
        self.assertHttpUnauthorized(
            self.api_client.delete(
                '/api/v1/user/{0}/'.format(new_user.id),
                format='json'
            )
        )

    # Test Detail
    def test_get_detail_json(self):
        """Authorized Users should get back a valid json of a user"""
        self.setup_session()
        resp = self.api_client.get(
            self.api_detail,
            format='json'
        )
        user = User.objects.get(id=self.api_user_id)
        self.assertValidJSONResponse(resp)
        self.assertEqual(self.deserialize(resp)['username'], user.username)
        self.assertHttpOK(resp)

    def test_put_detail(self):
        """Authorized User can PUT"""
        self.setup_session()
        original_data = self.deserialize(
            self.api_client.get(
                self.api_detail,
                format='json'
            )
        )
        new_data = original_data.copy()
        new_data['first_name'] = 'new First'
        new_data['last_name'] = 'new Last'
        total_count = User.objects.all().count()

        self.assertEqual(User.objects.count(), total_count)
        self.assertHttpAccepted(
            self.api_client.put(
                self.api_detail,
                format='json',
                data=new_data
            )
        )
        self.assertEqual(User.objects.count(), total_count)
        self.assertEqual(User.objects.get(id=self.api_user_id).first_name, 'new First')
        self.assertEqual(User.objects.get(id=self.api_user_id).last_name, 'new Last')

    def test_patch_detail(self):
        """Authorized User can PATCH"""
        self.setup_session()
        resp = self.api_client.put(
            self.api_detail,
            format='json',
            data=self.patch_data
        )
        self.assertHttpAccepted(resp)
        self.assertEqual(User.objects.get(id=self.api_user_id).last_name, 'testPatch')

    # 401 Unauthorized
    def test_unauthorized(self):
        """Unauthorized Users cant GET, POST list & GET, PUT, PATCH, DELETE detail"""
        self.assertHttpUnauthorized(
            self.api_client.get(
                self.api_list,
                format='json'
            )
        )

    # 405 Method Not Allowed
    def test_not_allowed(self):
        """Users can't PUT PATCH DELETE list & POST detail"""
        self.setup_session()
        # PUT list
        self.assertHttpMethodNotAllowed(
            self.api_client.put(
                self.api_list,
                format='json',
                data=self.put_data
            )
        )
        # PATCH list
        self.assertHttpMethodNotAllowed(
            self.api_client.patch(
                self.api_list,
                format='json',
                data=self.patch_data
            )
        )
        # DELETE list
        self.assertHttpMethodNotAllowed(
            self.api_client.delete(
                self.api_list
            )
        )
        # POST detail
        self.assertHttpMethodNotAllowed(
            self.api_client.post(
                self.api_detail,
                format='json',
                data=self.post_data
            )
        )

    def test_login_correct_credentials(self):
        response = self.api_client.post(
            self.api_login,
            format='json',
            data={'username': self.username, 'password': self.password}
        )
        self.assertHttpOK(response)

    def test_login_wrong_credentials(self):
        response = self.api_client.post(
                self.api_login,
                format='json',
                data={'username': self.username, 'password': 'wrong password'}
        )
        self.assertHttpUnauthorized(response)
        self.assertIn('error', self.deserialize(response))

    def test_login_disabled_user(self):
        response = self.api_client.post(
            self.api_login,
            format='json',
            data={'username': 'steve', 'password': self.password}
        )
        self.assertHttpForbidden(response)
        self.assertIn('error', self.deserialize(response))

    def test_logout(self):
        self.setup_session()
        response = self.api_client.post(self.api_logout)
        self.assertHttpOK(response)
        response = self.api_client.post(self.api_logout)
        self.assertHttpUnauthorized(response)

    def test_registration_valid_input(self):
        response = self.api_client.post(
            self.api_register, format='json',
            data={'username': 'newusername', 'password': 'newpass'}
        )
        self.assertHttpOK(response)

    def test_registration_invalid_input(self):
        no_data_response = self.api_client.post(
            self.api_register, format='json'
        )
        self.assertHttpBadRequest(no_data_response)
        no_password_response = self.api_client.post(
            self.api_register, format='json',
            data={'username': 'newusername'}
        )
        self.assertHttpBadRequest(no_password_response)
        no_uname_response = self.api_client.post(
            self.api_register, format='json',
            data={'password': 'foo'}
        )
        self.assertHttpBadRequest(no_uname_response)

    def test_registration_existing_user(self):
        response = self.api_client.post(
            self.api_register, format='json',
            data={'username': self.username, 'password': self.password}
        )
        self.assertHttpForbidden(response)
        self.assertEqual(
            self.deserialize(response)['error'], 'User already exists')
