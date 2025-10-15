// FINAL SCRIPT WITH ALL FEATURES AND FIXES
console.log('Lets write JavaScript');
let currentSong = new Audio();
let songs;
let currFolder;
let customSongs = JSON.parse(localStorage.getItem('myCustomSongs')) || {};

function playTrack(url, name) {
    currentSong.pause();
    updateNowPlaying(name);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
    currentSong.src = url;
    currentSong.load();

    const playPromise = currentSong.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.error("Playback error:", error);
            play.src = "hugeicons/playbar.svg";
        });
    }
}

const playMusic = (track) => {
    const fullUrl = `/${currFolder}/${encodeURI(track)}`;
    playTrack(fullUrl, track);
};

async function playYoutubeSong(videoId, title) {
    const streamUrl = `/stream?videoId=${videoId}`;
    playTrack(streamUrl, title);
}

function deleteSong(event, folderName, songIndex) {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete this song from "${folderName}"?`)) {
        customSongs[folderName].splice(songIndex, 1);
        if (customSongs[folderName].length === 0) delete customSongs[folderName];
        localStorage.setItem('myCustomSongs', JSON.stringify(customSongs));
        window.location.reload();
    }
}

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function updateNowPlaying(title) {
    const songInfoContainer = document.querySelector(".songinfo");
    songInfoContainer.innerHTML = `<span>${title}</span>`;
    songInfoContainer.classList.remove('scrolling-text');
    const textSpan = songInfoContainer.querySelector("span");
    setTimeout(() => {
        if (textSpan && textSpan.scrollWidth > songInfoContainer.clientWidth) {
            songInfoContainer.classList.add('scrolling-text');
        }
    }, 100);
}

function attachAllSongClickListeners() {
    document.querySelectorAll(".songList ul li").forEach(e => e.replaceWith(e.cloneNode(true)));
    document.querySelectorAll(".songList ul li").forEach(e => {
        e.addEventListener("click", (event) => {
            if (event.target.closest('.deleteSong')) return;
            const type = e.dataset.type;
            const title = e.dataset.title;
            if (type === 'youtube') {
                playYoutubeSong(e.dataset.videoId, title);
            } else {
                playMusic(title);
            }
        });
    });
}

async function getSongs(folder) {
    currFolder = `songs/${folder}`;
    try {
        let a = await fetch(`./${currFolder}/`);
        if (!a.ok) { songs = []; return songs; }
        let response = await a.text();
        let div = document.createElement("div");
        div.innerHTML = response;
        songs = Array.from(div.getElementsByTagName("a"))
            .map(el => el.getAttribute("href"))
            .filter(href => href && href.endsWith(".mp3"))
            .map(href => decodeURI(href.substring(href.lastIndexOf('/') + 1)));
    } catch (error) {
        console.error(`Could not fetch songs from folder: ${folder}`, error);
        songs = [];
    }
    let songUL = document.querySelector(".songList ul");
    songUL.innerHTML = "";
    for (const songName of songs) {
        songUL.innerHTML += `<li data-title="${songName}"><img class="invert" src="hugeicons/music.svg" alt=""><div class="info"><div>${songName}</div><div>Original Artist</div></div><div class="playnow"><span>Play now</span><img class="invert" src="hugeicons/playbar.svg" alt=""></div></li>`;
    }
    attachAllSongClickListeners();
    return songs;
}

function loadCustomSongs(folder) {
    let songUL = document.querySelector(".songList ul");
    songUL.innerHTML = "";
    const customSongList = customSongs[folder];
    for (let i = 0; i < customSongList.length; i++) {
        const song = customSongList[i];
        songUL.innerHTML += `<li data-type="youtube" data-video-id="${song.videoId}" data-title="${song.name}"><img class="invert" src="hugeicons/music.svg" alt=""><div class="info"><div>${song.name}</div><div>Custom</div></div><div class="playnow"><span>Play now</span><img class="invert" src="hugeicons/playbar.svg" alt=""></div><div class="deleteSong" onclick="deleteSong(event, '${folder}', ${i})"><img class="invert" src="hugeicons/delete.svg" alt="Delete" style="cursor:pointer;"></div></li>`;
    }
    attachAllSongClickListeners();
}

function loadCustomFolders() {
    const cardContainer = document.querySelector(".cardContainer");
    if (!cardContainer) return;
    const customFolders = Object.keys(customSongs);
    for (const folder of customFolders) {
        const firstSong = customSongs[folder][0];
        const coverImage = firstSong && firstSong.thumbnail ? firstSong.thumbnail : "favicon.ico";
        const cardHTML = `<div class="card" data-folder="${folder}"><div class="play"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"><circle cx="12" cy="12" r="10" fill="green" /><path d="M15.9453 12.3948C15.7686 13.0215 14.9333 13.4644 13.2629 14.3502C11.648 15.2064 10.8406 15.6346 10.1899 15.4625C9.9209 15.3913 9.6758 15.2562 9.47812 15.0701C9 14.6198 9 13.7465 9 12C9 10.2535 9 9.38018 9.47812 8.92995C9.6758 8.74381 9.9209 8.60868 10.1899 8.53753C10.8406 8.36544 11.648 8.79357 13.2629 9.64983C14.9333 10.5356 15.7686 10.9785 15.9453 11.6052C16.0182 11.8639 16.0182 12.1361 15.9453 12.3948Z" fill="black" stroke="black" stroke-width="1.5" stroke-linejoin="round" /></svg></div><img src="${coverImage}" alt="custom playlist cover"><h2>${folder}</h2><p>Custom Playlist</p></div>`;
        cardContainer.insertAdjacentHTML('beforeend', cardHTML);
    }
}

async function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResultsContainer = document.getElementById('searchResults');
    const query = searchInput.value.trim();
    if (!query) return;
    searchResultsContainer.innerHTML = 'Searching...';
    try {
        const response = await fetch(`/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const results = await response.json();
        displaySearchResults(results);
    } catch (error) {
        console.error('Search failed:', error);
        searchResultsContainer.innerHTML = 'Failed to load results.';
    }
}

function displaySearchResults(results) {
    const searchResultsContainer = document.getElementById('searchResults');
    searchResultsContainer.innerHTML = '';
    if (results.length === 0) { searchResultsContainer.innerHTML = 'No results found.'; return; }
    results.forEach(video => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.dataset.videoId = video.videoId;
        resultItem.dataset.title = video.title;
        resultItem.dataset.thumbnail = video.thumbnail || '';
        resultItem.innerHTML = `<img src="${video.thumbnail || 'favicon.ico'}" alt="thumbnail"><span>${video.title}</span>`;
        resultItem.addEventListener('click', () => addSongFromSearch(resultItem));
        searchResultsContainer.appendChild(resultItem);
    });
}

async function addSongFromSearch(resultElement) {
    const { videoId, title, thumbnail } = resultElement.dataset;
    const folder = prompt("Enter playlist name to save this song:", "YouTube Imports");
    if (!folder) return;
    if (!customSongs[folder]) customSongs[folder] = [];
    customSongs[folder].push({ name: title, videoId: videoId, thumbnail: thumbnail, type: 'youtube' });
    localStorage.setItem('myCustomSongs', JSON.stringify(customSongs));
    alert(`Song "${title}" added to "${folder}" playlist!`);
    document.getElementById('addSongPopup').style.display = 'none';
    window.location.reload();
}

async function main() {
    document.getElementById("addSongBtn").addEventListener("click", () => document.getElementById("addSongPopup").style.display = "block");
    document.getElementById("cancelSongBtn").addEventListener("click", () => document.getElementById("addSongPopup").style.display = "none");
    document.getElementById('searchBtn').addEventListener('click', handleSearch);
    document.getElementById('searchInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSearch(); });

    loadCustomFolders();

    await getSongs("Arijit");
    if (songs && songs.length > 0) {
        let firstSong = songs[0];
        updateNowPlaying(firstSong);
        currentSong.src = `/${currFolder}/${encodeURI(firstSong)}`;
    }

    play.addEventListener("click", () => {
        if (currentSong.src && currentSong.paused) currentSong.play();
        else currentSong.pause();
    });
    currentSong.addEventListener('play', () => { play.src = "hugeicons/pause.svg"; });
    currentSong.addEventListener('pause', () => { play.src = "hugeicons/playbar.svg"; });
    currentSong.addEventListener("timeupdate", () => {
        if (currentSong.duration) {
            document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;
            document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
        }
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        if (currentSong.duration) {
            let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
            currentSong.currentTime = ((currentSong.duration) * percent) / 100;
        }
    });
    document.querySelector(".hamburger").addEventListener("click", () => { document.querySelector(".left").style.left = "0"; });
    document.querySelector(".close").addEventListener("click", () => { document.querySelector(".left").style.left = "-120%"; });

    previous.addEventListener("click", () => {
        const currentSongTitle = document.querySelector(".songinfo span").textContent.trim();
        const listItems = Array.from(document.querySelectorAll(".songList ul li"));
        let currentIndex = -1;

        for (let i = 0; i < listItems.length; i++) {
            if (listItems[i].dataset.title === currentSongTitle) {
                currentIndex = i;
                break;
            }
        }

        if (currentIndex > 0) {
            const prevItem = listItems[currentIndex - 1];
            const type = prevItem.dataset.type;
            const title = prevItem.dataset.title;
            const folder = prevItem.dataset.folder;
            
            if (type === 'youtube') {
                playYoutubeSong(prevItem.dataset.videoId, title);
            } else {
                currFolder = folder ? `songs/${folder}` : currFolder; 
                playMusic(title);
            }
        } else if (listItems.length > 0 && currentIndex === 0) {
            const lastItem = listItems[listItems.length - 1];
            const type = lastItem.dataset.type;
            const title = lastItem.dataset.title;
            const folder = lastItem.dataset.folder;
            
            if (type === 'youtube') {
                playYoutubeSong(lastItem.dataset.videoId, title);
            } else {
                currFolder = folder ? `songs/${folder}` : currFolder; 
                playMusic(title);
            }
        }
    });
    

    next.addEventListener("click", () => {
        const currentSongTitle = document.querySelector(".songinfo span").textContent.trim();
        const listItems = Array.from(document.querySelectorAll(".songList ul li"));
        let currentIndex = -1;
        for (let i = 0; i < listItems.length; i++) {
            if (listItems[i].dataset.title === currentSongTitle) {
                currentIndex = i;
                break;
            }
        }

        if (currentIndex !== -1 && currentIndex < listItems.length - 1) {
            const nextItem = listItems[currentIndex + 1];
            const type = nextItem.dataset.type;
            const title = nextItem.dataset.title;
            const folder = nextItem.dataset.folder;

            if (type === 'youtube') {
                playYoutubeSong(nextItem.dataset.videoId, title);
            } else {
                currFolder = folder ? `songs/${folder}` : currFolder;
                playMusic(title);
            }
        } else if (listItems.length > 0 && (currentIndex === listItems.length - 1 || currentIndex === -1)) {
            const firstItem = listItems[0];
            const type = firstItem.dataset.type;
            const title = firstItem.dataset.title;
            const folder = firstItem.dataset.folder;
            
            if (type === 'youtube') {
                playYoutubeSong(firstItem.dataset.videoId, title);
            } else {
                currFolder = folder ? `songs/${folder}` : currFolder;
                playMusic(title);
            }
        }
    });

    document.querySelector(".range input").addEventListener("change", (e) => { currentSong.volume = parseInt(e.target.value) / 100; });

    document.querySelector(".range input").addEventListener("change", (e) => { currentSong.volume = parseInt(e.target.value) / 100; });

    document.querySelector(".cardContainer").addEventListener("click", async (event) => {
        const card = event.target.closest(".card");
        if (card) {
            const folder = card.dataset.folder;
            if (customSongs[folder]) {
                loadCustomSongs(folder);
            } else {
                await getSongs(folder);
            }
        }
    });
}

let allFoldersData = {};
let currentFilterFolder = 'all';

function getAllFolderNames() {
    const cards = document.querySelectorAll('.cardContainer .card');
    const folderNames = Array.from(cards).map(card => card.dataset.folder);
    const customFolders = Object.keys(customSongs);
    return [...folderNames, ...customFolders];
}

async function loadAllSongsData() {
    const folders = getAllFolderNames();
    allFoldersData = {};
    
    for (const folder of folders) {
        if (customSongs[folder]) {
            // Custom songs
            allFoldersData[folder] = customSongs[folder].map(song => ({
                ...song,
                folder: folder,
                type: 'youtube'
            }));
        } else {
            try {
                let a = await fetch(`./songs/${folder}/`);
                if (a.ok) {
                    let response = await a.text();
                    let div = document.createElement("div");
                    div.innerHTML = response;
                    const songList = Array.from(div.getElementsByTagName("a"))
                        .map(el => el.getAttribute("href"))
                        .filter(href => href && href.endsWith(".mp3"))
                        .map(href => ({
                            name: decodeURI(href.substring(href.lastIndexOf('/') + 1)),
                            folder: folder,
                            type: 'regular'
                        }));
                    if (songList.length > 0) {
                        allFoldersData[folder] = songList;
                    }
                }
            } catch (error) {
                console.error(`Could not fetch songs from folder: ${folder}`, error);
            }
        }
    }
}

// Display songs based on filter selection
function displayFilteredSongs(folderName = 'all') {
    let songUL = document.querySelector(".songList ul");
    songUL.innerHTML = "";
    
    let songsToDisplay = [];
    
    if (folderName === 'all') {
        Object.keys(allFoldersData).forEach(folder => {
            if (allFoldersData[folder]) {
                songsToDisplay.push(...allFoldersData[folder]);
            }
        });
    } else {
        songsToDisplay = allFoldersData[folderName] || [];
    }
    
    // Display songs
    songsToDisplay.forEach((song) => {
        if (song.type === 'youtube') {
            const folderSongs = customSongs[song.folder];
            const songIndex = folderSongs ? folderSongs.findIndex(s => s.videoId === song.videoId) : -1;
            
            songUL.innerHTML += `
                <li data-type="youtube" data-video-id="${song.videoId}" data-title="${song.name}" data-folder="${song.folder}">
                    <img class="invert" src="hugeicons/music.svg" alt="">
                    <div class="info">
                        <div>${song.name}</div>
                        <div>${song.folder} - Custom</div>
                    </div>
                    <div class="playnow">
                        <span>Play now</span>
                        <img class="invert" src="hugeicons/playbar.svg" alt="">
                    </div>
                    ${songIndex !== -1 ? `<div class="deleteSong" onclick="deleteSong(event, '${song.folder}', ${songIndex})">
                        <img class="invert" src="hugeicons/delete.svg" alt="Delete" style="cursor:pointer;">
                    </div>` : ''}
                </li>
            `;
        } else {
            songUL.innerHTML += `
                <li data-type="regular" data-title="${song.name}" data-folder="${song.folder}">
                    <img class="invert" src="hugeicons/music.svg" alt="">
                    <div class="info">
                        <div>${song.name}</div>
                        <div>${song.folder} - Original Artist</div>
                    </div>
                    <div class="playnow">
                        <span>Play now</span>
                        <img class="invert" src="hugeicons/playbar.svg" alt="">
                    </div>
                </li>
            `;
        }
    });
    
    attachAllSongClickListenersWithFolder();
}

function filterSongsBySearch(searchQuery) {
    const query = searchQuery.toLowerCase().trim();
    const allListItems = document.querySelectorAll(".songList ul li");
    
    if (query === '') {
        allListItems.forEach(item => item.style.display = "flex");
        return;
    }
    
    allListItems.forEach(item => {
        const title = item.dataset.title.toLowerCase();
        const folder = item.dataset.folder ? item.dataset.folder.toLowerCase() : '';
        
        if (title.includes(query) || folder.includes(query)) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
    });
}

function createFilterUI() {
    const folders = getAllFolderNames();

    if (document.getElementById('folderFilter')) return;

    const filterHTML = `
        <div class="filter-container">
                        <h1>Sukoon Voices</h1>
            <label for="folderFilter">Filter by:</label>
            <select id="folderFilter">
                <option value="all">All Songs</option>
                ${folders.map(folder => `<option value="${folder}">${folder}</option>`).join('')}
            </select>
            <input type="text" id="songSearchFilter" placeholder="Search songs...">
        </div>
    `;

    const playlistContainer = document.querySelector('.spotifyPlaylists');

    const heading = playlistContainer ? playlistContainer.querySelector('h1') : null;

    if (heading) {
        heading.insertAdjacentHTML('afterend', filterHTML);
    } 
    else if (playlistContainer) {
        playlistContainer.insertAdjacentHTML('afterbegin', filterHTML);
    }
    if (document.getElementById('folderFilter')) {
        document.getElementById('folderFilter').addEventListener('change', (e) => {
            currentFilterFolder = e.target.value;
            displayFilteredSongs(currentFilterFolder);
            document.getElementById('songSearchFilter').value = '';
        });
        
        document.getElementById('songSearchFilter').addEventListener('input', (e) => {
            filterSongsBySearch(e.target.value);
        });
        const filterContainer = document.querySelector('.filter-container');
        if (filterContainer) {
            filterContainer.addEventListener('click', (e) => {
                if (window.innerWidth <= 800 && e.target.tagName !== 'SELECT' && e.target.tagName !== 'INPUT') {
                    filterContainer.classList.toggle('open');
                }
            });
        }

    }
}

function attachAllSongClickListenersWithFolder() {
    document.querySelectorAll(".songList ul li").forEach(e => e.replaceWith(e.cloneNode(true)));
    document.querySelectorAll(".songList ul li").forEach(e => {
        e.addEventListener("click", (event) => {
            if (event.target.closest('.deleteSong')) return;
            
            const type = e.dataset.type;
            const title = e.dataset.title;
            const folder = e.dataset.folder;
            
            if (type === 'youtube') {
                playYoutubeSong(e.dataset.videoId, title);
            } else {
                // Set the currFolder correctly before playing
                currFolder = `songs/${folder}`;
                playMusic(title);
            }
        });
    });
}

async function initializeFilterSystem() {
    await loadAllSongsData();
    createFilterUI();
    displayFilteredSongs('all');
}

const originalCardContainerHandler = document.querySelector(".cardContainer");
if (originalCardContainerHandler) {
    setTimeout(() => {
        const cardContainer = document.querySelector(".cardContainer");
        const newCardContainer = cardContainer.cloneNode(true);
        cardContainer.parentNode.replaceChild(newCardContainer, cardContainer);
        
        newCardContainer.addEventListener("click", async (event) => {
            const card = event.target.closest(".card");
            if (card) {
                const folder = card.dataset.folder;

                const filterSelect = document.getElementById('folderFilter');
                if (filterSelect) {
                    filterSelect.value = folder;
                    currentFilterFolder = folder;
                }

                if (customSongs[folder]) {
                    loadCustomSongs(folder);
                } else {
                    await getSongs(folder);
                    if (filterSelect) {
                        displayFilteredSongs(folder);
                    }
                }
            }
        });
    }, 1000);
}

window.addEventListener('DOMContentLoaded', async () => {
    setTimeout(async () => {
        await initializeFilterSystem();
    }, 1500);
});
main();
