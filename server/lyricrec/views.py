from django.shortcuts import render

from django.http import HttpResponse

from .models import Track

def index(request, id):
    try:
        track = Track.objects.get(song_id=id)
        return HttpResponse("{} by {} returned".format(track.title, track.artist))
    except Track.DoesNotExist:
        return HttpResponse("No track")
