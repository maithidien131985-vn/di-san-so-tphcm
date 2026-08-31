import json
import re

with open("scripts/callbacks.txt", "r", encoding="utf-8") as f:
    text = f.read()

# Let's search for filenames or documents in callbacks.txt
# Find anything looking like document names or di tich names
docs = re.findall(r'\"([^\"]*(?:Di tích|Dinh|Địa đạo|Chùa|Đình|Bảo tàng|Bến|Nhà tù|Hồ sơ|Tài liệu)[^\"]*)\"', text, re.IGNORECASE)
print("Found keywords:", len(docs))
for d in docs[:30]:
    print("-", d)

# Find all 1... Google drive IDs
drive_ids = set(re.findall(r'1[a-zA-Z0-9_-]{28,34}', text))
print("Found drive IDs in callbacks:", len(drive_ids))
for i in drive_ids:
    print("ID:", i)
