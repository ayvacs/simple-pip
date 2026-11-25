(async () => {
    if ('pictureInPictureEnabled' in document) {
        if (!document.pictureInPictureEnabled) {
            return;
        }
    } else if (!HTMLVideoElement.prototype.requestPictureInPicture) {
        return;
    }

    function findLargestPlayingVideo() {
        const videos = Array.from(document.querySelectorAll('video'))
            .filter(video => video.readyState != 0)
            .filter(video => !video.disablePictureInPicture)
            .sort((v1, v2) => {
                const v1Rect = v1.getBoundingClientRect();
                const v2Rect = v2.getBoundingClientRect();
                return ((v2Rect.width * v2Rect.height) - (v1Rect.width * v1Rect.height));
            });

        if (videos.length === 0) {
            return null;
        }

        return videos[0];
    }

    async function requestPictureInPicture(video) {
        try {
            if (typeof video.requestPictureInPicture !== 'function') {
                return;
            }
            await video.requestPictureInPicture();
            video.setAttribute('__pip__', 'true');
            video.addEventListener('leavepictureinpicture', () => {
                video.removeAttribute('__pip__');
            }, { once: true });
            if (typeof ResizeObserver === 'function') {
                new ResizeObserver(maybeUpdatePictureInPictureVideo).observe(video);
            }
        } catch (err) {
            console.error('Failed to enter Picture-in-Picture:', err);
        }
    }

    function maybeUpdatePictureInPictureVideo(entries, observer) {
        const observedVideo = entries[0].target;
        if (!document.pictureInPictureElement && !document.querySelector('[__pip__]')) {
            observer.unobserve(observedVideo);
            return;
        }
        const video = findLargestPlayingVideo();
        if (video && !video.hasAttribute('__pip__') && video !== document.pictureInPictureElement) {
            observer.unobserve(observedVideo);
            requestPictureInPicture(video);
        }
    }

    if (document.pictureInPictureElement) {
        try {
            if (typeof document.exitPictureInPicture === 'function') {
                await document.exitPictureInPicture();
            }
        } catch (err) {
            console.error('Failed to exit Picture-in-Picture:', err);
        }
        return;
    }

    const video = findLargestPlayingVideo();
    if (!video) {
        return;
    }

    if (video.hasAttribute('__pip__')) {
        try {
            if (typeof document.exitPictureInPicture === 'function') {
                await document.exitPictureInPicture();
            }
        } catch (err) {
            console.error('Failed to exit Picture-in-Picture:', err);
        }
        return;
    }

    await requestPictureInPicture(video);
})();
