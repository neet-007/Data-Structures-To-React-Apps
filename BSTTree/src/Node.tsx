import React, {ComponentProps} from 'react'
import { useTreeContext } from './TreeContext';

interface NodeProps extends ComponentProps<'div'>{
  node:NodeType,
  shift:'l' | 'r' | ''
};

export type NodeType = {
    val:number;
    parent:number;
    left:number;
    right:number;
    className:'highlight' | 'found' | '';
};

const Node:React.FC<NodeProps> = ({node, shift, ...props}) => {
  const {tree} = useTreeContext()
  return (
    <div style={{width:'100%', display:'flex', flexDirection:'column', marginLeft:`${shift === 'l' ? '-50%': shift === 'r' ?'50%' : ''}`,}} {...props}>
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
          <Node node={tree[node.left]} shift={node.right !== -1 ? '' : 'l'}/>
        }
        {node.right !== -1 &&
          <Node node={tree[node.right]} shift={node.left !== -1 ? '' : 'r'}/>
        }
      </div>
    </div>
  )
}

export default Node