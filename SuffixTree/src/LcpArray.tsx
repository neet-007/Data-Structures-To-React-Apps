import React, { ComponentProps, useEffect, useMemo, useState } from 'react'
import { useTreeContext } from './TreeContext';

interface LcpArrayProps extends ComponentProps<'div'>{

};

const LcpArray:React.FC<LcpArrayProps> = ({...props}) => {
    const {text, suffixArray, command, setLcpArray, setCommand, setSuffix:setSuffix_} = useTreeContext()
    const [order, setOrder] = useState<number[]>(suffixArray);
    const [lcpArrayBefore, setLcpArrayBefore] = useState<number[]>([]);
    const [lcp, setLcp] = useState<number>(0);
    const [currIndex, setCurrIndex] = useState<number>(1);
    const [suffix, setSuffix] = useState<number>(order[0]);
    const [nextSuffix, setNextSuffix] = useState<number>(-1);

    const inverseOrder = useMemo(() => {
        if (suffixArray.length === 0){
            return []
        };

        const return_value = Array(suffixArray.length).fill(0);
        for (let i = 0; i < suffixArray.length; i ++){
            return_value[suffixArray[i]] = i;
        };

        return return_value
    },[text]);

    useEffect(() => {
        if (command !== 2 && command !== 20){
            return
        };

        if (currIndex >= text.length){
            if (command === 20){
                setCommand(4);
            }else{
                setLcpArray(lcpArrayBefore);
                setCommand(3);
                setSuffix_(suffixArray[0]);
            };
            return;
        };

        setTimeout(() => {
            if (nextSuffix === -1){
                const currIndex_ = inverseOrder[suffix];
                if (currIndex_ === text.length - 1){
                    setLcp(0);
                    setSuffix(prev => {
                        return (prev + 1) % text.length
                    });
                }else{
                    setNextSuffix(suffixArray[currIndex_ + 1]);
                };
            }else if (nextSuffix === -2){
                setSuffix(prev => {
                    setLcpArrayBefore(prevLcp => {
                        prevLcp[inverseOrder[prev]] = lcp;
                        return [...prevLcp]
                    });
                    return (prev + 1) % text.length
                });
                setLcp(prev => prev - 1);
                setNextSuffix(-1);
                setCurrIndex(prev => prev + 1);
            }else{
                    const prevLcp = Math.max(0, lcp);
                    if (suffix + prevLcp < text.length && nextSuffix + prevLcp < text.length){
                        if (text[suffix + prevLcp] === text[nextSuffix + prevLcp]){
                            console.log('lcpprev', prevLcp)
                            setLcp(prevLcp + 1);
                        }else{
                            setNextSuffix(-2);
                        };
                    }else{
                        setNextSuffix(-2);
                    };
            };
        },2000);
    },[currIndex, command, suffix, nextSuffix, lcp]);

    function handleReCalculate(){
        setSuffix(order[0]);
        setNextSuffix(-1);
        setLcp(0);
        setCurrIndex(1);
        setLcpArrayBefore([]);
        setCommand(20);
    };

    return (
        <div {...props}>
            <div style={{display:'flex', gap:'1rem', alignItems:'center'}}>
                <h3>LCP Array</h3>
                <button disabled={command !== 4} onClick={handleReCalculate} style={{height:'max-content'}}>recalculate</button>
            </div>
            <div style={{display:'flex', gap:'1rem'}}>
                <p>suffix: </p>
                <p>nextSuffix: </p>
            </div>
            {lcpArrayBefore.map((v, i) => {
                return <div key={`lcp-arr-${i}`}>
                            {v}
                       </div>
            })}
        </div>
    );
};

export default LcpArray