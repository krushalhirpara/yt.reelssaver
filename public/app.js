// ytDownloader Pro - Client Application Logic (Worldwide Languages, Policies, & Full Responsiveness)
document.addEventListener("DOMContentLoaded", () => {
  // Comprehensive Worldwide Languages Dictionary with Content & Policy Translations
  const translations = {
    gu: {
      brandSub: "YouTube વિડિયો, રીલ્સ અને MP3 ડાઉનલોડર",
      heroTitle: "YouTube વિડિયો અને રીલ્સ ડાઉનલોડ કરો",
      heroSubtitle: "કોઈપણ YouTube, Instagram Reels, Shorts, Twitter અથવા Facebook લિંક અહીં પેસ્ટ કરો",
      inputPlaceholder: "અહીં લિંક પેસ્ટ કરો: https://www.youtube.com/watch?v=...",
      pasteBtn: "પેસ્ટ",
      downloadBtn: "ડાઉનલોડ",
      quickSamples: "સેમ્પલ લિંક્સ:",
      analyzingTitle: "વિડિયો વિગતો તપાસી રહ્યું છે...",
      analyzingSub: "yt-dlp દ્વારા વિડિયો ક્વોલિટી, રીઝોલ્યુશન અને ઓડિયો ફોર્મેટ્સ મેળવી રહ્યું છે",
      videoTab: "વિડિયો (MP4)",
      audioTab: "ઓડિયો (MP3 / M4A)",
      selectVideoRes: "વિડિયો ક્વોલિટી પસંદ કરો:",
      selectAudioFmt: "ઓડિયો ફોર્મેટ અને ક્વોલિટી પસંદ કરો:",
      downloadNowVideo: "વિડિયો ડાઉનલોડ કરો (MP4)",
      downloadNowAudio: "ઓડિયો ડાઉનલોડ કરો (MP3 / M4A)",
      speed: "ઝડપ:",
      eta: "બાકી સમય:",
      size: "કદ:",
      connecting: "કનેક્ટ થઈ રહ્યું છે...",
      downloadingVideo: "વિડિયો ડાઉનલોડ થઈ રહ્યો છે...",
      downloadingAudio: "ઓડિયો ડાઉનલોડ થઈ રહ્યો છે...",
      merging: "FFmpeg દ્વારા ફાઇલ તૈયાર થઈ રહી છે...",
      downloadSuccess: "ડાઉનલોડ સફળતાપૂર્વક પૂર્ણ થયું!",
      saveFile: "ફાઇલ સેવ કરો",
      pastedToast: "ક્લિપબોર્ડમાંથી લિંક પેસ્ટ કરી",
      clipboardError: "ક્લિપબોર્ડ એક્સેસ નિષ્ફળ. કૃપા કરીને જાતે પેસ્ટ કરો.",
      // Content Sections
      howHeading: "વિડિયો કેવી રીતે ડાઉનલોડ કરવો?",
      howSubheading: "સરળ 3 પગલાંમાં કોઈપણ વિડિયો તમારા ફોન અથવા કમ્પ્યુટરમાં સેવ કરો",
      step1Title: "લિંક કૉપી કરો",
      step1Desc: "YouTube, Instagram અથવા અન્ય કોઈપણ સાઇટ પરથી વિડિયોની લિંક (URL) કૉપી કરો.",
      step2Title: "પેસ્ટ કરો અને ગુણવત્તા પસંદ કરો",
      step2Desc: "અહીં બોક્સમાં લિંક પેસ્ટ કરી 'ડાઉનલોડ' દબાવો અને મનપસંદ ક્વોલિટી (4K, 1080p અથવા MP3) પસંદ કરો.",
      step3Title: "ડાઉનલોડ કરો અને સેવ કરો",
      step3Desc: "ડાઉનલોડ પૂર્ણ થતાં જ ફાઇલ તમારા ઉપકરણમાં સીધી સેવ થઈ જશે.",
      featuresHeading: "મુખ્ય વિશેષતાઓ",
      featuresSubheading: "ઝડપી, સલામત અને અમર્યાદિત ફ્રી ડાઉનલોડિંગ સુવિધા",
      feat1Title: "અલ્ટ્રા ફાસ્ટ સ્પીડ",
      feat1Desc: "હાઈ-સ્પીડ ડાઉનલોડ એન્જિન સાથે વિડિયો માત્ર ગણતરીની સેકન્ડોમાં ડાઉનલોડ કરો.",
      feat2Title: "4K અને Full HD સપોર્ટ",
      feat2Desc: "4K, 1440p, 1080p 60fps અને 720p જેવી તમામ હાઇ ક્વોલિટીમાં વિડિયો ઉપલબ્ધ.",
      feat3Title: "ઓડિયો MP3 એક્સ્ટ્રેક્ટર",
      feat3Desc: "કોઈપણ વિડિયોમાંથી 320kbps ક્રિસ્ટલ ક્લિયર MP3 અથવા M4A ઓડિયો અલગ કરો.",
      feat4Title: "તમામ ડિવાઇસ સપોર્ટ",
      feat4Desc: "મોબાઇલ, ટેબ્લેટ અને કમ્પ્યુટર ત્રણેયમાં સરળતાથી અને ઝડપથી કામ કરે છે.",
      feat5Title: "100% સુરક્ષિત અને જાહેરાત મુક્ત",
      feat5Desc: "કોઈપણ પ્રકારની પોપ-અપ એડ્સ કે વાયરસ વિના સંપૂર્ણ સુરક્ષિત ડાઉનલોડ.",
      feat6Title: "સંપૂર્ણ મફત અને અનલિમિટેડ",
      feat6Desc: "કોઈ રજીસ્ટ્રેશન કે લોગિનની જરૂર નથી. ગમે તેટલા વિડિયો મફતમાં ડાઉનલોડ કરો.",
      platformsHeading: "સપોર્ટેડ પ્લેટફોર્મ્સ",
      platformsSubheading: "સેંકડો લોકપ્રિય સાઇટ્સ પરથી વિડિયો અને ઓડિયો ડાઉનલોડ કરો",
      faqHeading: "વારંવાર પૂછાતા પ્રશ્નો (FAQ)",
      faqSubheading: "તમારા પ્રશ્નોના સામાન્ય જવાબો",
      faq1Q: "શું આ સર્વિસ તદ્દન મફત છે?",
      faq1A: "હા, yt.reelssaver (ReelsSaver) સંપૂર્ણપણે મફત છે. કોઈ સબ્સ્ક્રિપ્શન કે ચુકવણીની જરૂર નથી.",
      faq2Q: "હું કયા ફોર્મેટમાં વિડિયો ડાઉનલોડ કરી શકું?",
      faq2A: "તમે MP4 (4K, 1080p, 720p, 480p) વિડિયો તેમજ હાઇ ક્વોલિટી MP3 (320kbps) અને M4A ઓડિયો ડાઉનલોડ કરી શકો છો.",
      faq3Q: "શું હું મોબાઇલ ફોનમાં પણ આ વાપરી શકું છું?",
      faq3A: "હા, અમારી વેબસાઇટ Android અને iPhone બંને સ્માર્ટફોન તથા ટેબ્લેટ પર સંપૂર્ણ રિસ્પોન્સિવ છે.",
      faq4Q: "ડાઉનલોડ કરેલી ફાઇલો ક્યાં સેવ થાય છે?",
      faq4A: "ફાઇલો સીધી તમારા કમ્પ્યુટર અથવા ફોનના સ્ટાન્ડર્ડ 'Downloads' ફોલ્ડરમાં સેવ થાય છે.",
      footerDesc: "ઝડપી, સુરક્ષિત અને ઉચ્ચ ગુણવત્તાવાળા વિડિયો અને ઓડિયો ડાઉનલોડ માટે વિશ્વસનીય પ્લેટફોર્મ.",
      formatsHeading: "ફોર્મેટ્સ",
      policyHeading: "પોલિસી અને નિયમો",
      privacyLink: "Privacy Policy",
      termsLink: "Terms of Service",
      dmcaLink: "Copyright & DMCA",
      contactLink: "Contact Us",
      disclaimer: "આ સાધન માત્ર વ્યક્તિગત અને શૈક્ષણિક ઉપયોગ માટે છે. કૉપિરાઇટ નિયમોનું સન્માન કરો."
    },
    en: {
      brandSub: "Universal YouTube Video & Reels Downloader Suite",
      heroTitle: "Download YouTube Videos & Instagram Reels",
      heroSubtitle: "Paste any YouTube, Instagram Reels, Shorts, Twitter, Vimeo or TikTok link below",
      inputPlaceholder: "https://www.youtube.com/watch?v=...",
      pasteBtn: "Paste",
      downloadBtn: "Download",
      quickSamples: "Quick samples:",
      analyzingTitle: "Analyzing Media Streams...",
      analyzingSub: "Extracting resolutions, codecs, audio bitrates and direct formats with yt-dlp",
      videoTab: "Video (MP4 / MKV)",
      audioTab: "Audio (MP3 / M4A)",
      selectVideoRes: "Select Video Resolution:",
      selectAudioFmt: "Select Audio Format & Quality:",
      downloadNowVideo: "Download Video Now (MP4)",
      downloadNowAudio: "Download Audio (MP3 / M4A)",
      speed: "Speed:",
      eta: "ETA:",
      size: "Size:",
      connecting: "Connecting to yt-dlp...",
      downloadingVideo: "Downloading Video...",
      downloadingAudio: "Downloading Audio...",
      merging: "Merging & Finalizing format with FFmpeg...",
      downloadSuccess: "Download Finished Successfully!",
      saveFile: "Save File to PC",
      pastedToast: "Pasted URL from clipboard",
      clipboardError: "Unable to read clipboard. Please paste manually.",
      // Content Sections
      howHeading: "How to Download Video?",
      howSubheading: "Save any video to your phone, tablet, or PC in 3 simple steps",
      step1Title: "Copy Video URL",
      step1Desc: "Copy the link of the video you want to download from YouTube, Instagram, or TikTok.",
      step2Title: "Paste & Select Format",
      step2Desc: "Paste the URL into the input field above, click Download, and choose 4K, 1080p, or MP3.",
      step3Title: "Save to Device",
      step3Desc: "Once processed, the file is saved directly to your device ready for offline playback.",
      featuresHeading: "Key Features",
      featuresSubheading: "Fast, secure, and unlimited media downloading suite",
      feat1Title: "Ultra Fast Speeds",
      feat1Desc: "Multi-threaded downloading engine fetches videos in mere seconds.",
      feat2Title: "4K & Full HD Quality",
      feat2Desc: "Supports 4K, 1440p, 1080p 60fps, and 720p HD resolution downloads.",
      feat3Title: "Audio MP3 Extractor",
      feat3Desc: "Extract crystal clear 320kbps MP3 or M4A audio from any video source.",
      feat4Title: "All Devices Supported",
      feat4Desc: "Flawlessly responsive on Mobile (Android & iOS), Tablet, and Desktop PCs.",
      feat5Title: "100% Safe & Ad-Free",
      feat5Desc: "No intrusive pop-ups, no tracking, and no malware. Completely private.",
      feat6Title: "Free & Unlimited",
      feat6Desc: "No subscriptions, no registration required. Download as many videos as you want.",
      platformsHeading: "Supported Platforms",
      platformsSubheading: "Download videos and audio from hundreds of top web platforms",
      faqHeading: "Frequently Asked Questions (FAQ)",
      faqSubheading: "Answers to common questions about yt.reelssaver",
      faq1Q: "Is this service completely free?",
      faq1A: "Yes, yt.reelssaver (ReelsSaver) is 100% free with no limits, hidden fees, or subscription required.",
      faq2Q: "Which formats and resolutions can I download?",
      faq2A: "You can download MP4 videos in 4K, 1080p, 720p, and 480p, as well as MP3 and M4A audio.",
      faq3Q: "Can I use this on my mobile phone?",
      faq3A: "Yes, our web app is fully responsive and optimized for iPhone, Android, and tablets.",
      faq4Q: "Where are downloaded files saved?",
      faq4A: "Files are saved directly to your device's default 'Downloads' folder.",
      footerDesc: "Your trusted high-speed downloader for YouTube videos, Instagram Reels, and audio content.",
      formatsHeading: "Formats",
      policyHeading: "Legal & Policies",
      privacyLink: "Privacy Policy",
      termsLink: "Terms of Service",
      dmcaLink: "Copyright & DMCA",
      contactLink: "Contact Us",
      disclaimer: "This tool is intended strictly for personal and educational use. Respect copyright laws."
    },
    hi: {
      brandSub: "यूनिवर्सल वीडियो और ऑडियो डाउनलोडर सूट",
      heroTitle: "कोई भी वीडियो या ऑडियो डाउनलोड करें",
      heroSubtitle: "कोई भी YouTube, Instagram, Twitter या Vimeo लिंक नीचे पेस्ट करें",
      inputPlaceholder: "यहाँ लिंक पेस्ट करें: https://www.youtube.com/watch?v=...",
      pasteBtn: "पेस्ट",
      downloadBtn: "डाउनलोड",
      quickSamples: "सैंपल लिंक्स:",
      analyzingTitle: "मीडिया स्ट्रीम की जांच की जा रही है...",
      analyzingSub: "yt-dlp द्वारा वीडियो क्वालिटी और ऑडियो फॉर्मेट्स निकाले जा रहे हैं",
      videoTab: "वीडियो (MP4)",
      audioTab: "ऑडियो (MP3 / M4A)",
      selectVideoRes: "वीडियो क्वालिटी चुनें:",
      selectAudioFmt: "ऑडियो फॉर्मेट चुनें:",
      downloadNowVideo: "वीडियो डाउनलोड करें (MP4)",
      downloadNowAudio: "ऑडियो डाउनलोड करें (MP3)",
      speed: "स्पीड:",
      eta: "शेष समय:",
      size: "साइज:",
      connecting: "कनेक्ट हो रहा है...",
      downloadingVideo: "वीडियो डाउनलोड हो रहा है...",
      downloadingAudio: "ऑडियो डाउनलोड हो रहा है...",
      merging: "FFmpeg द्वारा फाइल प्रोसेस की जा रही है...",
      downloadSuccess: "डाउनलोड सफलतापूर्वक पूरा हुआ!",
      saveFile: "फाइल सेव करें",
      pastedToast: "क्लिपबोर्ड से लिंक पेस्ट किया गया",
      clipboardError: "क्लिपबोर्ड नहीं पढ़ा जा सका। कृपया स्वयं पेस्ट करें।",
      howHeading: "वीडियो कैसे डाउनलोड करें?",
      howSubheading: "सरल 3 चरणों में किसी भी वीडियो को अपने फोन या कंप्यूटर में सेव करें",
      step1Title: "लिंक कॉपी करें",
      step1Desc: "YouTube या Instagram से वीडियो का URL कॉपी करें।",
      step2Title: "पेस्ट करें और क्वालिटी चुनें",
      step2Desc: "लिंक पेस्ट करके डाउनलोड दबाएं और 4K या MP3 क्वालिटी चुनें।",
      step3Title: "डिवाइस में सेव करें",
      step3Desc: "डाउनलोड पूरा होते ही फाइल आपके डिवाइस में सेव हो जाएगी।",
      featuresHeading: "प्रमुख विशेषताएं",
      featuresSubheading: "तेज, सुरक्षित और असीमित मुफ्त डाउनलोडिंग सुविधा",
      feat1Title: "अल्ट्रा फास्ट स्पीड",
      feat1Desc: "हाई-स्पीड इंजन से सेकंडों में वीडियो डाउनलोड करें।",
      feat2Title: "4K और Full HD सपोर्ट",
      feat2Desc: "4K, 1080p 60fps और 720p में वीडियो डाउनलोड उपलब्ध।",
      feat3Title: "ऑडियो MP3 एक्सट्रैक्टर",
      feat3Desc: "किसी भी वीडियो से 320kbps उच्च गुणवत्ता वाला MP3 ऑडियो निकालें।",
      feat4Title: "सभी डिवाइस सपोर्ट",
      feat4Desc: "मोबाइल, टैबलेट और कंप्यूटर पर बेहतरीन और सुगम अनुभव।",
      feat5Title: "सुरक्षित और विज्ञापन-मुक्त",
      feat5Desc: "बिना किसी पॉप-अप या वायरस के पूरी तरह सुरक्षित।",
      feat6Title: "पूरी तरह मुफ्त और असीमित",
      feat6Desc: "बिना किसी रजिस्ट्रेशन के जितने चाहें उतने वीडियो डाउनलोड करें।",
      platformsHeading: "समर्थित प्लेटफॉर्म",
      platformsSubheading: "सैकड़ों लोकप्रिय वेबसाइटों से वीडियो डाउनलोड करें",
      faqHeading: "अक्सर पूछे जाने वाले सवाल (FAQ)",
      faqSubheading: "yt.reelssaver से जुड़े सामान्य उत्तर",
      faq1Q: "क्या यह सेवा पूरी तरह मुफ्त है?",
      faq1A: "हाँ, yt.reelssaver 100% मुफ्त है। कोई शुल्क नहीं है।",
      faq2Q: "मैं किन फॉर्मेट्स में डाउनलोड कर सकता हूँ?",
      faq2A: "आप MP4 (4K, 1080p) वीडियो और MP3 ऑडियो डाउनलोड कर सकते हैं।",
      faq3Q: "क्या यह मोबाइल फोन पर काम करता है?",
      faq3A: "हाँ, यह Android और iPhone दोनों पर पूरी तरह उत्तरदायी (Responsive) है।",
      faq4Q: "डाउनलोड की गई फाइलें कहाँ सेव होती हैं?",
      faq4A: "फाइलें आपके डिवाइस के डिफ़ॉल्ट 'Downloads' फ़ोल्डर में सेव होती हैं।",
      footerDesc: "तेज और सुरक्षित वीडियो डाउनलोडिंग के लिए आपका भरोसेमंद साथी।",
      formatsHeading: "फॉर्मेट्स",
      policyHeading: "नियम और नीतियां",
      privacyLink: "Privacy Policy",
      termsLink: "Terms of Service",
      dmcaLink: "Copyright & DMCA",
      contactLink: "Contact Us",
      disclaimer: "यह उपकरण केवल व्यक्तिगत उपयोग के लिए है। कॉपीराइट का सम्मान करें।"
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
        document.getElementById("error-title-text").textContent = "Failed to analyze video";
        document.getElementById("error-details-text").textContent = data.details || data.error || "Please verify the link.";
        inspectError.style.display = "flex";
        return;
      }

      currentVideoData = data;
      renderPreview(data);
    } catch (err) {
      inspectLoading.style.display = "none";
      document.getElementById("error-title-text").textContent = "Network error connecting to backend";
      document.getElementById("error-details-text").textContent = err.message;
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
