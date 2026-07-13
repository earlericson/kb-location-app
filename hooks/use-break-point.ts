import { useState, useEffect } from 'react';

export const useBreakPoint = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            // Set to true if screen width is less than 768px (Tailwind's md breakpoint)
            setIsMobile(window.innerWidth < 768);
        };

        // Set initial state
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile;
};