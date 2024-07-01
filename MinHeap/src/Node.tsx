import React, {ComponentProps} from 'react'
import { useTreeContext } from './TreeContext';

export type NodeType = {
    val:string | number;
    parent:number;
    leftChild:number;
    rightChild:number;
}

export interface NodeProps extends ComponentProps<'div'>{
    data:NodeType;
};

const Node:React.FC<NodeProps> = ({data, ...props}) => {
  const {heap} = useTreeContext()
  return (
    <div {...props}>
        <p>{data.val}</p>
        {data.leftChild &&
            <Node data={heap[data.leftChild]}/>
        }
        {data.rightChild &&
            <Node data={heap[data.rightChild]}/>
        }
    </div>
  )
}

export default Node