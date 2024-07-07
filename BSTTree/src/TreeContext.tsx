import React, {useState, useEffect, useContext, createContext, ComponentProps} from "react";
import { NodeType } from "./Node";

type nextCommandType = 'add' | 'delete' | 'none';

type ModeType = 'add' | 'delete' | 'find' | 'none';

type TreeContextType = {
    tree:NodeType[];
    treeSize:number;
    addNode:(val:number) => void;
    deleteNode:(val:number) => void;
    find:(val:number) => void;
};

const INITIAL_STATE:TreeContextType = {
    tree:[],
    treeSize:0,
    addNode:() => {},
    deleteNode:() => {},
    find:() => {}
};

const TreeContext = createContext<TreeContextType>(INITIAL_STATE);

export const TreeContextProvider:React.FC<ComponentProps<'div'>> = ({children}) => {
    const [tree, setTree] = useState<NodeType[]>([{val:2, parent:-1, left:1, right:2, className:''}, {val:1, parent:0, left:-1, right:-1, className:''}, {val:4, parent:0, left:-1, right:-1, className:''}]);
    const [treeSize, setTreeSize] = useState<number>(0);
    const [currIndex, setCurrIndex] = useState<number>(-1);
    const [currVal, setCurrVal] = useState<number>(-1);
    const [mode, setMode] = useState<ModeType>('none');
    const [nextCommand, setNextCommand] = useState<nextCommandType>('none');

    useEffect(() => {
        if (currIndex === -1){
            return
        };
        if (mode === 'find'){
            setTimeout(() =>{
                setTree(prev => {
                    if (prev[currIndex].val === currVal){
                        if(nextCommand === 'delete'){
                            setMode('delete');
                        }else{
                            prev[currIndex].className = 'found';
                            setCurrIndex(-1);
                            setCurrVal(-1);
                            setMode('none');
                            //alert(`found ${currIndex}`);
                        };
                    }else if (prev[currIndex].val > currVal){
                        if (prev[currIndex].left === -1){
                            if (nextCommand === 'add'){
                                setMode('add');
                            }else{
                                if (nextCommand === 'none'){
                                    alert(`not found ${currIndex}`);
                                };
                                setCurrIndex(-1);
                                setMode('none');
                                setCurrVal(-1);
                                setNextCommand('none');
                            };
                        }else{
                            prev[currIndex].className = '';
                            prev[prev[currIndex].left].className = 'highlight';
                            setCurrIndex(prev[currIndex].left);
                        };
                    }else{
                        if (prev[currIndex].right === -1){
                            if (nextCommand === 'add'){
                                setMode('add');
                            }else{
                                if(nextCommand === 'none'){
                                    alert(`not found ${currIndex}`)
                                };
                                setCurrIndex(-1);
                                setMode('none');
                                setCurrVal(-1);
                                setNextCommand('none');
                            }}else{
                            prev[currIndex].className = '';
                            prev[prev[currIndex].right].className = 'highlight';
                            setCurrIndex(prev[currIndex].right);
                        };
                    };
                    return [...prev]
                });
            },2000);
        }
        if (mode === 'add'){

        }
    },[currIndex, mode])

    console.log(currIndex)
    function addNode(val:number){
        find(val);
        setNextCommand('add');
        console.log(currIndex);
        setTreeSize(prev => prev + 1);
    };

    function deleteNode(val:number){
        find(val);
        setNextCommand('delete');
    };

    function Getpredecessor(index:number){
        return index
    };

    function find(val:number){
        setTree(prev => {
            prev[0].className = 'highlight';
            return [...prev]
        });
        setCurrIndex(0);
        setMode('find');
        setCurrVal(val);
    };

    return (
    <TreeContext.Provider value={{tree, treeSize, addNode, deleteNode, find}}>
        {children}
    </TreeContext.Provider>
    );
};

export const useTreeContext = () => useContext(TreeContext);