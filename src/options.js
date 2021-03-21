chrome.storage.sync.get({ optOutAnalytics: false }, results => {
  const optOutAnalyticsCheckbox = document.querySelector('#optOutAnalytics');

  optOutAnalyticsCheckbox.checked = results.optOutAnalytics;
  optOutAnalyticsCheckbox.onchange = _ => {
    chrome.storage.sync.set({
      optOutAnalytics: optOutAnalyticsCheckbox.checked
    }, _ => {
      // Reload extension to make opt-out change immediate.
      chrome.runtime.reload();
      window.close();
    });
  };
});
