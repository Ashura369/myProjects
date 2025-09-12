// Sample playlist data
const SONGS = [
  {
    title: "Dreams",
    artist: "Ashura",
    file: "song1.mp3",
    cover: "cover1.jpg"
  },
  {
    title: "Skyline",
    artist: "Ashura",
    file: "song2.mp3",
    cover: "cover2.jpg"
  },
  {
    title: "Sunset Road",
    artist: "Ashura",
    file: "song3.mp3",
    cover: "cover3.jpg"
  }
];

let currentSong = 0;
const audio = document.getElementById('audio');
const artwork = document.getElementById('artwork');
const titleEl = document.getElementById('title');
const artistEl = document.getElementById('artist');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const playlistEl = document.getElementById('playlist');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

// Initialize playlist
function renderPlaylist() {
  playlistEl.innerHTML = '';
  SONGS.forEach((song, i) => {
    const li = document.createElement('li');
    li.textContent = `${song.title} - ${song.artist}`;
    if (i === currentSong) li.classList.add('active');
    li.onclick = () => loadSong(i, true);
    playlistEl.appendChild(li);
  });
}

// Load a song
function loadSong(index, playNow=false) {
  currentSong = index;
  audio.src = SONGS[index].file;
  artwork.src = SONGS[index].cover;
  titleEl.textContent = SONGS[index].title;
  artistEl.textContent = SONGS[index].artist;
  renderPlaylist();
  if (playNow) audio.play();
  updatePlayIcon();
}

// Play/pause
playBtn.onclick = function() {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
  updatePlayIcon();
};

function updatePlayIcon() {
  playBtn.innerHTML = audio.paused ? '&#9654;' : '&#10073;&#10073;';
}

// Next/prev
nextBtn.onclick = function() {
  let next = (currentSong + 1) % SONGS.length;
  loadSong(next, true);
};
prevBtn.onclick = function() {
  let prev = (currentSong - 1 + SONGS.length) % SONGS.length;
  loadSong(prev, true);
};

// Play next song when current ends
audio.onended = function() {
  let next = (currentSong + 1) % SONGS.length;
  loadSong(next, true);
};

// Progress bar update
audio.ontimeupdate = function() {
  if (audio.duration) {
    progress.value = (audio.currentTime / audio.duration) * 100;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
  }
};

progress.oninput = function() {
  if (audio.duration) {
    audio.currentTime = (progress.value / 100) * audio.duration;
  }
};

function formatTime(sec) {
  sec = Math.floor(sec);
  let m = Math.floor(sec / 60);
  let s = sec % 60;
  return m + ':' + (s < 10 ? '0' : '') + s;
}

// Initial load
loadSong(0);
renderPlaylist();
updatePlayIcon();