import {ComponentProps, forwardRef, useMemo, useRef} from 'react'
import { useTreeContext } from './TreeContext';

export type NodeType = {
    val:string | number;
    parent:number;
    leftChild:number;
    rightChild:number;
};

export interface NodeProps extends ComponentProps<'div'> {
    index: number;
    complete?:boolean
};

const Node = forwardRef<HTMLDivElement, NodeProps>(({ index, complete, ...props }, ref) => {
    const { heap, heapSize } = useTreeContext();
    const parentRef = useRef<HTMLParagraphElement>(null);
    const leftRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);

    const parentCords = useMemo(() => {
      if (parentRef.current) {
        const rect = parentRef.current.getBoundingClientRect();
        return {
          x: rect.x + rect.width / 2,
          y: rect.y + rect.height / 2
        };
      }
      return { x: 0, y: 0 };
    }, [parentRef.current]);

    const leftCords = useMemo(() => {
        console.log(leftRef.current)
        if(!leftRef.current){
            return {x:0, y:0};
        };
        const rect = leftRef.current.children[0].getBoundingClientRect();
        console.log('left')
        console.log(rect)
        return{
            x:rect.x + rect.width / 2,
            y:rect.y + rect.height /2
        };
    },[leftRef.current]);

    const rightCords = useMemo(() => {
        if(!rightRef.current){
            return {x:0, y:0};
        };
        const rect = rightRef.current.children[0].getBoundingClientRect();
        console.log('rigth')
        console.log(rect)
        return{
            x:rect.x + rect.width / 2,
            y:rect.y + rect.height / 2
        };
    },[rightRef.current]);

    return (
      <div ref={ref} style={{width:'100%', display: 'flex', flexDirection: 'column' }} {...props}>
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
            justifyContent: 'center'
          }}
          ref={parentRef}
        >
          {heap[index].val}
        </p>
        <div style={{display: 'flex', justifyContent: 'center' }}>
          {(heap[index].leftChild < heapSize && heap[index].leftChild !== -1) &&
              <svg style={{ position: 'absolute' }} width="0" height="0">
                <line
                x1={parentCords.x.toString()}
                y1={parentCords.y.toString()}
                x2={leftCords.x.toString()}
                y2={rightCords.x.toString()}
                stroke="black"
                />
            </svg>
          }
          {(heap[index].leftChild < heapSize && heap[index].leftChild !== -1) &&
            <Node index={heap[index].leftChild} ref={leftRef} complete={heap[index].rightChild !== -1}/>
          }
          {(heap[index].rightChild < heapSize && heap[index].rightChild !== -1) &&
              <svg style={{ position: 'absolute' }} width="0" height="0">
                <line
                x1={parentCords.x.toString()}
                y1={parentCords.y.toString()}
                x2={rightCords.x.toString()}
                y2={rightCords.y.toString()}
                stroke="black"
                 />
                </svg>
          }
          {(heap[index].rightChild < heapSize && heap[index].rightChild !== -1) &&
            <Node index={heap[index].rightChild} ref={rightRef} complete/>
          }
        </div>
      </div>
    );
  });

export default Node