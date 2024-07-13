import React, {useState, useContext, createContext, ComponentProps, useEffect} from "react";
import { NodeType } from "./Node";

type TreeContextType = {
    text:string,
    setText:React.Dispatch<React.SetStateAction<string>>;
    suffixArray:number[];
    lcpArray:number[];
    suffixTree:NodeType[];
    command:0 | 1 | 2 | 3 | 4;
    setSuffixArray: React.Dispatch<React.SetStateAction<number[]>>;
    setLcpArray: React.Dispatch<React.SetStateAction<number[]>>;
    setSuffixTree: React.Dispatch<React.SetStateAction<NodeType[]>>;
    ALPHABET:string[];
    setALPHABET: React.Dispatch<React.SetStateAction<string[]>>;
    setCommand:React.Dispatch<React.SetStateAction<0 | 1 | 2 | 3 | 4>>;
};

const INITIAL_STATE = {
    text:'',
    setText:() => {},
    suffixArray:[],
    lcpArray:[],
    suffixTree:[],
    setSuffixArray:() => {},
    setLcpArray:() => {},
    setSuffixTree:() => {},
    ALPHABET:[],
    setALPHABET:() => {},
    command:0,
    setCommand:() => {},
} as TreeContextType;

const TreeContext = createContext<TreeContextType>(INITIAL_STATE);

export const TreeContextProvider:React.FC<ComponentProps<'div'>> = ({children}) => {
    const [ALPHABET, setALPHABET] = useState<string[]>([
        '$', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
        'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
    ]);
    const [text, setText] = useState<string>('acacbacbacc');
    const [suffixArray, setSuffixArray] = useState<number[]>([]);
    const [lcpArray, setLcpArray] = useState<number[]>([]);
    const [suffixTree, setSuffixTree] = useState<NodeType[]>([
        {
          parent: -1,
          stringDepth: 0,
          edgeStart: -1,
          edgeEnd: -1,
          children: [
            -1,  2,  8, 10, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1
          ]
        },
        {
          parent: 2,
          stringDepth: 11,
          edgeStart: 2,
          edgeEnd: 10,
          children: [
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1
          ]
        },
        {
          parent: 0,
          stringDepth: 2,
          edgeStart: 0,
          edgeEnd: 1,
          children: [
            -1,  1,  4,  6, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1
          ]
        },
        {
          parent: 4,
          stringDepth: 9,
          edgeStart: 7,
          edgeEnd: 10,
          children: [
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1
          ]
        },
        {
          parent: 2,
          stringDepth: 5,
          edgeStart: 4,
          edgeEnd: 6,
          children: [
            -1, -1,  3,  5, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1
          ]
        },
        {
          parent: 4,
          stringDepth: 6,
          edgeStart: 10,
          edgeEnd: 10,
          children: [
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1
          ]
        },
        {
          parent: 2,
          stringDepth: 3,
          edgeStart: 10,
          edgeEnd: 10,
          children: [
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1
          ]
        },
        {
          parent: 8,
          stringDepth: 7,
          edgeStart: 7,
          edgeEnd: 10,
          children: [
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1
          ]
        },
        {
          parent: 0,
          stringDepth: 3,
          edgeStart: 4,
          edgeEnd: 6,
          children: [
            -1, -1,  7,  9, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1
          ]
        },
        {
          parent: 8,
          stringDepth: 4,
          edgeStart: 10,
          edgeEnd: 10,
          children: [
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1
          ]
        },
        {
          parent: 0,
          stringDepth: 1,
          edgeStart: 10,
          edgeEnd: 10,
          children: [
            -1, 11, 13, 15, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1
          ]
        },
        {
          parent: 10,
          stringDepth: 10,
          edgeStart: 2,
          edgeEnd: 10,
          children: [
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1
          ]
        },
        {
          parent: 13,
          stringDepth: 8,
          edgeStart: 7,
          edgeEnd: 10,
          children: [
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1
          ]
        },
        {
          parent: 10,
          stringDepth: 4,
          edgeStart: 4,
          edgeEnd: 6,
          children: [
            -1, -1, 12, 14, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1
          ]
        },
        {
          parent: 13,
          stringDepth: 5,
          edgeStart: 10,
          edgeEnd: 10,
          children: [
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1
          ]
        },
        {
          parent: 10,
          stringDepth: 2,
          edgeStart: 10,
          edgeEnd: 10,
          children: [
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1
          ]
        }
      ]);
    const [i, setI] = useState<number>(0);
    const [currIndex, setCurrIndex] = useState<number>(0);
    const [lcpPrev, setLcpPrev] = useState<number>(0);
    const [command, setCommand] = useState<0 | 1 | 2 | 3 | 4>(0);

    useEffect(() => {
        if (command !== 3){
            return
        }else if (i >= text.length){
            setCommand(4);
            return
        }else{
            setTimeout(() => {
                function createLeafNode(s:string, node:NodeType, nodeIdx:number, suffix:number){
                    return {
                        parent:nodeIdx,
                        stringDepth:s.length - suffix,
                        edgeStart:suffix + node.stringDepth,
                        edgeEnd:s.length - 1,
                        children:Array(ALPHABET.length).fill(-1)
                    };
                };

                function breakeNode(node:NodeType, nodeIdx:number, start:number, offset:number){
                    return {
                        parent:nodeIdx,
                        stringDepth:node.stringDepth + offset,
                        edgeStart: start,
                        edgeEnd: start + offset - 1,
                        children:Array(ALPHABET.length).fill(-1)
                    };
                };

                setSuffixTree(prev => {
                    const suffix = suffixArray[i];
                    let currIndexCopy = currIndex;

                    while (prev[currIndexCopy].stringDepth > lcpPrev){
                        currIndexCopy = prev[currIndexCopy].parent;
                    };

                    if (prev[currIndexCopy].stringDepth === lcpPrev){
                        const newNode = createLeafNode(text, prev[currIndexCopy], currIndexCopy, suffix);
                        prev[currIndexCopy].children[ALPHABET.indexOf(text[newNode.edgeStart].toLowerCase())] = prev.length;
                        setCurrIndex(prev.length);
                        prev.push(newNode);
                    }else{
                        const start = suffixArray[i - 1] + prev[currIndexCopy].stringDepth;
                        const offset = lcpPrev - prev[currIndexCopy].stringDepth;
                        const midNode = breakeNode(prev[currIndexCopy], currIndexCopy, start, offset);

                        midNode.children[ALPHABET.indexOf(text[start + offset].toLowerCase())] = prev[currIndexCopy].children[ALPHABET.indexOf(text[start].toLowerCase())];
                        prev[prev[currIndexCopy].children[ALPHABET.indexOf(text[start].toLowerCase())]].parent = prev.length;
                        prev[prev[currIndexCopy].children[ALPHABET.indexOf(text[start].toLowerCase())]].edgeStart += offset;

                        prev[currIndexCopy].children[ALPHABET.indexOf(text[start].toLowerCase())] = prev.length;
                        currIndexCopy = prev.length;
                        prev.push(midNode);

                        const newNode = createLeafNode(text, midNode, currIndexCopy, suffix);
                        prev[currIndexCopy].children[ALPHABET.indexOf(text[newNode.edgeStart].toLowerCase())] = prev.length;

                        setCurrIndex(prev.length);
                        prev.push(newNode);
                    };
                    if (i < text.length - 1){
                        setLcpPrev(lcpArray[i]);
                    };

                    setI(prev => prev + 1);
                    return [...prev]
                });


            },2000);
        };
    },[command, currIndex]);

    console.log(command);

    const VALUE = {
        text,
        setText,
        suffixArray,
        lcpArray,
        suffixTree,
        setSuffixArray,
        setLcpArray,
        setSuffixTree,
        ALPHABET,
        setALPHABET,
        command,
        setCommand
    };
    return (
        <TreeContext.Provider value={VALUE}>
            {children}
        </TreeContext.Provider>
    );
};

export const useTreeContext = () => useContext(TreeContext);