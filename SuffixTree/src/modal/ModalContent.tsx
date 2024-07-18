import React, { ComponentProps, useState } from 'react'

export type ContentType = {
    title:string;
    content:string
};

const ModalContent:React.FC<ComponentProps<'div'> & {passedContent:ContentType[]}> = ({passedContent, ...props}) => {
    const [page, setPage] = useState<number>(0);
    return (
        <div {...props}>
            <p>
                A suffix array is a data structure that lists the starting positions of a string's suffixes in lexicographical order.
                It is used for efficient substring searching and other string processing tasks.
            </p>
            <div>
                <div>
                    <p>
                        {passedContent[page].title}
                    </p>
                    <p>
                        {passedContent[page].content}
                    </p>
                </div>
                <div className='position-absolute bottom-0 flex gap-2-rem align-items-center' style={{ transform: 'translateY(-50%)' }}>
                    <p>{page}</p>
                    {page > 0 &&
                        <button className='heigth-max-content button' onClick={() => setPage(prev => prev - 1)}>back</button>
                    }
                    {page < passedContent.length - 1 &&
                        <button className='heigth-max-content button' onClick={() => setPage(prev => prev + 1)}>next</button>
                    }
                </div>
            </div>
        </div>
    )
}

export default ModalContent