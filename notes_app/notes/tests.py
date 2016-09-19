from __future__ import unicode_literals
from django.contrib.auth.models import User
from django.test import TestCase
from tastypie.test import ResourceTestCaseMixin
from .models import Note


class NoteResourceTest(ResourceTestCaseMixin, TestCase):
    fixtures = ['user.json', 'note.json']

    def setUp(self):
        super(NoteResourceTest, self).setUp()

        self.username = 'test'
        self.password = 'foobarbaz'
        self.user = User.objects.get(username=self.username)

        self.api_list = '/api/v1/note/'
        self.api_detail = '/api/v1/note/1/'
        self.api_detail_shared = '/api/v1/note/4/'
        self.api_detail_not_shared = '/api/v1/note/5/'
        self.note_keys = [
            'id', 'title', 'content', 'created_on', 'updated_on',
            'resource_uri', 'owner', 'shared_with'
        ]
        self.api_user_id = "/api/v1/user/2/"
        self.post_data = {
            'title': 'New note title',
            'content': 'Some content',
            'owner': self.api_user_id
        }
        self.post_data_empty_title = {
            'title': '',
            'content': 'This note has no title',
            'owner': self.api_user_id
        }
        self.post_data_empty_content = {
            'title': 'This note has no content',
            'content': '',
            'owner': self.api_user_id
        }
        self.post_data_absent_title = {
            'content': 'The title of this note is absent',
            'owner': self.api_user_id
        }
        self.post_data_absent_content = {
            'title': 'The content of this note is absent',
            'owner': self.api_user_id
        }

    def get_credentials(self):
        return self.create_basic(
            username=self.user.username,
            password=self.password)

    def test_api_unauthenticated(self):
        """Unauthenticated user should be denied access to the Notes API."""
        self.assertHttpUnauthorized(self.api_client.get(
            self.api_list, format='json'))
        self.assertHttpUnauthorized(self.api_client.get(
            self.api_detail, format='json'))
        self.assertHttpUnauthorized(self.api_client.post(
            self.api_list, format='json', data=self.post_data))
        self.assertHttpUnauthorized(self.api_client.put(
            self.api_detail, format='json'))

    def test_get_list_json(self):
        """Authenticated user should get back a list of notes owned by them."""
        owned_count = Note.objects.filter(owner=self.user).count()
        shared_count = Note.objects.filter(shared_with=self.user.id).count()
        total_count = owned_count + shared_count

        resp = self.api_client.get(
            self.api_list,
            format='json',
            authentication=self.get_credentials())
        self.assertValidJSONResponse(resp)
        self.assertEqual(len(self.deserialize(resp)['objects']), total_count)
        self.assertEqual(self.deserialize(resp)['objects'][0], {
            'content': 'It\'s a beautiful note.',
            'created_on': '2016-09-09T08:02:46.504000',
            'id': 1,
            'owner': self.api_user_id,
            'shared_with': [],
            'resource_uri': self.api_detail,
            'title': 'Hello world!',
            'updated_on': '2016-09-09T08:02:46.504000'
        })

    def test_get_detail_json(self):
        """Authenticated user should have access to a note they own."""
        resp = self.api_client.get(
            self.api_detail,
            format='json',
            authentication=self.get_credentials())
        self.assertValidJSONResponse(resp)
        self.assertKeys(self.deserialize(resp), self.note_keys)
        self.assertEqual(self.deserialize(resp)['title'], 'Hello world!')

    def test_get_detail_json_other_user(self):
        """Authenticated user shouldn't be able to read other users' notes."""
        self.assertHttpUnauthorized(self.api_client.get(
            self.api_detail_not_shared,
            format='json',
            authentication=self.get_credentials()
        ))

    def test_get_detail_json_shared(self):
        """Authenticated user should be able to read a note that was shared \
            with them"""
        resp = self.api_client.get(
            self.api_detail_shared,
            format='json',
            authentication=self.get_credentials()
        )
        self.assertValidJSONResponse(resp)
        self.assertKeys(self.deserialize(resp), self.note_keys)
        self.assertEqual(self.deserialize(resp)['title'], 'Shared Note')

    def test_post_list(self):
        """Authenticated user should be able to create notes."""
        owned_count = Note.objects.filter(owner=self.user).count()
        self.assertEqual(Note.objects.filter(
            owner=self.user).count(), owned_count)
        self.assertHttpCreated(self.api_client.post(
            self.api_list,
            format='json',
            data=self.post_data,
            authentication=self.get_credentials()))
        self.assertEqual(Note.objects.filter(
            owner=self.user).count(), owned_count+1)

    def test_post_list_empty_fields(self):
        """Authenticated user shouldn't be able to add notes with empty \
        title or content"""
        owned_count = Note.objects.filter(owner=self.user).count()
        self.assertHttpBadRequest(self.api_client.post(
            self.api_list,
            format='json',
            data=self.post_data_empty_title,
            authentication=self.get_credentials()))
        self.assertHttpBadRequest(self.api_client.post(
            self.api_list,
            format='json',
            data=self.post_data_absent_title,
            authentication=self.get_credentials()))
        self.assertHttpBadRequest(self.api_client.post(
            self.api_list,
            format='json',
            data=self.post_data_empty_content,
            authentication=self.get_credentials()))
        self.assertHttpBadRequest(self.api_client.post(
            self.api_list,
            format='json',
            data=self.post_data_absent_content,
            authentication=self.get_credentials()))
        self.assertEqual(Note.objects.filter(
            owner=self.user).count(), owned_count)

    def test_put_detail(self):
        """Authenticated user should be able to update notes owned by them."""
        owned_count = Note.objects.filter(owner=self.user).count()
        new_title = 'New Title'
        new_content = 'New Content'
        original_data = self.deserialize(self.api_client.get(
            self.api_detail, format='json',
            authentication=self.get_credentials()))
        new_data = original_data.copy()
        new_data['title'] = new_title
        new_data['content'] = new_content
        self.assertEqual(Note.objects.filter(
            owner=self.user).count(), owned_count)

        self.assertHttpAccepted(self.api_client.put(
            self.api_detail,
            format='json',
            data=new_data,
            authentication=self.get_credentials()))
        self.assertEqual(Note.objects.filter(
            owner=self.user).count(), owned_count)
        self.assertEqual(Note.objects.get(pk=1).title, new_title)
        self.assertEqual(Note.objects.get(pk=1).content, new_content)

    def test_delete_detail(self):
        """Delete HTTP request is not allowed regardless of user status."""
        self.assertHttpMethodNotAllowed(self.api_client.delete(
            self.api_detail, format='json',
            authentication=self.get_credentials()))
        self.assertHttpMethodNotAllowed(self.api_client.delete(
            self.api_detail, format='json',
            authentication=self.get_credentials()))
