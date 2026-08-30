import urllib.request
import re
import os
import json

folder_id = '1xBiey6IhHuwi4CKf6nj7QMg5Wy9VDpAL'
url = f'https://drive.google.com/drive/folders/{folder_id}'

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8')
    print('Fetched HTML length:', len(html))
    with open('scripts/folder_page.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print('Saved folder_page.html')
except Exception as e:
    print('Error fetching drive folder:', e)
