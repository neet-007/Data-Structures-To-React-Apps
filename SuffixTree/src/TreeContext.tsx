import React, {useState, useContext, createContext, ComponentProps} from "react";
import { NodeType } from "./Node";

type TreeContextType = {
    text:string,
    setText:React.Dispatch<React.SetStateAction<string>>;
    suffixArray:number[];
    lcpArray:number[];
    suffixTree:NodeType[];
    command:0 | 1 | 2 | 3;
    setSuffixArray: React.Dispatch<React.SetStateAction<number[]>>;
    setLcpArray: React.Dispatch<React.SetStateAction<number[]>>;
    setSuffixTree: React.Dispatch<React.SetStateAction<NodeType[]>>;
    ALPHABET:string[];
    setALPHABET: React.Dispatch<React.SetStateAction<string[]>>;
    setCommand:React.Dispatch<React.SetStateAction<0 | 1 | 2 | 3>>;
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
    const [text, setText] = useState<string>('');
    const [suffixArray, setSuffixArray] = useState<number[]>([]);
    const [lcpArray, setLcpArray] = useState<number[]>([]);
    const [suffixTree, setSuffixTree] = useState<NodeType[]>([{parent:-1, stringDepth:0, edgeStart:0, edgeEnd:0, children:[1,2,3]},{parent:1, stringDepth:0, edgeStart:0, edgeEnd:0, children:[]},{parent:1, stringDepth:0, edgeStart:0, edgeEnd:0, children:[]},{parent:1, stringDepth:0, edgeStart:0, edgeEnd:0, children:[]},]);
    const [command, setCommand] = useState<0 | 1 | 2 | 3>(0);
    const [ALPHABET, setALPHABET] = useState<string[]>([
        '$', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
        'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
    ]);
    console.log(command)
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