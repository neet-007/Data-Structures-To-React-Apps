import React, {ComponentProps, useEffect, useMemo, useRef, useState} from 'react'
import { useTreeContext } from './TreeContext';

export type NodeType = {
    val:string | number;
    parent:number;
    leftChild:number;
    rightChild:number;
};

type NodeCordsSetter = {x:number, y:number, width:number, height:number};

export interface NodeProps extends ComponentProps<'div'> {
    index: number;
    complete?:boolean;
    setLeftNodeRect_?:React.Dispatch<React.SetStateAction<NodeCordsSetter>>
};


const Node:React.FC<NodeProps> = ({index, setLeftNodeRect_, complete, ...props}) => {
    const { heap, heapSize } = useTreeContext();
    const [windowDimintions, setWindowDimintions] = useState<{width:number, height:number}>({width:0, height:0})
    const [leftNodeRect, setLeftNodeRect] = useState<NodeCordsSetter>({x:0, y:0, width:0, height:0})
    const [rightNodeRect, setRightNodeRect] = useState<NodeCordsSetter>({x:0, y:0, width:0, height:0})
    const parentRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
      function updateWindowSize(){
        setWindowDimintions({
          width:window.innerWidth,
          height:window.innerHeight
        });
      };

      window.addEventListener('resize', updateWindowSize);
      updateWindowSize();

      return() => window.removeEventListener('resize', updateWindowSize)
    },[])

    useEffect(() => {
      if (setLeftNodeRect_ && parentRef.current){
        const rect = parentRef.current.getBoundingClientRect();
        setLeftNodeRect_({x:rect.x, y:rect.y, width:rect.width, height:rect.height})
      }
    },[windowDimintions.width, windowDimintions.height])

    const parentCords = useMemo(() => {
      if (parentRef.current) {
        const rect = parentRef.current.getBoundingClientRect();
        return {
          x: rect.x + rect.width / 2,
          y: rect.y + rect.height / 2
        };
      }
      return { x: 0, y: 0 };
    }, [parentRef.current, windowDimintions.width, windowDimintions.height]);

    const leftCords = useMemo(() => {
        const val = {
            x:leftNodeRect.x + leftNodeRect.width / 2,
            y:leftNodeRect.y + leftNodeRect.height / 2,
            height:0,
            width:0
        };
        val.height = Math.abs(val.y - parentCords.y);
        val.width = Math.abs(val.x - parentCords.x);
        return val
    },[{...leftNodeRect}, windowDimintions.width, windowDimintions.height]);

    const rightCords = useMemo(() => {
        const val = {
            x:rightNodeRect.x + rightNodeRect.width / 2,
            y:rightNodeRect.y + rightNodeRect.height / 2,
            height:0,
            width:0
        };
        val.height = Math.abs(val.y - parentCords.y);
        val.width = Math.abs(val.x - parentCords.x);
        return val
    },[{...rightNodeRect}, windowDimintions.width, windowDimintions.height]);

    return (
      <div style={{width:'100%', display: 'flex', flexDirection: 'column' }} {...props}>
        <p
          style={{
            height: '1rem',
            width: '1rem',
            alignSelf:'center',
            marginLeft:`${complete ? '' : '-50%'}`,
            border: '1px solid black',
            borderRadius: '50%',
            padding: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor:'white',
            color:'black'
          }}
          ref={parentRef}
        >
          {heap[index].val}
        </p>
        <div style={{display: 'flex', justifyContent: 'center' }}>
          {(heap[index].leftChild < heapSize && heap[index].leftChild !== -1) &&
              <svg style={{ position: 'absolute', top:0, left:0, pointerEvents:'none', zIndex:-1 }} width={'100%'} height={'100%'}>
                <line
                x1={parentCords.x}
                y1={parentCords.y}
                x2={leftCords.x}
                y2={leftCords.y}
                stroke="black"
                />
            </svg>
          }
          {(heap[index].leftChild < heapSize && heap[index].leftChild !== -1) &&
            <Node index={heap[index].leftChild} setLeftNodeRect_={setLeftNodeRect} complete={heap[index].rightChild !== -1 && heap[index].rightChild < heapSize}/>
          }
          {(heap[index].rightChild < heapSize && heap[index].rightChild !== -1) &&
              <svg style={{ position: 'absolute', top:0, left:0, pointerEvents:'none', zIndex:-1 }} width={'100%'} height={'100%'}>
                <line
                x1={parentCords.x}
                y1={parentCords.y}
                x2={rightCords.x}
                y2={rightCords.y}
                stroke="black"
                 />
                </svg>
          }
          {(heap[index].rightChild < heapSize && heap[index].rightChild !== -1) &&
            <Node index={heap[index].rightChild} setLeftNodeRect_={setRightNodeRect} complete/>
          }
        </div>
      </div>
    );
  };

export default Node