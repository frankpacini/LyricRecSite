from django.shortcuts import render
from django.http import HttpResponse

from .models import Track
from .scraper import Scraper

scraper = Scraper()

def index(request, id):
    try:
        track = Track.objects.get(song_id=id)
    except Track.DoesNotExist:
        song_dict = scraper.get(id)
        if song_dict is None:
            response = HttpResponse("No track found")
            response.status_code = 404
            return response
        else:
            track = Track(**song_dict)
            track.save()
    return HttpResponse("{} by {}\n\n{}".format(track.title, track.artist, track.lyrics))
        