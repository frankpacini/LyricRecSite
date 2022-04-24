from django.db import models


class Track(models.Model):
    song_id = models.IntegerField(blank=True, null=True)
    title = models.CharField(max_length=255)
    artist = models.CharField(max_length=255)
    page_views = models.IntegerField(blank=True, null=True)
    pyongs_count = models.IntegerField(blank=True, null=True)
    annotation_count = models.IntegerField(blank=True, null=True)
    lyrics = models.CharField(max_length=8000, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tracks'
