import { useState, useCallback } from 'react';

export const useFullScreen = () => {
    const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

    const enterFullScreen = useCallback(() => {
        const element = document.documentElement; // Full screen for the whole page
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if ((element as any).mozRequestFullScreen) {
            (element as any).mozRequestFullScreen(); // Firefox
        } else if ((element as any).webkitRequestFullscreen) {
            (element as any).webkitRequestFullscreen(); // Chrome, Safari, Opera
        } else if ((element as any).msRequestFullscreen) {
            (element as any).msRequestFullscreen(); // IE/Edge
        }
        setIsFullScreen(true);
    }, []);

    const exitFullScreen = useCallback(() => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
            (document as any).mozCancelFullScreen(); // Firefox
        } else if ((document as any).webkitExitFullscreen) {
            (document as any).webkitExitFullscreen(); // Chrome, Safari, Opera
        } else if ((document as any).msExitFullscreen) {
            (document as any).msExitFullscreen(); // IE/Edge
        }
        setIsFullScreen(false);
    }, []);

    const toggleFullScreen = useCallback(() => {
        if (isFullScreen) {
            exitFullScreen();
        } else {
            enterFullScreen();
        }
    }, [isFullScreen, enterFullScreen, exitFullScreen]);

    return {
        isFullScreen,
        enterFullScreen,
        exitFullScreen,
        toggleFullScreen,
    };
};
