import Node from './Node'
import { useTreeContext } from './TreeContext'

const TreeContainer = () => {
  const {heap, setHeap} = useTreeContext()
  return (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
        {heap.map((node, index) => {
            return <Node key={`tree-node-${index}-${node.val}`} data={node}/>
        })}
    </div>
  )
}

export default TreeContainer