import urllib.request
import re
import os

def extract_ids_for_query(query):
    url = f"https://unsplash.com/s/photos/{urllib.parse.quote(query)}"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
            # Extract URLs like /photos/something-or-other-XXXXXX
            # Or images.unsplash.com/photo-XXXXXX
            matches = re.findall(r'photo-([a-zA-Z0-9\-]+)\?', html)
            unique_ids = []
            for m in matches:
                if m not in unique_ids and len(m) > 10:
                    unique_ids.append(m)
            return unique_ids
    except Exception as e:
        print(f"Error fetching {query}: {e}")
        return []

if __name__ == "__main__":
    for q in ["stadium-night", "soccer-stadium"]:
        print(f"IDs for {q}:")
        ids = extract_ids_for_query(q)
        for i in ids[:5]:
            print(f"  {i}")
