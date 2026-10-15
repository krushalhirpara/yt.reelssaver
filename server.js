const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const os = require("os");
const { spawn, execFile, exec } = require("child_process");

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// Dynamic Sitemap generator with current Host / Domain
app.get("/sitemap.xml", (req, res) => {
	const host = process.env.SITE_URL || `${req.protocol}://${req.get("host")}`;
	const today = new Date().toISOString().split("T")[0];
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <!-- Homepage -->
  <url>
    <loc>${host}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${host}/icon.png</image:loc>
      <image:title>yt.reelssaver - Free YouTube &amp; Reels Video Downloader (4K MP4 &amp; MP3)</image:title>
    </image:image>
  </url>
  <!-- Privacy Policy -->
  <url>
    <loc>${host}/privacy-policy</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <!-- Terms of Service -->
  <url>
    <loc>${host}/terms-of-service</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <!-- DMCA & Copyright Policy -->
  <url>
    <loc>${host}/dmca</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <!-- Contact Us -->
  <url>
    <loc>${host}/contact</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;
	res.header("Content-Type", "application/xml");
	res.send(sitemap);
});

// Dynamic Robots.txt generator
app.get("/robots.txt", (req, res) => {
	const host = process.env.SITE_URL || `${req.protocol}://${req.get("host")}`;
	const robots = `User-agent: *
Allow: /
Allow: /privacy-policy
Allow: /terms-of-service
Allow: /dmca
Allow: /contact
Disallow: /api/download
Disallow: /api/open-downloads
Disallow: /api/file/

Sitemap: ${host}/sitemap.xml
`;
	res.header("Content-Type", "text/plain");
	res.send(robots);
});

// Dedicated Legal & Policy Page Routes
app.get(["/privacy", "/privacy-policy"], (req, res) => {
	res.sendFile(path.join(__dirname, "public", "privacy.html"));
});

app.get(["/terms", "/terms-of-service"], (req, res) => {
	res.sendFile(path.join(__dirname, "public", "terms.html"));
});

app.get(["/dmca", "/copyright"], (req, res) => {
	res.sendFile(path.join(__dirname, "public", "dmca.html"));
});

app.get(["/contact", "/contact-us"], (req, res) => {
	res.sendFile(path.join(__dirname, "public", "contact.html"));
});

app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "public")));

const DOWNLOADS_DIR = path.join(__dirname, "downloads");
if (!fs.existsSync(DOWNLOADS_DIR)) {
	fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

// Locate yt-dlp binary
function getYtDlpPath() {
	const userYtDlp = path.join(os.homedir(), ".ytDownloader", "ytdlp.exe");
	if (fs.existsSync(userYtDlp)) return userYtDlp;
	const localYtDlp = path.join(__dirname, "ytdlp.exe");
	if (fs.existsSync(localYtDlp)) return localYtDlp;
	return "yt-dlp";
}

// Locate ffmpeg binary
function getFfmpegPath() {
	const pyFfmpeg = "C:\\Users\\VICTUS\\AppData\\Local\\Python\\pythoncore-3.14-64\\Lib\\site-packages\\imageio_ffmpeg\\binaries\\ffmpeg-win-x86_64-v7.1.exe";
	if (fs.existsSync(pyFfmpeg)) return pyFfmpeg;
	const localFfmpeg = path.join(__dirname, "ffmpeg", "bin", "ffmpeg.exe");
	if (fs.existsSync(localFfmpeg)) return localFfmpeg;
	return "ffmpeg";
}

const YTDLP_BIN = getYtDlpPath();
const FFMPEG_BIN = getFfmpegPath();

console.log("[ytDownloader Web] yt-dlp path:", YTDLP_BIN);
console.log("[ytDownloader Web] ffmpeg path:", FFMPEG_BIN);

// In-memory active download jobs
const activeJobs = new Map();

// Helper: Format seconds to MM:SS or HH:MM:SS
function formatDuration(seconds) {
	if (!seconds || isNaN(seconds)) return "00:00";
	const s = Math.floor(seconds);
	const h = Math.floor(s / 3600);
	const m = Math.floor((s % 3600) / 60);
	const remS = s % 60;
	if (h > 0) {
		return `${h}:${m < 10 ? "0" : ""}${m}:${remS < 10 ? "0" : ""}${remS}`;
	}
	return `${m < 10 ? "0" : ""}${m}:${remS < 10 ? "0" : ""}${remS}`;
}

// Helper: Format byte sizes
function formatBytes(bytes) {
	if (!bytes || bytes === 0) return "0 B";
	const k = 1024;
	const sizes = ["B", "KB", "MB", "GB", "TB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// --- API Endpoints ---

// 1. Health & Status
app.get("/api/status", async (req, res) => {
	execFile(YTDLP_BIN, ["--version"], (err, stdout) => {
		const version = stdout ? stdout.trim() : (err ? "Unavailable" : "Ready");
		res.json({
			status: "online",
			port: PORT,
			ytdlpVersion: version,
			ytdlpPath: YTDLP_BIN,
			ffmpegPath: FFMPEG_BIN,
			activeJobs: activeJobs.size,
			downloadsCount: fs.readdirSync(DOWNLOADS_DIR).filter(f => !f.endsWith(".part") && !f.endsWith(".ytdl")).length
		});
	});
});

// 2. Inspect Video / Playlist Metadata
app.post("/api/info", (req, res) => {
	const { url } = req.body;
	if (!url || typeof url !== "string") {
		return res.status(400).json({ error: "Valid URL is required." });
	}

	const args = [
		"--dump-single-json",
		"--no-playlist",
		"--js-runtimes", "node",
		url.trim()
	];

	if (FFMPEG_BIN && fs.existsSync(FFMPEG_BIN)) {
		args.unshift("--ffmpeg-location", FFMPEG_BIN);
	}

	execFile(YTDLP_BIN, args, { maxBuffer: 30 * 1024 * 1024 }, (err, stdout, stderr) => {
		if (err) {
			console.error("[Info Error]", stderr || err.message);
			return res.status(500).json({
				error: "Failed to extract metadata. Please verify the URL.",
				details: (stderr || err.message).slice(0, 500)
			});
		}

		try {
			const data = JSON.parse(stdout);
			
			// Process video resolutions
			const videoFormatsMap = new Map();
			const audioFormatsMap = new Map();

			if (Array.isArray(data.formats)) {
				for (const f of data.formats) {
					// Video formats
					if (f.vcodec && f.vcodec !== "none" && f.height) {
						const height = f.height;
						const label = `${height}p` + (f.fps && f.fps > 30 ? ` ${f.fps}fps` : "");
						if (!videoFormatsMap.has(height) || (f.filesize || f.filesize_approx || 0) > (videoFormatsMap.get(height).size || 0)) {
							videoFormatsMap.set(height, {
								height,
								label,
								formatId: f.format_id,
								ext: f.ext || "mp4",
								size: f.filesize || f.filesize_approx || null,
								sizeStr: f.filesize || f.filesize_approx ? formatBytes(f.filesize || f.filesize_approx) : "Dynamic"
							});
						}
					}
					// Audio formats
					if (f.acodec && f.acodec !== "none" && (!f.vcodec || f.vcodec === "none")) {
						const abr = Math.round(f.abr || 128);
						const key = `${f.ext || "audio"}-${abr}`;
						if (!audioFormatsMap.has(key)) {
							audioFormatsMap.set(key, {
								ext: f.ext || "m4a",
								abr: abr,
								label: `${abr} kbps (${(f.ext || "audio").toUpperCase()})`,
								formatId: f.format_id,
								size: f.filesize || f.filesize_approx || null,
								sizeStr: f.filesize || f.filesize_approx ? formatBytes(f.filesize || f.filesize_approx) : "Dynamic"
							});
						}
					}
				}
			}

			const videoOptions = Array.from(videoFormatsMap.values()).sort((a, b) => b.height - a.height);
			const audioOptions = Array.from(audioFormatsMap.values()).sort((a, b) => b.abr - a.abr);

			res.json({
				id: data.id,
				title: data.title || "Untitled Video",
				thumbnail: data.thumbnail || (data.thumbnails && data.thumbnails.length ? data.thumbnails[data.thumbnails.length - 1].url : ""),
				uploader: data.uploader || data.channel || "Unknown Creator",
				uploaderUrl: data.uploader_url || data.channel_url || "",
				duration: data.duration,
				durationStr: formatDuration(data.duration),
				viewCount: data.view_count ? data.view_count.toLocaleString() : "N/A",
				description: (data.description || "").slice(0, 300),
				webpageUrl: data.webpage_url || url,
				videoOptions,
				audioOptions
			});
		} catch (parseErr) {
			console.error("[JSON Parse Error]", parseErr);
			res.status(500).json({ error: "Failed to parse video metadata." });
		}
	});
});

// 3. YouTube Search
app.post("/api/search", (req, res) => {
	const { query } = req.body;
	if (!query || typeof query !== "string") {
		return res.status(400).json({ error: "Search query is required." });
	}

	const args = [
		`ytsearch8:${query.trim()}`,
		"--dump-single-json",
		"--flat-playlist",
		"--js-runtimes", "node"
	];

	execFile(YTDLP_BIN, args, { maxBuffer: 20 * 1024 * 1024 }, (err, stdout) => {
		if (err) {
			return res.status(500).json({ error: "Search failed", details: err.message });
		}

		try {
			const data = JSON.parse(stdout);
			const entries = (data.entries || []).map(entry => ({
				id: entry.id,
				title: entry.title,
				url: entry.url || `https://www.youtube.com/watch?v=${entry.id}`,
				thumbnail: entry.thumbnails && entry.thumbnails.length ? entry.thumbnails[entry.thumbnails.length - 1].url : (entry.thumbnail || ""),
				uploader: entry.uploader || entry.channel || "YouTube",
				duration: entry.duration,
				durationStr: formatDuration(entry.duration),
				viewCount: entry.view_count ? entry.view_count.toLocaleString() : ""
			}));

			res.json({ results: entries });
		} catch (parseErr) {
			res.status(500).json({ error: "Failed to parse search results" });
		}
	});
});

// 4. Start Download Job
app.post("/api/download", (req, res) => {
	const { url, type, quality, customExt } = req.body;
	if (!url) {
		return res.status(400).json({ error: "URL is required" });
	}

	const jobId = "job_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
	const isAudio = type === "audio";

	// Output template
	const outputTemplate = path.join(DOWNLOADS_DIR, "%(title).100B [%(id)s].%(ext)s");

	const args = [
		"--newline",
		"--no-mtime",
		"--js-runtimes", "node",
		"-o", outputTemplate
	];

	if (FFMPEG_BIN && fs.existsSync(FFMPEG_BIN)) {
		args.push("--ffmpeg-location", FFMPEG_BIN);
	}

	if (isAudio) {
		args.push("-x");
		const audioExt = customExt || "mp3";
		args.push("--audio-format", audioExt);
		args.push("--audio-quality", "0"); // best
	} else {
		// Video
		if (quality) {
			args.push("-f", `bestvideo[height<=${quality}]+bestaudio/best[height<=${quality}]/best`);
		} else {
			args.push("-f", "bestvideo+bestaudio/best");
		}
		args.push("--merge-output-format", "mp4");
	}

	args.push(url.trim());

	console.log(`[Job ${jobId}] Starting download:`, args.join(" "));

	const jobState = {
		id: jobId,
		url,
		type: isAudio ? "audio" : "video",
		status: "starting",
		progress: 0,
		speed: "Connecting...",
		eta: "--:--",
		totalSize: "",
		filename: null,
		filePath: null,
		error: null,
		createdAt: new Date().toISOString()
	};

	activeJobs.set(jobId, jobState);

	const proc = spawn(YTDLP_BIN, args);

	proc.stdout.on("data", (chunk) => {
		const text = chunk.toString();
		// Look for progress lines: [download]  45.3% of ~  15.20MiB at    4.23MiB/s ETA 00:03
		const progressMatch = text.match(/\[download\]\s+([\d\.]+)%\s+of\s+~?([\d\.]+\w+)\s+at\s+([^\s]+)\s+ETA\s+([^\s]+)/i);
		if (progressMatch) {
			jobState.status = "downloading";
			jobState.progress = parseFloat(progressMatch[1]);
			jobState.totalSize = progressMatch[2];
			jobState.speed = progressMatch[3];
			jobState.eta = progressMatch[4];
		} else if (text.includes("[Merger]") || text.includes("[ExtractAudio]")) {
			jobState.status = "processing";
			jobState.progress = 98;
			jobState.speed = "Processing & Merging...";
		} else if (text.includes("[download] 100%")) {
			jobState.progress = 100;
		}

		// Detect destination filename
		const destMatch = text.match(/Destination:\s+(.+)$/m) || text.match(/Merging formats into "(.+)"/m);
		if (destMatch && destMatch[1]) {
			const detectedPath = destMatch[1].trim().replace(/^"|"$/g, "");
			jobState.filePath = detectedPath;
			jobState.filename = path.basename(detectedPath);
		}
	});

	proc.stderr.on("data", (chunk) => {
		const text = chunk.toString();
		console.warn(`[Job ${jobId} stderr]:`, text);
		if (text.toLowerCase().includes("error:")) {
			jobState.error = text.trim();
		}
	});

	proc.on("close", (code) => {
		console.log(`[Job ${jobId}] Exited with code ${code}`);
		if (code === 0) {
			jobState.status = "completed";
			jobState.progress = 100;
			jobState.speed = "Completed";
			jobState.eta = "00:00";

			// Find newest file in DOWNLOADS_DIR if filename wasn't captured
			if (!jobState.filename) {
				try {
					const files = fs.readdirSync(DOWNLOADS_DIR)
						.filter(f => !f.endsWith(".part") && !f.endsWith(".ytdl"))
						.map(f => ({ name: f, time: fs.statSync(path.join(DOWNLOADS_DIR, f)).mtimeMs }))
						.sort((a, b) => b.time - a.time);
					if (files.length > 0) {
						jobState.filename = files[0].name;
						jobState.filePath = path.join(DOWNLOADS_DIR, files[0].name);
					}
				} catch (_) {}
			}
		} else {
			jobState.status = "failed";
			jobState.error = jobState.error || `Download failed with process code ${code}`;
		}
	});

	res.json({ jobId, message: "Download initiated successfully" });
});

// 5. Job Status Polling
app.get("/api/job/:jobId", (req, res) => {
	const job = activeJobs.get(req.params.jobId);
	if (!job) {
		return res.status(404).json({ error: "Job not found" });
	}
	res.json(job);
});

// 6. List Downloaded Files
app.get("/api/downloads", (req, res) => {
	try {
		const files = fs.readdirSync(DOWNLOADS_DIR)
			.filter(f => !f.endsWith(".part") && !f.endsWith(".ytdl") && !f.startsWith("."))
			.map(name => {
				const fullPath = path.join(DOWNLOADS_DIR, name);
				const stat = fs.statSync(fullPath);
				const ext = path.extname(name).toLowerCase();
				const isVideo = [".mp4", ".mkv", ".webm", ".avi", ".mov"].includes(ext);
				const isAudio = [".mp3", ".m4a", ".wav", ".aac", ".flac", ".opus"].includes(ext);
				return {
					name,
					size: stat.size,
					sizeStr: formatBytes(stat.size),
					createdAt: stat.mtime,
					type: isVideo ? "video" : (isAudio ? "audio" : "file"),
					url: `/api/file/${encodeURIComponent(name)}`
				};
			})
			.sort((a, b) => b.createdAt - a.createdAt);

		res.json({ files, count: files.length, folderPath: DOWNLOADS_DIR });
	} catch (err) {
		res.status(500).json({ error: "Failed to read downloads folder" });
	}
});

// 7. Stream or Download File
app.get("/api/file/:filename", (req, res) => {
	const filename = decodeURIComponent(req.params.filename);
	const filePath = path.join(DOWNLOADS_DIR, filename);

	if (!fs.existsSync(filePath)) {
		return res.status(404).send("File not found");
	}

	if (req.query.download === "true") {
		return res.download(filePath, filename);
	}

	res.sendFile(filePath);
});

// 8. Delete Downloaded File
app.delete("/api/file/:filename", (req, res) => {
	const filename = decodeURIComponent(req.params.filename);
	const filePath = path.join(DOWNLOADS_DIR, filename);

	if (!fs.existsSync(filePath)) {
		return res.status(404).json({ error: "File not found" });
	}

	try {
		fs.unlinkSync(filePath);
		res.json({ message: "File deleted successfully" });
	} catch (err) {
		res.status(500).json({ error: "Failed to delete file" });
	}
});

// 9. Open Download Folder in Windows Explorer
app.post("/api/open-downloads", (req, res) => {
	exec(`explorer.exe "${DOWNLOADS_DIR}"`, (err) => {
		if (err) {
			return res.status(500).json({ error: "Failed to open folder" });
		}
		res.json({ success: true, folder: DOWNLOADS_DIR });
	});
});

app.listen(PORT, "0.0.0.0", () => {
	console.log(`====================================================`);
	console.log(` yt.reelssaver Web Suite is LIVE on:`);
	console.log(` 👉 http://localhost:${PORT}`);
	console.log(` 👉 http://127.0.0.1:${PORT}`);
	console.log(` Downloads stored in: ${DOWNLOADS_DIR}`);
	console.log(`====================================================`);
});
