import requests
from sqlite3 import DataError
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.forms.models import model_to_dict

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


session = requests.Session()
session.headers = {
    'application': 'LyricRec',
    'User-Agent': 'https://github.com/frankpacini/LyricRec'
}
access_token = 'Bearer ' + open('../creds.txt').read().split('\n')[4]
authorization_header = {'Authorization': access_token}

def search(request, query):
    search_response = session.request('GET', 'https://api.genius.com/search/', params={'q': query, "per_page": 10}, headers=authorization_header)
    search_results = search_response.json()['response']['hits']

    parsed_results = []
    for result in search_results:
        if result['type'] != 'song':
            raise DataError
        result = result['result']
        parsed_result = {
                            'id': result['id'],
                            'title': result['title'],
                            'artist': result['primary_artist']['name'],
                            'image_thumbnail_url': result['song_art_image_thumbnail_url']
                        }
        parsed_results.append(parsed_result)

    return JsonResponse({'results': parsed_results})