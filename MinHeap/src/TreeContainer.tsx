import { useRef } from 'react'
import Node from './Node'
import { useTreeContext } from './TreeContext'

const TreeContainer = () => {
  const {heap, heapPush, heapPop, lastPoppedItem} = useTreeContext();
  console.log(heap)
  const InputRef = useRef<HTMLInputElement>(null);
  return (
    <div>
      <div>
        <input type="text" ref={InputRef}/>
        <button onClick={() => heapPush(Number(InputRef.current!.value))}>add</button>
      </div>
      <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            {heap[0] &&
              <Node index={0}/>
            }
      </div>
      <button onClick={() => heapPop()}>pop</button>
      <div>
        <p>last popped item</p>
        <p>{lastPoppedItem?.val}</p>
      </div>
    </div>
  )
}

export default TreeContainer