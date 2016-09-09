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
        self.user = User.objects.get(username='test')

        self.entry1 = User.objects.get(id=1)
        self.post_data = {
            'title': 'New note title',
            'content': 'Some content',
            'owner': 2
        }

    def get_credentials(self):
        return self.create_basic(
            username=self.user.username,
            password=self.password)

    def test_get_list_unauthenticated(self):
        self.assertHttpUnauthorized(self.api_client.get(
            '/api/v1/note/', format='json'))

    def test_get_list_json(self):
        resp = self.api_client.get(
            '/api/v1/note/',
            format='json',
            authentication=self.get_credentials())
        self.assertValidJSONResponse(resp)
        self.assertEqual(len(self.deserialize(resp)['objects'], 3))
        self.assertEqual(self.deserialize(resp)['objects'][0], {
            "content": "It's a beautiful note.",
            "created_on": "2016-09-09T08:02:46.504000",
            "id": 1,
            "resource_uri": "/api/v1/note/1/",
            "title": "Hello world!",
            "updated_on": "2016-09-09T08:02:46.504000"
        })

    def test_get_detail_unauthenticated(self):
        self.assertHttpUnauthorized(self.api_client.get(
            '/api/v1/node/1/', format='json'))

    def test_get_detail_json(self):
        resp = self.api_client.get(
            '/api/v1/note/1/',
            format='json',
            authentication=self.get_credentials())
        self.assertValidJSONResponse(resp)
        self.assertKeys(self.deserialize(resp), [
            'title', 'content', 'created_on', 'updated_on'])
        self.assertEqual(self.deserialize(resp)['title'], 'Hello world!')

    def test_post_list_unauthenticated(self):
        self.assertHttpUnauthorized(self.api_client.post(
            '/api/v1/note/', format='json', data=self.post_data))

    def test_post_list(self):
        self.assertEqual(Note.objects.count(), 3)
        self.assertHttpCreated(self.api_client.post(
            '/api/v1/note/',
            format='json',
            data=self.post_data,
            authentication=self.get_credentials()))
        self.assertEqual(Note.objects.count(), 4)

    def test_put_detail_unauthenticated(self):
        self.assertHttpUnauthorized(self.api_client.put(
            '/api/v1/note/1/', format='json'))

    def test_put_detail(self):
        original_data = self.deserialize(self.api_client.get(
            '/api/v1/note/1/', format='json',
            authentication=self.get_credentials()))
        new_data = original_data.copy()
        new_data['title'] = 'New Title'
        new_data['content'] = 'New Content'
        self.assertEqual(Note.objects.count(), 3)

        self.assertHttpAccepted(self.api_client.put(
            '/api/v1/note/1/',
            format='json',
            data=new_data,
            authentication=self.get_credentials()))
        self.assertEqual(Note.objects.count(), 4)
        self.assertEqual(Note.objects.get(pk=1).title, 'New Title')
        self.assertEqual(Note.objects.get(pk=1).content, 'New Content')

    def test_delete_detail_unauthenticated(self):
        self.assertHttpUnauthorized(self.api_client.delete(
            '/api/v1/note/1/', format='json'))

    def test_delete_detail(self):
        self.assertHttpUnauthorized(self.api_client.delete(
            'api/v1/note/1/', format='json',
            authentication=self.get_credentials()))
