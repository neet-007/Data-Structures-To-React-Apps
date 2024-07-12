import React, { ComponentProps, useEffect, useRef, useState } from 'react'
import { useTreeContext } from './TreeContext';

const CHARDIST = 30;

export type NodeType = {
    parent:number,
    stringDepth:number,
    edgeStart:number,
    edgeEnd:number,
    children:number[]
};

type RectType = {
    x1:number,
    x2:number,
    y1:number,
    y2:number,
    width:number,
    height:number,
    angle:number
};

interface NodeProps extends ComponentProps<'div'>{
    node:NodeType
};

const Node:React.FC<NodeProps> = ({node, ...props}) => {
    const {text, suffixTree, ALPHABET} = useTreeContext();
    const nodeRef = useRef<HTMLDivElement | null>(null);
    const childrenRef = useRef<Map<any, any> | null>(null);
    const [windowDimentions, setWindowDimentions] = useState<{height:number, width:number}>({height:0, width:0});
    const prevDimintions = useRef<{height:number, width:number}>(windowDimentions);
    const [nodeChildrenDimentions, setNodeChildrenDimentions] = useState<RectType[]>([]);

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
            const arr = Array(ALPHABET.length).fill(-1);
            const parentRect = nodeRef.current.getBoundingClientRect();
            map.forEach((val, key) => {
                if (!val){
                    arr[key] = {
                        x1:0,
                        y1:0,
                        x2:0,
                        y2:0,
                        width:0,
                        heigth:0,
                        angle:0
                    };
                }else{
                    arr[key] = {
                        x1:parentRect.x + parentRect.width / 2,
                        y1:parentRect.y + parentRect.height / 2,
                        x2:val.x + val.width / 2,
                        y2:val.y + val.height / 2,
                        width:val.width,
                        height:val.height,
                        angle:Math.atan2((val.y - parentRect.y), (val.x - parentRect.x)) * (180/Math.PI)
                    };
                };
            });

            setNodeChildrenDimentions(arr);
        };
    },[windowDimentions.height, windowDimentions.width]);

    function getMap(){
        if (!childrenRef.current){
            childrenRef.current = new Map()
        };
        return childrenRef.current;
    };
    return (
        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}} {...props}>
            <div style={{
                display:'flex',
                alignItems:'center',
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
                gap:'2rem',
                height:'100%',
                width:'100%'
            }}>
                {node.children.reduce((prev:number[], curr:number) => {
                    if (curr !== -1){
                        prev.push(curr);
                    };
                    return prev;
                },[]).map((v, i) => {
                    return <div key={`node-${node.edgeStart}-child-${i}`}
                                style={{
                                    height:'100%',
                                    width:'100%',
                                    marginTop:`${(text.length - v) * CHARDIST}px`
                                }}
                                ref={(elem) => {
                                    const map = getMap();
                                    if (elem){
                                        map.set(v, elem.getBoundingClientRect())
                                    }else{
                                        map.delete(elem)
                                    };
                                }}>
                                <svg style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', zIndex:-1}}>
                                    <line x1={nodeChildrenDimentions[v] ? nodeChildrenDimentions[v].x1 : 0}
                                          y1={nodeChildrenDimentions[v] ? nodeChildrenDimentions[v].y1 : 0}
                                          x2={nodeChildrenDimentions[v] ? nodeChildrenDimentions[v].x2 : 0}
                                          y2={nodeChildrenDimentions[v] ? nodeChildrenDimentions[v].y2 : 0}
                                          height={nodeChildrenDimentions[v] ? nodeChildrenDimentions[v].height : 0}
                                          width={nodeChildrenDimentions[v] ? nodeChildrenDimentions[v].width : 0}
                                          stroke='black'>
                                    </line>
                                    {text.slice(v, text.length).split('').map((c, idx) => (
                                        <text key={`node-${i}-child-${c}-${idx}`}
                                        x={nodeChildrenDimentions[v] ? (nodeChildrenDimentions[v].x1 + nodeChildrenDimentions[v].x2) / 2 + (idx * CHARDIST * Math.cos(nodeChildrenDimentions[v].angle * Math.PI / 180)) : 0}
                                        y={nodeChildrenDimentions[v] ? (nodeChildrenDimentions[v].y1 - ((text.length - v) * CHARDIST) + nodeChildrenDimentions[v].y2) / 2 + idx * CHARDIST * Math.sin(nodeChildrenDimentions[v].angle * Math.PI / 180): 0}
                                        textAnchor="middle"
                                        alignmentBaseline="middle"
                                        style={{ fontSize: '16px', fill: 'red' }}
                                        >
                                            <tspan>{c}</tspan>
                                        </text>
                                    ))}
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