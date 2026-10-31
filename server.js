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

// Monetag Ads Publisher Service Worker
app.get("/sw.js", (req, res) => {
	res.setHeader("Service-Worker-Allowed", "/");
	res.setHeader("Content-Type", "application/javascript");
	res.setHeader("Cache-Control", "public, max-age=3600");
	const swPublic = path.join(__dirname, "public", "sw.js");
	const swRoot = path.join(__dirname, "sw.js");
	if (fs.existsSync(swPublic)) {
		return res.sendFile(swPublic);
	} else if (fs.existsSync(swRoot)) {
		return res.sendFile(swRoot);
	}
	res.status(404).send("// sw.js not found");
});

// MyBid Ads Publisher Service Worker (#2030633 Web-Push)
app.get("/8Ynqxu.js", (req, res) => {
	res.setHeader("Service-Worker-Allowed", "/");
	res.setHeader("Content-Type", "application/javascript");
	res.setHeader("Cache-Control", "public, max-age=3600");
	const pPublic = path.join(__dirname, "public", "8Ynqxu.js");
	const pRoot = path.join(__dirname, "8Ynqxu.js");
	if (fs.existsSync(pPublic)) {
		return res.sendFile(pPublic);
	} else if (fs.existsSync(pRoot)) {
		return res.sendFile(pRoot);
	}
	res.status(404).send("// 8Ynqxu.js not found");
});

app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "public"), {
	etag: false,
	lastModified: false,
	setHeaders: (res, filePath) => {
		if (filePath.endsWith(".html") || filePath.endsWith(".css") || filePath.endsWith(".js")) {
			res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
			res.setHeader("Pragma", "no-cache");
			res.setHeader("Expires", "0");
		}
	}
}));

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

// --- Apify YouTube Video Downloader Integration (Actor ID: UUhJDfKJT2SsXdclR) ---
const APIFY_CONFIG_PATH = path.join(__dirname, "apify-config.json");
const DEFAULT_APIFY_ACTOR_ID = "UUhJDfKJT2SsXdclR";

function getApifyConfig() {
	let cfg = {
		actorId: process.env.APIFY_ACTOR_ID || DEFAULT_APIFY_ACTOR_ID,
		apiToken: process.env.APIFY_API_TOKEN || process.env.APIFY_TOKEN || "",
		useApifyPrimary: true
	};

	// Check .env file if present
	const envPath = path.join(__dirname, ".env");
	if (fs.existsSync(envPath)) {
		try {
			const envContent = fs.readFileSync(envPath, "utf8");
			const tokenMatch = envContent.match(/^\s*APIFY_API_TOKEN\s*=\s*["']?([^"'\r\n]+)["']?/m) ||
				envContent.match(/^\s*APIFY_TOKEN\s*=\s*["']?([^"'\r\n]+)["']?/m);
			if (tokenMatch && tokenMatch[1] && !cfg.apiToken) {
				cfg.apiToken = tokenMatch[1].trim();
			}
			const actorMatch = envContent.match(/^\s*APIFY_ACTOR_ID\s*=\s*["']?([^"'\r\n]+)["']?/m);
			if (actorMatch && actorMatch[1]) {
				cfg.actorId = actorMatch[1].trim();
			}
		} catch (_) {}
	}

	// Check apify-config.json if present
	if (fs.existsSync(APIFY_CONFIG_PATH)) {
		try {
			const fileCfg = JSON.parse(fs.readFileSync(APIFY_CONFIG_PATH, "utf8"));
			if (fileCfg.apiToken && !cfg.apiToken) cfg.apiToken = fileCfg.apiToken.trim();
			if (fileCfg.actorId) cfg.actorId = fileCfg.actorId.trim();
			if (typeof fileCfg.useApifyPrimary === "boolean") cfg.useApifyPrimary = fileCfg.useApifyPrimary;
		} catch (_) {}
	}

	return cfg;
}

// Helper: Make HTTPS JSON requests
function httpsJsonRequest(url, options = {}, bodyObj = null) {
	return new Promise((resolve, reject) => {
		const https = require("https");
		const parsedUrl = new URL(url);
		const reqOpts = {
			hostname: parsedUrl.hostname,
			port: parsedUrl.port || 443,
			path: parsedUrl.pathname + parsedUrl.search,
			method: options.method || "GET",
			headers: {
				"User-Agent": "Mozilla/5.0 yt.reelssaver ApifyClient/1.0",
				"Accept": "application/json",
				...(options.headers || {})
			}
		};

		let payloadStr = null;
		if (bodyObj !== null) {
			payloadStr = typeof bodyObj === "string" ? bodyObj : JSON.stringify(bodyObj);
			reqOpts.headers["Content-Type"] = "application/json; charset=utf-8";
			reqOpts.headers["Content-Length"] = Buffer.byteLength(payloadStr);
		}

		const req = https.request(reqOpts, (res) => {
			let raw = "";
			res.on("data", (chunk) => { raw += chunk; });
			res.on("end", () => {
				try {
					const json = raw ? JSON.parse(raw) : {};
					if (res.statusCode >= 200 && res.statusCode < 300) {
						resolve(json);
					} else {
						const errMsg = (json && json.error && json.error.message) || raw.slice(0, 300) || `HTTP ${res.statusCode}`;
						reject(new Error(errMsg));
					}
				} catch (e) {
					if (res.statusCode >= 200 && res.statusCode < 300) {
						resolve(raw);
					} else {
						reject(new Error(`HTTP ${res.statusCode}: ${raw.slice(0, 200)}`));
					}
				}
			});
		});

		req.on("error", reject);
		if (payloadStr !== null) req.write(payloadStr);
		req.end();
	});
}

// Extract YouTube Video ID from URL
function extractYouTubeId(url) {
	try {
		const u = new URL(url);
		if (u.hostname.includes("youtu.be")) {
			return u.pathname.slice(1).split("/")[0].split("?")[0];
		}
		if (u.pathname.includes("/shorts/")) {
			return u.pathname.split("/shorts/")[1].split("/")[0].split("?")[0];
		}
		if (u.pathname.includes("/live/")) {
			return u.pathname.split("/live/")[1].split("/")[0].split("?")[0];
		}
		return u.searchParams.get("v") || "";
	} catch (_) {
		return "";
	}
}

// Fast YouTube oEmbed Metadata Extractor (Works on all Cloud VPS IPs & pairs with Apify Actor UUhJDfKJT2SsXdclR)
async function fetchYouTubeOEmbedMetadata(cleanUrl) {
	const videoId = extractYouTubeId(cleanUrl) || "youtube_video";
	let title = "YouTube Video";
	let uploader = "YouTube Creator";
	let uploaderUrl = "";
	let thumbnail = videoId !== "youtube_video" ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : "";

	try {
		const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(cleanUrl)}&format=json`;
		const oembed = await httpsJsonRequest(oembedUrl);
		if (oembed && oembed.title) title = oembed.title;
		if (oembed && oembed.author_name) uploader = oembed.author_name;
		if (oembed && oembed.author_url) uploaderUrl = oembed.author_url;
		if (oembed && oembed.thumbnail_url) thumbnail = oembed.thumbnail_url;
	} catch (_) {
		try {
			const noembedUrl = `https://noembed.com/embed?url=${encodeURIComponent(cleanUrl)}`;
			const noembed = await httpsJsonRequest(noembedUrl);
			if (noembed && noembed.title) title = noembed.title;
			if (noembed && noembed.author_name) uploader = noembed.author_name;
			if (noembed && noembed.thumbnail_url) thumbnail = noembed.thumbnail_url;
		} catch (_2) {}
	}

	// Qualities supported by Apify Actor UUhJDfKJT2SsXdclR (streamers/youtube-video-downloader)
	const videoOptions = [
		{ height: 2160, label: "2160p 4K UHD", formatId: "2160p", ext: "mp4", size: null, sizeStr: "4K Ultra HD" },
		{ height: 1440, label: "1440p 2K QHD", formatId: "1440p", ext: "mp4", size: null, sizeStr: "2K Quad HD" },
		{ height: 1080, label: "1080p Full HD", formatId: "1080p", ext: "mp4", size: null, sizeStr: "Full HD" },
		{ height: 720, label: "720p HD", formatId: "720p", ext: "mp4", size: null, sizeStr: "Standard HD" },
		{ height: 480, label: "480p SD", formatId: "480p", ext: "mp4", size: null, sizeStr: "Medium" },
		{ height: 360, label: "360p", formatId: "360p", ext: "mp4", size: null, sizeStr: "Compact" },
		{ height: 240, label: "240p", formatId: "240p", ext: "mp4", size: null, sizeStr: "Data Saver" },
		{ height: 144, label: "144p", formatId: "144p", ext: "mp4", size: null, sizeStr: "Ultra Light" }
	];

	const audioOptions = [
		{ ext: "mp3", abr: 320, label: "320 kbps (MP3)", formatId: "mp3", size: null, sizeStr: "High Quality" },
		{ ext: "m4a", abr: 256, label: "256 kbps (M4A)", formatId: "m4a", size: null, sizeStr: "Original AAC" },
		{ ext: "wav", abr: 1411, label: "Lossless (WAV)", formatId: "wav", size: null, sizeStr: "Studio WAV" },
		{ ext: "flac", abr: 1000, label: "Hi-Res (FLAC)", formatId: "flac", size: null, sizeStr: "Lossless FLAC" }
	];

	return {
		id: videoId,
		title,
		thumbnail,
		uploader,
		uploaderUrl,
		duration: 0,
		durationStr: "YouTube",
		viewCount: "YouTube",
		description: `Ready to download via Apify YouTube Video Downloader (${DEFAULT_APIFY_ACTOR_ID})`,
		webpageUrl: cleanUrl,
		videoOptions,
		audioOptions
	};
}

// Run Apify Actor UUhJDfKJT2SsXdclR (streamers/youtube-video-downloader) for a Download Job
async function runApifyDownloadJob(jobState, { cleanUrl, isAudio, quality, customExt, apifyToken, actorId }) {
	try {
		const validQualities = ["144p", "240p", "360p", "480p", "720p", "1080p", "1440p", "2160p"];
		let preferredQuality = "720p";
		if (quality) {
			const qStr = String(quality).endsWith("p") ? String(quality) : `${quality}p`;
			if (validQualities.includes(qStr)) {
				preferredQuality = qStr;
			}
		}

		const preferredFormat = isAudio ? (customExt || "mp3") : (customExt || "mp4");

		// Exact input payload for Actor UUhJDfKJT2SsXdclR
		const actorInput = {
			videos: [{ url: cleanUrl }],
			storeInKVStore: true,
			preferredQuality,
			preferredFormat,
			filenameTemplateParts: ["title"],
			transcriptionAndSubtitle: "NONE"
		};

		jobState.status = "downloading";
		jobState.progress = 12;
		jobState.speed = "Starting Apify Actor...";
		jobState.eta = "Processing";

		const startUrl = `https://api.apify.com/v2/acts/${encodeURIComponent(actorId)}/runs?token=${encodeURIComponent(apifyToken)}`;
		const startRes = await httpsJsonRequest(startUrl, { method: "POST" }, actorInput);
		const runData = startRes && startRes.data;

		if (!runData || !runData.id) {
			throw new Error("Could not start Apify Actor run. Please check your Apify API Token.");
		}

		const runId = runData.id;
		const defaultDatasetId = runData.defaultDatasetId;
		const defaultKeyValueStoreId = runData.defaultKeyValueStoreId;

		console.log(`[Job ${jobState.id}] Apify Actor ${actorId} Run started: ${runId}`);

		// Poll Apify run until SUCCEEDED or FAILED
		let runFinished = false;
		let finalRunInfo = runData;
		let pollCount = 0;

		while (!runFinished && pollCount < 180) {
			await new Promise(r => setTimeout(r, 2500));
			pollCount++;

			const statusUrl = `https://api.apify.com/v2/actor-runs/${encodeURIComponent(runId)}?token=${encodeURIComponent(apifyToken)}`;
			const statusRes = await httpsJsonRequest(statusUrl);
			finalRunInfo = (statusRes && statusRes.data) || finalRunInfo;

			const runStatus = finalRunInfo.status;
			if (runStatus === "SUCCEEDED") {
				runFinished = true;
				break;
			} else if (["FAILED", "ABORTED", "TIMED-OUT"].includes(runStatus)) {
				throw new Error(`Apify Actor run ${runStatus}: ${finalRunInfo.statusMessage || "Unable to download video"}`);
			} else {
				// Smooth progress increment up to 85% while Apify downloads & converts
				jobState.progress = Math.min(85, 15 + pollCount * 4);
				jobState.speed = finalRunInfo.statusMessage || "Apify Cloud Downloading...";
			}
		}

		if (!runFinished) {
			throw new Error("Apify Actor run timed out.");
		}

		jobState.progress = 90;
		jobState.speed = "Fetching converted media...";

		// 1. Check Dataset items for downloadedFileUrl / videoOnlyUrl / audioOnlyUrl
		let remoteMediaUrl = null;
		let remoteFileKey = null;

		if (defaultDatasetId) {
			const dsUrl = `https://api.apify.com/v2/datasets/${encodeURIComponent(defaultDatasetId)}/items?token=${encodeURIComponent(apifyToken)}`;
			const items = await httpsJsonRequest(dsUrl);
			if (Array.isArray(items) && items.length > 0) {
				const item = items[0];
				remoteFileKey = item.fileKey || null;
				if (item.downloadedFileUrl) {
					remoteMediaUrl = item.downloadedFileUrl;
				} else if (isAudio && item.audioOnlyUrl) {
					remoteMediaUrl = item.audioOnlyUrl;
				} else if (item.videoOnlyUrl) {
					remoteMediaUrl = item.videoOnlyUrl;
				} else if (item.audioOnlyUrl) {
					remoteMediaUrl = item.audioOnlyUrl;
				}
			}
		}

		// 2. If not in dataset or if stored in Apify Key-Value Store, check KV store keys
		if (!remoteMediaUrl && defaultKeyValueStoreId) {
			const kvKeysUrl = `https://api.apify.com/v2/key-value-stores/${encodeURIComponent(defaultKeyValueStoreId)}/keys?token=${encodeURIComponent(apifyToken)}`;
			const kvRes = await httpsJsonRequest(kvKeysUrl);
			const items = (kvRes && kvRes.data && kvRes.data.items) || [];
			const mediaItem = items.find(k => k.key !== "INPUT" && !k.key.startsWith("SDK_"));
			if (mediaItem) {
				remoteFileKey = mediaItem.key;
				remoteMediaUrl = `https://api.apify.com/v2/key-value-stores/${encodeURIComponent(defaultKeyValueStoreId)}/records/${encodeURIComponent(mediaItem.key)}?token=${encodeURIComponent(apifyToken)}`;
			}
		}

		if (!remoteMediaUrl) {
			throw new Error("Apify Actor finished, but no media URL was returned in dataset or KV store.");
		}

		// Save file locally into DOWNLOADS_DIR so /api/file/:filename works seamlessly
		const videoId = extractYouTubeId(cleanUrl) || Date.now();
		const safeExt = preferredFormat.replace(/[^a-z0-9]/gi, "") || (isAudio ? "mp3" : "mp4");
		const rawName = remoteFileKey ? path.basename(remoteFileKey) : `youtube_${videoId}_${preferredQuality}.${safeExt}`;
		const finalFilename = rawName.includes(".") ? rawName.replace(/[<>:"/\\|?*]+/g, "_") : `${rawName.replace(/[<>:"/\\|?*]+/g, "_")}.${safeExt}`;
		const destPath = path.join(DOWNLOADS_DIR, finalFilename);

		jobState.status = "processing";
		jobState.progress = 95;
		jobState.speed = "Saving file to server...";
		jobState.directUrl = remoteMediaUrl;

		try {
			await downloadBinaryStream(remoteMediaUrl, destPath);
			jobState.filename = finalFilename;
			jobState.filePath = destPath;
			console.log(`[Job ${jobState.id}] Apify download saved to: ${destPath}`);
		} catch (streamErr) {
			console.warn(`[Job ${jobState.id}] Direct URL mode active:`, streamErr.message);
		}

		jobState.status = "completed";
		jobState.progress = 100;
		jobState.speed = "Completed";
		jobState.eta = "00:00";
		return true;
	} catch (err) {
		console.error(`[Job ${jobState.id}] Apify Error:`, err.message);
		throw err;
	}
}

// --- URL Sanitization & Cloud VPS Bypass Utilities ---

// Normalize YouTube, Shorts, and mobile share links to clean canonical URLs
function sanitizeMediaUrl(rawUrl) {
	if (!rawUrl || typeof rawUrl !== "string") return "";
	let clean = rawUrl.trim();
	try {
		const u = new URL(clean);
		const host = u.hostname.toLowerCase();

		// youtu.be/<id>?si=...
		if (host.includes("youtu.be")) {
			const id = u.pathname.slice(1).split("/")[0].split("?")[0];
			if (id) return `https://www.youtube.com/watch?v=${id}`;
		}

		// youtube.com / m.youtube.com
		if (host.includes("youtube.com")) {
			// /shorts/<id>
			if (u.pathname.includes("/shorts/")) {
				const id = u.pathname.split("/shorts/")[1].split("/")[0].split("?")[0];
				if (id) return `https://www.youtube.com/watch?v=${id}`;
			}
			// /live/<id>
			if (u.pathname.includes("/live/")) {
				const id = u.pathname.split("/live/")[1].split("/")[0].split("?")[0];
				if (id) return `https://www.youtube.com/watch?v=${id}`;
			}
			// /watch?v=<id>
			const v = u.searchParams.get("v");
			if (v) {
				return `https://www.youtube.com/watch?v=${v}`;
			}
		}
	} catch (e) {}
	return clean;
}

// Common yt-dlp arguments that prevent bot blocks on Cloud VPS / Datacenter IPs
function getCommonYtDlpArgs(url) {
	const args = [
		"--no-playlist",
		"--force-ipv4",
		"--no-check-certificates",
		"--geo-bypass",
		"--socket-timeout", "30",
		"--user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
		"--add-header", "Accept-Language: en-US,en;q=0.9"
	];

	// Cookies support: check if cookies.txt exists in project root
	const cookiesCandidates = [
		path.join(__dirname, "cookies.txt"),
		path.join(process.cwd(), "cookies.txt"),
		path.join(os.homedir(), ".ytDownloader", "cookies.txt")
	];
	for (const cPath of cookiesCandidates) {
		if (fs.existsSync(cPath) && fs.statSync(cPath).size > 10) {
			args.push("--cookies", cPath);
			break;
		}
	}

	return args;
}

// Multi-Tier Video Metadata Extraction (Tier 1: Comprehensive Standard, Tier 2: TV Embedded Bot-Bypass, Tier 3: Android Client)
function extractVideoInfoWithRetry(ytdlpBin, cleanUrl, ffmpegBin) {
	return new Promise((resolve, reject) => {
		const isYouTube = cleanUrl.toLowerCase().includes("youtu");

		// Tier 1: Comprehensive standard extraction with IPv4 & clean headers (returns full 4K, 1080p, 720p & audio)
		const tier1Args = [
			"--dump-single-json",
			...getCommonYtDlpArgs(cleanUrl)
		];
		if (ffmpegBin && fs.existsSync(ffmpegBin)) tier1Args.unshift("--ffmpeg-location", ffmpegBin);
		tier1Args.push(cleanUrl);

		execFile(ytdlpBin, tier1Args, { maxBuffer: 40 * 1024 * 1024 }, (err1, stdout1, stderr1) => {
			if (!err1 && stdout1) {
				try {
					return resolve(JSON.parse(stdout1));
				} catch (_) {}
			}

			console.warn("[Tier 1 Extraction Failed]", (stderr1 || (err1 && err1.message) || "").slice(0, 200));

			if (!isYouTube) {
				return reject(new Error(stderr1 || (err1 && err1.message) || "Extraction failed"));
			}

			// Tier 2: TV Embedded client (proven bypass for VPS/cloud datacenter IP bot detection & HTTP 429)
			const tier2Args = [
				"--dump-single-json",
				...getCommonYtDlpArgs(cleanUrl),
				"--extractor-args", "youtube:player_client=tv_embedded",
				cleanUrl
			];
			if (ffmpegBin && fs.existsSync(ffmpegBin)) tier2Args.unshift("--ffmpeg-location", ffmpegBin);

			execFile(ytdlpBin, tier2Args, { maxBuffer: 40 * 1024 * 1024 }, (err2, stdout2, stderr2) => {
				if (!err2 && stdout2) {
					try {
						return resolve(JSON.parse(stdout2));
					} catch (_) {}
				}

				console.warn("[Tier 2 Extraction Failed]", (stderr2 || (err2 && err2.message) || "").slice(0, 200));

				// Tier 3: Android client fallback
				const tier3Args = [
					"--dump-single-json",
					...getCommonYtDlpArgs(cleanUrl),
					"--extractor-args", "youtube:player_client=android,web",
					cleanUrl
				];
				if (ffmpegBin && fs.existsSync(ffmpegBin)) tier3Args.unshift("--ffmpeg-location", ffmpegBin);

				execFile(ytdlpBin, tier3Args, { maxBuffer: 40 * 1024 * 1024 }, (err3, stdout3, stderr3) => {
					if (!err3 && stdout3) {
						try {
							return resolve(JSON.parse(stdout3));
						} catch (_) {}
					}
					const finalErr = stderr2 || stderr1 || stderr3 || (err1 && err1.message) || "Failed to extract video details.";
					return reject(new Error(finalErr));
				});
			});
		});
	});
}

// --- API Endpoints ---

// 0. Apify Configuration Status & Setup Endpoint (Actor ID: UUhJDfKJT2SsXdclR)
app.get("/api/apify-config", (req, res) => {
	const cfg = getApifyConfig();
	res.json({
		actorId: cfg.actorId,
		actorConsoleUrl: `https://console.apify.com/actors/${cfg.actorId}/input?addFromActorId=${cfg.actorId}`,
		hasApiToken: Boolean(cfg.apiToken && cfg.apiToken.length > 5),
		useApifyPrimary: cfg.useApifyPrimary
	});
});

app.post("/api/apify-config", (req, res) => {
	const { apiToken, actorId, useApifyPrimary } = req.body || {};
	const current = getApifyConfig();
	const updated = {
		actorId: (actorId || current.actorId || DEFAULT_APIFY_ACTOR_ID).trim(),
		actorName: "streamers/youtube-video-downloader",
		actorConsoleUrl: `https://console.apify.com/actors/${(actorId || current.actorId || DEFAULT_APIFY_ACTOR_ID).trim()}/input?addFromActorId=${(actorId || current.actorId || DEFAULT_APIFY_ACTOR_ID).trim()}`,
		apiToken: typeof apiToken === "string" ? apiToken.trim() : current.apiToken,
		useApifyPrimary: typeof useApifyPrimary === "boolean" ? useApifyPrimary : current.useApifyPrimary,
		defaultQuality: "720p",
		defaultFormat: "mp4"
	};

	try {
		fs.writeFileSync(APIFY_CONFIG_PATH, JSON.stringify(updated, null, 2), "utf8");
		res.json({
			success: true,
			message: "Apify YouTube Video Downloader configuration saved.",
			actorId: updated.actorId,
			hasApiToken: Boolean(updated.apiToken)
		});
	} catch (e) {
		res.status(500).json({ success: false, error: e.message });
	}
});

// 1. Health & Status
app.get("/api/status", async (req, res) => {
	let ytdlpBin = findExistingYtDlp();
	const ffmpegBin = getFfmpegPath();
	const apifyCfg = getApifyConfig();

	if (!ytdlpBin && !apifyCfg.apiToken) {
		return res.json({
			status: "initializing",
			message: "yt-dlp binary is currently initializing or downloading",
			platform: process.platform,
			port: PORT
		});
	}

	if (!ytdlpBin) {
		return res.json({
			status: "online",
			engine: "apify",
			apifyActorId: apifyCfg.actorId,
			platform: process.platform,
			port: PORT,
			activeJobs: activeJobs.size
		});
	}

	execFile(ytdlpBin, ["--version"], (err, stdout) => {
		const version = stdout ? stdout.trim() : (err ? "Unavailable: " + err.message : "Ready");
		res.json({
			status: "online",
			engine: apifyCfg.apiToken && apifyCfg.useApifyPrimary ? "apify+ytdlp" : "ytdlp",
			apifyActorId: apifyCfg.actorId,
			apifyTokenConfigured: Boolean(apifyCfg.apiToken),
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

// Admin / Binary Auto-Updater (keeps yt-dlp updated against YouTube changes)
app.get("/api/update-ytdlp", async (req, res) => {
	try {
		const bin = await ensureYtDlp();
		execFile(bin, ["-U"], (err, stdout, stderr) => {
			if (err) {
				return res.json({ success: false, error: stderr || err.message });
			}
			res.json({ success: true, output: stdout.trim() });
		});
	} catch (e) {
		res.status(500).json({ success: false, error: e.message });
	}
});

// 2. Inspect Video / Playlist Metadata (Apify + oEmbed + Multi-Tier yt-dlp Fallback)
app.post("/api/info", async (req, res) => {
	const { url } = req.body;
	if (!url || typeof url !== "string") {
		return res.status(400).json({ error: "Valid URL is required." });
	}

	const cleanUrl = sanitizeMediaUrl(url);
	const apifyCfg = getApifyConfig();

	// If Apify primary mode is enabled with an API token, return instant oEmbed metadata + Apify formats
	if (apifyCfg.useApifyPrimary && apifyCfg.apiToken) {
		try {
			const meta = await fetchYouTubeOEmbedMetadata(cleanUrl);
			return res.json(meta);
		} catch (oembedErr) {
			console.warn("[Apify oEmbed Warning]", oembedErr.message);
		}
	}

	let ytdlpBin = null;
	try {
		ytdlpBin = await ensureYtDlp();
	} catch (_) {}

	const ffmpegBin = getFfmpegPath();

	if (ytdlpBin) {
		try {
			const data = await extractVideoInfoWithRetry(ytdlpBin, cleanUrl, ffmpegBin);

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

			return res.json({
				id: data.id,
				title: data.title || "Untitled Video",
				thumbnail: data.thumbnail || (data.thumbnails && data.thumbnails.length ? data.thumbnails[data.thumbnails.length - 1].url : ""),
				uploader: data.uploader || data.channel || "YouTube Creator",
				uploaderUrl: data.uploader_url || data.channel_url || "",
				duration: data.duration,
				durationStr: formatDuration(data.duration),
				viewCount: data.view_count ? data.view_count.toLocaleString() : "N/A",
				description: (data.description || "").slice(0, 300),
				webpageUrl: cleanUrl,
				videoOptions,
				audioOptions
			});
		} catch (err) {
			console.warn("[yt-dlp Info Fallback to oEmbed/Apify]:", err.message);
		}
	}

	// Universal fallback to YouTube oEmbed + Apify Actor UUhJDfKJT2SsXdclR qualities
	try {
		const fallbackMeta = await fetchYouTubeOEmbedMetadata(cleanUrl);
		return res.json(fallbackMeta);
	} catch (err) {
		res.status(500).json({
			error: "Failed to extract metadata. Please verify the URL or try another video.",
			details: (err.message || "").slice(0, 500)
		});
	}
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

// 4. Start Download Job (Apify Actor UUhJDfKJT2SsXdclR + yt-dlp Engine)
app.post("/api/download", async (req, res) => {
	const { url, type, quality, customExt } = req.body;
	if (!url) {
		return res.status(400).json({ error: "URL is required" });
	}

	const cleanUrl = sanitizeMediaUrl(url);
	const apifyCfg = getApifyConfig();
	const jobId = "job_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
	const isAudio = type === "audio";

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
		directUrl: null,
		error: null,
		createdAt: new Date().toISOString()
	};

	activeJobs.set(jobId, jobState);

	// Primary Path: Use Apify Actor UUhJDfKJT2SsXdclR if API Token is configured
	if (apifyCfg.apiToken && apifyCfg.useApifyPrimary) {
		res.json({ jobId, engine: "apify", actorId: apifyCfg.actorId, message: "Apify download initiated" });
		runApifyDownloadJob(jobState, {
			cleanUrl,
			isAudio,
			quality,
			customExt,
			apifyToken: apifyCfg.apiToken,
			actorId: apifyCfg.actorId
		}).catch((apifyErr) => {
			console.warn(`[Job ${jobId}] Apify failed, attempting yt-dlp fallback:`, apifyErr.message);
			startYtDlpFallback(jobState, { cleanUrl, isAudio, quality, customExt, apifyErr });
		});
		return;
	}

	// Secondary Path: Use yt-dlp (with Apify fallback if token exists)
	res.json({ jobId, engine: "ytdlp", message: "Download initiated successfully" });
	startYtDlpFallback(jobState, { cleanUrl, isAudio, quality, customExt, apifyErr: null });
});

async function startYtDlpFallback(jobState, { cleanUrl, isAudio, quality, customExt, apifyErr }) {
	const jobId = jobState.id;
	let ytdlpBin;
	try {
		ytdlpBin = await ensureYtDlp();
	} catch (e) {
		jobState.status = "failed";
		jobState.error = apifyErr ? apifyErr.message : "Download engine is initializing. Please retry in 10-15 seconds.";
		return;
	}

	const ffmpegBin = getFfmpegPath();
	const outputTemplate = path.join(DOWNLOADS_DIR, "%(title).100B [%(id)s].%(ext)s");

	const args = [
		"--newline",
		"--no-mtime",
		"-o", outputTemplate,
		...getCommonYtDlpArgs(cleanUrl)
	];

	if (ffmpegBin && (fs.existsSync(ffmpegBin) || ffmpegBin === "ffmpeg")) {
		if (fs.existsSync(ffmpegBin)) {
			args.unshift("--ffmpeg-location", ffmpegBin);
		}
	}

	if (isAudio) {
		args.push("-x");
		const audioExt = customExt || "mp3";
		args.push("--audio-format", audioExt);
		args.push("--audio-quality", "0");
	} else {
		if (quality) {
			args.push("-f", `bestvideo[height<=${quality}]+bestaudio/best[height<=${quality}]/best`);
		} else {
			args.push("-f", "bestvideo+bestaudio/best");
		}
		args.push("--merge-output-format", "mp4");
	}

	args.push(cleanUrl);
	console.log(`[Job ${jobId}] Starting yt-dlp download:`, args.join(" "));

	const proc = spawn(ytdlpBin, args);

	proc.stdout.on("data", (chunk) => {
		const text = chunk.toString();
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
			const apifyCfg = getApifyConfig();
			jobState.status = "failed";
			if (!apifyCfg.apiToken) {
				jobState.error = (jobState.error || `Download failed (code ${code})`) + " — Tip: Set APIFY_API_TOKEN in apify-config.json or .env to use Apify Actor UUhJDfKJT2SsXdclR.";
			} else {
				jobState.error = apifyErr ? apifyErr.message : (jobState.error || `Download failed with process code ${code}`);
			}
		}
	});
}

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
