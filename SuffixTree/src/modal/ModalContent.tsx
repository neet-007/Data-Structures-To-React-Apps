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
                <div style={{display:'flex', gap:'1rem', alignItems:'center'}}>
                    <p>{page}</p>
                    {page > 0 &&
                        <button style={{height:'max-content'}} onClick={() => setPage(prev => prev - 1)}>back</button>
                    }
                    {page < passedContent.length - 1 &&
                        <button style={{height:'max-content'}} onClick={() => setPage(prev => prev + 1)}>next</button>
                    }
                </div>
            </div>
        </div>
    )
}

export default ModalContent