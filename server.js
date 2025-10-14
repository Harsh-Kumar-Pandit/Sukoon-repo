// server.js - FINAL VERSION (COMBINED FULL-STACK SERVER)

const express = require('express');
const cors = require('cors');
const play = require('play-dl'); 
const { spawn } = require('child_process'); 
const path = require('path'); 

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0'; 

const serveIndex = require('serve-index');

app.use(cors());

// =========================================================
// CRITICAL: STATIC FILE SERVING
// This line tells Express to serve static files 
// (index.html, script.js, style.css, etc.) 
// from the same directory where server.js is located.
// =========================================================
app.use(express.static(__dirname)); 

app.use('/songs', serveIndex(path.join(__dirname, 'songs'), {'icons': true}));


// ROUTE 1: Search for videos (API endpoint)
app.get('/search', async (req, res) => {
    try {
        const videos = await play.search(req.query.q, { limit: 10, source: { youtube: 'video' } });
        const results = videos.map(video => ({
            videoId: video.id,
            title: video.title,
            thumbnail: video.thumbnails[0]?.url
        }));
        res.json(results);
    } catch (error) {
        console.error('Search Error:', error);
        res.status(500).json({ error: 'Failed to search for videos' });
    }
});

// ROUTE 2: Stream audio (API endpoint)
app.get('/stream', (req, res) => {
    const videoId = req.query.videoId;
    if (!videoId) {
        return res.status(400).send('Video ID is required');
    }

    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    // Path to the yt-dlp.exe in your project folder
    const ytDlpPath = path.join(__dirname, 'yt-dlp.exe');
    
    // Command to execute: yt-dlp.exe -f bestaudio -o - [URL]
    const ytDlpProcess = spawn(ytDlpPath, ['-f', 'bestaudio', '-o', '-', youtubeUrl]);

    // Set headers to tell the browser it's an audio stream
    res.setHeader('Content-Type', 'audio/webm');

    // Pipe the audio stream from yt-dlp directly to the browser
    ytDlpProcess.stdout.pipe(res);

    // Handle errors from the yt-dlp process
    ytDlpProcess.stderr.on('data', (data) => {
        console.error(`yt-dlp stderr: ${data}`);
    });

    ytDlpProcess.on('error', (error) => {
        console.error('Failed to start yt-dlp process:', error);
        if (!res.headersSent) {
            res.status(500).send('Failed to start stream process.');
        }
    });

    ytDlpProcess.on('close', (code) => {
        if (code !== 0 && !res.headersSent) {
            console.log(`yt-dlp process exited with code ${code}`);
            res.status(500).send('Stream ended unexpectedly.');
        }
    });
});

// =========================================================
// This route now serves the frontend files, so we can remove
// the separate redundant root route from the previous steps.
// =========================================================


app.listen(PORT, HOST, () => {
    console.log(`Full-Stack Sukoon Server running on http://${HOST}:${PORT}`);
});