import subprocess
import urllib.parse
import json
import os
import hashlib
import re

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
        print(f"  Failed to get dimensions for {src_path}")
        return False
    W, H = dims
    
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
        
    # Run sips crop
    subprocess.run(["sips", "--cropToHeightWidth", str(crop_h), str(crop_w), src_path], capture_output=True)
    # Run sips resize
    subprocess.run(["sips", "-z", str(target_h), str(target_w), src_path, "--out", dst_path], capture_output=True)
    return True

if __name__ == "__main__":
    event_images = [
        # Concerts
        {
            "filename": "concert-bts.jpg",
            "commons_name": "BTS_in_concert_at_Wembley_Stadium,_2_June_2019_02.jpg",
            "target_w": 1024,
            "target_h": 1024
        },
        {
            "filename": "concert-coldplay.jpg",
            "commons_name": "Coldplay_in_the_Philippines_on_20_January_2024_07.jpg",
            "target_w": 1000,
            "target_h": 667
        },
        {
            "filename": "concert-arijit.jpg",
            "commons_name": "Arijit_Singh_performance_at_MMRDA_ground_Mumbai_in_2018.jpg",
            "target_w": 1000,
            "target_h": 667
        },
        {
            "filename": "concert-dualipa.jpg",
            "commons_name": "Dua_Lipa,_Radical_Optimism_Tour,_Philippine_Arena,_13_Nov_2024.jpg",
            "target_w": 1000,
            "target_h": 750
        },
        {
            "filename": "concert-weeknd.jpg",
            "commons_name": "The_Weeknd_performing_at_Foro_Sol.jpg",
            "target_w": 1024,
            "target_h": 1024
        },
        # Football
        {
            "filename": "football-fifa.jpg",
            "commons_name": "Germany_champions_2014_FIFA_World_Cup.jpg",
            "target_w": 1000,
            "target_h": 563
        },
        {
            "filename": "football-ucl.jpg",
            "commons_name": "Trofeo_UEFA_Champions_League.jpg",
            "target_w": 1000,
            "target_h": 563
        },
        {
            "filename": "football-elclasico.jpg",
            "commons_name": "Pasillo_Real_Madrid_-_F.C._Barcelona.jpg",
            "target_w": 1000,
            "target_h": 584
        },
        {
            "filename": "football-arsenal.jpg",
            "commons_name": "Chelsea_players_training_before_2019_UEFA_Europa_League_final_03.jpg",
            "target_w": 1024,
            "target_h": 1024
        },
        {
            "filename": "football-manutd.jpg",
            "commons_name": "Williams-Brice_Stadium,_Manchester_United_v._Liverpool,_8-3-2024.jpg",
            "target_w": 1024,
            "target_h": 1024
        },
        # Cricket
        {
            "filename": "cricket-ipl.jpg",
            "commons_name": "Narendra_modi_stadium_2023_Final_between_India_and_Australia.jpg",
            "target_w": 1024,
            "target_h": 1024
        },
        {
            "filename": "cricket-indpak.jpg",
            "commons_name": "India_vs_pakistan_2023_CWC.jpg",
            "target_w": 1000,
            "target_h": 669
        },
        {
            "filename": "cricket-wtc.jpg",
            "commons_name": "The_Oval_test_match_-_geograph.org.uk_-_915211.jpg",
            "target_w": 1000,
            "target_h": 1494
        }
    ]
    
    os.makedirs("scratch/temp_downloads", exist_ok=True)
    os.makedirs("src/assets/events", exist_ok=True)
    
    for item in event_images:
        filename = item["filename"]
        commons_name = item["commons_name"]
        tw = item["target_w"]
        th = item["target_h"]
        
        url = get_image_url(commons_name)
        tmp_path = f"scratch/temp_downloads/{filename}"
        dst_path = f"src/assets/events/{filename}"
        
        print(f"Downloading {filename} from: {url}")
        res = subprocess.run(["curl", "-L", "-o", tmp_path, url])
        if res.returncode == 0 and os.path.exists(tmp_path) and os.path.getsize(tmp_path) > 1000:
            print(f"  Downloaded. Processing to {tw}x{th}...")
            if crop_and_resize(tmp_path, dst_path, tw, th):
                print(f"  Successfully processed and saved to {dst_path}!")
            else:
                print(f"  Failed processing for {filename}.")
        else:
            print(f"  Failed to download {filename} from {url}.")
            
    print("\nAll tasks completed!")
