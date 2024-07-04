import { useRef } from 'react'
import Node from './Node'
import { useTreeContext } from './TreeContext'

const TreeContainer = () => {
  const {heap, currIndex, heapSize, heapPush, heapPop, lastPoppedItem} = useTreeContext();
  const InputRef = useRef<HTMLInputElement>(null);
  const NodeRef = useRef<HTMLDivElement>(null);

  console.log(heap)
  return (
    <div>
      <div>
        <input type="text" ref={InputRef}/>
        <button onClick={() => heapPush(Number(InputRef.current!.value))} disabled={currIndex !== -1}>add</button>
      </div>
      <div ref={NodeRef} style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            {(heap[0] && heapSize > 0) &&
              <Node index={0} complete/>
            }
      </div>
      <button disabled={heapSize === 0 || currIndex !== -1} onClick={() => heapPop()}>pop</button>
      <div>
        <p>last popped item</p>
        <p>{lastPoppedItem?.val}</p>
      </div>
    </div>
  )
}

export default TreeContainer