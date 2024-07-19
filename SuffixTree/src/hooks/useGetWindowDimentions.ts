import { useEffect, useState } from "react";
export function useGetWindowDimentions(){
    const [windowDimentions, setWindowDimentions] = useState<{height:number, width:number}>({height:0, width:0});
    useEffect(() => {
        function updateWindowDimentions(){
            setWindowDimentions({height:window.innerHeight, width:window.innerWidth});
        };

        window.addEventListener('resize', updateWindowDimentions);
        updateWindowDimentions();

        return () => window.removeEventListener('resize', updateWindowDimentions);
    },[]);

    return windowDimentions;
};