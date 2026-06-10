const fs = require('fs');
const path = require('path');
const https = require('https');

const assetsDir = path.join(__dirname, '..', 'src', 'assets');
const eventsDir = path.join(assetsDir, 'events');
const venuesDir = path.join(assetsDir, 'venues');

// Ensure directories exist
if (!fs.existsSync(eventsDir)) fs.mkdirSync(eventsDir, { recursive: true });
if (!fs.existsSync(venuesDir)) fs.mkdirSync(venuesDir, { recursive: true });

const downloads = [
  // Events
  {
    url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1000&auto=format&fit=crop&q=80',
    dest: path.join(eventsDir, 'concert-coldplay.jpg')
  },
  {
    url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1000&auto=format&fit=crop&q=80',
    dest: path.join(eventsDir, 'concert-arijit.jpg')
  },
  {
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000&auto=format&fit=crop&q=80',
    dest: path.join(eventsDir, 'concert-diljit.jpg')
  },
  {
    url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1000&auto=format&fit=crop&q=80',
    dest: path.join(eventsDir, 'concert-weeknd.jpg')
  },
  {
    url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1000&auto=format&fit=crop&q=80',
    dest: path.join(eventsDir, 'concert-dualipa.jpg')
  },
  {
    url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1000&auto=format&fit=crop&q=80',
    dest: path.join(eventsDir, 'football-fifa.jpg')
  },
  {
    url: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=1000&auto=format&fit=crop&q=80',
    dest: path.join(eventsDir, 'football-ucl.jpg')
  },
  {
    url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1000&auto=format&fit=crop&q=80',
    dest: path.join(eventsDir, 'football-elclasico.jpg')
  },
  {
    url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1000&auto=format&fit=crop&q=80',
    dest: path.join(eventsDir, 'football-manutd.jpg')
  },
  {
    url: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=1000&auto=format&fit=crop&q=80',
    dest: path.join(eventsDir, 'football-arsenal.jpg')
  },
  {
    url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1000&auto=format&fit=crop&q=80',
    dest: path.join(eventsDir, 'cricket-indpak.jpg')
  },
  {
    url: 'https://images.unsplash.com/photo-1624561172888-ac93c696e10c?w=1000&auto=format&fit=crop&q=80',
    dest: path.join(eventsDir, 'cricket-ipl.jpg')
  },
  {
    url: 'https://images.unsplash.com/photo-1540747737956-37872404a8c3?w=1000&auto=format&fit=crop&q=80',
    dest: path.join(eventsDir, 'cricket-wtc.jpg')
  },
  
  // Venues
  {
    url: 'https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=1000&auto=format&fit=crop&q=80',
    dest: path.join(venuesDir, 'metlife.jpg')
  },
  {
    url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1000&auto=format&fit=crop&q=80',
    dest: path.join(venuesDir, 'wembley.jpg')
  },
  {
    url: 'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=1000&auto=format&fit=crop&q=80',
    dest: path.join(venuesDir, 'campnou.jpg')
  },
  {
    url: 'https://images.unsplash.com/photo-1540747737956-37872404a8c3?w=1000&auto=format&fit=crop&q=80',
    dest: path.join(venuesDir, 'bernabeu.jpg')
  },
  {
    url: 'https://images.unsplash.com/photo-1624561172888-ac93c696e10c?w=1000&auto=format&fit=crop&q=80',
    dest: path.join(venuesDir, 'modi.jpg')
  },
  {
    url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1000&auto=format&fit=crop&q=80',
    dest: path.join(venuesDir, 'dypatil.jpg')
  }
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    // Unsplash might redirect
    const request = https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirect
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (Status Code: ${response.statusCode})`));
        return;
      }
      const fileStream = fs.createWriteStream(dest);
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded: ${path.basename(dest)}`);
        resolve();
      });
      fileStream.on('error', (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
    });
    request.on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function start() {
  console.log('Starting assets download...');
  for (const item of downloads) {
    try {
      await downloadFile(item.url, item.dest);
    } catch (e) {
      console.error(`Error downloading ${item.dest}:`, e.message);
    }
  }
  console.log('Assets download finished.');
}

start();
