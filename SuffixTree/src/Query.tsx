import React, { ComponentProps, useRef } from 'react'
import { useTreeContext } from './TreeContext';
import DynamicHeightInput from './DynamicHeightInput';

export type QueryType = {char:string, className: 'heighlited-char' | 'found-char' | 'unmatching-char' | ''}

interface QueryProps extends ComponentProps<'div'>{

}

const Query:React.FC<QueryProps> = ({...props}) => {
    const {command, text, query, handleQuery} = useTreeContext();

    const queryRef = useRef<HTMLDivElement>(null);


    function handleClickQuery(){
        if (!queryRef.current){
          return
        };
        const inputElem = queryRef.current.children[1] as HTMLInputElement
        if (inputElem.value.length > text.length){
            alert('query is longer than the text');
            return
        };
        const q = inputElem.value.split('').reduce((prev:QueryType[], curr:string) => {
            prev.push({char:curr.toLocaleLowerCase(), className:prev.length === 0 ? 'heighlited-char' : ''});
            return prev
        },[]);
        handleQuery(q);
      };

    return (
        <div {...props} style={{display:'flex', alignItems:'center', gap:'1rem'}}>
        <div>
        <DynamicHeightInput passedLabel='query' passedPlaceHolder='query should be shorter than the text' ref={queryRef}/>
        <button disabled={command !== 4} onClick={handleClickQuery}>query</button>
        </div>
        <div>query: {query.map((v, i) => (
            <span key={`query-text-${v.char}-${i}`} className={v.className}>{v.char}</span>
            ))}
        </div>
        <p>results: </p>
    </div>
    )
}

export default Query