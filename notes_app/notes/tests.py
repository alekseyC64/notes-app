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
            u'id', u'title', u'content', u'created_on', u'updated_on',
            u'resource_uri', u'owner', u'shared_with'
        ]
        self.api_user_id = "/api/v1/user/2/"
        self.post_data = {
            u'title': u'New note title',
            u'content': u'Some content',
            u'owner': self.api_user_id
        }

    def get_credentials(self):
        return self.create_basic(
            username=self.user.username,
            password=self.password)

    def test_get_list_unauthenticated(self):
        """Access to notes should be denied to unauthenticated users."""
        self.assertHttpUnauthorized(self.api_client.get(
            self.api_list, format='json'))

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
            u"content": u"It's a beautiful note.",
            u"created_on": u"2016-09-09T08:02:46.504000",
            u"id": 1,
            u"owner": u"/api/v1/user/2/",
            u"shared_with": [],
            u"resource_uri": self.api_detail,
            u"title": u"Hello world!",
            u"updated_on": u"2016-09-09T08:02:46.504000"
        })

    def test_get_detail_unauthenticated(self):
        """Access to a note should be denied to unauthenticated users."""
        self.assertHttpUnauthorized(self.api_client.get(
            self.api_detail, format='json'))

    def test_get_detail_json(self):
        """Authenticated user should have access to a note they own."""
        resp = self.api_client.get(
            self.api_detail,
            format='json',
            authentication=self.get_credentials())
        self.assertValidJSONResponse(resp)
        self.assertKeys(self.deserialize(resp), self.note_keys)
        self.assertEqual(self.deserialize(resp)[u'title'], 'Hello world!')

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
        self.assertEqual(self.deserialize(resp)[u'title'], 'Shared Note')

    def test_post_list_unauthenticated(self):
        """Unauthenticated user shouldn't be able to create notes."""
        self.assertHttpUnauthorized(self.api_client.post(
            self.api_list, format='json', data=self.post_data))

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

    def test_put_detail_unauthenticated(self):
        """Unauthenticated user shouln't be able to update notes."""
        self.assertHttpUnauthorized(self.api_client.put(
            self.api_detail, format='json'))

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

    def test_delete_detail_unauthenticated(self):
        """Delete HTTP request is not allowed"""
        self.assertHttpMethodNotAllowed(self.api_client.delete(
            self.api_detail, format='json',
            authentication=self.get_credentials()))

    def test_delete_detail(self):
        """Delete HTTP request is not allowed"""
        self.assertHttpMethodNotAllowed(self.api_client.delete(
            self.api_detail, format='json',
            authentication=self.get_credentials()))
