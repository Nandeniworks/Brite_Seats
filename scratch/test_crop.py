import subprocess
import urllib.parse
import json
import os
import hashlib
import re

def search_commons(query):
    url = "https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srsearch=" + urllib.parse.quote(query + " filetype:bitmap") + "&srnamespace=6&srlimit=5"
    cmd = ["curl", "-s", "-H", "User-Agent: BriteSeats/1.0 (contact: demo@example.com)", url]
    try:
        res = subprocess.run(cmd, capture_output=True, text=True)
        data = json.loads(res.stdout)
        results = data.get("query", {}).get("search", [])
        return [r["title"] for r in results]
    except Exception as e:
        print(f"Error searching for {query}: {e}")
        return []

def get_image_url(filename):
    if filename.startswith("File:"):
        filename = filename[5:]
    filename = filename.replace(" ", "_")
    md5 = hashlib.md5(filename.encode('utf-8')).hexdigest()
    return f"https://upload.wikimedia.org/wikipedia/commons/{md5[0]}/{md5[0:2]}/{urllib.parse.quote(filename)}"

def get_dimensions(filepath):
    try:
        res = subprocess.run(["sips", "-g", "pixelWidth", "-g", "pixelHeight", filepath], capture_output=True, text=True)
        w_match = re.search(r"pixelWidth:\s*(\d+)", res.stdout)
        h_match = re.search(r"pixelHeight:\s*(\d+)", res.stdout)
        if w_match and h_match:
            return int(w_match.group(1)), int(h_match.group(1))
    except Exception as e:
        print(f"Error getting dimensions: {e}")
    return None

def crop_and_resize(src_path, dst_path, target_w, target_h):
    dims = get_dimensions(src_path)
    if not dims:
        print(f"Failed to get dimensions for {src_path}")
        return False
    W, H = dims
    print(f"Original: {W}x{H}, Target: {target_w}x{target_h}")
    
    target_r = target_w / target_h
    orig_r = W / H
    
    if orig_r > target_r:
        # Crop width
        crop_h = H
        crop_w = int(H * target_r)
    else:
        # Crop height
        crop_w = W
        crop_h = int(W / target_r)
        
    print(f"Cropping to: {crop_w}x{crop_h} centered")
    # Run sips crop
    subprocess.run(["sips", "--cropToHeightWidth", str(crop_h), str(crop_w), src_path], capture_output=True)
    # Run sips resize
    print(f"Resizing to: {target_w}x{target_h}")
    subprocess.run(["sips", "-z", str(target_h), str(target_w), src_path, "--out", dst_path], capture_output=True)
    return True

if __name__ == "__main__":
    # Test with one image
    query = "BTS in concert at Wembley Stadium, 2 June 2019 02.jpg"
    title = "File:" + query
    url = get_image_url(title)
    print(f"Test download: {url}")
    os.makedirs("scratch/test", exist_ok=True)
    tmp_src = "scratch/test/temp_bts.jpg"
    subprocess.run(["curl", "-L", "-o", tmp_src, url])
    
    # Try cropping and resizing to 1024x1024
    dst = "scratch/test/concert-bts.jpg"
    crop_and_resize(tmp_src, dst, 1024, 1024)
    print("Done test!")
