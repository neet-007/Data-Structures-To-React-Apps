import React, {ComponentProps, useEffect, useMemo, useRef, useState} from 'react'
import { useTreeContext } from './TreeContext';

interface NodeProps extends ComponentProps<'div'>{
  node:NodeType,
  shift:'l' | 'r' | '',
  setCordsToParent?:React.Dispatch<React.SetStateAction<CordsType>>
};

export type NodeType = {
    val:number;
    parent:number;
    left:number;
    right:number;
    className:'highlight' | 'found' | '';
};

type CordsType = {x:number, y:number, height:number, width:number};

const Node:React.FC<NodeProps> = ({node, shift, setCordsToParent, ...props}) => {
      const {tree} = useTreeContext();
      const [windowDimintions, setWindowDimintions] =useState<{height:number, width:number}>({height:0, width:0})
      const [leftCords, setLeftCords] = useState<CordsType>({x:0, y:0, height:0, width:0});
      const [rightCords, setRightCords] = useState<CordsType>({x:0, y:0, height:0, width:0});
      const nodeRef = useRef<HTMLParagraphElement>(null);

      useEffect(() => {
        function updateWindowSize(){
          setWindowDimintions({height:window.innerHeight, width:window.innerWidth});
        };

        window.addEventListener('resize', updateWindowSize);
        updateWindowSize();

        return () => window.removeEventListener('resize', updateWindowSize);
      },[]);

      useEffect(() => {
        if (setCordsToParent && nodeRef.current){
          const rect = nodeRef.current.getBoundingClientRect();
          setCordsToParent({x:rect.x, y:rect.y, height:rect.height, width:rect.width});
        };
      },[nodeRef.current, windowDimintions.height, windowDimintions.width]);

      const ParentCords = useMemo(() => {
        if (!nodeRef.current){
          return {x:0, y:0};
        };
        const ParentRect = nodeRef.current.getBoundingClientRect();
        return{
          x:ParentRect.x + ParentRect.width / 2,
          y:ParentRect.y + ParentRect.height / 2,
        };
      },[nodeRef.current, windowDimintions.height, windowDimintions.width]);

      const LeftNodeCords = useMemo(() => {
        return {
          x:leftCords.x + leftCords.width / 2,
          y:leftCords.y + leftCords.height / 2,
        };
      },[{...leftCords}, windowDimintions.height, windowDimintions.width]);

      const rightNodeCords = useMemo(() => {
        return{
          x:rightCords.x + rightCords.width / 2,
          y:rightCords.y + rightCords.height / 2,
        }
      },[{...rightCords}, windowDimintions.height, windowDimintions.width]);

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
            ref={nodeRef}
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
              <svg style={{height:'100%', width:'100%', position:'absolute', top:0, left:0, pointerEvents:'none', zIndex:-1}}>
                <line x1={ParentCords.x} y1={ParentCords.y} x2={LeftNodeCords.x} y2={LeftNodeCords.y}
                      width={leftCords.width} height={leftCords.height} stroke='black'></line>
              </svg>
            }
            {node.left !== -1 &&
              <Node node={tree[node.left]} shift={node.right !== -1 ? '' : 'l'} setCordsToParent={setLeftCords}/>
            }
            {node.right !== -1 &&
              <svg style={{height:'100%', width:'100%', position:'absolute', top:0, left:0, pointerEvents:'none', zIndex:-1}}>
                <line x1={ParentCords.x} y1={ParentCords.y} x2={rightNodeCords.x} y2={rightNodeCords.y}
                      width={rightCords.width} height={rightCords.height} stroke='black'></line>
              </svg>
            }
            {node.right !== -1 &&
              <Node node={tree[node.right]} shift={node.left !== -1 ? '' : 'r'} setCordsToParent={setRightCords}/>
            }
          </div>
        </div>
      )
    }

    export default Node