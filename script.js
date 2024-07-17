console.log('lets write java');
let currentSong = new Audio();
let songs;
let currFolder;


function secondsToMinutesSeconds(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;
    var formattedMinutes = ('0' + minutes).slice(-2);
    var formattedSeconds = ('0' + remainingSeconds).slice(-2);
    return formattedMinutes + ':' + formattedSeconds;
}

async function getSongs(folder) {
    currFolder = folder;

    let a = await fetch(`http://127.0.0.1:5501/${folder}/`)
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")

    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];

        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }






    //show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""

    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="music.svg" alt="">
                                <div class="info">
                                    <div> ${song.replaceAll("%20", " ")} </div>
                                    <div>Pranav</div>
                                </div>
                                <div class="playnow">
                                    <span>Play Now</span>
                                    <img class="invert" src="play.svg" alt="">
                                </div> </li>`;

    }

    //attach an event listner to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {

        e.addEventListener("click", element => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    })

    return songs
}



const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track)
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "pause.svg"
    }


    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}

async function displayAlbums() {


    let a = await fetch(`http://127.0.0.1:5501/songs/`)
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")

    Array.from(anchors).forEach(e => {
        if (e.href.includes("/songs")) {
            console.log(e.href.split("/").slice(-2)[0])
        }
    })










    // let cardContainer = document.querySelector(".cardContainer")


    // let array = Array.from(anchors)
    // for (let index = 0; index < array.length; index++) {
    //     const e = array[index];



    //     if (e.href.includes("/songs")) {
    //         let folder = e.href.split("/").slice(-2)[0]

    //         // // get the meta data of the folder

    //         let a = await fetch(`http://127.0.0.15500/songs/${folder}/info.json`)
    //         let response = await a.json();

    //         cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
    //                     <div class="play">

    //                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    //                             xmlns="http://www.w3.org/2000/svg">

    //                             <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
    //                                 stroke-linejoin="round" />


    //                         </svg>
    //                     </div>

    //                     <img src="/songs/${folder}/cover.jpg alt="">
    //                     <h2>${response.title}</h2>
    //                     <p>${response.description}</p>
    //                 </div>`
    //     }

    // }

   

}




async function main() {
    // get the list of all the songs
    await getSongs("songs/ncs")
    playMusic(songs[0], true)

    //display all the albums on the page

    displayAlbums()





    //attach an eventlistner to play next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "play.svg"
        }
    })

    //listen for time update event

    currentSong.addEventListener("timeupdate", () => {

        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";

    })

    //add an event listner to seek bar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    //add an event listner for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    //add an event listner for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    //add an event listner to previous

    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("previous clicked")
        // console.log(currentSong)

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })


    //add an event listner to next
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }


    })


    //add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {

        console.log("setting volume to", e.target, e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100
    })

    // load the playlist whenver the card is clciked

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])

        })
    })











    //add event listner to mute the track
    document.querySelector(".volume>img").addEventListener("click", e => {
        console.log(e.target)
        console.log("changing", e.target.src)
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })




}
main()