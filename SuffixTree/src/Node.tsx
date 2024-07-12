import React, { ComponentProps, useEffect, useMemo, useRef, useState } from 'react'
import { useTreeContext } from './TreeContext';

export type NodeType = {
    parent:number,
    stringDepth:number,
    edgeStart:number,
    edgeEnd:number,
    children:number[]
};

interface NodeProps extends ComponentProps<'div'>{
    node:NodeType
};

const Node:React.FC<NodeProps> = ({node, ...props}) => {
    const {text, suffixTree} = useTreeContext();
    const nodeRef = useRef<HTMLDivElement | null>(null);
    const childrenRef = useRef<Map<any, any> | null>(null);
    const [windowDimentions, setWindowDimentions] = useState<{height:number, width:number}>({height:0, width:0});
    const prevDimintions = useRef<{height:number, width:number}>(windowDimentions);
    const [nodeChildrenDimentions, setNodeChildrenDimentions] = useState<Map<any, any>>(new Map());

    useEffect(() => {
        function updateWindowDimentions(){
            setWindowDimentions(prev => {
                prevDimintions.current = prev;
                return {height:window.innerHeight, width:window.innerWidth}
            });
        };

        window.addEventListener('resize', updateWindowDimentions);
        updateWindowDimentions();

        return () => window.removeEventListener('resize', updateWindowDimentions);
    },[]);


    useEffect(() => {
        if (nodeRef.current){
            const map = getMap();
            const returnMap = new Map();
            const parentRect = nodeRef.current.getBoundingClientRect();
            map.forEach((val, key) => {
                if (!val){
                    returnMap.set(key, {
                        x1:0,
                        y1:0,
                        x2:0,
                        y2:0,
                        width:0,
                        heigth:0
                    });
                }else{
                    returnMap.set(key, {
                        x1:parentRect.x + parentRect.width / 2,
                        y1:parentRect.y + parentRect.height / 2,
                        x2:val.x + val.width / 2,
                        y2:val.y + val.height / 2,
                        width:val.width,
                        height:val.height
                    });
                };
            });

            setNodeChildrenDimentions(returnMap);
        };
    },[windowDimentions.height, windowDimentions.width]);

    function getMap(){
        if (!childrenRef.current){
            childrenRef.current = new Map()
        };
        return childrenRef.current;
    };
    return (
        <div style={{width:'100%', height:'100%'}} {...props}>
            <div style={{
                display:'flex',
                alignItems:'center',
                alignSelf:'center',
                justifyContent:'center',
                height:'1rem',
                width:'1rem',
                padding:'0.25rem',
                border:'1px solid black',
                borderRadius:'50%',
                backgroundColor:'white',
            }}
            ref={nodeRef}
            ></div>
            <div style={{
                display:'flex',
                justifyContent:'center',
                height:'100%',
                width:'100%'
            }}>
                {node.children.reduce((prev:number[], curr:number) => {
                    if (curr !== -1){
                        prev.push(curr);
                    };
                    return prev;
                },[]).map((v, i) => {
                    if (v === -1){
                        return null
                    };
                    return <div key={`node-${node.edgeStart}-child-${i}`}
                                style={{
                                    height:'100%',
                                    width:'100%',
                                    transform:`rotate(${i * 10}deg)`
                                }}
                                ref={(elem) => {
                                    const map = getMap();
                                    if (elem){
                                        map.set(v, elem.getBoundingClientRect())
                                    }else{
                                        map.delete(elem)
                                    };
                                }}>
                                <svg style={{width:'100%', height:'100%' ,position:'absolute', left:0, top:0, pointerEvents:'none'}}>
                                    <line x1={nodeChildrenDimentions.get(v) ? nodeChildrenDimentions.get(v).x1 : 0}
                                          y1={nodeChildrenDimentions.get(v) ? nodeChildrenDimentions.get(v).y1 : 0}
                                          x2={nodeChildrenDimentions.get(v) ? nodeChildrenDimentions.get(v).x2 : 0}
                                          y2={nodeChildrenDimentions.get(v) ? nodeChildrenDimentions.get(v).y2 : 0}
                                          height={nodeChildrenDimentions.get(v) ? nodeChildrenDimentions.get(v).height : 0}
                                          width={nodeChildrenDimentions.get(v) ? nodeChildrenDimentions.get(v).width : 0}
                                          stroke='black'>
                                    </line>
                                    {text.slice(v, text.length).split('').map((c, idx) => (
                                        <text
                                        key={`node-child-${i}-char-${c}-${idx}`}
                                        x1={nodeChildrenDimentions.get(v) ? nodeChildrenDimentions.get(v).x1 + (idx * 10) : 0}
                                        y1={nodeChildrenDimentions.get(v) ? nodeChildrenDimentions.get(v).y1 + (idx * 10) : 0}
                                        x2={nodeChildrenDimentions.get(v) ? nodeChildrenDimentions.get(v).x2 + (idx * 10) : 0}
                                        y2={nodeChildrenDimentions.get(v) ? nodeChildrenDimentions.get(v).y2 + (idx * 10) : 0}
                                        textAnchor="middle"
                                        alignmentBaseline="middle"
                                        >
                                            <tspan>
                                                {c}
                                            </tspan>
                                        </text>
                                    ))
                                    }
                                </svg>
                                <Node node={suffixTree[v]}/>
                           </div>
                })
            }
            </div>
        </div>
    );
};

export default Node