import React, {useState, useEffect, useContext, createContext, ComponentProps} from "react";
import { NodeType } from "./Node";

type nextCommandType = 'add' | 'delete' | 'none';

type ModeType = 'add' | 'delete' | 'find' | 'none';

type TreeContextType = {
    tree:NodeType[];
    addNode:(val:number) => void;
    deleteNode:(val:number) => void;
    find:(val:number) => void;
};

const INITIAL_STATE:TreeContextType = {
    tree:[],
    addNode:() => {},
    deleteNode:() => {},
    find:() => {}
};

const TreeContext = createContext<TreeContextType>(INITIAL_STATE);

export const TreeContextProvider:React.FC<ComponentProps<'div'>> = ({children}) => {
    const [tree, setTree] = useState<NodeType[]>([]);
    const [currIndex, setCurrIndex] = useState<number>(-1);
    const [currVal, setCurrVal] = useState<number>(-1);
    const [nextVal, setNextVal] = useState<number>(-1);
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
                        if (nextCommand === 'add'){
                            if (prev[currIndex].right !== -1){
                                setCurrIndex(prev[currIndex].right);
                            }else{
                                setMode('add');
                                prev[currIndex].className = 'found';
                            };
                        }else if(nextCommand === 'delete'){
                            console.log('delte')
                            console.log(prev[currIndex])
                            setMode('delete');
                            prev[currIndex].className = 'found';
                        }else{
                            prev[currIndex].className = 'found';
                            setCurrIndex(-1);
                            setCurrVal(-1);
                            setMode('none');
                            prev[currIndex].className = 'found';
                            //alert(`found ${currIndex}`);
                        };
                    }else if (prev[currIndex].val > currVal){
                        if (prev[currIndex].left === -1){
                            prev[currIndex].className = '';
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
                            prev[currIndex].className = '';
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
                            };
                        }else{
                            prev[currIndex].className = '';
                            prev[prev[currIndex].right].className = 'highlight';
                            setCurrIndex(prev[currIndex].right);
                        };
                    };
                    if (prev[currIndex].parent !== -1){
                        prev[prev[currIndex].parent].className = ''
                    }
                    return [...prev]
                });
            },700);
        }
        if (mode === 'add'){
            setTimeout(() => {
                setTree(prev => {
                    const newNode = {val:nextVal, parent:currIndex, left:-1, right:-1, className:''} as NodeType;
                    if(prev[currIndex].val > nextVal){
                        prev[currIndex].left = prev.length;
                    }else{
                        prev[currIndex].right = prev.length;
                    };
                    prev[currIndex].className = '';
                    return [...prev, newNode]
                });
                setCurrVal(-1);
                setMode('none');
                setCurrIndex(-1);
                setNextCommand('none');
            }, 700);
        };
        if (mode === 'delete'){
            setTimeout(() => {
                setTree(prev => {
                    // leaf node
                    if (prev[currIndex].left === -1 && prev[currIndex].right === -1){
                        if (prev[prev[currIndex].parent].left === currIndex){
                            prev[prev[currIndex].parent].left = -1;
                        }else{
                            prev[prev[currIndex].parent].right = -1;
                        };

                        // correct the children indecies after shifting
                        for (let i = prev[currIndex].parent; i < prev.length; i++){
                            if (i !== currIndex && prev[i].parent !== -1){
                                prev[i].parent =- 1;
                            };
                            if (prev[i].left !== -1){
                                prev[i].left -= 1;
                            };
                            if (prev[i].right !== -1){
                                prev[i].right -= 1;
                            };
                        };
                        prev = prev.filter((v, i) => i === currIndex ? undefined: v);
                    // one child on left
                    }else if (prev[currIndex].left !== -1 && prev[currIndex].right === -1){
                        // swap parents
                        prev[prev[currIndex].left].parent = prev[currIndex].parent;

                        const curr = prev[currIndex].left;
                        prev[currIndex] = prev[curr];
                        prev = prev.filter((v, i) => i === curr ? undefined : v);
                        for (let i = currIndex; i < prev.length; i ++){
                            if (i !== currIndex && prev[i].parent !== -1){
                                prev[i].parent -= 1;
                            };
                            if (prev[i].left !== -1){
                                prev[i].left -= 1;
                            };
                            if (prev[i].right !== -1){
                                prev[i].right -= 1;
                            };
                        };
                    // one child on rigth
                    }else if (prev[currIndex].right !== -1 && prev[currIndex].left === -1){
                        // swap parents
                        prev[prev[currIndex].right].parent = prev[currIndex].parent;

                        const curr = prev[currIndex].right;
                        prev[currIndex] = prev[curr];
                        prev = prev.filter((v, i) => i === curr ? undefined : v);
                        for (let i = currIndex; i < prev.length; i ++){
                            if (i !== currIndex && prev[i].parent !== -1){
                                prev[i].parent -= 1;
                            };
                            if (prev[i].left !== -1){
                                prev[i].left -= 1;
                            };
                            if (prev[i].right !== -1){
                                prev[i].right -= 1;
                            };
                        };
                    // two children
                    }else{
                        let curr = prev[currIndex].right;

                        while(prev[curr].left !== -1){
                            curr = prev[curr].left;
                        };

                        const currParent = prev[curr].parent;

                        prev[curr].parent = prev[currIndex].parent;

                        if (currParent !== currIndex){
                            prev[currParent].left = prev[curr].right;
                            if (prev[curr].right !== -1){
                                prev[prev[curr].right].parent = currParent;
                            };

                            prev[curr].left = prev[currIndex].left;

                            prev[curr].right = prev[currIndex].right;
                        }else{
                            console.log('here')
                            prev[curr].left = prev[currIndex].left;
                            if (prev[curr].right !== -1){
                                prev[prev[curr].right].parent = currIndex;
                            };
                        };
                        // overwrite the deleted node
                        prev[currIndex] = prev[curr];
                        // remove the duplicated node
                        prev = prev.filter((v, i) => i === curr ? undefined : v);
                        // correct all the shifted indecies
                        for (let i = currIndex; i < prev.length; i ++){
                            if (i !== currIndex && prev[i].parent !== -1){
                                prev[i].parent -= 1;
                            };
                            if (prev[i].left !== -1 && prev[i].left !== currIndex + 1){
                                prev[i].left -= 1;
                            };
                            if (prev[i].right !== -1){
                                prev[i].right -= 1;
                            };
                        };
                    };
                    setCurrIndex(-1);
                    setCurrVal(-1);
                    setMode('none');
                    setNextCommand('none');
                    return [...prev]
                })
            }, 700);
        };
    },[currIndex, mode]);

    function addNode(val:number){
        if (tree.length === 0){
            setTree(prev => [...prev, {val, parent:-1, left:-1, right:-1} as NodeType]);
            return;
        }
        find(val);
        setNextCommand('add');
        setNextVal(val);
    };

    function deleteNode(val:number){
        if (tree.length === 0){
            return;
        };
        find(val);
        setNextCommand('delete');
    };

    function find(val:number){
        if (tree.length === 0){
            return;
        };
        setTree(prev => {
            prev[0].className = 'highlight';
            return [...prev]
        });
        setCurrIndex(0);
        setMode('find');
        setCurrVal(val);
    };

    return (
    <TreeContext.Provider value={{tree, addNode, deleteNode, find}}>
        {children}
    </TreeContext.Provider>
    );
};

export const useTreeContext = () => useContext(TreeContext);