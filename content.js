console.log("Gemini Reels Runner (State Detection) loaded.");

let isRunning = false;

function checkForStopButton() {
    const allButtons = Array.from(document.querySelectorAll('button'));
    
    const stopButton = allButtons.find(btn => {
        const text = btn.innerText || "";
        const label = btn.getAttribute('aria-label') || "";
        return text.trim() === "Stop" || label.includes("Stop");
    });
    const isBusy = !!stopButton;

    handleStateChange(isBusy);
}

function handleStateChange(isBusy) {
    if (isBusy && !isRunning) {
        console.log("Stop button detected. AI is thinking...");
        isRunning = true;
        chrome.runtime.sendMessage({ action: "start_doomscrolling" });
    } 
    else if (!isBusy && isRunning) {
        console.log("Stop button gone. AI is done!");
        isRunning = false;
        chrome.runtime.sendMessage({ action: "generation_complete" });
    }
}
setInterval(checkForStopButton, 500);