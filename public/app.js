// ytDownloader Pro - Client Application Logic (Worldwide Languages, Policies, & Full Responsiveness)
document.addEventListener("DOMContentLoaded", () => {
  // English Translations Dictionary for Content & Formats (Strictly English Only)
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
      saveFile: "Save File",
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
        <p>We use standard browser local storage solely to remember your chosen language preference. No tracking cookies or advertising cookies are utilized.</p>
        <h4>4. Security</h4>
        <p>Our web server operates strictly on a clean, ad-free environment without any third-party spyware or malware.</p>
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

  // Language selector
  const langSelect = document.getElementById("language-select");
  let currentLang = localStorage.getItem("ytdn_lang") || "gu";

  if (langSelect) {
    langSelect.value = currentLang;
    langSelect.addEventListener("change", (e) => {
      currentLang = e.target.value;
      localStorage.setItem("ytdn_lang", currentLang);
      applyTranslations(currentLang);
    });
  }

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

    if (downloadBtnLabel) {
      downloadBtnLabel.textContent = selectedMode === "video" ? dict.downloadNowVideo : dict.downloadNowAudio;
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
  const btnPasteClipboard = document.getElementById("btn-paste-clipboard");
  const inspectLoading = document.getElementById("inspect-loading");
  const inspectError = document.getElementById("inspect-error");
  const btnDismissError = document.getElementById("btn-dismiss-error");
  const mediaPreviewCard = document.getElementById("media-preview-card");

  // Preview elements
  const previewThumbImg = document.getElementById("preview-thumb-img");
  const previewDuration = document.getElementById("preview-duration");
  const previewUploader = document.getElementById("preview-uploader");
  const previewViews = document.getElementById("preview-views");
  const previewTitle = document.getElementById("preview-title");
  const previewDesc = document.getElementById("preview-desc");

  // Format & Quality Controls
  const btnToggleVideo = document.getElementById("btn-toggle-video");
  const btnToggleAudio = document.getElementById("btn-toggle-audio");
  const videoQualityGroup = document.getElementById("video-quality-group");
  const audioQualityGroup = document.getElementById("audio-quality-group");
  const videoChipsContainer = document.getElementById("video-chips-container");
  const audioChipsContainer = document.getElementById("audio-chips-container");
  const btnStartDownload = document.getElementById("btn-start-download");
  const downloadBtnLabel = document.getElementById("download-btn-label");

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
  const btnJobClose = document.getElementById("btn-job-close");

  // Current Video Selection State
  let currentVideoData = null;
  let selectedMode = "video";
  let selectedResolution = null;
  let selectedAudioFormat = "mp3";
  let activePollingInterval = null;

  // Paste from clipboard
  btnPasteClipboard.addEventListener("click", async () => {
    const dict = translations[currentLang] || translations.en;
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        mediaUrlInput.value = text.trim();
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

  // When user clicks the "Download" button on the URL bar
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

  // Render Video Preview Card
  function renderPreview(data) {
    previewThumbImg.src = data.thumbnail || "";
    previewDuration.textContent = data.durationStr || "00:00";
    previewUploader.textContent = data.uploader || "YouTube Creator";
    previewViews.textContent = `${data.viewCount} views`;
    previewTitle.textContent = data.title || "Video Title";
    previewDesc.textContent = data.description || "No description provided.";

    // Render Video Quality Chips
    videoChipsContainer.innerHTML = "";
    const videoOptions = data.videoOptions && data.videoOptions.length ? data.videoOptions : [
      { height: 1080, label: "1080p Full HD", sizeStr: "Best Quality" },
      { height: 720, label: "720p HD", sizeStr: "Standard" },
      { height: 480, label: "480p SD", sizeStr: "Compact" },
      { height: 360, label: "360p", sizeStr: "Lightweight" }
    ];

    selectedResolution = videoOptions[0].height;

    videoOptions.forEach((opt, idx) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = `quality-chip ${idx === 0 ? "active" : ""}`;
      chip.setAttribute("data-height", opt.height);
      chip.innerHTML = `
        <span class="q-main">${opt.label}</span>
        <span class="q-sub">${opt.sizeStr || "Dynamic Size"}</span>
      `;
      chip.addEventListener("click", () => {
        videoChipsContainer.querySelectorAll(".quality-chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        selectedResolution = opt.height;
      });
      videoChipsContainer.appendChild(chip);
    });

    mediaPreviewCard.style.display = "block";
    mediaPreviewCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // Format Toggle
  btnToggleVideo.addEventListener("click", () => {
    selectedMode = "video";
    btnToggleVideo.classList.add("active");
    btnToggleAudio.classList.remove("active");
    videoQualityGroup.style.display = "block";
    audioQualityGroup.style.display = "none";
    const dict = translations[currentLang] || translations.en;
    downloadBtnLabel.textContent = dict.downloadNowVideo;
  });

  btnToggleAudio.addEventListener("click", () => {
    selectedMode = "audio";
    btnToggleAudio.classList.add("active");
    btnToggleVideo.classList.remove("active");
    audioQualityGroup.style.display = "block";
    videoQualityGroup.style.display = "none";
    const dict = translations[currentLang] || translations.en;
    downloadBtnLabel.textContent = dict.downloadNowAudio;
  });

  // Audio chips selection
  audioChipsContainer.querySelectorAll(".quality-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      audioChipsContainer.querySelectorAll(".quality-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      selectedAudioFormat = chip.getAttribute("data-quality");
    });
  });

  // Big Download Button Click
  btnStartDownload.addEventListener("click", async () => {
    if (!currentVideoData) return;

    const dict = translations[currentLang] || translations.en;
    btnStartDownload.disabled = true;
    btnStartDownload.style.opacity = "0.6";

    activeDownloadCard.style.display = "block";
    activeDownloadCard.scrollIntoView({ behavior: "smooth", block: "nearest" });

    jobStatusText.textContent = dict.connecting;
    metricSpeed.textContent = `${dict.speed} --`;
    metricEta.textContent = `${dict.eta} --`;
    metricSize.textContent = `${dict.size} --`;
    jobProgressFill.style.width = "5%";
    jobProgressNum.textContent = "5%";
    jobFilenameText.textContent = currentVideoData.title;
    jobSuccessActions.style.display = "none";

    try {
      const payload = {
        url: currentVideoData.webpageUrl || mediaUrlInput.value.trim(),
        type: selectedMode,
        quality: selectedMode === "video" ? selectedResolution : null,
        customExt: selectedMode === "audio" ? selectedAudioFormat : null
      };

      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        showToast(data.error || "Download could not be started", "error");
        btnStartDownload.disabled = false;
        btnStartDownload.style.opacity = "1";
        return;
      }

      startJobPolling(data.jobId);
    } catch (err) {
      showToast("Download request failed: " + err.message, "error");
      btnStartDownload.disabled = false;
      btnStartDownload.style.opacity = "1";
    }
  });

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
          jobStatusText.textContent = job.type === "audio" ? dict.downloadingAudio : dict.downloadingVideo;
          jobProgressFill.style.width = `${Math.max(5, job.progress)}%`;
          jobProgressNum.textContent = `${job.progress.toFixed(1)}%`;
          metricSpeed.textContent = `${dict.speed} ${job.speed || "--"}`;
          metricEta.textContent = `${dict.eta} ${job.eta || "--"}`;
          metricSize.textContent = `${dict.size} ${job.totalSize || "--"}`;
        } else if (job.status === "processing") {
          jobStatusText.textContent = dict.merging;
          jobProgressFill.style.width = "95%";
          jobProgressNum.textContent = "95%";
          metricSpeed.textContent = dict.speed + " Processing";
        } else if (job.status === "completed") {
          clearInterval(activePollingInterval);
          jobStatusText.textContent = `✅ ${dict.downloadSuccess}`;
          jobProgressFill.style.width = "100%";
          jobProgressNum.textContent = "100%";
          metricSpeed.textContent = `${dict.speed} Done`;
          metricEta.textContent = `${dict.eta} 00:00`;

          btnStartDownload.disabled = false;
          btnStartDownload.style.opacity = "1";

          if (job.filename) {
            btnJobDirectDownload.href = `/api/file/${encodeURIComponent(job.filename)}?download=true`;
            btnJobDirectDownload.textContent = dict.saveFile;
            jobSuccessActions.style.display = "flex";
            jobFilenameText.textContent = `Saved: ${job.filename}`;
          }

          showToast(dict.downloadSuccess, "success");
        } else if (job.status === "failed") {
          clearInterval(activePollingInterval);
          jobStatusText.textContent = "❌ Download Failed";
          metricSpeed.textContent = "Error";
          btnStartDownload.disabled = false;
          btnStartDownload.style.opacity = "1";
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
