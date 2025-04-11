console.log('Lets write JavaScript');
let currentSong = new Audio()
let songs;
let currFolder;

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const formattedSecs = secs < 10 ? '0' + secs : secs;
    return `${mins}:${formattedSecs}`;
}

// Example usage:
const duration = 125; // 2 minutes 5 seconds
console.log(formatTime(duration)); // Output: "2:05"

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div");
    // console.log(div);
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    console.log(as)
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        console.log(as)
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])//split by songs at index 1
        }

    }

    //Show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> 
                            <img class="invert" src="hugeicons/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Harsh</div>
                            </div>
                            <div class="playnow">
                            <span>Play now</span>
                            <img class="invert" src="hugeicons/playbar.svg" alt="">
                        </div>
         </li>`;
    }

    // Attach an event listner to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    });
    return songs;
}

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/Spotify/songs/" + track)
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "hugeicons/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

// async function displayAlbums(){
//     let a = await fetch(`http://127.0.0.1:5500/Spotify/songs/`)
//     let response = await a.text();
//     let div = document.createElement("div");
//     div.innerHTML = response;
//     let anchors = div.getElementsByTagName("a")
//     let cardContainer = document.querySelector(".cardContainer")
//     let array = Array.from(anchors)
//         for (let index = 0; index < array.length; index++) {
//             const e = array[index];
            
        
//         if(e.href.includes("/Spotifys/songs")){
//             let folder = e.href.split("/Spotify/songs/").slice(-1)[0]
//             let a = await fetch(`http://127.0.0.1:5500/Spotify/songs/${folder}/info.json`)
//             let response = await a.json();
//             console.log(response)
//             cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="Arijit" class="card">


//                         <div class="play">
//                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
//                                 <circle cx="12" cy="12" r="10" fill="green" />
//                                 <path
//                                     d="M15.9453 12.3948C15.7686 13.0215 14.9333 13.4644 13.2629 14.3502C11.648 15.2064 10.8406 15.6346 10.1899 15.4625C9.9209 15.3913 9.6758 15.2562 9.47812 15.0701C9 14.6198 9 13.7465 9 12C9 10.2535 9 9.38018 9.47812 8.92995C9.6758 8.74381 9.9209 8.60868 10.1899 8.53753C10.8406 8.36544 11.648 8.79357 13.2629 9.64983C14.9333 10.5356 15.7686 10.9785 15.9453 11.6052C16.0182 11.8639 16.0182 12.1361 15.9453 12.3948Z"
//                                     fill="black" stroke="black" stroke-width="1.5" stroke-linejoin="round" />
//                             </svg>

//                         </div>


//                         <img src="/Spotify/songs/${folder}/cover.jpg"
//                             alt="">
//                         <h2>${response.title}</h2>
//                         <p>${response.discription}</p>
//                     </div>`
//         }
//     }
        // Load the playlist whenever card is clicked
//         Array.from(document.getElementsByClassName("card")).forEach(e => {
//             e.addEventListener("click", async item => {
//                 songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
    
//             })
//         })
// }
async function main() {

    //Get the list of all song
    await getSongs("/songs/Arijit");
    // console.log(songs)
    playMusic(songs[0], true)

    //Display all the albums on the page
    // displayAlbums()


    //Error because user first interact it first but by ctrl + S it plays
    // Uncaught (in promise) NotAllowedError: play() failed because the user didn't interact with the document first. https://goo.gl/xX8pDD
    //play the first song
    // var audio = new Audio(songs[0]);
    // audio.play();

    //Attach an event listner to play, next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "hugeicons/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "hugeicons/playbar.svg"
        }
    })

    //Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}
        `
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //Add an event listner to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    //Add an event listner for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    //Add an event listner for close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })

    //Add an event listner to previous
    previous.addEventListener("click", () => {
        console.log("Previous clicked")
        console.log(currentSong.src)
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    //Add an event listner to next
    next.addEventListener("click", () => {
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    //Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "100")
        currentSong.volume = parseInt(e.target.value) / 100
    })

     //Load the playlist whenever card is clicked
     Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);

        })
    })





}

document.getElementById("startBtn").addEventListener("click", async () => {
    document.getElementById("startBtn").style.display = "none"; // hide the button after click
    await main(); // now run your player logic
});
