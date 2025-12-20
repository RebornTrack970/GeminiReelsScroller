let aiStudioTabId = null;
const PLATFORMS = {
  instagram: {
    url: "https://www.instagram.com/reels/",
    pattern: "https://www.instagram.com/reels/*"
  },
  tiktok: {
    url: "https://www.tiktok.com/",
    pattern: "https://www.tiktok.com/*"
  },
  twitter: {
    url: "https://x.com/home",
    patterns: ["*://twitter.com/*", "*://x.com/*"]
  },
  youtube: {
    url: "https://www.youtube.com/shorts/",
    pattern: "https://www.youtube.com/shorts/*"
  }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "start_doomscrolling") {
    
    aiStudioTabId = sender.tab.id;

    chrome.storage.sync.get(['preferredPlatform'], (result) => {
      const choice = result.preferredPlatform || 'instagram';
      const siteData = PLATFORMS[choice];

      console.log("Opening platform:", choice); 
      let queryPatterns = [];
      if (siteData.patterns) {
        queryPatterns = siteData.patterns;
      } else {
        queryPatterns = [siteData.pattern];
      }

      chrome.tabs.query({ url: queryPatterns }, (tabs) => {
        if (tabs.length > 0) {
          const existingTab = tabs[0];
          chrome.tabs.update(existingTab.id, { active: true });
          chrome.windows.update(existingTab.windowId, { focused: true });
        } else {
          chrome.tabs.create({ url: siteData.url });
        }
      });
    });

  } else if (request.action === "generation_complete") {
    if (aiStudioTabId) {
      chrome.tabs.update(aiStudioTabId, { active: true });
      chrome.tabs.get(aiStudioTabId, (tab) => {
        if (tab && tab.windowId) {
          chrome.windows.update(tab.windowId, { focused: true });
        }
      });
    }
  }
});
