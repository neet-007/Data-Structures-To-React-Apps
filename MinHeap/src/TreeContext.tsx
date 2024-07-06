import React, {useState, createContext, useContext, useEffect, ComponentProps} from "react";
import { NodeType } from "./Node";

type TreeContextType = {
    heap:NodeType[];
    heapPush:(val:string | number) => void;
    heapPop:() => void;
    lastPoppedItem:NodeType | undefined;
    heapSize:number;
    currIndex:number;
};

const INITIAL_STATE:TreeContextType = {
    heap:[],
    heapPush:() => {},
    heapPop:() => {},
    lastPoppedItem:undefined,
    heapSize:0,
    currIndex:0,
};

const TreeContext = createContext<TreeContextType>(INITIAL_STATE);

export const TreeContextProvidor:React.FC<ComponentProps<'div'>> = ({children}) => {
    const [heap, setHeap] = useState<NodeType[]>([])
    const [heapSize, setHeapSize] = useState<number>(0)
    const [lastPoppedItem, setLastPoppedItem] = useState<NodeType | undefined>(undefined);
    const [isPush, setIsPush] = useState<boolean>(false);
    const [currIndex, setCurrIndex] = useState<number>(-1);

    useEffect(() => {
        if (currIndex < 0){
          return;
        };
        let timeOut;
        if (!isPush){
            timeOut = setTimeout(() => {
                setHeap(prev => {
                    if (currIndex < heapSize){
                        let smallIndex = currIndex;
                        const leftChild = getChild(currIndex, 'l');
                        if (leftChild < heapSize && prev[leftChild].val < prev[smallIndex].val){
                            smallIndex = leftChild;
                        };
                        const rightChild = getChild(currIndex, 'r');
                        if (rightChild < heapSize && prev[rightChild].val < prev[smallIndex].val){
                            smallIndex = rightChild;
                        };

                        if (smallIndex === currIndex){
                            setCurrIndex(-1);
                            return [...prev];
                        };

                        const temp = prev[smallIndex];
                        const tempParent = prev[smallIndex].parent;
                        const tempLeft = prev[smallIndex].leftChild;
                        const tempRight = prev[smallIndex].rightChild;

                        if (leftChild < heapSize){
                            prev[leftChild].className = 'nnn';
                        };
                        if (rightChild < heapSize){
                            prev[rightChild].className = 'nnn';
                        };
                        prev[currIndex].className = 'nnn';

                        prev[smallIndex] = prev[currIndex];
                        prev[currIndex] = temp;

                        prev[currIndex].parent = prev[smallIndex].parent;
                        prev[currIndex].leftChild = prev[smallIndex].leftChild;
                        prev[currIndex].rightChild = prev[smallIndex].rightChild;
                        prev[smallIndex].parent = tempParent;
                        prev[smallIndex].leftChild = tempLeft;
                        prev[smallIndex].rightChild = tempRight;

                        setCurrIndex(smallIndex);
                        prev[smallIndex].className = 'compare';
                        const leftChildSmall = getChild(smallIndex, 'l');
                        if (leftChildSmall < heapSize){
                            prev[leftChildSmall].className = 'compare';
                        };
                        const rightChildSmall = getChild(smallIndex, 'r');
                        if (rightChildSmall < heapSize){
                            prev[rightChildSmall].className = 'compare';
                        };

                    }else{
                        setCurrIndex(-1);
                    };
                    return [...prev]
                });
            }, 1000);
        }
        else{
          timeOut = setTimeout(() => {
            setHeap(prev => {
                let parentIdx = getParent(currIndex);

                if (parentIdx >= 0 && prev[currIndex].val < prev[parentIdx].val){
                    prev[parentIdx].className = 'nnn';
                    prev[currIndex].className = 'nnn';

                    const temp = prev[parentIdx];

                    prev[parentIdx] = prev[currIndex];
                    prev[currIndex] = temp;

                    const parentParent = getParent(parentIdx);
                    const parentLeft = getChild(parentIdx, 'l');
                    const parentRight = getChild(parentIdx, 'r');
                    const currParent = getParent(currIndex);
                    const currLeft = getChild(currIndex, 'l');
                    const currRight = getChild(currIndex, 'r');
                    prev[parentIdx].parent = parentIdx === 0 ? -1 : parentParent;
                    prev[parentIdx].leftChild = parentLeft < prev.length ? parentLeft : -1;
                    prev[parentIdx].rightChild = parentRight < prev.length ? parentRight : -1;
                    prev[currIndex].parent = currParent;
                    prev[currIndex].leftChild = currLeft < prev.length ? currLeft : -1;
                    prev[currIndex].rightChild = currRight < prev.length ? currRight : -1;

                    setCurrIndex(parentIdx);

                    if(parentIdx > 0){
                        const parent_idx = getParent(parentIdx);
                        prev[parentIdx].className = 'compare';
                        prev[parent_idx].className = 'compare';
                    };
                }
                else{
                    if (parentIdx > -1 && prev[parentIdx].leftChild !== currIndex && prev[parentIdx].rightChild !== currIndex){
                        prev[currIndex].parent = parentIdx;
                        if (prev[parentIdx].leftChild === -1){
                            prev[parentIdx].leftChild = currIndex;
                        }else{
                            prev[parentIdx].rightChild = currIndex;
                        };
                    };
                    prev[currIndex].className = 'nnn'
                    setCurrIndex(-1);
                };
                return [...prev];
            });
    }, 1000);
}

      return () => clearTimeout(timeOut!);
    },[currIndex, isPush]);

    function heapPush(val:string | number){
      setHeap(prev => {
        if(heapSize > 0){
            const parentIdx = getParent(heapSize);
            prev[parentIdx].className = 'compare';
            if (prev[parentIdx].leftChild === -1){
                prev[parentIdx].leftChild = heapSize;
            }else{
                prev[parentIdx].rightChild = heapSize;
            };
        };
        if (prev.length > heapSize){
            prev[heapSize] = {val, parent:-1, leftChild:-1, rightChild:-1, className:'compare'};
            return [...prev]
        };
        return [...prev, {val, parent:-1, leftChild:-1, rightChild:-1, className:'compare'}]
      });
      setCurrIndex(heapSize);
      setIsPush(true);
      setHeapSize(prev => prev + 1);
    };

    function heapPop(){
      const temp = heap[0];
      setHeap(prev => {
        prev[0] = prev[heapSize - 1];
        prev[heapSize - 1] = temp;
        prev[0].parent = -1;
        if (prev[heapSize - 1].leftChild !== -1){
            prev[prev[heapSize - 1].leftChild].className = 'compare';
        };
        if (prev[heapSize - 1].rightChild !== -1){
            prev[prev[heapSize - 1].rightChild].className = 'compare';
        };
        prev[0].className = 'compare';
        prev[0].leftChild = prev[heapSize - 1].leftChild;
        prev[0].rightChild = prev[heapSize - 1].rightChild;
        prev[heapSize - 1].leftChild = prev[heapSize - 1].rightChild = prev[heapSize - 1].parent = -1;
        return [...prev];
      });
      setCurrIndex(0);
      setIsPush(false);
      setHeapSize(prev => prev - 1);
      setLastPoppedItem(temp);
    };

    function getChild(index:number, dir:'l' | 'r'){
        if (dir === 'l'){
            return (index * 2) + 1;
        }else{
            return (index * 2) + 2;
        };
    }

    function getParent(index:number){
        return Math.floor(((index - 1) / 2));
    };


    return(
        <TreeContext.Provider value={{heap, heapPush, heapPop, currIndex, lastPoppedItem, heapSize}}>
            {children}
        </TreeContext.Provider>
    )
}

export const useTreeContext = () => useContext(TreeContext);