import urllib.request
import urllib.parse
import json
import os
import hashlib
import sys

def search_commons(query):
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode({
        "action": "query",
        "format": "json",
        "list": "search",
        "srsearch": query + " filetype:bitmap",
        "srnamespace": "6",  # File namespace
        "srlimit": "10"
    })
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'BriteSeats/1.0 (contact: demo@example.com)'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            results = data.get("query", {}).get("search", [])
            return [r["title"] for r in results]
    except Exception as e:
        print(f"Error searching for {query}: {e}")
        return []

def get_image_url(filename):
    # filename comes with "File:" prefix
    if filename.startswith("File:"):
        filename = filename[5:]
    # Replace spaces with underscores
    filename = filename.replace(" ", "_")
    # Calculate MD5 hash
    md5 = hashlib.md5(filename.encode('utf-8')).hexdigest()
    # Build URL
    # Format: https://upload.wikimedia.org/wikipedia/commons/a/ab/Filename.jpg
    url = f"https://upload.wikimedia.org/wikipedia/commons/{md5[0]}/{md5[0:2]}/{urllib.parse.quote(filename)}"
    return url

if __name__ == "__main__":
    queries = [
        ("BTS concert", "concert-bts.jpg"),
        ("Coldplay concert", "concert-coldplay.jpg"),
        ("Arijit Singh", "concert-arijit.jpg"),
        ("Dua Lipa concert", "concert-dualipa.jpg"),
        ("The Weeknd performing", "concert-weeknd.jpg"),
        ("FIFA World Cup trophy", "football-fifa.jpg"),
        ("Champions League trophy", "football-ucl.jpg"),
        ("El Clasico Real Madrid Barcelona match", "football-elclasico.jpg"),
        ("Arsenal Chelsea match", "football-arsenal.jpg"),
        ("Manchester United Liverpool match", "football-manutd.jpg"),
        ("IPL trophy cricket", "cricket-ipl.jpg"),
        ("India vs Pakistan cricket match", "cricket-indpak.jpg"),
        ("World Test Championship cricket trophy", "cricket-wtc.jpg")
    ]
    
    os.makedirs("scratch/downloaded", exist_ok=True)
    
    for query, target in queries:
        print(f"Searching for: {query}...")
        results = search_commons(query)
        if not results:
            print(f"No results for {query}")
            continue
        
        # Print top 3 options
        for i, title in enumerate(results[:3]):
            print(f"  {i+1}. {title}")
            
        # Try downloading the first one
        title = results[0]
        img_url = get_image_url(title)
        print(f"  Downloading: {img_url} -> scratch/downloaded/{target}")
        try:
            req = urllib.request.Request(img_url, headers={'User-Agent': 'BriteSeats/1.0 (contact: demo@example.com)'})
            with urllib.request.urlopen(req) as response:
                with open(f"scratch/downloaded/{target}", "wb") as f:
                    f.write(response.read())
            print(f"  Successfully downloaded {target}!")
        except Exception as e:
            print(f"  Failed to download {title}: {e}")
            # Try second option
            if len(results) > 1:
                title = results[1]
                img_url = get_image_url(title)
                print(f"  Retrying second option: {img_url}")
                try:
                    req = urllib.request.Request(img_url, headers={'User-Agent': 'BriteSeats/1.0 (contact: demo@example.com)'})
                    with urllib.request.urlopen(req) as response:
                        with open(f"scratch/downloaded/{target}", "wb") as f:
                            f.write(response.read())
                    print(f"  Successfully downloaded {target} on retry!")
                except Exception as e2:
                    print(f"  Failed retry: {e2}")
