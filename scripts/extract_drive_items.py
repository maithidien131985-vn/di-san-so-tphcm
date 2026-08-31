import re
import json

with open("scripts/drive_ref_folder.html", "r", encoding="utf-8") as f:
    html = f.read()

# Let's find all script contents and look for doc/file info
scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
items = []
for s in scripts:
    # Google drive initial data often has `AF_initDataCallback`
    callbacks = re.findall(r'AF_initDataCallback\s*\(\s*(\{[^<]+\})\s*\);', s)
    for cb in callbacks:
        # try to find data inside
        items.append(cb)

print("Found callbacks:", len(items))
with open("scripts/callbacks.txt", "w", encoding="utf-8") as f:
    for c in items:
        f.write(c + "\n\n" + "="*50 + "\n\n")

# Look for drive file URLs or IDs with titles
file_matches = re.findall(r'\[\"(1[a-zA-Z0-9_-]{27,})\",\[\"([^\"]+)\"', html)
print(f"File matches: {len(file_matches)}")
with open("scripts/file_matches.txt", "w", encoding="utf-8") as f:
    for m in file_matches:
        f.write(f"{m[0]} : {m[1]}\n")
