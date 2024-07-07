import React, {ComponentProps} from 'react'
import { useTreeContext } from './TreeContext';

interface NodeProps extends ComponentProps<'div'>{
  node:NodeType,
  complete:boolean
};

export type NodeType = {
    val:number;
    parent:number;
    left:number;
    right:number;
    className:'highlight' | 'found' | '';
};

const Node:React.FC<NodeProps> = ({node, complete, ...props}) => {
  const {tree} = useTreeContext()
  return (
    <div style={{width:'100%', display:'flex', flexDirection:'column'}} {...props}>
      <p
        className={node.className}
        style={{
          display:'flex',
          height:'1rem',
          width:'1rem',
          alignSelf:'center',
          justifyContent:'center',
          alignItems:'center',
          border:'1px solid black',
          backgroundColor:'white',
          borderRadius:'50%',
          marginLeft:`${complete ? '0%': '-50%'}`,
          padding:'0.25rem'
        }}
      >
        {node.val}
      </p>
      <div
        style={{
          display:'flex',
          justifyContent:'center'
        }}
      >
        {node.left !== -1 &&
          <Node node={tree[node.left]} complete={node.left !== -1}/>
        }
        {node.right !== -1 &&
          <Node node={tree[node.right]} complete/>
        }
      </div>
    </div>
  )
}

export default Node