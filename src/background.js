if (!document.pictureInPictureEnabled) {
  chrome.browserAction.setTitle({ title: 'Picture-in-Picture NOT supported' });
} else {
  chrome.browserAction.onClicked.addListener(tab => {
    chrome.tabs.executeScript({ file: 'script.js', allFrames: true });
  });
}

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-134864766-1']);

chrome.runtime.onMessage.addListener(data => {
  if (data.message === 'enter')
    _gaq.push(['_trackPageview']);
});

chrome.storage.sync.get({ optOutAnalytics: false }, results => {
  if (results.optOutAnalytics) {
    return;
  }
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
});
