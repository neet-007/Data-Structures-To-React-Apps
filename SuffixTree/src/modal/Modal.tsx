import React, { ComponentProps } from 'react'
import { createPortal } from 'react-dom'
import ModalContent from './ModalContent';
import { LCP_CONTENT, SA_CONTENT, ST_CONTENT } from './content';

interface ModalProps extends ComponentProps<'div'>{
    isOpen:boolean;
    setIsOpen:React.Dispatch<React.SetStateAction<boolean>>;
    title: 'suffix array' | 'lcp array' | 'suffix tree'
}

const Modal:React.FC<ModalProps> = ({isOpen, setIsOpen, title, ...props}) => {
    if (!isOpen) {
        return null
    };
    return (
        createPortal(
            <div style={{position:'absolute', left:0, top:0, right:0, bottom:0, backgroundColor:'rgba(0,0,0,0.75)',zIndex:'100'}} {...props}>
                <div style={{position:'absolute', left:'50%', top:'50%', transform:'translate(-50%, -50%)',
                            height:'20rem', width:'40rem', backgroundColor:'white', borderRadius:'1rem',
                            display:'flex', flexDirection:'column', padding:'1rem'
                }}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <p style={{textTransform:'capitalize'}}>{title}</p>
                        <button style={{height:'max-content'}} onClick={() => setIsOpen(false)}>X</button>
                    </div>
                    <ModalContent passedContent={
                        title === 'suffix array' ?
                        SA_CONTENT :
                        title === 'lcp array' ?
                        LCP_CONTENT :
                        ST_CONTENT
                    }/>
                </div>
            </div>
        , document.getElementById('modal-div')!)
    )
}

export default Modal