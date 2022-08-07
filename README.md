# LyricRecSite

Lyric-based track recommendation site using deep language models and the Genius.com API.

- app/ is the React.js frontend, using Material-ui as the css framework.
- ml/ includes model experiments using lyric data scraped from Genius.com
- server/ is the Django backend which receives search and track requests from the app and communicates with the Genius API and Azure
