import requests
import lyricsgenius as lg

import re
import string
from unidecode import unidecode

class Scraper:
    def __init__(self):
        self.token = open("../token.txt", "r").read()
        self.session = requests.Session()
        self.session.headers = {
            'application': 'LyricRec',
            'User-Agent': 'https://github.com/frankpacini/LyricRec'
        }
        self.auth_header = {'Authorization': 'Bearer ' + self.token}

        self.genius = lg.Genius(self.token, skip_non_songs=True, 
            excluded_terms=["(Remix)", "(Live)", "- Live", "- Remix"], remove_section_headers=True)

    def get(self, id):
        response = self.session.request('GET', "https://api.genius.com/songs/{}/".format(id), headers=self.auth_header).json()
        if response['meta']['status'] == 404:
            return None
        try:
            song_response = response['response']['song']
        except KeyError:
            print(response.json())
            return None
            
        song = {'song_id': id}
        song['title'] = song_response['title']
        song['artist'] = song_response['primary_artist']['name']
        song['page_views'] = 0 if 'pageviews' not in song_response['stats'] else song_response['stats']['pageviews']
        song['pyongs_count'] = song_response['pyongs_count']
        song['annotation_count'] = song_response['annotation_count']
        song['thumbnail_url'] = song_response['song_art_image_thumbnail_url']
        song['lyrics'] = self.get_lyrics(id, song['title'])

        return song

        
    def get_lyrics(self, id, title):
        for i in range(3):
            try:
                lyrics = self.genius.lyrics(song_id=id)
                break
            except requests.Timeout:
                if i == 2:
                    raise
        if lyrics:
            start = len(title) + len(" Lyrics")
            if lyrics[start] == '[':
                start += lyrics[start:].find('\n') + 1
            
            end = len(lyrics) - len("Embed")
            while end > 0:
                if not lyrics[end-1].isdigit():
                    break
                end-=1
            lyrics = lyrics[start:end] + '.'

            lyrics = unidecode(lyrics)
            lyrics = str.encode(lyrics)[:8001].decode()
            trunc = list(re.compile('.|, | |;|\n').finditer(lyrics))[-1].start()
            lyrics = lyrics[:trunc]

        return lyrics