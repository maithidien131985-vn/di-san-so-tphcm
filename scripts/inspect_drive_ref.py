import re
import json

with open("scripts/drive_ref_folder.html", "r", encoding="utf-8") as f:
    html = f.read()

# Search for doc/pdf/file names or drive IDs
# Find any occurrences of titles, files, or docs
file_ids = set(re.findall(r'1[a-zA-Z0-9_-]{27,}', html))
print(f"Found {len(file_ids)} possible IDs")

# Look for patterns of filenames
filenames = re.findall(r'[\w\s\.\-–_()]+\.(?:pdf|docx|doc|txt|png|jpg|jpeg)', html, re.IGNORECASE)
print(f"Found {len(filenames)} filenames:", filenames[:20])

# Search for AF_dataServiceRequests or _ds:
ds_matches = re.findall(r'window\._ds\s*=\s*(\{.*?\});', html, re.DOTALL)
print("ds_matches:", len(ds_matches))

# Look for text snippets in script tags
scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
for i, s in enumerate(scripts):
    if "1FZc-1NfRdcOMAFn-MxjSL2wEl8JrtNvT" in s or "di tích" in s.lower() or "dinh" in s.lower() or "drive.google.com" in s:
        print(f"Script {i} contains keywords, length: {len(s)}")
        # let's search for string arrays inside
        strs = re.findall(r'"([^"\\]{4,100})"', s)
        print("Sample strings:", strs[:25])
