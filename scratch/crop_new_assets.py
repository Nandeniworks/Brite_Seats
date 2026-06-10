import subprocess
import os
import re

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
        
    print(f"  Cropping {src_path} ({W}x{H}) -> {crop_w}x{crop_h} and resizing to {target_w}x{target_h}")
    # Run sips crop
    subprocess.run(["sips", "--cropToHeightWidth", str(crop_h), str(crop_w), src_path], capture_output=True)
    # Run sips resize
    subprocess.run(["sips", "-z", str(target_h), str(target_w), src_path, "--out", dst_path], capture_output=True)
    return True

if __name__ == "__main__":
    event_crops = [
        ("concert-edsheeran.jpg", 1000, 667),
        ("concert-imaginedragons.jpg", 1000, 750),
        ("football-bayern.jpg", 1000, 584),
        ("cricket-micsk.jpg", 1024, 1024)
    ]
    
    venue_crops = [
        ("emirates.jpg", 1024, 680),
        ("oldtrafford.jpg", 1024, 680),
        ("allianz.jpg", 1024, 680),
        ("wankhede.jpg", 1024, 680),
        ("lords.jpg", 1024, 680)
    ]
    
    print("Processing event images...")
    for filename, tw, th in event_crops:
        src = f"scratch/downloaded_new/{filename}"
        dst = f"src/assets/events/{filename}"
        if os.path.exists(src):
            crop_and_resize(src, dst, tw, th)
        else:
            print(f"Source file not found: {src}")
            
    print("\nProcessing venue images...")
    for filename, tw, th in venue_crops:
        src = f"scratch/downloaded_new/{filename}"
        dst = f"src/assets/venues/{filename}"
        if os.path.exists(src):
            crop_and_resize(src, dst, tw, th)
        else:
            print(f"Source file not found: {src}")

    print("\nCropping complete!")
