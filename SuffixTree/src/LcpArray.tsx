import React, { ComponentProps, useEffect, useMemo, useState } from 'react'
import { useTreeContext } from './TreeContext';
import Modal from './modal/Modal';

interface LcpArrayProps extends ComponentProps<'div'>{

};

const LcpArray:React.FC<LcpArrayProps> = ({...props}) => {
    const {text, suffixArray, command, skipCommands, setLcpArray, setCommand, setSuffix:setSuffix_} = useTreeContext()
    const [order, setOrder] = useState<number[]>(suffixArray);
    const [lcpArrayBefore, setLcpArrayBefore] = useState<number[]>([]);
    const [lcp, setLcp] = useState<number>(0);
    const [currIndex, setCurrIndex] = useState<number>(1);
    const [suffix, setSuffix] = useState<number>(order[0]);
    const [nextSuffix, setNextSuffix] = useState<number>(-1);
    const [isOpen, setIsOpen] = useState<boolean>(false);

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
        if (command !== 2 && command !== 20 && command !== 2000){
            return
        };

        if (currIndex >= text.length){
            if (command === 20){
                setCommand(4);
            }else{
                setLcpArray(lcpArrayBefore);
                setCommand(skipCommands[2] ? 3000 : 3);
                setSuffix_(suffixArray[0]);
            };
            return;
        };
        if (command === 2000){
            function compareLCP(i:number, j:number, lcp__:number){
                let lcp_ = Math.max(0, lcp__);
                while (i + lcp_ < text.length && j + lcp_ < text.length){
                    if (text[i + lcp_] === text[j + lcp_]){
                        lcp_ += 1;
                    }else{
                        break;
                    };
                };

                return lcp_;
            };

            const lcpArray_ = Array(suffixArray.length - 1).fill(0);

            let lcp_ = 0;

            let suffix_ = suffixArray[0];
            let i = 0
            while (i < text.length){
                const currIndex_ = inverseOrder[suffix_];
                if (currIndex_ === text.length - 1){
                    lcp_ = 0;
                    suffix_ = (suffix_ + 1) % text.length;
                    continue;
                };
                const nextSuffix_ = suffixArray[currIndex_ + 1];
                lcp_ = compareLCP(suffix_, nextSuffix_, lcp_ - 1);
                lcpArray_[currIndex_] = lcp_;
                suffix_ = (suffix_ + 1) % text.length;
                i++;
            };
            setCurrIndex(i);
            setLcpArrayBefore(lcpArray_);
        }else if (nextSuffix === -1){
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
            setTimeout(() => {
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
            },2000);
        };
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
                <button onClick={() => setIsOpen(true)}>I</button>
            </div>
            <div style={{display:'flex', gap:'1rem'}}>
                <p>suffix: {(command === 2 || command === 20) ? text.slice(suffix, text.length).split('').map((v, i) => (
                    <span key={`lcp-arr-suffix-${v}-${i}`} className={lcp === i ? 'heighlited-char': lcp > i ? 'found-char' : ''}>{v}</span>
                )) : ''}</p>
                <p>nextSuffix: {nextSuffix > -1 ? text.slice(nextSuffix, text.length).split('').map((v, i) => (
                    <span key={`lcp-arr-next-suffix-${v}-${i}`} className={lcp === i ? 'heighlited-char' : lcp > i ? 'found-char' : ''}>{v}</span>
                )) : ''}</p>
            </div>
            {lcpArrayBefore.map((v, i) => {
                return <div key={`lcp-arr-${i}`}>
                            {v}
                       </div>
            })}
            <Modal isOpen={isOpen} setIsOpen={setIsOpen} title='lcp array'/>
        </div>
    );
};

export default LcpArray