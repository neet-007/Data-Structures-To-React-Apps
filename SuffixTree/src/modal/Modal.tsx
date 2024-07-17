import React, { ComponentProps } from 'react'
import { createPortal } from 'react-dom'
import ModalContent from './ModalContent';
import { LCP_CONTENT, SA_CONTENT, ST_CONTENT } from './content';

interface ModalProps extends ComponentProps<'div'>{
    isOpen:boolean;
    setIsOpen:React.Dispatch<React.SetStateAction<boolean>>;
    title: 'suffix array' | 'lcp array' | 'suffix tree' | 'timer';
    setTimer?:React.Dispatch<React.SetStateAction<number>>;
}

const Modal:React.FC<ModalProps> = ({isOpen, setIsOpen, title, setTimer, ...props}) => {
    if (!isOpen) {
        return null
    };
    return (
        createPortal(
            <>
                <div id='modal-overlay' style={{position:'fixed', left:0, top:0, right:0, bottom:0, backgroundColor:'rgba(0,0,0,0.75)',zIndex:'100'}} {...props}>
                </div>
                <div style={{position:'fixed', left:'50%', top:'50%', transform:'translate(-50%, -50%)',
                            minHeight:'20rem', minWidth:'40rem', backgroundColor:'white', borderRadius:'1rem',
                            display:'flex', flexDirection:'column', padding:'1rem', zIndex:'1000'
                        }}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <p style={{textTransform:'capitalize'}}>{title}</p>
                        <button style={{height:'max-content'}} onClick={() => setIsOpen(false)}>X</button>
                    </div>
                    {(title === 'timer' && setTimer) ?
                    <div>
                        <input type="number" />
                        <button onClick={(e) => {
                            const elem = e.currentTarget.previousSibling as HTMLInputElement
                            setTimer(Number(elem.value))
                            }}>set</button>
                    </div>
                    :
                        <ModalContent passedContent={
                            title === 'suffix array' ?
                            SA_CONTENT :
                            title === 'lcp array' ?
                            LCP_CONTENT :
                            ST_CONTENT
                        }/>
                    }
                </div>
            </>
        , document.getElementById('modal-div')!)
    )
}

export default Modal