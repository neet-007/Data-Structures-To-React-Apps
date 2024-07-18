import React, { ComponentProps, useState } from 'react'
import Node from './Node'
import Modal from './modal/Modal'
import { useTreeContext } from './TreeContext'
import { modalOverlayClick } from './utils/functions'

const SuffixTree:React.FC<ComponentProps<'div'>> = ({...props}) => {
    const {suffixTree, command, setCommand} = useTreeContext();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [currModalTitle, setCurrTitle] = useState<'suffix tree' | 'timer'>('suffix tree');

    function reDrawTree(){
        setCommand(30);
      };

    return (
        <div {...props} onClick={(e) => modalOverlayClick(e, setIsOpen)}>
        <div style={{display:'flex', gap:'1rem', alignItems:'center'}}>
            <h3>Suffix Tree</h3>
            <button style={{height:'max-content'}} disabled={command !== 4} onClick={reDrawTree}>redraw tree</button>
            <button onClick={() => {setIsOpen(true); setCurrTitle('suffix tree')}}>I</button>
            <button disabled={command !== 0 && command !== 4} onClick={() => {setIsOpen(true); setCurrTitle('timer')}}>set timer</button>
        </div>

        <div style={{height:'100%', width:'100%', display:'flex', flexDirection:'column', alignItems:'center'}}>
            <Node node={suffixTree[0]} adjustedHeight={0}/>
        </div>
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} title={currModalTitle}/>
        </div>
    )
}

export default SuffixTree