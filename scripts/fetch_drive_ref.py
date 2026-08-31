import urllib.request
import re
import json

url = "https://drive.google.com/drive/folders/1FZc-1NfRdcOMAFn-MxjSL2wEl8JrtNvT?usp=sharing"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        with open("scripts/drive_ref_folder.html", "w", encoding="utf-8") as f:
            f.write(html)
        print("HTML length:", len(html))
        
        # Look for files or data
        # Google Drive embeds items in JS
        matches = re.findall(r'\["([a-zA-Z0-9_-]{25,})",\["([^"]+)"', html)
        print("Total matches:", len(matches))
        for m in matches[:30]:
            print(m)
except Exception as e:
    print("Error:", e)
