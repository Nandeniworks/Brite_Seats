import subprocess
import urllib.parse
import json
import os

def search_commons(query):
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode({
        "action": "query",
        "format": "json",
        "list": "search",
        "srsearch": query + " filetype:bitmap",
        "srnamespace": "6",  # File namespace
        "srlimit": "8"
    })
    try:
        res = subprocess.run(["curl", "-s", "-A", "Mozilla/5.0 (demo@example.com)", url], capture_output=True, text=True)
        data = json.loads(res.stdout)
        results = data.get("query", {}).get("search", [])
        return [r["title"] for r in results]
    except Exception as e:
        print(f"Error searching for {query}: {e}")
        return []

def get_actual_image_url(file_title):
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode({
        "action": "query",
        "format": "json",
        "prop": "imageinfo",
        "iiprop": "url",
        "titles": file_title
    })
    try:
        res = subprocess.run(["curl", "-s", "-A", "Mozilla/5.0 (demo@example.com)", url], capture_output=True, text=True)
        data = json.loads(res.stdout)
        pages = data.get("query", {}).get("pages", {})
        for page_id, page_data in pages.items():
            imageinfo = page_data.get("imageinfo", [])
            if imageinfo:
                return imageinfo[0].get("url")
    except Exception as e:
        print(f"Error getting URL for {file_title}: {e}")
    return None

if __name__ == "__main__":
    queries = [
        # Aligned/failed ones
        ("IPL cricket match", "cricket-micsk.jpg"),
        ("Emirates Stadium Arsenal", "emirates.jpg"),
        ("Old Trafford pitch", "oldtrafford.jpg"),
        ("Allianz Arena stadium", "allianz.jpg"),
        ("Lords Cricket Ground", "lords.jpg")
    ]
    
    os.makedirs("scratch/downloaded_new", exist_ok=True)
    
    for query, target in queries:
        print(f"\nSearching for: {query}...")
        results = search_commons(query)
        if not results:
            print(f"No results for {query}")
            continue
        
        success = False
        for title in results:
            img_url = get_actual_image_url(title)
            if not img_url:
                continue
            
            dst_path = f"scratch/downloaded_new/{target}"
            print(f"  Downloading actual URL: {img_url} -> {dst_path}")
            
            res = subprocess.run([
                "curl", "-L", 
                "-A", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
                "-o", dst_path, img_url
            ], capture_output=True)
            
            if res.returncode == 0 and os.path.exists(dst_path) and os.path.getsize(dst_path) > 10000:
                print(f"  Successfully downloaded {target} using {title}!")
                success = True
                break
            else:
                size = os.path.getsize(dst_path) if os.path.exists(dst_path) else 0
                print(f"  Failed for {title} (code {res.returncode}, size {size} bytes)")
                if os.path.exists(dst_path):
                    os.remove(dst_path)
        
        if not success:
            print(f"  Failed all options for {target}")
