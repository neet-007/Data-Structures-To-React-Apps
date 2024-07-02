import React, {ComponentProps} from 'react'
import { useTreeContext } from './TreeContext';

export type NodeType = {
    val:string | number;
    parent:number;
    leftChild:number;
    rightChild:number;
}

export interface NodeProps extends ComponentProps<'div'>{
    index:number;
};

const Node:React.FC<NodeProps> = ({index, ...props}) => {
  const {heap, heapSize} = useTreeContext()
  return (
    <div style={{width:'100%', display:'flex', flexDirection:'column'}} {...props}>
        <p style={{alignSelf:'center', border:'1px solid black', borderRadius:'50%', padding:'0.75rem'}}>{heap[index].val}</p>
        <div style={{display:'flex', justifyContent:'center'}}>
            {(heap[index].leftChild < heapSize && heap[index].leftChild != -1) &&
                <Node index={heap[index].leftChild}/>
            }
            {(heap[index].rightChild < heapSize && heap[index].rightChild != -1) &&
                <Node index={heap[index].rightChild}/>
            }
        </div>
    </div>
  )
}

export default Node