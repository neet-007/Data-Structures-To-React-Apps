import React, {useState, createContext, useContext, ComponentProps} from "react";
import { NodeType } from "./Node";

type TreeContextType = {
    heap:NodeType[];
    setHeap:React.Dispatch<React.SetStateAction<NodeType[]>>
}

const INITIAL_STATE:TreeContextType = {
    heap:[],
    setHeap: () => {}
}

const TreeContext = createContext<TreeContextType>(INITIAL_STATE);

export const TreeContextProvidor:React.FC<ComponentProps<'div'>> = ({children, ...props}) => {
    const [heap, setHeap] = useState<NodeType[]>([])
    return(
        <TreeContext.Provider value={{heap, setHeap}}>
            {children}
        </TreeContext.Provider>
    )
}

export const useTreeContext = () => useContext(TreeContext);