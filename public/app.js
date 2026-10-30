// ytDownloader Pro - Client Application Logic (Direct 1-Click Video & Audio Downloads + Ad-Ready UX)
document.addEventListener("DOMContentLoaded", () => {
  // English Translations Dictionary for Content & Formats
  const translations = {
    en: {
      brandSub: "Free YouTube Video & Shorts Downloader Suite",
      heroTitle: "Download YouTube Videos Now",
      heroSubtitle: "Fast & Free YouTube Video & Shorts Downloader in 4K MP4 & 320kbps MP3",
      inputPlaceholder: "Paste YouTube or Shorts link (e.g. https://www.youtube.com/watch?v=...)",
      pasteBtn: "Paste",
      downloadBtn: "Download",
      quickSamples: "Sample Links:",
      analyzingTitle: "Analyzing Video Details...",
      analyzingSub: "Extracting video qualities, resolutions, and audio formats with yt-dlp",
      videoTab: "Video (MP4)",
      audioTab: "Audio (MP3 / M4A)",
      selectVideoRes: "Select Video Quality:",
      selectAudioFmt: "Select Audio Format & Quality:",
      downloadNowVideo: "Download Video (MP4)",
      downloadNowAudio: "Download Audio (MP3 / M4A)",
      speed: "Speed:",
      eta: "ETA:",
      size: "Size:",
      connecting: "Connecting to server...",
      downloadingVideo: "Downloading Video...",
      downloadingAudio: "Downloading Audio...",
      merging: "Merging & Finalizing format with FFmpeg...",
      downloadSuccess: "Download Finished Successfully!",
      saveFile: "Save File Now",
      pastedToast: "Pasted URL from clipboard",
      clipboardError: "Unable to read clipboard. Please paste manually.",
      howHeading: "How to Download YouTube Videos?",
      howSubheading: "Save any YouTube video or Shorts to your device in 3 easy steps",
      step1Title: "Copy Video Link",
      step1Desc: "Copy the link (URL) of the video or Shorts from YouTube.",
      step2Title: "Paste & Select Quality",
      step2Desc: "Paste the URL into the input field above, click Download, and choose 4K, 1080p, or MP3.",
      step3Title: "Download & Save",
      step3Desc: "Once processed, the file is saved directly to your device ready for offline playback.",
      featuresHeading: "Key Features",
      featuresSubheading: "Fast, safe, and unlimited media downloading suite",
      feat1Title: "Ultra Fast Speed",
      feat1Desc: "High-speed multi-threaded downloading engine fetches videos in mere seconds.",
      feat2Title: "4K & Full HD Support",
      feat2Desc: "Supports 4K UHD, 1440p, 1080p 60fps, and 720p HD resolution downloads.",
      feat3Title: "Audio MP3 Extractor",
      feat3Desc: "Extract crystal clear 320kbps MP3 or M4A audio from any video source.",
      feat4Title: "All Devices Supported",
      feat4Desc: "Flawlessly responsive on Mobile (Android & iOS), Tablet, and Desktop PCs.",
      feat5Title: "100% Safe & Ad-Free",
      feat5Desc: "No intrusive pop-ups, no tracking, and no malware. Completely private.",
      feat6Title: "Free & Unlimited",
      feat6Desc: "No subscriptions, no registration required. Download as many videos as you want.",
      platformsHeading: "Supported Platforms",
      platformsSubheading: "Download videos and audio from popular media websites",
      faqHeading: "Frequently Asked Questions (FAQ)",
      faqSubheading: "Find answers to common questions about yt.reelssaver",
      footerDesc: "The trusted online platform to download YouTube videos and Shorts in 4K MP4 and 320kbps MP3.",
      formatsHeading: "Formats",
      policyHeading: "Policies & Legal",
      privacyLink: "Privacy Policy",
      termsLink: "Terms of Service",
      dmcaLink: "Copyright & DMCA",
      contactLink: "Contact Us",
      disclaimer: "This tool is for personal and educational use only. Please respect all copyright laws and intellectual property rights."
    }
  };

  // Policy Modal Content Data
  const policyDocs = {
    privacy: {
      title: "Privacy Policy",
      content: `
        <h4>1. Information We Do Not Collect</h4>
        <p>yt.reelssaver (ReelsSaver) values user privacy. We do not require registration, login, email addresses, or personal information. We do not track your downloads, IP address history, or browsing habits.</p>
        <h4>2. Data Processing</h4>
        <p>When you enter a URL, it is processed locally through yt-dlp to retrieve format options and download media. All file transfers occur directly between your device and the target media host.</p>
        <h4>3. Cookies and Local Storage</h4>
        <p>We use standard browser local storage solely to remember user preferences. No tracking cookies or invasive advertising cookies are utilized.</p>
        <h4>4. Security</h4>
        <p>Our web server operates strictly on a clean environment without any spyware or malware.</p>
      `
    },
    terms: {
      title: "Terms of Service",
      content: `
        <h4>1. Acceptance of Terms</h4>
        <p>By using yt.reelssaver (ReelsSaver), you acknowledge and agree to comply with these Terms of Service and all applicable local, national, and international laws.</p>
        <h4>2. Permitted Use</h4>
        <p>This service is provided strictly for personal, non-commercial, and educational backup purposes. You agree not to distribute or monetize copyrighted content obtained through this service without authorization from the copyright holder.</p>
        <h4>3. Disclaimer of Warranties</h4>
        <p>yt.reelssaver is provided on an "as-is" and "as-available" basis without warranties of any kind. We do not host or store any media on public third-party servers.</p>
      `
    },
    dmca: {
      title: "Copyright & DMCA Disclaimer",
      content: `
        <h4>1. Respect for Intellectual Property</h4>
        <p>yt.reelssaver (ReelsSaver) strictly respects the intellectual property rights of content creators, musicians, and artists worldwide.</p>
        <h4>2. Non-Hosting Notice</h4>
        <p>This web service does not host, upload, or index any copyrighted audio or video files. All media is fetched in real-time from original sources using open-source utilities (yt-dlp).</p>
        <h4>3. DMCA Inquiries</h4>
        <p>If you believe your content is being processed without authorization, you may contact our administrative support for inquiries.</p>
      `
    },
    contact: {
      title: "Contact & Support",
      content: `
        <h4>Contact Us</h4>
        <p>Have questions, suggestions, or need technical assistance with yt.reelssaver? Feel free to reach out to our team:</p>
        <ul>
          <li><strong>Email:</strong> support@reelssaver.local</li>
          <li><strong>Engine Status:</strong> yt-dlp & FFmpeg High Speed</li>
        </ul>
        <p>We respond to all genuine inquiries and feedback to improve our user experience.</p>
      `
    }
  };

  let currentLang = "en";

  function applyTranslations(lang) {
    const dict = translations[lang] || translations.en;
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    const mediaInput = document.getElementById("media-url-input");
    if (mediaInput && dict.inputPlaceholder) {
      mediaInput.placeholder = dict.inputPlaceholder;
    }
  }

  // Toast Notifications Helper
  function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    if (type === "success") toast.style.borderLeftColor = "#10b981";
    if (type === "error") toast.style.borderLeftColor = "#ef4444";
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // --- Downloader Form Elements ---
  const urlInspectForm = document.getElementById("url-inspect-form");
  const mediaUrlInput = document.getElementById("media-url-input");
  const btnClearUrl = document.getElementById("btn-clear-url");
  const btnPasteClipboard = document.getElementById("btn-paste-clipboard");
  const inspectLoading = document.getElementById("inspect-loading");
  const inspectError = document.getElementById("inspect-error");
  const btnDismissError = document.getElementById("btn-dismiss-error");
  const mediaPreviewCard = document.getElementById("media-preview-card");

  // Hero Mode Pre-Selector
  let preferredMode = "all";
  document.querySelectorAll(".hero-mode-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".hero-mode-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      preferredMode = pill.getAttribute("data-mode");
    });
  });

  // Clear URL Input Button
  if (mediaUrlInput && btnClearUrl) {
    mediaUrlInput.addEventListener("input", () => {
      btnClearUrl.style.display = mediaUrlInput.value.length > 0 ? "flex" : "none";
    });
    btnClearUrl.addEventListener("click", () => {
      mediaUrlInput.value = "";
      btnClearUrl.style.display = "none";
      mediaUrlInput.focus();
    });
  }

  // Preview elements
  const previewThumbImg = document.getElementById("preview-thumb-img");
  const previewDuration = document.getElementById("preview-duration");
  const previewUploader = document.getElementById("preview-uploader");
  const previewViews = document.getElementById("preview-views");
  const previewTitle = document.getElementById("preview-title");
  const previewDesc = document.getElementById("preview-desc");

  // Format Tabs & Tab Panes
  const btnToggleVideo = document.getElementById("btn-toggle-video");
  const btnToggleAudio = document.getElementById("btn-toggle-audio");
  const videoTabContent = document.getElementById("video-tab-content");
  const audioTabContent = document.getElementById("audio-tab-content");

  // Tables & Quick Buttons
  const quickVideoTitle = document.getElementById("quick-video-title");
  const btnQuickDownloadVideo = document.getElementById("btn-quick-download-video");
  const videoTableBody = document.getElementById("video-table-body");

  const quickAudioTitle = document.getElementById("quick-audio-title");
  const btnQuickDownloadAudio = document.getElementById("btn-quick-download-audio");
  const audioTableBody = document.getElementById("audio-table-body");

  // Active Job Elements
  const activeDownloadCard = document.getElementById("active-download-card");
  const jobStatusText = document.getElementById("job-status-text");
  const metricSpeed = document.getElementById("metric-speed");
  const metricEta = document.getElementById("metric-eta");
  const metricSize = document.getElementById("metric-size");
  const jobProgressFill = document.getElementById("job-progress-fill");
  const jobProgressNum = document.getElementById("job-progress-num");
  const jobFilenameText = document.getElementById("job-filename-text");
  const jobSuccessActions = document.getElementById("job-success-actions");
  const btnJobDirectDownload = document.getElementById("btn-job-direct-download");
  const btnJobConvertAnother = document.getElementById("btn-job-convert-another");
  const btnJobClose = document.getElementById("btn-job-close");

  // Sticky Bottom Ad Dismiss
  const stickyAdContainer = document.getElementById("sticky-ad-container");
  const btnCloseStickyAd = document.getElementById("btn-close-sticky-ad");
  if (sessionStorage.getItem("ad_sticky_dismissed") === "1" && stickyAdContainer) {
    stickyAdContainer.classList.add("dismissed");
  }
  if (btnCloseStickyAd && stickyAdContainer) {
    btnCloseStickyAd.addEventListener("click", () => {
      stickyAdContainer.classList.add("dismissed");
      sessionStorage.setItem("ad_sticky_dismissed", "1");
    });
  }

  // Current Video Selection State
  let currentVideoData = null;
  let activePollingInterval = null;

  // Paste from clipboard
  btnPasteClipboard.addEventListener("click", async () => {
    const dict = translations[currentLang] || translations.en;
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        mediaUrlInput.value = text.trim();
        if (btnClearUrl) btnClearUrl.style.display = "flex";
        showToast(dict.pastedToast || "Pasted URL from clipboard");
        inspectMediaUrl(text.trim());
      }
    } catch (e) {
      showToast(dict.clipboardError || "Unable to read clipboard. Please paste manually.", "error");
    }
  });

  // Quick sample chips
  document.querySelectorAll(".quick-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const sample = chip.getAttribute("data-sample");
      mediaUrlInput.value = sample;
      if (btnClearUrl) btnClearUrl.style.display = "flex";
      inspectMediaUrl(sample);
    });
  });

  btnDismissError.addEventListener("click", () => {
    inspectError.style.display = "none";
  });

  if (btnJobClose) {
    btnJobClose.addEventListener("click", () => {
      activeDownloadCard.style.display = "none";
    });
  }

  if (btnJobConvertAnother) {
    btnJobConvertAnother.addEventListener("click", () => {
      mediaUrlInput.value = "";
      if (btnClearUrl) btnClearUrl.style.display = "none";
      mediaPreviewCard.style.display = "none";
      activeDownloadCard.style.display = "none";
      window.scrollTo({ top: 0, behavior: "smooth" });
      mediaUrlInput.focus();
    });
  }

  // When user submits the form
  urlInspectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const url = mediaUrlInput.value.trim();
    if (url) {
      inspectMediaUrl(url);
    }
  });

  // Inspect URL function
  async function inspectMediaUrl(url) {
    inspectLoading.style.display = "block";
    inspectError.style.display = "none";
    mediaPreviewCard.style.display = "none";

    try {
      const res = await fetch("/api/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });

      const data = await res.json();
      inspectLoading.style.display = "none";

      if (!res.ok || data.error) {
        if (res.status === 503 || (data.error && data.error.includes("initializing"))) {
          document.getElementById("error-title-text").textContent = "Setting Up Download Engine...";
          document.getElementById("error-details-text").textContent = "The server is preparing the video download tools for the first time. Please wait 10 seconds and click Download again.";
        } else {
          document.getElementById("error-title-text").textContent = "Failed to analyze video";
          document.getElementById("error-details-text").textContent = data.error || data.details || "Please verify the link and try again.";
        }
        inspectError.style.display = "flex";
        return;
      }

      currentVideoData = data;
      renderPreview(data);
    } catch (err) {
      inspectLoading.style.display = "none";
      document.getElementById("error-title-text").textContent = "Network error connecting to backend";
      document.getElementById("error-details-text").textContent = "Could not reach the server. Please check your internet connection and try again.";
      inspectError.style.display = "flex";
    }
  }

  // Render Video Preview Card with Direct Format Tables
  function renderPreview(data) {
    previewThumbImg.src = data.thumbnail || "";
    previewDuration.textContent = data.durationStr || "00:00";
    previewUploader.textContent = data.uploader || "YouTube Creator";
    previewViews.textContent = `${data.viewCount} views`;
    previewTitle.textContent = data.title || "Video Title";
    previewDesc.textContent = data.description || "No description provided.";

    // Video Options
    const videoOptions = data.videoOptions && data.videoOptions.length ? data.videoOptions : [
      { height: 1080, label: "1080p Full HD", sizeStr: "Best Quality" },
      { height: 720, label: "720p HD", sizeStr: "Standard" },
      { height: 480, label: "480p SD", sizeStr: "Compact" },
      { height: 360, label: "360p", sizeStr: "Lightweight" }
    ];

    // Setup Quick Video Download (Top available resolution)
    const topVideo = videoOptions[0];
    if (quickVideoTitle) {
      quickVideoTitle.textContent = `${topVideo.label} MP4 (${topVideo.sizeStr || "High Definition"})`;
    }
    if (btnQuickDownloadVideo) {
      btnQuickDownloadVideo.onclick = () => {
        startDownloadProcess({ type: "video", quality: topVideo.height });
      };
    }

    // Populate Video Formats Table with 1-Click Direct Download Buttons
    videoTableBody.innerHTML = "";
    videoOptions.forEach((opt) => {
      const tr = document.createElement("tr");

      let badgeClass = "badge-sd";
      if (opt.height >= 2160) badgeClass = "badge-4k";
      else if (opt.height >= 1440) badgeClass = "badge-2k";
      else if (opt.height >= 1080) badgeClass = "badge-1080p";
      else if (opt.height >= 720) badgeClass = "badge-720p";

      tr.innerHTML = `
        <td><span class="badge-res ${badgeClass}">${opt.label}</span></td>
        <td><span class="fmt-type-tag">MP4</span></td>
        <td><span class="fmt-size-tag">${opt.sizeStr || "Dynamic Size"}</span></td>
        <td style="text-align: right;">
          <button type="button" class="btn-row-download" data-height="${opt.height}">
            <svg viewBox="0 0 24 24" class="btn-icon-sm" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
            <span>Download MP4</span>
          </button>
        </td>
      `;

      tr.querySelector(".btn-row-download").addEventListener("click", () => {
        startDownloadProcess({ type: "video", quality: opt.height });
      });

      videoTableBody.appendChild(tr);
    });

    // Audio Options List
    const audioItems = [
      { ext: "mp3", abr: "320", qualityLabel: "320 kbps (High Quality Audio)", sizeStr: "~8 - 12 MB" },
      { ext: "mp3", abr: "256", qualityLabel: "256 kbps (Standard Audio)", sizeStr: "~6 - 9 MB" },
      { ext: "mp3", abr: "128", qualityLabel: "128 kbps (Compact Audio)", sizeStr: "~3 - 5 MB" },
      { ext: "m4a", abr: "Original", qualityLabel: "Original AAC Audio Stream", sizeStr: "~4 - 8 MB" },
      { ext: "wav", abr: "Lossless", qualityLabel: "Studio Lossless Master (WAV)", sizeStr: "~30 - 50 MB" },
      { ext: "flac", abr: "Hi-Res", qualityLabel: "High-Fidelity Studio FLAC", sizeStr: "~20 - 40 MB" }
    ];

    // Setup Quick Audio Download (MP3 320k)
    if (quickAudioTitle) {
      quickAudioTitle.textContent = "MP3 Audio (320 kbps High Bitrate)";
    }
    if (btnQuickDownloadAudio) {
      btnQuickDownloadAudio.onclick = () => {
        startDownloadProcess({ type: "audio", customExt: "mp3" });
      };
    }

    // Populate Audio Formats Table with 1-Click Direct Download Buttons
    audioTableBody.innerHTML = "";
    audioItems.forEach((item) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td><span class="badge-res badge-audio-fmt">${item.ext.toUpperCase()}</span></td>
        <td><strong>${item.qualityLabel}</strong></td>
        <td><span class="fmt-size-tag">${item.sizeStr}</span></td>
        <td style="text-align: right;">
          <button type="button" class="btn-row-download btn-audio" data-ext="${item.ext}">
            <svg viewBox="0 0 24 24" class="btn-icon-sm" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
            <span>Download ${item.ext.toUpperCase()}</span>
          </button>
        </td>
      `;

      tr.querySelector(".btn-row-download").addEventListener("click", () => {
        startDownloadProcess({ type: "audio", customExt: item.ext });
      });

      audioTableBody.appendChild(tr);
    });

    // Auto-select tab according to pre-selected mode
    if (preferredMode === "audio") {
      activateAudioTab();
    } else {
      activateVideoTab();
    }

    mediaPreviewCard.style.display = "block";
    mediaPreviewCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // Format Toggle Functions
  function activateVideoTab() {
    btnToggleVideo.classList.add("active");
    btnToggleAudio.classList.remove("active");
    videoTabContent.style.display = "flex";
    audioTabContent.style.display = "none";
  }

  function activateAudioTab() {
    btnToggleAudio.classList.add("active");
    btnToggleVideo.classList.remove("active");
    audioTabContent.style.display = "flex";
    videoTabContent.style.display = "none";
  }

  btnToggleVideo.addEventListener("click", activateVideoTab);
  btnToggleAudio.addEventListener("click", activateAudioTab);

  // Start Download Process
  async function startDownloadProcess({ type, quality, customExt }) {
    if (!currentVideoData) return;

    const dict = translations[currentLang] || translations.en;

    activeDownloadCard.style.display = "block";
    activeDownloadCard.scrollIntoView({ behavior: "smooth", block: "nearest" });

    jobStatusText.textContent = dict.connecting || "Connecting to server...";
    metricSpeed.textContent = `${dict.speed || "Speed:"} --`;
    metricEta.textContent = `${dict.eta || "ETA:"} --`;
    metricSize.textContent = `${dict.size || "Size:"} --`;
    jobProgressFill.style.width = "5%";
    jobProgressNum.textContent = "5%";
    jobFilenameText.textContent = currentVideoData.title;
    jobSuccessActions.style.display = "none";

    showToast(`Starting ${type === "audio" ? (customExt || "MP3").toUpperCase() : (quality + "p MP4")} download...`);

    try {
      const payload = {
        url: currentVideoData.webpageUrl || mediaUrlInput.value.trim(),
        type: type,
        quality: quality || null,
        customExt: customExt || null
      };

      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        showToast(data.error || "Download could not be started", "error");
        return;
      }

      startJobPolling(data.jobId);
    } catch (err) {
      showToast("Download request failed: " + err.message, "error");
    }
  }

  // Auto trigger browser download
  function triggerBrowserDownload(url, filename) {
    try {
      const tempLink = document.createElement("a");
      tempLink.href = url;
      tempLink.setAttribute("download", filename || "download");
      document.body.appendChild(tempLink);
      tempLink.click();
      setTimeout(() => tempLink.remove(), 1000);
    } catch (err) {
      console.warn("Auto-download trigger fallback:", err);
    }
  }

  // Poll Job Progress
  function startJobPolling(jobId) {
    if (activePollingInterval) clearInterval(activePollingInterval);

    activePollingInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/job/${jobId}`);
        if (!res.ok) return;
        const job = await res.json();
        const dict = translations[currentLang] || translations.en;

        if (job.status === "downloading") {
          jobStatusText.textContent = job.type === "audio" ? (dict.downloadingAudio || "Downloading Audio...") : (dict.downloadingVideo || "Downloading Video...");
          jobProgressFill.style.width = `${Math.max(5, job.progress)}%`;
          jobProgressNum.textContent = `${job.progress.toFixed(1)}%`;
          metricSpeed.textContent = `${dict.speed || "Speed:"} ${job.speed || "--"}`;
          metricEta.textContent = `${dict.eta || "ETA:"} ${job.eta || "--"}`;
          metricSize.textContent = `${dict.size || "Size:"} ${job.totalSize || "--"}`;
        } else if (job.status === "processing") {
          jobStatusText.textContent = dict.merging || "Processing & Merging with FFmpeg...";
          jobProgressFill.style.width = "95%";
          jobProgressNum.textContent = "95%";
          metricSpeed.textContent = (dict.speed || "Speed:") + " Processing";
        } else if (job.status === "completed") {
          clearInterval(activePollingInterval);
          jobStatusText.textContent = `✅ ${dict.downloadSuccess || "Download Complete!"}`;
          jobProgressFill.style.width = "100%";
          jobProgressNum.textContent = "100%";
          metricSpeed.textContent = `${dict.speed || "Speed:"} Ready`;
          metricEta.textContent = `${dict.eta || "ETA:"} 00:00`;

          if (job.filename) {
            const fileDownloadUrl = `/api/file/${encodeURIComponent(job.filename)}?download=true`;
            btnJobDirectDownload.href = fileDownloadUrl;
            btnJobDirectDownload.textContent = `📥 ${dict.saveFile || "Save File Now"}`;
            jobSuccessActions.style.display = "flex";
            jobFilenameText.textContent = `Saved: ${job.filename}`;

            // Auto-trigger the file download immediately to the browser!
            triggerBrowserDownload(fileDownloadUrl, job.filename);
          }

          showToast(dict.downloadSuccess || "Download Complete!", "success");
        } else if (job.status === "failed") {
          clearInterval(activePollingInterval);
          jobStatusText.textContent = "❌ Download Failed";
          metricSpeed.textContent = "Error";
          showToast(job.error || "Download error occurred", "error");
        }
      } catch (e) {
        console.error("Polling error:", e);
      }
    }, 800);
  }

  // --- Policy Pages Modal Logic ---
  const policyModal = document.getElementById("policy-modal");
  const policyModalTitle = document.getElementById("policy-modal-title");
  const policyModalContent = document.getElementById("policy-modal-content");
  const btnClosePolicyModal = document.getElementById("btn-close-policy-modal");
  const btnDismissPolicy = document.getElementById("btn-dismiss-policy");

  document.querySelectorAll(".policy-link-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const policyKey = btn.getAttribute("data-policy");
      const doc = policyDocs[policyKey] || policyDocs.privacy;
      if (policyModalTitle) policyModalTitle.textContent = doc.title;
      if (policyModalContent) policyModalContent.innerHTML = doc.content;
      if (policyModal) policyModal.style.display = "flex";
    });
  });

  function closePolicyModal() {
    if (policyModal) policyModal.style.display = "none";
  }

  if (btnClosePolicyModal) btnClosePolicyModal.addEventListener("click", closePolicyModal);
  if (btnDismissPolicy) btnDismissPolicy.addEventListener("click", closePolicyModal);
  if (policyModal) {
    policyModal.addEventListener("click", (e) => {
      if (e.target === policyModal) closePolicyModal();
    });
  }

  // Initial setup: Apply language
  applyTranslations(currentLang);
});
