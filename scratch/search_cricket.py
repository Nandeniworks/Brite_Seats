import subprocess
import urllib.parse
import json

def search_commons(query):
    url = "https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srsearch=" + urllib.parse.quote(query + " filetype:bitmap") + "&srnamespace=6&srlimit=10"
    cmd = ["curl", "-s", "-H", "User-Agent: BriteSeats/1.0 (contact: demo@example.com)", url]
    try:
        res = subprocess.run(cmd, capture_output=True, text=True)
        data = json.loads(res.stdout)
        results = data.get("query", {}).get("search", [])
        return [r["title"] for r in results]
    except Exception as e:
        print(f"Error: {e}")
        return []

if __name__ == "__main__":
    queries = [
        "Narendra Modi Stadium",
        "IPL cricket match",
        "cricket stadium crowd",
        "Test cricket match Oval",
        "Lord's Cricket Ground match action"
    ]
    for q in queries:
        print(f"\nResults for '{q}':")
        for title in search_commons(q):
            print(f"  - {title}")
