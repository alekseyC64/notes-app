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

    def get_credentials(self):
        return self.create_basic(
            username=self.user.username,
            password=self.password)

    def get_wrong_credentials(self):
        return self.create_basic(
            username=self.user.username,
            password='111'
        )

    # Test List
    def test_get_list_json(self):
        """Authenticated User should get back a list of users."""
        resp = self.api_client.get(
            self.api_list,
            format='json',
            authentication=self.get_credentials()
        )
        total_count = User.objects.all().count()
        self.assertValidJSONResponse(resp)
        self.assertEqual(len(self.deserialize(resp)['objects']), total_count)
        self.assertHttpOK(resp)

    def test_post_list_and_delete_detail(self):
        """Authorized Users can POST list and DELETE detail"""
        users_before = User.objects.all().count()

        # create
        self.assertHttpCreated(
            self.api_client.post(
                self.api_list,
                format='json',
                data=self.post_data,
                authentication=self.get_credentials()
            )
        )
        users_after = User.objects.all().count()
        self.assertEqual((users_before + 1), users_after)

        # delete
        new_user = User.objects.get(first_name='test', email='test@email.com')
        self.assertEqual(User.objects.count(), users_after)
        self.assertHttpAccepted(
            self.api_client.delete(
                '/api/v1/user/{0}/'.format(new_user.id),
                format='json',
                authentication=self.get_credentials()
            )
        )
        self.assertEqual(User.objects.count(), users_before)

    def test_delete_another_detail(self):
        """Users can't DELETE another users"""
        # create
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
                },
                authentication=self.create_basic(username='iggy', password='iggy')
            )
        )

        # delete
        new_user = User.objects.get(first_name='newtest', email='newtest@email.com')
        self.assertHttpUnauthorized(
            self.api_client.delete(
                '/api/v1/user/{0}/'.format(new_user.id),
                format='json',
                authentication=self.create_basic(username='iggy', password='iggy'))
        )

    # Test Detail
    def test_get_detail_json(self):
        """Authorized Users should get back a valid json of a user"""
        resp = self.api_client.get(
            self.api_detail,
            format='json',
            authentication=self.get_credentials()
        )
        user = User.objects.get(id=self.api_user_id)
        self.assertValidJSONResponse(resp)
        self.assertEqual(self.deserialize(resp)['username'], user.username)
        self.assertHttpOK(resp)

    def test_put_detail(self):
        """Authorized User can PUT"""
        original_data = self.deserialize(
            self.api_client.get(
                self.api_detail,
                format='json',
                authentication=self.get_credentials()
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
                data=new_data,
                authentication=self.get_credentials()
            )
        )
        self.assertEqual(User.objects.count(), total_count)
        self.assertEqual(User.objects.get(id=self.api_user_id).first_name, 'new First')
        self.assertEqual(User.objects.get(id=self.api_user_id).last_name, 'new Last')

    def test_patch_detail(self):
        """Authorized User can PATCH"""
        resp = self.api_client.put(
            self.api_detail,
            format='json',
            data=self.patch_data,
            authentication=self.get_credentials()
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
        # PUT list
        self.assertHttpMethodNotAllowed(
            self.api_client.put(
                self.api_list,
                format='json',
                data=self.put_data,
                authentication=self.get_credentials()
            )
        )
        # PATCH list
        self.assertHttpMethodNotAllowed(
            self.api_client.patch(
                self.api_list,
                format='json',
                data=self.patch_data,
                authentication=self.get_credentials()
            )
        )
        # DELETE list
        self.assertHttpMethodNotAllowed(
            self.api_client.delete(
                self.api_list,
                authentication=self.get_credentials()
            )
        )
        # POST detail
        self.assertHttpMethodNotAllowed(
            self.api_client.post(
                self.api_detail,
                format='json',
                data=self.post_data,
                authentication=self.get_credentials()
            )
        )
