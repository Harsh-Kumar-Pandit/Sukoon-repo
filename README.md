# 🎵 Sukoon - Your Web-Based Music Player 🎧

#🎵 Sukoon -
> A calm and simple music player that brings your favorite tunes to your browser.


Sukoon is a web-based music player that allows you to play local audio files and stream music from YouTube. It provides a seamless and intuitive user interface for managing your music library and discovering new tunes. Enjoy your favorite music anytime, anywhere!

## 🚀 Key Features

- **Local Music Playback:** Play audio files directly from your computer.
- **YouTube Streaming:** Search and stream music from YouTube using a powerful backend API.
- **Custom Playlists:** Create and manage your own playlists, saved locally in your browser.
- **Intuitive UI:** Enjoy a clean and user-friendly interface for easy navigation and control.
- **Search Functionality:** Quickly find your favorite songs and artists.
- **Dynamic Song List:** Dynamically updated song list based on the current folder.
- **Persistent Data:** Custom playlist data is stored in `localStorage` for persistence across browser sessions.
- **Directory Browsing:** Browse local song files using the `/songs` endpoint.

## 🛠️ Tech Stack

*   **Frontend:**
    *   HTML5
    *   CSS3
    *   JavaScript
*   **Backend:**
    *   Node.js
    *   Express.js
    *   CORS
    *   serve-index
*   **Audio Streaming:**
    *   play-dl
    *   yt-dlp (YouTube Downloader)
*   **Other:**
    *   npm (Node Package Manager)

## 📦 Getting Started

### Prerequisites

*   Node.js and npm installed on your machine.
*   yt-dlp installed and available in your system's PATH. You can download it from the official [yt-dlp repository](https://github.com/yt-dlp/yt-dlp).

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository_url>
    cd sukoon
    ```

2.  Install the dependencies:

    ```bash
    npm install
    ```

### Running Locally

1.  Start the server:

    ```bash
    npm start
    ```

2.  Open your browser and navigate to `http://localhost:3000` (or the port your server is running on).

## 💻 Usage

1.  **Browse Local Music:** Navigate through your local music folders and play your favorite tracks.
2.  **Search YouTube:** Use the search bar to find music videos on YouTube and stream their audio.
3.  **Create Playlists:** Create custom playlists and add songs to them. Your playlists will be saved in your browser's local storage.
4.  **Control Playback:** Use the player controls to play, pause, skip, and adjust the volume.

## 📂 Project Structure

```
sukoon/
├── index.html        # Main HTML file for the music player UI
├── script.js         # Client-side JavaScript for handling user interactions and API requests
├── server.js         # Backend server using Node.js and Express
├── style.css         # CSS file for styling the music player UI
├── utility.css       # CSS file for utility classes
├── package.json      # Project metadata and dependencies
├── logo.svg          # Logo image
├── home.svg          # Home icon
├── search.svg        # Search icon
├── playlist.svg      # Playlist icon
├── hamburger.svg     # Hamburger menu icon
├── close.svg         # Close icon
├── playbar.svg       # Playbar icon
├── next.svg          # Next track icon
├── previous.svg      # Previous track icon
├── volume.svg        # Volume icon
├── mute.svg          # Mute icon
├── favicon.ico       # Favicon
└── songs/            # Directory for local song files (optional)
```

## 📸 Screenshots

(Screenshots will be added soon)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues to suggest improvements or report bugs.

## 📝 License

Currently, this project doesn’t include a specific license.
Please contact the author if you wish to use or modify the code.


## 📬 Contact

If you have any questions or suggestions, feel free to contact me at [harshkumarpandt2004@gmail.com](mailto:harshkumarpandt2004@gmail.com).

## 💖 Thanks

Thank you for using Sukoon! I hope you enjoy listening to your favorite music.
---
Made with ❤️ by Harsh Kumar Pandit

