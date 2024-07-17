import { ComponentProps, forwardRef, useEffect, useRef, useState } from 'react'
import { useTreeContext } from './TreeContext';

const CHARDIST = 30;

const CONVERTE_TO_PX = parseFloat(getComputedStyle(document.documentElement).fontSize);

const GAP = 2;

export type NodeChildrenType = {
    index:number;
    currChar:number;
    className:'heighlited-char' | 'found-char' | 'unmatching-char' | '';
};

export type NodeType = {
    parent:number,
    stringDepth:number,
    edgeStart:number,
    edgeEnd:number,
    children:NodeChildrenType[],
    nodeClassName:'heighlited-node' | 'found-node' | 'unmatching-node' | '',
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
    node:NodeType;
    adjustedHeight:number;
};

const NodeTest = forwardRef<HTMLDivElement, NodeProps>(({node, adjustedHeight, ...props}, ref) => {
    const {text, suffixTree, ALPHABET} = useTreeContext();
    const [windowDimentions, setWindowDimentions] = useState<{height:number, width:number}>({height:0, width:0});
    const [windowScroll, setWindowScroll] = useState<{x:number, y:number}>({x:0, y:0});
    const [nodeChildrenDimentions, setNodeChildrenDimentions] = useState<RectType[]>(Array(ALPHABET.length).fill({x1:Infinity, y1:Infinity, x2:Infinity, y2:Infinity, width:Infinity, height:Infinity, angle:Infinity}));
    const nodeRef = useRef<HTMLDivElement | null>(null);
    const childrenRef = useRef<Map<any, any> | null>(null);
    const prevDimintions = useRef<{height:number, width:number}>(windowDimentions);

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
        function updateWindowScroll(){
            setWindowScroll(prev => {
                if (Math.abs(prev.x - window.scrollX) > 100 || Math.abs(prev.y - window.scrollY) > 100){
                    return {x:window.scrollX, y:window.scrollY};
                };
                return prev
            });
        };

        window.addEventListener('scroll', updateWindowScroll);
        updateWindowScroll();

        return () => window.removeEventListener('scroll', updateWindowScroll);
    },[])

    useEffect(() => {
        if (nodeRef.current){
            const map = getMap();
            const arr = Array(ALPHABET.length).fill({x1:Infinity, y1:Infinity, x2:Infinity, y2:Infinity, width:Infinity, height:Infinity, angle:Infinity});
            const parentRect = nodeRef.current.children[0].getBoundingClientRect();
            map.forEach((val, key) => {
                if (!val){
                    arr[key] = {
                        x1:0,
                        y1:0,
                        x2:0,
                        y2:0,
                        width:0,
                        height:0,
                        angle:0
                    };
                }else{
                    arr[key] = {
                        x1:parentRect.x + window.scrollX + parentRect.width - (GAP * CONVERTE_TO_PX) / 2,
                        y1:parentRect.y + window.scrollY + parentRect.height - (GAP * CONVERTE_TO_PX) / 2,
                        x2:val.x + window.scrollX + val.width - (GAP * CONVERTE_TO_PX) / 2,
                        y2:val.y + window.scrollY + val.height - (GAP * CONVERTE_TO_PX) / 2,
                        width:val.width,
                        height:val.height,
                        angle:Math.atan2((val.y - parentRect.y), (val.x - parentRect.x)) * (180/Math.PI)
                    };
                };
            });

            setNodeChildrenDimentions(arr);
        };
    },[windowDimentions.height, windowDimentions.width, windowScroll.x, windowScroll.y, suffixTree.length]);

    function getMap(){
        if (!childrenRef.current){
            childrenRef.current = new Map()
        };
        return childrenRef.current;
    };
    return (
        <div ref={nodeRef} style={{display:'flex', flexDirection:'column', alignItems:'center', marginTop:`${adjustedHeight}px`, width:'100%'}} {...props}>
            <div style={{
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                height:'0.5rem',
                width:'0.5rem',
                padding:'0.25rem',
                border:'1px solid black',
                borderRadius:'50%',
                backgroundColor:`${node.nodeClassName === '' ? 'white': ''}`,
            }}
            className={node.nodeClassName}
            ref={ref}
            ></div>
            <div style={{
                display:'flex',
                justifyContent:'center',
                gap:`${GAP}rem`,
                height:'100%',
                width:'100%'
            }}>
                {(() => {
                    if (!node){
                        return null
                    };
                    const children = node.children.reduce((prev:NodeChildrenType[], curr:NodeChildrenType) => {
                        if (curr.index !== -1){
                            prev.push(curr);
                        };
                        return prev
                    },[]);
                    let adjH = suffixTree.reduce((prev:number, curr:NodeType, i:number) => {
                        if (children.find(x => x.index === i) && curr.edgeEnd + 1 - curr.edgeStart > prev){
                            return (curr.edgeEnd + 1 - curr.edgeStart);
                        };
                        return prev
                    },0);
                    adjH *= (CHARDIST * 1.75);
                    //const adjH = children.length > 0 ? ((suffixTree[children[Math.floor(children.length / 2)]].edgeEnd + 1 - suffixTree[children[Math.floor(children.length / 2)]].edgeStart) * CHARDIST) : 0;
                    return children.map((v, i) => {
                        return <div key={`node-${node.edgeStart}-child-${i}`}
                        style={{
                            height:'100%',
                            width:'100%',
                        }}>
                                <svg style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', zIndex:-1}}>
                                    <line x1={nodeChildrenDimentions[v.index].x1 !== Infinity ? nodeChildrenDimentions[v.index].x1 : 0}
                                        y1={nodeChildrenDimentions[v.index].y1 !== Infinity ? nodeChildrenDimentions[v.index].y1 : 0}
                                        x2={nodeChildrenDimentions[v.index].x2 !== Infinity ? nodeChildrenDimentions[v.index].x2 : 0}
                                        y2={nodeChildrenDimentions[v.index].y2 !== Infinity ? nodeChildrenDimentions[v.index].y2 : 0}
                                        height={nodeChildrenDimentions[v.index].height !== Infinity ? nodeChildrenDimentions[v.index].height : 0}
                                        width={nodeChildrenDimentions[v.index].width !== Infinity ? nodeChildrenDimentions[v.index].width : 0}
                                        stroke='black'>
                                    </line>
                                    {text.slice(suffixTree[v.index].edgeStart, suffixTree[v.index].edgeEnd + 1).split('').map((c, idx) => (
                                        <text key={`node-${i}-child-${c}-${idx}`}
                                        x={nodeChildrenDimentions[v.index].x1 !== Infinity ? (nodeChildrenDimentions[v.index].x1 + nodeChildrenDimentions[v.index].x2 + (GAP * CONVERTE_TO_PX)) / 2 + (idx * CHARDIST * Math.cos(nodeChildrenDimentions[v.index].angle * Math.PI / 180)) : 0}
                                        y={nodeChildrenDimentions[v.index].y1 !== Infinity ? (nodeChildrenDimentions[v.index].y1 + nodeChildrenDimentions[v.index].y2 - (GAP * CONVERTE_TO_PX)) / 2 + (idx * CHARDIST * Math.sin(nodeChildrenDimentions[v.index].angle * Math.PI / 180)) : 0}
                                        textAnchor="middle"
                                        alignmentBaseline="middle"
                                        style={{fontSize:'1.2em'}}
                                        className={v.currChar === idx ? v.className : ''}
                                        >
                                            <tspan>{c}</tspan>
                                        </text>
                                    ))}
                                </svg>
                            <NodeTest node={suffixTree[v.index]} adjustedHeight={adjH}
                                        ref={(elem) => {
                                            const map = getMap();
                                            if (elem){
                                                map.set(v.index, elem.getBoundingClientRect())
                                            }else{
                                                map.delete(elem)
                                            };
                                        }}/>
                        </div>
                    })
                })()}
            </div>
        </div>
    );
});

export default NodeTest