import json
import re

with open("scripts/callbacks.txt", "r", encoding="utf-8") as f:
    text = f.read()

# Let's search for filenames or documents in callbacks.txt
docs = re.findall(r'\"([^\"]*(?:Di tích|Dinh|Địa đạo|Chùa|Đình|Bảo tàng|Bến|Nhà tù|Hồ sơ|Tài liệu|STT|\.pdf|\.docx|\.doc|\.txt)[^\"]*)\"', text, re.IGNORECASE)

with open("scripts/found_docs.txt", "w", encoding="utf-8") as f_out:
    f_out.write(f"Found keywords: {len(docs)}\n")
    for d in docs:
        f_out.write(f"- {d}\n")

    # Find all 1... Google drive IDs
    drive_ids = set(re.findall(r'1[a-zA-Z0-9_-]{28,34}', text))
    f_out.write(f"\nFound drive IDs in callbacks: {len(drive_ids)}\n")
    for i in drive_ids:
        f_out.write(f"ID: {i}\n")

print("Finished writing found_docs.txt")
