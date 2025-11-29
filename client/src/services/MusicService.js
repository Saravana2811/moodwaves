// client/src/services/MusicService.js

// 🔗 MW Music backend base URL (set in client/.env as VITE_MUSIC_API_URL)
const API_BASE = import.meta.env.VITE_MUSIC_API_URL || "http://localhost:4000";

// Map high-level moods to MW playlist IDs
const MOOD_TO_PLAYLIST = {
  // calm / chill moods
  calm: "chill-vibes",
  peaceful: "chill-vibes",
  relaxed: "chill-vibes",
  chill: "chill-vibes",
  meditative: "chill-vibes",

  // happy / positive moods
  happy: "happy-energy",
  excited: "happy-energy",
  joyful: "happy-energy",
  confident: "happy-energy",
  energetic: "happy-energy",
  motivated: "happy-energy",

  // sad / emotional moods
  sad: "indian-hits",
  heartbroken: "indian-hits",
  depressed: "indian-hits",
  nostalgic: "indian-hits",
  romantic: "indian-hits",

  // angry / intense – for now also send to "happy-energy" or any playlist you like
  angry: "happy-energy",
  aggressive: "happy-energy"
};

// ──────────────────────────────────────────────────────────────
// Mock music data - Fallback when MW Music API is unavailable
// ──────────────────────────────────────────────────────────────
const SAMPLE_TRACKS = [
  // Happy/Upbeat
  {
    id: 1,
    title: "Sunny Day",
    artist: "MoodWaves Demo",
    url: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",
    image: null,
    mood: ["happy", "upbeat", "energetic", "joyful", "excited"],
    genre: "Pop",
    energy: 0.9
  },
  {
    id: 2,
    title: "Energy Boost",
    artist: "MoodWaves Demo",
    url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/Creative_Commons/Brad_Sucks/I_Dont_Know_What_Im_Doing/Brad_Sucks_-_01_-_Sick_as_a_Dog.mp3",
    image: null,
    mood: ["angry", "energetic", "empowered", "frustrated"],
    genre: "Pop Rock",
    energy: 0.8
  },
  // Sad/Melancholic
  {
    id: 3,
    title: "Someone Like You",
    artist: "Adele",
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    image: null,
    mood: ["sad", "heartbroken", "melancholic", "nostalgic"],
    genre: "Ballad",
    energy: 0.3
  },
  {
    id: 4,
    title: "Mad World",
    artist: "Gary Jules",
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    image: null,
    mood: ["depressed", "lonely", "dark", "contemplative"],
    genre: "Alternative",
    energy: 0.2
  },
  // Calm/Relaxing
  {
    id: 5,
    title: "Peaceful Mind",
    artist: "MoodWaves Demo",
    url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3",
    image: null,
    mood: ["calm", "relaxed", "peaceful", "meditative", "chill"],
    genre: "Ambient",
    energy: 0.1
  },
  {
    id: 6,
    title: "River",
    artist: "Leon Bridges",
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    image: null,
    mood: ["calm", "soulful", "reflective", "peaceful"],
    genre: "Soul",
    energy: 0.4
  },
  // Energetic/Workout
  {
    id: 7,
    title: "Till I Collapse",
    artist: "Eminem",
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    image: null,
    mood: ["motivated", "energetic", "determined", "aggressive"],
    genre: "Hip Hop",
    energy: 0.9
  },
  {
    id: 8,
    title: "Thunder",
    artist: "Imagine Dragons",
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    image: null,
    mood: ["confident", "energetic", "empowered"],
    genre: "Alternative Rock",
    energy: 0.8
  }
];

// Mood keywords and their associated emotions
const MOOD_KEYWORDS = {
  // Happy emotions
  happy: ["happy", "joyful", "cheerful", "glad", "elated", "ecstatic"],
  excited: ["excited", "thrilled", "pumped", "hyped", "energetic"],
  confident: ["confident", "empowered", "strong", "bold", "fierce"],
  
  // Sad emotions
  sad: ["sad", "unhappy", "down", "blue", "melancholic"],
  heartbroken: ["heartbroken", "hurt", "betrayed", "lonely", "abandoned"],
  depressed: ["depressed", "hopeless", "empty", "numb", "dark"],
  
  // Calm emotions
  calm: ["calm", "peaceful", "serene", "tranquil", "relaxed"],
  meditative: ["meditative", "mindful", "zen", "centered", "focused"],
  chill: ["chill", "laid-back", "easy-going", "mellow"],
  
  // Angry emotions
  angry: ["angry", "mad", "furious", "irritated", "frustrated"],
  aggressive: ["aggressive", "intense", "fierce", "powerful"],
  
  // Motivated emotions
  motivated: ["motivated", "determined", "driven", "ambitious", "focused"],
  
  // Nostalgic emotions
  nostalgic: ["nostalgic", "reminiscent", "wistful", "sentimental"],
  
  // Romantic emotions
  romantic: ["romantic", "loving", "passionate", "intimate", "tender"]
};

class MusicService {
  // Analyze mood text and extract emotions
  analyzeMood(moodText) {
    const text = moodText.toLowerCase();
    const detectedMoods = [];
    
    for (const [mood, keywords] of Object.entries(MOOD_KEYWORDS)) {
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          detectedMoods.push(mood);
          break;
        }
      }
    }
    
    // If no specific moods detected, try to infer from context
    if (detectedMoods.length === 0) {
      if (text.includes("work") || text.includes("gym") || text.includes("exercise")) {
        detectedMoods.push("motivated", "energetic");
      } else if (text.includes("study") || text.includes("focus")) {
        detectedMoods.push("calm", "focused");
      } else if (text.includes("party") || text.includes("dance")) {
        detectedMoods.push("happy", "energetic");
      } else {
        // Default to calm if nothing detected
        detectedMoods.push("calm");
      }
    }
    
    return detectedMoods;
  }

  // Generate playlist based on mood (now using MW Music API + fallback)
  async generatePlaylist(moodText, languages = ["English"], limit = 5) {
    const detectedMoods = this.analyzeMood(moodText);
    console.log("Detected moods:", detectedMoods);

    const primaryMood = detectedMoods[0] || "calm";
    const playlistId =
      MOOD_TO_PLAYLIST[primaryMood] || MOOD_TO_PLAYLIST["calm"];

    // ───── 1) Try MW Music backend first ─────
    try {
      console.log("Trying MW Music API with playlist:", playlistId);

      const res = await fetch(`${API_BASE}/api/playlists/${playlistId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch playlist from MW Music API");
      }

      const playlist = await res.json(); // { id, name, description, mood, songs: [...] }

      const tracks = (playlist.songs || [])
        .slice(0, limit)
        .map((song) => ({
          id: song.id,
          title: song.title,
          artist: song.artist,
          url: song.audioUrl, // 🔑 this is what <audio> will use
          image: song.coverImageUrl || null,
          // We keep mood array so your UI logic stays similar
          mood: [playlist.mood || primaryMood],
          genre: "Unknown",       // you can extend your MW data later
          energy: 0.5             // placeholder
        }));

      return {
        tracks,
        moodAnalysis: detectedMoods,
        playlistName: playlist.name || this.generatePlaylistName(detectedMoods),
        description:
          playlist.description ||
          this.generatePlaylistDescription(detectedMoods, moodText),
        source: "mw-api"
      };
    } catch (apiError) {
      console.error("MW Music API failed, falling back to local demo tracks:", apiError);
    }

    // ───── 2) Fallback to local SAMPLE_TRACKS (your existing logic) ─────
    console.log("Using local demo tracks as fallback...");

    try {
      const scoredTracks = SAMPLE_TRACKS.map((track) => {
        let score = 0;
        
        // Check mood matching
        for (const detectedMood of detectedMoods) {
          if (track.mood.includes(detectedMood)) {
            score += 10;
          }
          
          // Partial match for similar moods
          const similarMoods = this.getSimilarMoods(detectedMood);
          for (const similarMood of similarMoods) {
            if (track.mood.includes(similarMood)) {
              score += 5;
            }
          }
        }
        
        // Add some randomness for variety
        score += Math.random() * 2;
        
        return { ...track, score };
      });
    
      // Sort by score and return top tracks
      const playlist = scoredTracks
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ score, ...track }) => track);
    
      return {
        tracks: playlist,
        moodAnalysis: detectedMoods,
        playlistName: this.generatePlaylistName(detectedMoods),
        description: this.generatePlaylistDescription(detectedMoods, moodText),
        source: "local"
      };
    } catch (error) {
      console.error("Even fallback failed:", error);
      // Last resort - return a basic playlist
      return {
        tracks: [
          {
            id: "emergency-1",
            title: "Demo Track",
            artist: "MoodWaves",
            url: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",
            mood: detectedMoods
          }
        ],
        moodAnalysis: detectedMoods,
        playlistName: "Basic Playlist",
        description: `A basic playlist for your mood: ${moodText}`,
        source: "emergency"
      };
    }
  }

  // Get similar moods for better matching
  getSimilarMoods(mood) {
    const moodFamilies = {
      happy: ["excited", "confident", "joyful"],
      sad: ["heartbroken", "melancholic", "nostalgic"],
      calm: ["peaceful", "meditative", "chill"],
      angry: ["aggressive", "frustrated"],
      motivated: ["energetic", "confident", "determined"]
    };
    
    return moodFamilies[mood] || [];
  }

  // Generate playlist name based on moods
  generatePlaylistName(moods) {
    const playlistNames = {
      happy: ["Good Vibes Only", "Happy Place", "Sunshine Playlist", "Mood Lifter"],
      sad: ["Rainy Day Blues", "Heartbreak Hotel", "Melancholy Mood", "Sad Songs & Chill"],
      calm: ["Peaceful Moments", "Zen Zone", "Chill & Relax", "Mindful Music"],
      angry: ["Anger Management", "Rage Playlist", "Let It Out", "Fierce & Powerful"],
      motivated: ["Hustle Mode", "Get It Done", "Motivation Station", "Power Hour"],
      energetic: ["Energy Boost", "Pump It Up", "High Energy", "Feel the Beat"],
      romantic: ["Love Songs", "Romantic Vibes", "Heart & Soul", "Date Night"]
    };
    
    const primaryMood = moods[0];
    const names = playlistNames[primaryMood] || ["Your Mood Playlist"];
    return names[Math.floor(Math.random() * names.length)];
  }

  // Generate playlist description
  generatePlaylistDescription(moods, originalText) {
    const moodString = moods.length > 1 
      ? `${moods.slice(0, -1).join(", ")} and ${moods[moods.length - 1]}`
      : moods[0];
    
    return `A personalized playlist for when you're feeling ${moodString}. Based on: "${originalText}"`;
  }

  // Get trending tracks (mock)
  getTrendingTracks(limit = 10) {
    return SAMPLE_TRACKS
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);
  }

  // Search tracks by query (mock)
  searchTracks(query, limit = 10) {
    const searchQuery = query.toLowerCase();
    return SAMPLE_TRACKS.filter(track => 
      track.title.toLowerCase().includes(searchQuery) ||
      track.artist.toLowerCase().includes(searchQuery) ||
      track.mood.some(mood => mood.includes(searchQuery))
    ).slice(0, limit);
  }
}

export default new MusicService();
