import subprocess
import os

images = [
    ("cricket-micsk.jpg", "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=1000"), # Cricket pitch and players
    ("emirates.jpg", "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1000"),       # Football stadium interior red
    ("oldtrafford.jpg", "https://images.unsplash.com/photo-1606925797300-0b35e9d17d0e?auto=format&fit=crop&q=80&w=1000"),    # Football stadium pitch green
    ("allianz.jpg", "https://images.unsplash.com/photo-1568194157720-8eae79a6d7c7?auto=format&fit=crop&q=80&w=1000"),       # Glowing stadium at night
    ("lords.jpg", "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=1000")          # Classic cricket ground field
]

os.makedirs("scratch/downloaded_new", exist_ok=True)

for target, url in images:
    dst_path = f"scratch/downloaded_new/{target}"
    print(f"Downloading {target} from Unsplash: {url}...")
    res = subprocess.run([
        "curl", "-L",
        "-A", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "-o", dst_path, url
    ])
    if res.returncode == 0 and os.path.exists(dst_path) and os.path.getsize(dst_path) > 10000:
        print(f"  Successfully downloaded {target}!")
    else:
        print(f"  Failed to download {target}!")
