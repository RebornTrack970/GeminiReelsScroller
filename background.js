let aiStudioTabId = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "start_doomscrolling") {
    aiStudioTabId = sender.tab.id;
    const reelsPattern = "https://www.instagram.com/reels/*";

    chrome.tabs.query({ url: reelsPattern }, (tabs) => {
      if (tabs.length > 0) {
        const existingTab = tabs[0];
        
        chrome.tabs.update(existingTab.id, { active: true });
        
        chrome.windows.update(existingTab.windowId, { focused: true });
      } else {
        chrome.tabs.create({ url: "https://www.instagram.com/reels/" });
      }
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