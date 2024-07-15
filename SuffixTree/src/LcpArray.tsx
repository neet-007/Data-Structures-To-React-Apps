import React, { ComponentProps, useEffect, useMemo, useState } from 'react'
import { useTreeContext } from './TreeContext';

interface LcpArrayProps extends ComponentProps<'div'>{

};

const LcpArray:React.FC<LcpArrayProps> = ({...props}) => {
    const {text, suffixArray, command, setLcpArray, setCommand, setSuffix:setSuffix_} = useTreeContext()
    const [order, setOrder] = useState<number[]>(suffixArray);
    const [lcpArrayBefore, setLcpArrayBefore] = useState<number[]>([]);
    const [lcp, setLcp] = useState<number>(0);
    const [currIndex, setCurrIndex] = useState<number>(0);
    const [suffix, setSuffix] = useState<number>(order[0]);

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
            const currIndex = inverseOrder[suffix];
            if (currIndex === text.length - 1){
                setLcp(0);
                setSuffix((suffix + 1) % text.length);
            }else{
                const nextSuffix = suffixArray[currIndex + 1];
                setLcp(prev => {
                    let lcp_ = Math.max(0, prev - 1);
                    while (suffix + lcp_ < text.length && nextSuffix + lcp_ < text.length){
                        if (text[suffix + lcp_] === text[nextSuffix + lcp_]){
                            lcp_ += 1;
                        }else{
                            break;
                        };
                    };
                    setLcpArrayBefore(prevLcp => {
                        prevLcp[currIndex] = lcp_;
                        return [...prevLcp]
                    });
                    return lcp_
                });
                setSuffix((suffix + 1) % text.length);
            };
            setCurrIndex(prev => prev + 1);
        },2000);
    },[currIndex]);

    function handleReCalculate(){
        setSuffix(0);
        setCurrIndex(0);
        setLcpArrayBefore([]);
        setCommand(20);
    };

    return (
        <div {...props}>
            <div style={{display:'flex', gap:'1rem', alignItems:'center'}}>
                <h3>LCP Array</h3>
                <button disabled={command !== 4} onClick={handleReCalculate} style={{height:'max-content'}}>recalculate</button>
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