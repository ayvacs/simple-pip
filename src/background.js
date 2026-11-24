const browserAPI = globalThis.browser || globalThis.chrome;

browserAPI.action.onClicked.addListener(async (tab) => {
    if (!tab.id) return;

    try {
        await browserAPI.scripting.executeScript({
            target: { tabId: tab.id, allFrames: true },
            files: ['script.js']
        });
    } catch (err) {
        console.error('Failed to execute Picture-in-Picture script:', err);
    }
});
