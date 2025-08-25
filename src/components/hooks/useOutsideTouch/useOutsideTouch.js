import { useEffect, useRef, useState } from "react";

export const useOutsideTouch = () => {
    let ref = useRef(null);
    const [display, setDisplay] = useState(false);

    const listener = (e) => {
        if (!ref?.current?.contains(e.target)) setDisplay(false);
    };

    useEffect(() => {
        document.addEventListener('mousedown', listener);
        return () => document.removeEventListener('mousedown', listener);
    }, []);

    return { display, ref, setDisplay }
}