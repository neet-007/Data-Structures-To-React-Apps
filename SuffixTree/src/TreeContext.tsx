import React, {useState, useContext, createContext, ComponentProps, useEffect} from "react";
import { NodeType } from "./Node";
import { QueryType } from "./Query";

/*
    COMMANDS: -1 -> recreate, 0-> initial state, 1-> suffix array, 2 -> lcp array, 3 -> suffix tree, 4 -> end state, 5-> query
    *10 -> resets, *100 -> clean up, *1000 -> skip steps
 */

type TreeContextType = {
    text:string,
    setText:React.Dispatch<React.SetStateAction<string>>;
    suffixArray:number[];
    lcpArray:number[];
    suffixTree:NodeType[];
    suffix:number;
    command:-1 | 0 | 1 | 2 | 3 | 4 | 5 | 10 | 20 | 30 | 40 | 50 | 500 | 1000 | 2000 | 3000 | 5000;
    query:QueryType[];
    skipCommands:boolean[];
    setSuffixArray:React.Dispatch<React.SetStateAction<number[]>>;
    setLcpArray:React.Dispatch<React.SetStateAction<number[]>>;
    setSuffixTree:React.Dispatch<React.SetStateAction<NodeType[]>>;
    ALPHABET:string[];
    setALPHABET: React.Dispatch<React.SetStateAction<string[]>>;
    setCommand:React.Dispatch<React.SetStateAction<-1 | 0 | 1 | 2 | 3 | 4 | 5 | 10 | 20 | 30 | 40 | 50 | 500 | 1000 | 2000 | 3000 | 5000>>;
    setSuffix:React.Dispatch<React.SetStateAction<number>>;
    setQuery:React.Dispatch<React.SetStateAction<QueryType[]>>;
    handleQuery:(q:QueryType[]) => void;
    setSkipCommands: React.Dispatch<React.SetStateAction<boolean[]>>;
};

const INITIAL_STATE = {
    text:'',
    setText:() => {},
    suffixArray:[],
    lcpArray:[],
    suffixTree:[],
    suffix:0,
    query:[],
    skipCommands:[],
    setSuffixArray:() => {},
    setLcpArray:() => {},
    setSuffixTree:() => {},
    ALPHABET:[],
    setALPHABET:() => {},
    command:0,
    setCommand:() => {},
    setSuffix:() => {},
    setQuery:() => {},
    handleQuery:() => {},
    setSkipCommands:() => {}
} as TreeContextType;

const TreeContext = createContext<TreeContextType>(INITIAL_STATE);

function createLeafNode(s:string, node:NodeType, nodeIdx:number, suffix:number, ALPHABET:string[]){
    return {
        parent:nodeIdx,
        stringDepth:s.length - suffix,
        edgeStart:suffix + node.stringDepth,
        edgeEnd:s.length - 1,
        children:Array(ALPHABET.length).fill(-1),
        nodeClassName:'',
        charClassName:{char:-1, className:''}
    } as NodeType;
};

function breakeNode(node:NodeType, nodeIdx:number, start:number, offset:number, ALPHABET:string[]){
    return {
        parent:nodeIdx,
        stringDepth:node.stringDepth + offset,
        edgeStart: start,
        edgeEnd: start + offset - 1,
        children:Array(ALPHABET.length).fill(-1),
        nodeClassName:'',
        charClassName:{char:-1, className:''}
    } as NodeType;
};

export const TreeContextProvider:React.FC<ComponentProps<'div'>> = ({children}) => {
    const [ALPHABET, setALPHABET] = useState<string[]>([
        '$', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
        'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
    ]);
    const [text, setText] = useState<string>('');
    const [suffixArray, setSuffixArray] = useState<number[]>([]);
    const [lcpArray, setLcpArray] = useState<number[]>([]);
    const [suffixTree, setSuffixTree] = useState<NodeType[]>([{parent:-1, stringDepth:0, edgeStart:-1, edgeEnd:-1, children:Array(ALPHABET.length).fill(-1), charClassName:{char:-1, className:''}, nodeClassName:''}]);
    const [suffix, setSuffix] = useState<number>(0);
    const [i, setI] = useState<number>(0);
    const [currIndex, setCurrIndex] = useState<number>(0);
    const [lcpPrev, setLcpPrev] = useState<number>(0);
    const [command, setCommand] = useState<-1 | 0 | 1 | 2 | 3 | 4 | 5 | 10 | 20 | 30 | 40 | 50 | 500 | 1000 | 2000 | 3000 | 5000>(0);
    const [query, setQuery] = useState<QueryType[]>([]);
    const [currNodeIndex, setCurrNodeIndex] = useState<number>(0);
    const [currOffset, setCurrOffest] = useState<number>(0);
    const [currQueryIndex, setCurrQueryIndex] = useState<number>(0);
    const [skipCommands, setSkipCommands] = useState<boolean[]>(Array(3).fill(false));

    useEffect(() => {
        if (command !== 3 && command !== 30 && command !== 3000){
            return
        }else if (command === 30){
            setSuffixTree([{parent:-1, stringDepth:0, edgeStart:-1, edgeEnd:-1, children:Array(ALPHABET.length).fill(-1), charClassName:{char:-1, className:''}, nodeClassName:''}]);
            setCommand(3);
        }else if (i >= text.length){
            setLcpPrev(0);
            setI(0);
            setCurrIndex(0);
            setSuffix(suffixArray[0]);
            setCommand(4);
            setSkipCommands(prev => {
                for (let i = 0; i < prev.length; i++){
                    prev[i] = false;
                };
                return prev
            });
            return
        }else if (command === 3000){
            const suffixTree_:NodeType[] = [];
            suffixTree_.push({parent:-1, stringDepth:0, edgeStart:-1, edgeEnd:-1, nodeClassName:'', charClassName:{char:-1, className:''}, children:Array(ALPHABET.length).fill(-1)});

            let currNode_ = suffixTree_[0];
            let currIndex_ = 0;
            let lcpPrev_ = 0;

            let j = 0;
            while (j < text.length){
                const suffix_ = suffixArray[j];

                while (currNode_.stringDepth > lcpPrev_){
                    currIndex_ = currNode_.parent;
                    currNode_ = suffixTree_[currIndex_];
                };

                if (currNode_.stringDepth === lcpPrev_){
                    currNode_ = createLeafNode(text, currNode_, currIndex_, suffix_, ALPHABET);
                    suffixTree_[currIndex_].children[ALPHABET.indexOf(text[currNode_.edgeStart].toLowerCase())] = suffixTree_.length;
                    currIndex_ = suffixTree_.length;
                    suffixTree_.push(currNode_);
                }else{
                    const start = suffixArray[j - 1] + currNode_.stringDepth;
                    const offset = lcpPrev_ - currNode_.stringDepth;
                    const midNode = breakeNode(currNode_, currIndex_, start, offset, ALPHABET);

                    midNode.children[ALPHABET.indexOf(text[start + offset].toLowerCase())] = currNode_.children[ALPHABET.indexOf(text[start].toLowerCase())];
                    suffixTree_[suffixTree_[currIndex_].children[ALPHABET.indexOf(text[start].toLowerCase())]].parent = suffixTree_.length;
                    suffixTree_[suffixTree_[currIndex_].children[ALPHABET.indexOf(text[start].toLowerCase())]].edgeStart += offset;

                    suffixTree_[currIndex_].children[ALPHABET.indexOf(text[start].toLowerCase())] = suffixTree_.length;
                    currIndex_ = suffixTree_.length;
                    suffixTree_.push(midNode);

                    currNode_ = createLeafNode(text, midNode, currIndex_, suffix_, ALPHABET);
                    suffixTree_[currIndex_].children[ALPHABET.indexOf(text[currNode_.edgeStart].toLowerCase())] = suffixTree_.length;

                    currIndex_ = suffixTree_.length;
                    suffixTree_.push(currNode_);
                };
                if (j < text.length - 1){
                    lcpPrev_ = lcpArray[j];
                };
                j++;
            };
            setSuffixTree(suffixTree_);
            setI(j);
        }else if (command === 3){
            setTimeout(() => {
                setSuffixTree(prev => {
                    let currIndexCopy = currIndex;

                    while (prev[currIndexCopy].stringDepth > lcpPrev){
                        currIndexCopy = prev[currIndexCopy].parent;
                    };

                    if (prev[currIndexCopy].stringDepth === lcpPrev){
                        const newNode = createLeafNode(text, prev[currIndexCopy], currIndexCopy, suffix, ALPHABET);
                        prev[currIndexCopy].children[ALPHABET.indexOf(text[newNode.edgeStart].toLowerCase())] = prev.length;
                        setCurrIndex(prev.length);
                        prev.push(newNode);
                    }else{
                        const start = suffixArray[i - 1] + prev[currIndexCopy].stringDepth;
                        const offset = lcpPrev - prev[currIndexCopy].stringDepth;
                        const midNode = breakeNode(prev[currIndexCopy], currIndexCopy, start, offset, ALPHABET);

                        midNode.children[ALPHABET.indexOf(text[start + offset].toLowerCase())] = prev[currIndexCopy].children[ALPHABET.indexOf(text[start].toLowerCase())];
                        prev[prev[currIndexCopy].children[ALPHABET.indexOf(text[start].toLowerCase())]].parent = prev.length;
                        prev[prev[currIndexCopy].children[ALPHABET.indexOf(text[start].toLowerCase())]].edgeStart += offset;

                        prev[currIndexCopy].children[ALPHABET.indexOf(text[start].toLowerCase())] = prev.length;
                        currIndexCopy = prev.length;
                        prev.push(midNode);

                        const newNode = createLeafNode(text, midNode, currIndexCopy, suffix, ALPHABET);
                        prev[currIndexCopy].children[ALPHABET.indexOf(text[newNode.edgeStart].toLowerCase())] = prev.length;

                        setCurrIndex(prev.length);
                        prev.push(newNode);
                    };
                    if (i < text.length - 1){
                        setLcpPrev(lcpArray[i]);
                    };

                    setI(prev => {
                        setSuffix(suffixArray[prev + 1]);
                        return prev + 1;
                    });
                    return [...prev]
                });
            },2000);
        };
    },[command, currIndex, i]);

    useEffect(() => {
        if (command !== 5 && command !== 500){
            return;
        }else{
            setTimeout(() => {
                setSuffixTree(prevTree => {
                    if (currNodeIndex === -1){
                        setQuery(prevQ => {
                            if (currQueryIndex === query.length - 1){
                                prevQ[currQueryIndex].className = 'unmatching-char';
                            }else{
                                setCurrQueryIndex(prev => {
                                    prevQ[prev + 1].className = 'unmatching-char';
                                    return prev + 1
                                });
                            };
                            return [...prevQ]
                        });
                        setCurrNodeIndex(0);
                        setCommand(500);
                    }else if (command === 500){
                        if (currNodeIndex !== -1){
                            prevTree[currNodeIndex].nodeClassName = '';
                            prevTree[currNodeIndex].charClassName = {char:prevTree[currNodeIndex].edgeStart + currOffset , className:''}
                        };
                        setQuery(prevQ => {
                            prevQ[currQueryIndex].className = '';
                            return [...prevQ]
                        });
                        setCurrNodeIndex(0);
                        setCurrOffest(0);
                        setCurrQueryIndex(0);
                        setCommand(4);
                    }else if (currNodeIndex === 0){
                        prevTree[currNodeIndex].nodeClassName = '';
                        if(prevTree[currNodeIndex].children[ALPHABET.indexOf(query[currQueryIndex].char)] !== -1){
                            prevTree[prevTree[currNodeIndex].children[ALPHABET.indexOf(query[currQueryIndex].char)]].nodeClassName = 'heighlited-node';
                            prevTree[prevTree[currNodeIndex].children[ALPHABET.indexOf(query[currQueryIndex].char)]].charClassName = {char:prevTree[prevTree[currNodeIndex].children[ALPHABET.indexOf(query[currQueryIndex].char)]].edgeStart, className:'heighlited-char'};
                        };
                        setCurrNodeIndex(prev => prevTree[prev].children[ALPHABET.indexOf(query[currQueryIndex].char)]);
                    }else if (text[prevTree[currNodeIndex].edgeStart + currOffset] === query[currQueryIndex].char ){
                        if (prevTree[currNodeIndex].edgeStart + currOffset === prevTree[currNodeIndex].edgeEnd){
                            if (currQueryIndex === query.length - 1){
                                setQuery(prevQ => {
                                    prevQ[currQueryIndex].className = 'found-char';
                                    return [...prevQ]
                                });
                                prevTree[currNodeIndex].nodeClassName = 'found-node';
                                prevTree[currNodeIndex].charClassName = {char:prevTree[currNodeIndex].edgeStart + currOffset, className:'found-char'};
                                setCommand(500);
                            }else{
                                setQuery(prevQ => {
                                    prevQ[currQueryIndex].className = '';
                                    prevQ[currQueryIndex + 1].className = 'heighlited-char';
                                    return [...prevQ]
                                });
                                prevTree[currNodeIndex].nodeClassName = '';
                                prevTree[prevTree[currNodeIndex].children[ALPHABET.indexOf(query[currQueryIndex + 1].char)]].nodeClassName = 'heighlited-node';
                                prevTree[prevTree[currNodeIndex].children[ALPHABET.indexOf(query[currQueryIndex + 1].char)]].charClassName = {char:prevTree[currNodeIndex].edgeStart + currOffset, className:'heighlited-char'};
                                setCurrNodeIndex(prev => prevTree[prev].children[ALPHABET.indexOf(query[currQueryIndex + 1].char)]);
                                setCurrOffest(0);
                                setCurrQueryIndex(prev => prev + 1);
                            };
                        }else{
                            if (currQueryIndex === query.length - 1){
                                setQuery(prevQ => {
                                    prevQ[currQueryIndex].className = 'found-char';
                                    return [...prevQ]
                                });
                                prevTree[currNodeIndex].nodeClassName = 'found-node';
                                prevTree[currNodeIndex].charClassName = {char:prevTree[currNodeIndex].edgeStart + currOffset, className:'found-char'};
                                setCommand(500);
                            }else{
                                setQuery(prevQ => {
                                    prevQ[currQueryIndex].className = '';
                                    prevQ[currQueryIndex + 1].className = 'heighlited-char';
                                    return [...prevQ]
                                });
                                prevTree[currNodeIndex].charClassName = {char:prevTree[currNodeIndex].edgeStart + currOffset + 1, className:'found-char'};
                                setCurrOffest(prev => prev + 1);
                                setCurrQueryIndex(prev => prev + 1);
                            };
                        };
                    }else{
                        setQuery(prevQ => {
                            prevQ[currQueryIndex].className = 'unmatching-char';
                            return [...prevQ]
                        });
                        prevTree[currNodeIndex].nodeClassName = 'unmatching-node';
                        prevTree[currNodeIndex].charClassName = {char:prevTree[currNodeIndex].edgeStart + currOffset, className:'unmatching-char'};
                        setCommand(500);
                    };
                    return [...prevTree]
                });
            },2000);
        };
    },[command, currNodeIndex, currOffset])

    console.log(command);

    function handleQuery(q:QueryType[]){
        setQuery(q);
        setCommand(5);
        setSuffixTree(prev => {
            prev[0].nodeClassName = 'heighlited-node';
            return [...prev]
        });
    }

    const VALUE = {
        text,
        suffixArray,
        lcpArray,
        suffixTree,
        suffix,
        query,
        setText,
        setSuffixArray,
        setLcpArray,
        setSuffixTree,
        ALPHABET,
        setALPHABET,
        command,
        setCommand,
        setSuffix,
        setQuery,
        handleQuery,
        skipCommands,
        setSkipCommands
    };
    return (
        <TreeContext.Provider value={VALUE}>
            {children}
        </TreeContext.Provider>
    );
};

export const useTreeContext = () => useContext(TreeContext);