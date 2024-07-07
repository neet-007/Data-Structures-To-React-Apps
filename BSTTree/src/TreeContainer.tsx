import React, {ComponentProps, useRef} from 'react'
import { useTreeContext } from './TreeContext';
import Node from './Node';

const TreeContainer:React.FC<ComponentProps<'div'>> = () => {
  const {tree, treeSize, addNode, find, deleteNode} = useTreeContext()
  const inputRef = useRef<HTMLInputElement>(null);
  console.log(tree);
  function Add(){
    if (!inputRef.current){
      return
    };
    addNode(Number(inputRef.current.value));
  };
  function Find(){
    if (!inputRef.current){
      return
    };
    find(Number(inputRef.current.value));
  };
  function Delete(){
    if (!inputRef.current){
      return
    };
    deleteNode(Number(inputRef.current.value));
  };
  return (
    <div>
      <div>
        <input type="text" ref={inputRef}/>
        <div style={{display:'flex', justifyContent:'center'}}>
          <button onClick={Add}>add</button>
          <button onClick={Find}>find</button>
          <button onClick={Delete}>delete</button>
        </div>
      </div>
      {tree.length > 0 &&
        <Node node={tree[0]} shift=''/>
      }
    </div>
  )
}

export default TreeContainer