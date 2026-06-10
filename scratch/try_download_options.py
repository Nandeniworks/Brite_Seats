import subprocess
import os

candidate_ids = [
    "1518063319789-7217e6706b04",
    "1556056504-5c7696c4c28d",
    "1459865264687-595d652de67e",
    "1431324155629-1a6edd1dec1d",
    "1536122985607-4fe00b2e9928",
    "1510051640316-ecc3914f9ad5",
    "1574629810360-7efbbe195018",
    "1503677134444-8c6faaffab7a",
    "1543351611-58f7a64652c7"
]

os.makedirs("scratch/downloaded_new", exist_ok=True)

targets = ["oldtrafford.jpg", "allianz.jpg"]
downloaded = []

for i, id_val in enumerate(candidate_ids):
    url = f"https://images.unsplash.com/photo-{id_val}?auto=format&fit=crop&q=80&w=1000"
    temp_target = f"scratch/downloaded_new/temp_{i}.jpg"
    print(f"Trying download for ID {id_val}...")
    res = subprocess.run([
        "curl", "-L",
        "-A", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "-o", temp_target, url
    ])
    if res.returncode == 0 and os.path.exists(temp_target) and os.path.getsize(temp_target) > 10000:
        print(f"  ID {id_val} succeeded!")
        downloaded.append(temp_target)
    else:
        print(f"  ID {id_val} failed.")
        if os.path.exists(temp_target):
            os.remove(temp_target)

# Assign successfully downloaded images to our targets
for idx, target in enumerate(targets):
    if idx < len(downloaded):
        src = downloaded[idx]
        dst = f"scratch/downloaded_new/{target}"
        os.rename(src, dst)
        print(f"Assigned {src} to {dst}")
    else:
        print(f"No successful download available for {target}")

# Clean up any remaining temp files
for f in os.listdir("scratch/downloaded_new"):
    if f.startswith("temp_"):
        os.remove(f"scratch/downloaded_new/{f}")
