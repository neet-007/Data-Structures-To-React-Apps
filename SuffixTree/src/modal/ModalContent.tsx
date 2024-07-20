import React, { ComponentProps, useState } from 'react'

export type ContentType = {
    title:string;
    intro:string;
    content:string;
};

const ModalContent:React.FC<ComponentProps<'div'> & {passedContent:ContentType[]}> = ({passedContent, ...props}) => {
    const [page, setPage] = useState<number>(0);
    return (
        <div {...props}>
            <p>
                {passedContent[page].intro}
            </p>
            <div className='flex flex-direction-column'>
                <div>
                    <p className='h3'>
                        {passedContent[page].title}
                    </p>
                    <p>
                        {passedContent[page].content}
                    </p>
                </div>
                <div className='flex gap-2-rem align-items-center' style={{ transform: 'translateY(-50%)' }}>
                    <p>page: {page + 1}</p>
                    <button disabled={page <= 0} className='heigth-max-content button' onClick={() => setPage(prev => prev - 1)}>back</button>
                    <button disabled={page >= passedContent.length - 1} className='heigth-max-content button' onClick={() => setPage(prev => prev + 1)}>next</button>
                </div>
            </div>
        </div>
    )
}

export default ModalContent