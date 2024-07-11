import React, { ComponentProps } from 'react'

export type NodeType = {
    parent:number,
    stringDepth:number,
    edgeStart:number,
    edgeEnd:number,
    children:number[]
};

interface NodeProps extends ComponentProps<'div'>{

};

const Node:React.FC<NodeProps> = ({...props}) => {
  return (
    <div {...props}>
        Node
    </div>
  );
};

export default Node