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
      <image:title>yt.reelssaver - Download YouTube Videos Now &amp; YouTube Shorts Downloader (4K MP4 &amp; MP3)</image:title>
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

// Locate or auto-install yt-dlp binary (Cross-Platform for Linux / Windows / Mac)
const BIN_DIR = path.join(__dirname, "bin");
if (!fs.existsSync(BIN_DIR)) {
	fs.mkdirSync(BIN_DIR, { recursive: true });
}

const YTDLP_EXE_NAME = process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp";
const LOCAL_YTDLP_PATH = path.join(BIN_DIR, YTDLP_EXE_NAME);

function findExistingYtDlp() {
	if (process.env.YTDLP_PATH && fs.existsSync(process.env.YTDLP_PATH)) {
		return process.env.YTDLP_PATH;
	}

	if (fs.existsSync(LOCAL_YTDLP_PATH)) {
		try {
			if (fs.statSync(LOCAL_YTDLP_PATH).size > 500000) {
				if (process.platform !== "win32") {
					fs.chmodSync(LOCAL_YTDLP_PATH, 0o755);
				}
				return LOCAL_YTDLP_PATH;
			}
		} catch (_) {}
	}

	const rootBin = path.join(__dirname, YTDLP_EXE_NAME);
	if (fs.existsSync(rootBin)) {
		try {
			if (fs.statSync(rootBin).size > 500000) {
				if (process.platform !== "win32") {
					fs.chmodSync(rootBin, 0o755);
				}
				return rootBin;
			}
		} catch (_) {}
	}

	const homeBin = path.join(os.homedir(), ".ytDownloader", YTDLP_EXE_NAME);
	if (fs.existsSync(homeBin)) {
		try {
			if (fs.statSync(homeBin).size > 500000) {
				return homeBin;
			}
		} catch (_) {}
	}

	if (process.platform !== "win32") {
		const linuxCandidates = [
			"/usr/local/bin/yt-dlp",
			"/usr/bin/yt-dlp",
			path.join(os.homedir(), ".local", "bin", "yt-dlp")
		];
		for (const p of linuxCandidates) {
			if (fs.existsSync(p)) return p;
		}
	}

	try {
		const checkCmd = process.platform === "win32" ? "where yt-dlp" : "which yt-dlp";
		const out = require("child_process").execSync(checkCmd, { stdio: "pipe" }).toString().trim();
		if (out) {
			const firstLine = out.split("\n")[0].trim();
			if (fs.existsSync(firstLine)) return firstLine;
			return "yt-dlp";
		}
	} catch (_) {}

	return null;
}

function downloadBinaryStream(url, dest) {
	return new Promise((resolve, reject) => {
		const client = url.startsWith("https") ? require("https") : require("http");
		const req = client.get(url, { headers: { "User-Agent": "Mozilla/5.0 yt.reelssaver" } }, (res) => {
			if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
				return resolve(downloadBinaryStream(res.headers.location, dest));
			}
			if (res.statusCode !== 200) {
				return reject(new Error(`Failed to download binary: HTTP ${res.statusCode}`));
			}
			const file = fs.createWriteStream(dest);
			res.pipe(file);
			file.on("finish", () => {
				file.close(() => resolve(dest));
			});
			file.on("error", (err) => {
				fs.unlink(dest, () => reject(err));
			});
		});
		req.on("error", reject);
	});
}

let ytdlpInitPromise = null;

async function ensureYtDlp() {
	const existing = findExistingYtDlp();
	if (existing) return existing;

	if (ytdlpInitPromise) return ytdlpInitPromise;

	ytdlpInitPromise = (async () => {
		console.log(`[Auto-Installer] yt-dlp is missing on this server.`);
		console.log(`[Auto-Installer] Downloading official standalone yt-dlp binary for ${process.platform}...`);

		let downloadUrl = "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp";
		if (process.platform === "win32") {
			downloadUrl = "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe";
		} else if (process.platform === "darwin") {
			downloadUrl = "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_macos";
		}

		try {
			let downloaded = false;
			try {
				const YTDlpWrap = require("yt-dlp-wrap-plus").default;
				if (YTDlpWrap && typeof YTDlpWrap.downloadFromGithub === "function") {
					await YTDlpWrap.downloadFromGithub(LOCAL_YTDLP_PATH);
					downloaded = true;
				}
			} catch (wrapErr) {
				console.warn("[Auto-Installer] yt-dlp-wrap-plus download failed, falling back to direct stream:", wrapErr.message);
			}

			if (!downloaded) {
				await downloadBinaryStream(downloadUrl, LOCAL_YTDLP_PATH);
			}

			if (process.platform !== "win32") {
				fs.chmodSync(LOCAL_YTDLP_PATH, 0o755);
			}

			console.log(`[Auto-Installer] yt-dlp binary ready at: ${LOCAL_YTDLP_PATH}`);
			return LOCAL_YTDLP_PATH;
		} catch (err) {
			ytdlpInitPromise = null;
			console.error("[Auto-Installer Error]", err.message);
			throw err;
		}
	})();

	return ytdlpInitPromise;
}

// Locate ffmpeg binary
function getFfmpegPath() {
	if (process.env.FFMPEG_PATH && fs.existsSync(process.env.FFMPEG_PATH)) {
		return process.env.FFMPEG_PATH;
	}
	const candidates = [
		"/usr/bin/ffmpeg",
		"/usr/local/bin/ffmpeg",
		"/snap/bin/ffmpeg",
		path.join(__dirname, "ffmpeg", "bin", "ffmpeg.exe"),
		path.join(__dirname, "bin", "ffmpeg.exe"),
		path.join(__dirname, "bin", "ffmpeg"),
		"C:\\Users\\VICTUS\\AppData\\Local\\Python\\pythoncore-3.14-64\\Lib\\site-packages\\imageio_ffmpeg\\binaries\\ffmpeg-win-x86_64-v7.1.exe"
	];
	for (const p of candidates) {
		if (fs.existsSync(p)) return p;
	}
	return "ffmpeg";
}

// Background auto-initialization at start
ensureYtDlp()
	.then(p => console.log("[ytDownloader Web] Active yt-dlp path:", p))
	.catch(e => console.warn("[ytDownloader Web] Auto-download pending:", e.message));

console.log("[ytDownloader Web] Active ffmpeg path:", getFfmpegPath());

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
	let ytdlpBin = findExistingYtDlp();
	const ffmpegBin = getFfmpegPath();

	if (!ytdlpBin) {
		return res.json({
			status: "initializing",
			message: "yt-dlp binary is currently initializing or downloading",
			platform: process.platform,
			port: PORT
		});
	}

	execFile(ytdlpBin, ["--version"], (err, stdout) => {
		const version = stdout ? stdout.trim() : (err ? "Unavailable: " + err.message : "Ready");
		res.json({
			status: "online",
			platform: process.platform,
			port: PORT,
			ytdlpVersion: version,
			ytdlpPath: ytdlpBin,
			ffmpegPath: ffmpegBin,
			activeJobs: activeJobs.size,
			downloadsCount: fs.existsSync(DOWNLOADS_DIR) ? fs.readdirSync(DOWNLOADS_DIR).filter(f => !f.endsWith(".part") && !f.endsWith(".ytdl")).length : 0
		});
	});
});

// Admin / Manual binary trigger
app.get("/api/install-ytdlp", async (req, res) => {
	try {
		const bin = await ensureYtDlp();
		res.json({ success: true, message: "yt-dlp is ready", path: bin });
	} catch (e) {
		res.status(500).json({ success: false, error: e.message });
	}
});

// 2. Inspect Video / Playlist Metadata
app.post("/api/info", async (req, res) => {
	const { url } = req.body;
	if (!url || typeof url !== "string") {
		return res.status(400).json({ error: "Valid URL is required." });
	}

	let ytdlpBin;
	try {
		ytdlpBin = await ensureYtDlp();
	} catch (dlErr) {
		return res.status(503).json({
			error: "Download engine (yt-dlp) is currently initializing on the server. Please retry in 10-15 seconds.",
			details: dlErr.message
		});
	}

	const ffmpegBin = getFfmpegPath();
	const args = [
		"--dump-single-json",
		"--no-playlist",
		"--js-runtimes", "node",
		url.trim()
	];

	if (ffmpegBin && (fs.existsSync(ffmpegBin) || ffmpegBin === "ffmpeg")) {
		if (fs.existsSync(ffmpegBin)) {
			args.unshift("--ffmpeg-location", ffmpegBin);
		}
	}

	execFile(ytdlpBin, args, { maxBuffer: 30 * 1024 * 1024 }, (err, stdout, stderr) => {
		if (err) {
			console.error("[Info Error]", stderr || err.message);
			if (err.code === "ENOENT") {
				return res.status(500).json({
					error: "yt-dlp binary was not found or lacks execute permissions. Please ensure yt-dlp is installed on your Linux VPS (sudo wget https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -O /usr/local/bin/yt-dlp && sudo chmod a+rx /usr/local/bin/yt-dlp).",
					details: err.message
				});
			}
			return res.status(500).json({
				error: "Failed to extract metadata. Please verify the URL or try another video.",
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
app.post("/api/search", async (req, res) => {
	const { query } = req.body;
	if (!query || typeof query !== "string") {
		return res.status(400).json({ error: "Search query is required." });
	}

	let ytdlpBin;
	try {
		ytdlpBin = await ensureYtDlp();
	} catch (e) {
		return res.status(503).json({ error: "Download engine is initializing. Please retry in 10-15 seconds." });
	}

	const args = [
		`ytsearch8:${query.trim()}`,
		"--dump-single-json",
		"--flat-playlist",
		"--js-runtimes", "node"
	];

	execFile(ytdlpBin, args, { maxBuffer: 20 * 1024 * 1024 }, (err, stdout) => {
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
app.post("/api/download", async (req, res) => {
	const { url, type, quality, customExt } = req.body;
	if (!url) {
		return res.status(400).json({ error: "URL is required" });
	}

	let ytdlpBin;
	try {
		ytdlpBin = await ensureYtDlp();
	} catch (e) {
		return res.status(503).json({ error: "Download engine is initializing. Please retry in 10-15 seconds." });
	}

	const ffmpegBin = getFfmpegPath();
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

	if (ffmpegBin && (fs.existsSync(ffmpegBin) || ffmpegBin === "ffmpeg")) {
		if (fs.existsSync(ffmpegBin)) {
			args.push("--ffmpeg-location", ffmpegBin);
		}
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

	const proc = spawn(ytdlpBin, args);

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
