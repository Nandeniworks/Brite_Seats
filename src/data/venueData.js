export const ALL_VENUES = [
  {
    id: "metlife",
    name: "MetLife Stadium",
    capacity: "82,500",
    location: "East Rutherford, NJ, USA",
    coordinates: { lat: 40.8128, lng: -74.0742 },
    description: "Located in the Meadowlands Sports Complex, MetLife Stadium is home to the NFL's Giants and Jets and hosts major global events including the FIFA World Cup Final.",
    image: "/assets/venues/metlife.jpg",
    gallery: [
      "/assets/venues/metlife.jpg",
      "/assets/events/concert-weeknd.jpg",
      "/assets/events/football-fifa.jpg",
      "/assets/events/concert-bts.jpg"
    ],
    upcomingEvents: ["concert-bts", "concert-weeknd", "football-fifa"],
    highlights: ["Retractable Field Technology", "Over 200+ Luxury Suites", "4 Colossal HD Video Boards", "Host of FIFA World Cup Final"]
  },
  {
    id: "wembley",
    name: "Wembley Stadium",
    capacity: "90,000",
    location: "London, UK",
    coordinates: { lat: 51.5560, lng: -0.2796 },
    description: "Wembley Stadium is the iconic home of English football. Featuring its signature Wembley Arch, it is one of the most famous concert and sporting arenas in the world.",
    image: "/assets/venues/wembley.jpg",
    gallery: [
      "/assets/venues/wembley.jpg",
      "/assets/events/concert-coldplay.jpg",
      "/assets/events/football-ucl.jpg",
      "/assets/events/concert-edsheeran.jpg"
    ],
    upcomingEvents: ["concert-coldplay", "concert-edsheeran", "football-ucl"],
    highlights: ["Iconic 133-meter Wembley Arch", "Fully Retractable Sliding Roof", "State-of-the-Art Acoustic System", "Cathedral of English Football"]
  },
  {
    id: "campnou",
    name: "Camp Nou",
    capacity: "99,354",
    location: "Barcelona, Spain",
    coordinates: { lat: 41.3809, lng: 2.1228 },
    description: "The historic home stadium of FC Barcelona. Camp Nou is renowned for its incredible scale, steep stands, and passionate atmosphere, making it a cathedral of global sports.",
    image: "/assets/venues/campnou.jpg",
    gallery: [
      "/assets/venues/campnou.jpg",
      "/assets/events/concert-dualipa.jpg",
      "/assets/events/football-elclasico.jpg"
    ],
    upcomingEvents: ["concert-dualipa", "football-elclasico"],
    highlights: ["Europe's Largest Seating Capacity", "Open-air Multi-tiered Grandstand", "FC Barcelona Museum Onsite", "Holographic Match Replay Zones"]
  },
  {
    id: "bernabeu",
    name: "Santiago Bernabeu Stadium",
    capacity: "81,044",
    location: "Madrid, Spain",
    coordinates: { lat: 40.4531, lng: -3.6883 },
    description: "Located in the heart of Madrid, the newly renovated Santiago Bernabéu is a state-of-the-art stadium featuring a retractable roof and pitch, hosting legendary football and concerts.",
    image: "/assets/venues/bernabeu.jpg",
    gallery: [
      "/assets/venues/bernabeu.jpg",
      "/assets/events/concert-imaginedragons.jpg"
    ],
    upcomingEvents: ["concert-imaginedragons"],
    highlights: ["360-Degree LED Video Ribbon Screen", "Fully Retractable Roof & Pitch Storage", "Hypogeum Under-Pitch Greenhouse", "Located in Central Madrid"]
  },
  {
    id: "modi",
    name: "Narendra Modi Stadium",
    capacity: "132,000",
    location: "Ahmedabad, India",
    coordinates: { lat: 23.0917, lng: 72.5975 },
    description: "The largest stadium in the world by capacity. The Narendra Modi Stadium is a colossal cricket arena featuring advanced circular LED floodlighting and incredible architectural scale.",
    image: "/assets/venues/modi.jpg",
    gallery: [
      "/assets/venues/modi.jpg",
      "/assets/events/cricket-indpak.jpg",
      "/assets/events/cricket-ipl.jpg"
    ],
    upcomingEvents: ["cricket-indpak", "cricket-ipl"],
    highlights: ["Largest Cricket Arena in the World", "360-Degree Ring LED Lights (No Light Masts)", "Advanced Clubhouses & Olympic-size Pool", "11 Clay Pitch Varieties"]
  },
  {
    id: "dypatil",
    name: "DY Patil Stadium",
    capacity: "55,000",
    location: "Navi Mumbai, India",
    coordinates: { lat: 19.0435, lng: 73.0270 },
    description: "A premier multi-purpose sports arena in Navi Mumbai. Renowned for its excellent spectator views, acoustics, and world-class design, it frequently hosts international music tours.",
    image: "/assets/venues/dypatil.jpg",
    gallery: [
      "/assets/venues/dypatil.jpg",
      "/assets/events/concert-arijit.jpg"
    ],
    upcomingEvents: ["concert-arijit"],
    highlights: ["Cantilever Roof Design (No pillars to block view)", "Advanced Acoustic Concert Soundboards", "International Standard Football & Cricket Turf", "9 Professional Practice Pitches"]
  },
  {
    id: "seoulolympic",
    name: "Seoul Olympic Stadium",
    capacity: "69,950",
    location: "Seoul, South Korea",
    coordinates: { lat: 37.5148, lng: 127.0729 },
    description: "Built for the 1988 Summer Olympics, the Seoul Olympic Stadium is the crown jewel of South Korea's sports complex. Its iconic design mimics the elegant curves of a Joseon Dynasty porcelain vase.",
    image: "/assets/venues/seoulolympic.jpg",
    gallery: [
      "/assets/venues/seoulolympic.jpg"
    ],
    upcomingEvents: [],
    highlights: ["Largest Stadium in South Korea", "Iconic Joseon Porcelain Silhouette", "Host of the 1988 Summer Olympic Games", "Epicenter of Historic K-pop Comebacks"]
  },
  // New Stadiums
  {
    id: "emirates",
    name: "Emirates Stadium",
    capacity: "60,704",
    location: "London, UK",
    coordinates: { lat: 51.5549, lng: -0.1084 },
    description: "The state-of-the-art home of Arsenal FC, known for its incredible modern architecture, pristine pitch, and premium fan lounges.",
    image: "/assets/venues/emirates.png",
    gallery: [
      "/assets/venues/emirates.png",
      "/assets/events/football-arsenal.png"
    ],
    upcomingEvents: ["football-arsenal"],
    highlights: ["Premium Club Level Lounges", "Impeccable Desso GrassMaster Pitch", "Arsenal Museum & Armoury Shop", "Iconic North London Atmosphere"]
  },
  {
    id: "oldtrafford",
    name: "Old Trafford",
    capacity: "74,310",
    location: "Manchester, UK",
    coordinates: { lat: 53.4631, lng: -2.2913 },
    description: "Affectionately known as the 'Theatre of Dreams', Old Trafford is the historic home stadium of Manchester United and the largest club stadium in the UK.",
    image: "/assets/venues/oldtrafford.png",
    gallery: [
      "/assets/venues/oldtrafford.png",
      "/assets/events/football-manutd.png"
    ],
    upcomingEvents: ["football-manutd"],
    highlights: ["Sir Alex Ferguson Stand", "Iconic Munich Tunnel Memorial", "United Museum & Megastore", "Red Cafe & Premium Matchday Hospitality"]
  },
  {
    id: "allianz",
    name: "Allianz Arena",
    capacity: "75,024",
    location: "Munich, Germany",
    coordinates: { lat: 48.2188, lng: 11.6247 },
    description: "Renowned for its color-shifting ETFE plastic panel exterior, the Allianz Arena is a marvel of modern sports architecture and home to FC Bayern Munich.",
    image: "/assets/venues/allianz.png",
    gallery: [
      "/assets/venues/allianz.png",
      "/assets/events/football-bayern.png"
    ],
    upcomingEvents: ["football-bayern"],
    highlights: ["Color-Changing ETFE Cushion Facade", "Europe's Largest Standing Terrace", "FC Bayern Museum", "High-Tech Pitch Heating Systems"]
  },
  {
    id: "wankhede",
    name: "Wankhede Stadium",
    capacity: "33,108",
    location: "Mumbai, India",
    coordinates: { lat: 18.9389, lng: 72.8258 },
    description: "Situated next to the Arabian Sea, the historic Wankhede Stadium is the spiritual home of Mumbai cricket, famous for hosting the 2011 World Cup Final.",
    image: "/assets/venues/wankhede.png",
    gallery: [
      "/assets/venues/wankhede.png",
      "/assets/events/cricket-micsk.png"
    ],
    upcomingEvents: ["cricket-micsk"],
    highlights: ["Host of the 2011 World Cup Final", "Famous Sachin Tendulkar Stand", "Cantilever Roof (No Pillars)", "Iconic Marine Drive Coastal Breeze"]
  },
  {
    id: "lords",
    name: "Lord's Cricket Ground",
    capacity: "31,100",
    location: "London, UK",
    coordinates: { lat: 51.5298, lng: -0.1722 },
    description: "Commonly referred to as the 'Home of Cricket', Lord's Cricket Ground is steeped in over 200 years of cricket history, featuring the iconic Grade II listed Pavilion.",
    image: "/assets/venues/lords.png",
    gallery: [
      "/assets/venues/lords.png",
      "/assets/events/cricket-wtc.png"
    ],
    upcomingEvents: ["cricket-wtc"],
    highlights: ["The Iconic Grade II Listed Pavilion", "Historic Lord's Honors Boards", "The Famous 2.5-Meter Slope", "MCC Museum & Real Tennis Court"]
  },
  {
    id: "silverstone",
    name: "Silverstone Circuit",
    capacity: "150,000",
    location: "Silverstone, England",
    coordinates: { lat: 52.0786, lng: -1.0169 },
    description: "Silverstone Circuit is the home of British Motor Racing. Steeped in history, it is a fast and flowing circuit containing world-famous high-speed corners like Copse, Maggotts, Becketts, and Stowe.",
    image: "/assets/events/f1-silverstone.jpg",
    gallery: [
      "/assets/events/f1-silverstone.jpg"
    ],
    upcomingEvents: ["f1-british"],
    highlights: ["The Iconic Copse, Maggotts & Becketts Corner Sequence", "Wing Paddock & Pit Complex", "Fastest Average Cornering Speeds in F1", "Historic WWII Airfield Heritage"]
  },
  {
    id: "spa",
    name: "Circuit de Spa-Francorchamps",
    capacity: "70,000",
    location: "Stavelot, Belgium",
    coordinates: { lat: 50.4372, lng: 5.9714 },
    description: "Spa-Francorchamps is widely regarded as one of the most beautiful and challenging racing circuits in the world. Nestled in the Ardennes Forest, it is famous for the legendary Eau Rouge-Radillon hill section.",
    image: "/assets/events/f1-spa.jpg",
    gallery: [
      "/assets/events/f1-spa.jpg"
    ],
    upcomingEvents: ["f1-belgian"],
    highlights: ["Famous Eau Rouge & Radillon S-Curve", "Long Kemmel Straight Overtaking Zone", "Unpredictable Ardennes Microclimate Weather", "Longest Circuit Layout in Formula 1"]
  },
  {
    id: "monza",
    name: "Monza Circuit",
    capacity: "113,860",
    location: "Monza, Italy",
    coordinates: { lat: 45.6189, lng: 9.2812 },
    description: "Autodromo Nazionale di Monza is known as the 'Temple of Speed'. Built in 1922, it is one of the oldest GP tracks in the world and features incredibly fast straights, tight chicanes, and the iconic Parabolica corner.",
    image: "/assets/events/f1-monza.jpg",
    gallery: [
      "/assets/events/f1-monza.jpg"
    ],
    upcomingEvents: ["f1-italian"],
    highlights: ["Historical High-Speed Banking Loop Track", "Iconic Parabolica (Curva Alboreto) Corner", "Passionate Italian Tifosi Fan Base", "The Temple of Speed (Top speeds over 350 km/h)"]
  },
  {
    id: "marinabay",
    name: "Marina Bay Street Circuit",
    capacity: "90,000",
    location: "Marina Bay, Singapore",
    coordinates: { lat: 1.2914, lng: 103.8643 },
    description: "Marina Bay is a spectacular street circuit that winds around Singapore's beautiful harbour. It is the original Formula 1 night race, presenting a gruelling physical test for drivers in humid conditions.",
    image: "/assets/events/f1-singapore.jpg",
    gallery: [
      "/assets/events/f1-singapore.jpg"
    ],
    upcomingEvents: ["f1-singapore"],
    highlights: ["Spectacular 1500+ Halogen Floodlight Night Race", "Marina Bay Skyline & Singapore Flyer Views", "Gruelling 19-Turn High-Humidity Street Layout", "The Floating Grandstand Bridge Section"]
  },
  {
    id: "yasmarina",
    name: "Yas Marina Circuit",
    capacity: "60,000",
    location: "Yas Island, Abu Dhabi",
    coordinates: { lat: 24.4672, lng: 54.6031 },
    description: "Yas Marina Circuit is a state-of-the-art racing venue located on Yas Island. It hosts the twilight season finale of the F1 calendar and features a unique harbor-side layout with a hotel passing over the track.",
    image: "/assets/events/f1-yasmarina.jpg",
    gallery: [
      "/assets/events/f1-yasmarina.jpg"
    ],
    upcomingEvents: ["f1-abudhabi"],
    highlights: ["Twilight-to-Night Race Transition Lighting", "Unique Subterranean Pit Lane Exit Tunnel", "Grandstand Views over Yas Marina Yacht Basin", "Yas Marina W Hotel Overpass Bridge"]
  }
];
