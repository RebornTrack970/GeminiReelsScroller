console.log("Gemini Reels Runner (V7 - Instant Trigger) loaded.");

let isRunning = false;
let lastTriggerTime = 0;


document.addEventListener('keydown', (e) => {
    const target = e.target;
    const isInput = target.matches('textarea, [contenteditable="true"]');
    
    if (e.key === 'Enter' && !e.shiftKey && isInput) {
        console.log("Enter key detected. Triggering instant start.");
        activateGracePeriod();
    }
}, true);

document.addEventListener('click', (e) => {
    const target = e.target.closest('button');
    if (target) {
        const label = (target.getAttribute('aria-label') || "").toLowerCase();
        const text = (target.innerText || "").toLowerCase();
        const testId = (target.getAttribute('data-testid') || "").toLowerCase();
        
        if (label.includes("run") || text.includes("run") || 
            label.includes("send") || testId.includes("send")) {
            console.log("Run/Send click detected. Triggering instant start.");
            activateGracePeriod();
        }
    }
}, true);

function activateGracePeriod() {
    lastTriggerTime = Date.now();
    handleStateChange(true);
}


setInterval(() => {
    const host = window.location.hostname;
    let isBusy = false;

    if (host.includes("aistudio.google.com")) {
        isBusy = checkAIStudio();
    } else if (host.includes("chatgpt.com")) {
        isBusy = checkChatGPT();
    } else if (host.includes("gemini.google.com")) {
        isBusy = checkGemini();
    }

    const inGracePeriod = (Date.now() - lastTriggerTime) < 3000; // 3000ms = 3 seconds
    const effectiveBusy = isBusy || inGracePeriod;

    handleStateChange(effectiveBusy);
}, 500);



function isVisible(elem) {
    if (!elem) return false;
    return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
}

function checkAIStudio() {
    const candidates = document.querySelectorAll('button, [role="button"], [aria-label*="Stop"]');
    const stopBtn = Array.from(candidates).find(el => {
        if (!isVisible(el)) return false;
        const text = (el.innerText || "").toLowerCase();
        const label = (el.getAttribute('aria-label') || "").toLowerCase();
        return text === "stop" || label === "stop" || label.includes("stop response");
    });
    
    const thinkingSpan = Array.from(document.querySelectorAll('span, div')).find(el => {
        return isVisible(el) && el.innerText.trim() === "Thinking";
    });

    return !!stopBtn || !!thinkingSpan;
}

function checkChatGPT() {
    const stopBtn = document.querySelector('button[data-testid="stop-button"]');
    return isVisible(stopBtn);
}

function checkGemini() {
    const stopBtn = document.querySelector('button[aria-label*="Stop"], [role="button"][aria-label*="Stop"]');
    const stopIcon = document.querySelector('mat-icon[data-mat-icon-name="stop"]');
    return (stopBtn && isVisible(stopBtn)) || (stopIcon && isVisible(stopIcon));
}


function handleStateChange(shouldBeRunning) {
    if (shouldBeRunning && !isRunning) {
        console.log("Status: STARTING (Interaction or Thinking detected)");
        isRunning = true;
        chrome.runtime.sendMessage({ action: "start_doomscrolling" });
    } 
    else if (!shouldBeRunning && isRunning) {
        console.log("Status: DONE. Returning to work...");
        isRunning = false;
        chrome.runtime.sendMessage({ action: "generation_complete" });
    }
}
