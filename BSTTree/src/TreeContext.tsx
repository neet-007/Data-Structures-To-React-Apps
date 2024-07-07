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
    const [tree, setTree] = useState<NodeType[]>([{val:7, parent:-1, left:1, right:2, className:''}, {val:4, parent:0, left:-1, right:-1, className:''}, {val:14, parent:0, left:-1, right:-1, className:''}]);
    const [treeSize, setTreeSize] = useState<number>(0);
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
                        console.log('equal')
                        if (nextCommand === 'add'){
                            setMode('add');
                        }else if(nextCommand === 'delete'){
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
            },2000);
        }
        if (mode === 'add'){
            setTree(prev => {
                const newNode = {val:nextVal, parent:currIndex, left:-1, right:-1, className:''} as NodeType;
                if(prev[currIndex].val > nextVal){
                    prev[currIndex].left = prev.length;
                }else{
                    prev[currIndex].right = prev.length;
                };
                return [...prev, newNode]
            });
            setCurrVal(-1);
            setMode('none');
            setCurrIndex(-1);
            setNextCommand('none');
        };

        if (mode === 'delete'){
            setTree(prev => {
                // leaf node
                if (prev[currIndex].left === -1 && prev[currIndex].right === -1){
                    console.log('leaf')
                    if (prev[prev[currIndex].parent].left === currIndex){
                        prev[prev[currIndex].parent].left = -1;
                    }else{
                        prev[prev[currIndex].parent].right = -1;
                    };

                    // correct the children indecies after shifting
                    for (let i = prev[currIndex].parent; i < prev.length; i++){
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
                    console.log('one child left')
                    // swap parents
                    prev[prev[currIndex].left].parent = prev[currIndex].parent;

                    // replace the node with grandchild
                    if (prev[prev[currIndex].parent].left === currIndex){
                        prev[prev[currIndex].parent].left = prev[currIndex].left;
                    }else{
                        prev[prev[currIndex].parent].right = prev[currIndex].left;
                    };

                    // correct the children indecies after shifting
                    for (let i = prev[currIndex].parent; i < prev.length; i++){
                        if (prev[i].left !== -1){
                            prev[i].left -= 1;
                        };
                        if (prev[i].right !== -1){
                            prev[i].right -= 1;
                        };
                    };

                    prev = prev.filter((v, i) => i === currIndex ? undefined : v);
                // one child on rigth
                }else if (prev[currIndex].right !== -1 && prev[currIndex].left === -1){
                    console.log('one child right')
                    // swap parents
                    prev[prev[currIndex].right].parent = prev[currIndex].parent;

                    // replace the node with grandchild
                    if (prev[prev[currIndex].parent].left === currIndex){
                        prev[prev[currIndex].parent].left = prev[currIndex].right;
                    }else{
                        prev[prev[currIndex].parent].right = prev[currIndex].right;
                    };

                    // correct the children indecies after shifting
                    for (let i = prev[currIndex].parent; i < prev.length; i++){
                        if (prev[i].left !== -1){
                            prev[i].left -= 1;
                        };
                        if (prev[i].right !== -1){
                            prev[i].right -= 1;
                        };
                    };

                    prev = prev.filter((v, i) => i === currIndex ? undefined : v);
                // two children
                }else{
                    console.log('two cildren')
                    let curr = prev[currIndex].right;
                    console.log(curr)
                    console.log(prev[curr].left)
                    while(prev[curr].left !== -1){
                        console.log('sdsad')
                        curr = prev[curr].left;
                    };

                    const currParent = prev[curr].parent;

                    prev[curr].parent = prev[currIndex].parent;
                    if (prev[prev[currIndex].parent].left === currIndex){
                        prev[prev[currIndex].parent].left = curr;
                    }else{
                        prev[prev[currIndex].parent].right = curr;
                    };

                    prev[currParent].left = prev[curr].right;
                    if (prev[curr].right !== -1){
                        prev[prev[curr].right].parent = currParent;
                    };

                    prev[curr].left = prev[currIndex].left;
                    if (prev[currIndex].left !== -1){
                        prev[prev[currIndex].left].parent = curr;
                    };
                    prev[curr].right = prev[currIndex].right;
                    if (prev[currIndex].right !== -1){
                        prev[prev[currIndex].right].parent = curr;
                    };

                    for (let i = prev[currIndex].parent; i < prev.length; i++){
                        if (prev[i].left !== -1){
                            prev[i].left -= 1;
                        };
                        if (prev[i].right !== -1){
                            prev[i].right -= 1;
                        };
                    };

                    prev = prev.filter((v, i) => i === currIndex ? undefined : v);
                };
                setCurrIndex(-1);
                setCurrVal(-1);
                setMode('none');
                setNextCommand('none');
                return [...prev]
            })
        };
    },[currIndex, mode]);

    console.log(currIndex)

    function addNode(val:number){
        find(val);
        setNextCommand('add');
        setNextVal(val);
        setTreeSize(prev => prev + 1);
    };

    function deleteNode(val:number){
        find(val);
        setNextCommand('delete');
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