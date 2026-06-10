const VENUE_SCHEDULES = {
  Wembley: {
    duration: 1,
    segments: [
      { name: "Gates Open & Security", category: "🕒 Timing", type: "Security", img: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&q=80", time: "16:00", note: "Arrive early to pass electronic ticketing check-ins." },
      { name: "Opening Acts & DJ Set", category: "🎵 Music", type: "Warmup", img: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&q=80", time: "17:30", note: "Warmup sets by guest artists." },
      { name: "Main Performance / Match", category: "🏟 Main Event", type: "Action", img: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400&q=80", time: "19:30", note: "The highlight event of the night begins." },
      { name: "Encore & Fireworks / Presentation", category: "🎆 Ending", type: "Closing", img: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&q=80", time: "22:30", note: "Spectacular visual finale." }
    ]
  },
  MetLife: {
    duration: 1,
    segments: [
      { name: "Parking Lot Gates Open", category: "🚗 Logistics", type: "Parking", img: "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?w=400&q=80", time: "14:00", note: "Tailgating zones open for ticket holders." },
      { name: "Stadium Gates & Food Trucks", category: "🍔 Dining", type: "Entry", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80", time: "16:00", note: "Check out premium stadium dining options." },
      { name: "Warm-ups & Team Introductions", category: "⚽ Sports", type: "Intro", img: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&q=80", time: "18:00", note: "Teams take the pitch for pre-match exercises." },
      { name: "Match Kick-off", category: "🏆 Main Event", type: "Action", img: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=400&q=80", time: "19:30", note: "Official kickoff." }
    ]
  },
  CampNou: {
    duration: 1,
    segments: [
      { name: "VIP Lounge Reception", category: "🍹 Hospitality", type: "VIP", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80", time: "17:00", note: "Early entry for VIP Ticket and Box holders." },
      { name: "Public Turnstiles Open", category: "🕒 Entry", type: "Entry", img: "https://images.unsplash.com/photo-1540747737956-37872404a8c3?w=400&q=80", time: "18:00", note: "Enter via your designated gate number." },
      { name: "Team Warmup Session", category: "⚽ Warmup", type: "Warmup", img: "https://images.unsplash.com/photo-1524015368236-bbf6f72545b6?w=400&q=80", time: "19:00", note: "Players hit the field for drills." },
      { name: "Kickoff: Barcelona vs Real Madrid", category: "🏆 Main Event", type: "Action", img: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&q=80", time: "20:00", note: "El Clásico kickoff." }
    ]
  },
  Bernabeu: {
    duration: 1,
    segments: [
      { name: "Security Checkpoints Open", category: "🛡 Safety", type: "Security", img: "https://images.unsplash.com/photo-1473186578172-c141e6798ee4?w=400&q=80", time: "17:30", note: "Coats and bags subject to inspection." },
      { name: "Official Stadium Tour (Ticket Add-on)", category: "🎟 Experience", type: "Tour", img: "https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?w=400&q=80", time: "18:00", note: "Guided walk through historic corridors." },
      { name: "Match Kick-off", category: "🏆 Match", type: "Action", img: "https://images.unsplash.com/photo-1540747737956-37872404a8c3?w=400&q=80", time: "20:00", note: "Kickoff." }
    ]
  },
  Modi: {
    duration: 1,
    segments: [
      { name: "Gates & Merchandise Booths Open", category: "🛍 Shopping", type: "Entry", img: "https://images.unsplash.com/photo-1540304675549-d1020f5c15e9?w=400&q=80", time: "15:00", note: "Pick up official team jerseys and merchandise." },
      { name: "Toss & Team Lineups", category: "🏏 Cricket", type: "Toss", img: "https://images.unsplash.com/photo-1621644788102-c7f73db171f2?w=400&q=80", time: "18:30", note: "Captains meet at the pitch for the toss." },
      { name: "Match Begins (First Ball)", category: "🏆 Match", type: "Action", img: "https://images.unsplash.com/photo-1531415074968-046ba8829221?w=400&q=80", time: "19:00", note: "Match begins." },
      { name: "Innings Break Show", category: "🎵 Music", type: "Show", img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80", time: "20:45", note: "Laser show and performance on the field." }
    ]
  },
  DYPatil: {
    duration: 1,
    segments: [
      { name: "Gates Open for Early Access", category: "🕒 Entry", type: "Entry", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80", time: "16:00", note: "Beat the queue." },
      { name: "Opening Acts Performance", category: "🎵 Live Act", type: "Music", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80", time: "18:00", note: "Special guest live act." },
      { name: "Arijit Singh Live on Stage", category: "🎤 Concert", type: "Action", img: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400&q=80", time: "20:00", note: "Main concert starts." }
    ]
  }
};

const DEFAULT_SEGMENTS = [
  { name: "Doors Open & Check-In", category: "🕒 Timing", type: "Entry", img: "https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?w=400&q=80", time: "17:00", note: "Have your BriteSeats digital QR ticket ready." },
  { name: "Warm-ups / Opening Act", category: "⚡ Live Show", type: "Warmup", img: "https://images.unsplash.com/photo-1514332304917-7681d454655f?w=400&q=80", time: "18:30", note: "Show opener starts." },
  { name: "Main Event Action", category: "🏆 Event", type: "Action", img: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&q=80", time: "20:00", note: "The main show starts." }
];

export const generateSchedule = (venueOrEventName = "", baseLat = 0, baseLng = 0) => {
  let key = Object.keys(VENUE_SCHEDULES).find(k => venueOrEventName.toLowerCase().includes(k.toLowerCase()));
  const data = key ? VENUE_SCHEDULES[key] : null;
  const duration = data ? data.duration : 1;
  const rawSegments = data ? [...data.segments] : [...DEFAULT_SEGMENTS];

  const schedule = [];
  for (let d = 1; d <= duration; d++) {
    const places = rawSegments.map((seg, idx) => ({
      id: `seg-${Date.now()}-${d}-${idx}`,
      name: seg.name,
      time: seg.time,
      note: seg.note,
      lat: baseLat + (idx * 0.001 - 0.001),
      lng: baseLng + (idx * 0.001 - 0.001),
      category: seg.category,
      img: seg.img,
      type: seg.type,
      durationBadge: "TBD"
    }));

    schedule.push({
      id: `sched-day-${Date.now()}-${d}`,
      dayNumber: d,
      date: `Event Segment ${d}`,
      places: places
    });
  }
  return schedule;
};
