import React, {useState, createContext, useContext, ComponentProps} from "react";
import { NodeType } from "./Node";

type TreeContextType = {
    heap:NodeType[];
    heapPush:(val:string | number) => void;
    heapPop:() => void;
    lastPoppedItem:NodeType | undefined;
    heapSize:number;
}

const INITIAL_STATE:TreeContextType = {
    heap:[],
    heapPush: () => {},
    heapPop: () => {},
    lastPoppedItem:undefined,
    heapSize:0,
}

const TreeContext = createContext<TreeContextType>(INITIAL_STATE);

export const TreeContextProvidor:React.FC<ComponentProps<'div'>> = ({children}) => {
    const [heap, setHeap] = useState<NodeType[]>([])
    const [heapSize, setHeapSize] = useState<number>(0)
    const [lastPoppedItem, setLastPoppedItem] = useState<NodeType | undefined>(undefined);

    function heapPush(val:string | number){
        heapifyUp(heap.length, {val, parent:-1, leftChild:-1, rightChild:-1});
        setHeapSize(prev => prev + 1);
    };

    function heapPop(){
        const temp = heap[0];
        heapifyDown(0, true);
        setHeapSize(prev => prev - 1);
        setLastPoppedItem(temp);
    };

    function heapifyUp(index:number, item?:NodeType){
        setHeap(prev => {
            if (item){
                prev.push(item);
                prev[index].parent = getParent(index);
                const leftChild = getChild(index, 'l');
                const rightChild = getChild(index, 'r');
                prev[index].leftChild = leftChild < heapSize + 1 ? leftChild : -1;
                prev[index].rightChild = rightChild < heapSize + 1 ? rightChild : -1;
                if(prev[index].parent !== -1 && prev[prev[index].parent].leftChild === -1){
                    prev[prev[index].parent].leftChild = index;
                }else{
                    if(prev[index].parent !== -1){
                        prev[prev[index].parent].rightChild = index;
                    };
                };
            };

            let parentIdx = getParent(index);

            while (parentIdx >= 0 && prev[parentIdx].val > prev[index].val){
                const temp = prev[parentIdx];

                const tempParent = prev[parentIdx].parent;
                const tempLeft = prev[parentIdx].leftChild;
                const tempRight = prev[parentIdx].rightChild;

                prev[parentIdx] = prev[index];
                prev[index] = temp;

                prev[index].parent = prev[parentIdx].parent;
                prev[index].leftChild = prev[parentIdx].leftChild;
                prev[index].rightChild = prev[parentIdx].rightChild;
                prev[parentIdx].parent = tempParent;
                prev[parentIdx].leftChild = tempLeft;
                prev[parentIdx].rightChild = tempRight;

                index = parentIdx;
                parentIdx = getParent(parentIdx);
            };

            return [...prev]
        });
    };

    function heapifyDown(index:number, pop:boolean=false){
        setHeap(prev => {
            const length = heapSize - 1;
            if (pop){
                const temp = prev[0]
                const tempParent = prev[0].parent;
                const tempLeft = prev[0].leftChild;
                const tempRight = prev[0].rightChild;

                prev[0] = prev[heapSize - 1];
                prev[heapSize - 1] = temp;

                prev[heapSize - 1].parent = prev[0].parent;
                prev[heapSize - 1].leftChild = prev[0].leftChild;
                prev[heapSize - 1].rightChild = prev[0].rightChild;
                prev[0].parent = tempParent;
                prev[0].leftChild = tempLeft;
                prev[0].rightChild = tempRight;
            };

            while (index < length){
                console.log(index)
                let smallIndex = index;
                const leftChild = getChild(index, 'l');
                if (leftChild < length && prev[leftChild].val < prev[smallIndex].val){
                    smallIndex = leftChild;
                };
                const rightChild = getChild(index, 'r');
                if (rightChild < length && prev[rightChild].val < prev[smallIndex].val){
                    smallIndex = rightChild
                };

                if (smallIndex === index){
                    console.log(index)
                    break
                };

                console.log(prev[index]);
                console.log(prev[smallIndex]);
                const temp = prev[index];
                const tempParent = prev[index].parent;
                const tempLeft = prev[index].leftChild;
                const tempRight = prev[index].rightChild;

                prev[index] = prev[smallIndex];
                prev[smallIndex] = temp;

                prev[smallIndex].parent = prev[index].parent;
                prev[smallIndex].leftChild = prev[index].leftChild;
                prev[smallIndex].rightChild = prev[index].rightChild;
                prev[index].parent = tempParent;
                prev[index].leftChild = tempLeft;
                prev[index].rightChild = tempRight;

                index = smallIndex;

            };

            return [...prev]
        });
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
        <TreeContext.Provider value={{heap, heapPush, heapPop, lastPoppedItem, heapSize}}>
            {children}
        </TreeContext.Provider>
    )
}

export const useTreeContext = () => useContext(TreeContext);