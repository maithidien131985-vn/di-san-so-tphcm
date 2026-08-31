import urllib.request
import re

with open("scripts/callbacks.txt", "r", encoding="utf-8") as f:
    text = f.read()

# Search for matches with title and ID
# In Google Drive callback JS, files are represented like:
# [["id", null, null, ... "filename" ...]]
matches = re.findall(r'\[\"(1[a-zA-Z0-9_-]{25,})\",(?:\[\"([^\"]+)\"|null,[^,]+,[^,]+,\"([^\"]+)\")', text)
print(f"Matches found: {len(matches)}")
for m in matches:
    print(m)

# Let's search for "linh tài liệu tham khảo" in text
idx = text.find("linh tài liệu tham khảo")
if idx != -1:
    print("\nSnippet around 'linh tài liệu tham khảo':")
    print(text[max(0, idx-200):idx+300])

# Also check other items
for name in ["bà rịa", "bình dương", "tpHồ chí minh"]:
    i = text.lower().find(name)
    if i != -1:
        print(f"\nSnippet around '{name}':")
        print(text[max(0, i-200):i+300])
