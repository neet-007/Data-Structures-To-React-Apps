import React, { ComponentProps, useEffect, useState } from 'react'
import { useTreeContext } from './TreeContext';

interface SuffixArrayProps extends ComponentProps<'div'>{

};

const SuffixArray:React.FC<SuffixArrayProps> = ({...props}) => {
    const {text, setSuffixArray, ALPHABET, command, setCommand} = useTreeContext()
    const [length, setLength] = useState(0);
    const [order, setOrder] = useState<number[]>(Array(text.length).fill(0));
    const [eqvClasses, setEqvClasses] = useState<number[]>(Array(text.length).fill(0));

    useEffect(() => {
        if (command !== 1 && command !== 10){
            return
        };
        if (text !== '' && length > text.length){
            if (command === 10){
                setCommand(4);
            }else{
                setSuffixArray(order);
                setCommand(2);
            };
            return
        }else if (length === 0){
            setTimeout(() => {
                setOrder(prev => {
                    const count = Array(ALPHABET.length).fill(0);

                    for (let i = 0; i < text.length; i ++){
                        count[ALPHABET.indexOf(text[i].toLowerCase())] += 1;
                    };

                    for (let j = 1; j < count.length; j ++){
                        count[j] += count[j - 1];
                    };

                    for (let i = text.length - 1; i >= 0; i --){
                        count[ALPHABET.indexOf(text[i].toLowerCase())] -= 1;
                        prev[count[ALPHABET.indexOf(text[i].toLowerCase())]] = i;
                    };

                    setEqvClasses(prev_ => {
                        for (let i = 1; i < text.length; i ++){
                            if (text[prev[i]] !== text[prev[i - 1]]){
                                prev_[prev[i]] = prev_[prev[i - 1]] + 1;
                            }else{
                                prev_[prev[i]] = prev_[prev[i - 1]];
                            };
                        };

                        return [...prev_]
                    });

                    setLength(1);
                    return [...prev]
                });
            },2000);
        }else{
            setTimeout(() => {
                setOrder(prevOrder => {
                    const newOrder = Array(text.length).fill(0);
                    const count = Array(text.length).fill(0);

                    for (let i = 0; i < text.length; i ++){
                        count[eqvClasses[i]] += 1;
                    };

                    for (let j = 1; j < text.length; j ++){
                        count[j] += count[j - 1];
                    };

                    for (let i = text.length - 1; i >= 0; i --){
                        const start = (prevOrder[i] - length + text.length) % text.length;
                        const cl = eqvClasses[start];
                        count[cl] -= 1;
                        newOrder[count[cl]] = start;
                    };

                    const newClasses = Array(text.length).fill(0);

                    for (let i = 1; i < text.length; i ++){
                        const curr = newOrder[i];
                        const prev = newOrder[i - 1];
                        const currMid = (curr + length) % text.length;
                        const prevMid = (prev + length) % text.length;

                        if (eqvClasses[curr] !== eqvClasses[prev] || eqvClasses[currMid] !== eqvClasses[prevMid]){
                            newClasses[curr] = newClasses[prev] + 1;
                        }else{
                            newClasses[curr] = newClasses[prev];
                        };
                    };

                    setEqvClasses(newClasses);

                    return newOrder
                });
                setLength(prev => prev * 2);
            },2000);
        };
    },[length, command])

    function handleReCalculate(){
        setLength(0);
        setCommand(10);
    };

    return (
        <>
            <div style={{display:'flex', gap:'1rem', alignItems:'center'}}>
                <h3>Suffix Array</h3>
                <button disabled={command !== 4} onClick={handleReCalculate} style={{height:'max-content'}}>recalculate</button>
            </div>
            {order[0] !== -1 &&
            <div {...props}>
                {order.map((v, i) => {
                    return <div key={`suff-arr-${i}`}>
                            {text.slice(v, v + (length))}
                           </div>
                })}
            </div>
            }
        </>
    )
}

export default SuffixArray