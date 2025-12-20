document.addEventListener('DOMContentLoaded', () => {
  const selector = document.getElementById('platform');
  const saveBtn = document.getElementById('saveBtn');
  const status = document.getElementById('status');

  chrome.storage.sync.get(['preferredPlatform'], (result) => {
    if (result.preferredPlatform) {
      selector.value = result.preferredPlatform;
    }
  });

  saveBtn.addEventListener('click', () => {
    const platform = selector.value;
    chrome.storage.sync.set({ preferredPlatform: platform }, () => {
      status.textContent = 'Saved!';
      setTimeout(() => { status.textContent = ''; }, 1500);
    });
  });
});