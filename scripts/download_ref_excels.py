import urllib.request
import os

files = [
    ("1jsu92HmdNZLxb4X7rzMFawfQ1K1ccNdW", "scripts/di_tich_ba_ria_cu.xlsx"),
    ("1lozQSpToqSOeajzOwqrJYAdIzoGIRYzU", "scripts/di_tich_binh_duong_cu.xlsx"),
    ("1VSbSYGEUXs-wuMFVmsS6bD6iEZ9w8OGQ", "scripts/di_tich_tphcm_cu.xlsx")
]

for fid, outpath in files:
    url = f"https://drive.google.com/uc?export=download&id={fid}"
    print(f"Downloading {outpath} from {fid}...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as resp:
            content = resp.read()
            with open(outpath, "wb") as f:
                f.write(content)
            print(f"Saved {outpath}, size: {len(content)} bytes")
    except Exception as e:
        print(f"Failed to download {fid}: {e}")
