import React, {ComponentProps, useRef, useState} from 'react'
import LeftBracket from './LeftBracket'
import RightBracket from './RightBracket'
import StackItem from './StackItem'

type StackItemType = {val:string | number, className:string}

interface StackContainerProps extends ComponentProps<'div'>{

}

const StackContainer:React.FC<StackContainerProps> = ({children, ...props}) => {
  const [stack, setStack] = useState<(StackItemType)[]>([])
  const [lastPoppedItem, setLastPoppedItem] = useState<StackItemType | undefined>(undefined)
  const [peakState, setPeakState] = useState<boolean>(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const StackContainerRef = useRef<HTMLDivElement>(null)

  function push(item:string | number){
    setStack(prev => {
        if (prev.length !== 0){
          prev[prev.length - 1].className = '';
          StackContainerRef.current!.children[StackContainerRef.current!.children.length - 2].innerHTML = `item ${prev.length}`
        };
        prev.push({val:item, className:'last-stack-item'});
        setPeakState(true);
        return [...prev]
    });
  };

  function pop(){
    let temp;
    setStack(prev => {
        temp = prev.pop();
        if (prev.length !== 0){
          prev[prev.length - 1].className = 'last-stack-item';
        };
        setLastPoppedItem(temp);
        setPeakState(true);
        return [...prev]
    });
  };

  function peak(state:boolean){
    if(!StackContainerRef.current){
      return
    };

    if(state){
      StackContainerRef.current.children[StackContainerRef.current.children.length - 2].innerHTML = stack[stack.length - 1].val.toString();
    }else{
      StackContainerRef.current.children[StackContainerRef.current.children.length - 2].innerHTML = `item ${stack.length}`
    };
    setPeakState(prev => !prev);
  }

  return (
    <section {...props}>
        <div ref={StackContainerRef} style={{display:'flex', gap:'1rem', alignItems:'center', justifyContent:'flex-start'}}>
            <LeftBracket/>
                {stack.map((item, index) => {
                    return <StackItem className={item.className} onClick={item.className === 'last-stack-item' ? pop:() => {}}
                    style={{cursor:'pointer'}} key={`${index}-${item}-stack-item`} val={`item ${index + 1}`}/>
                })}

            <RightBracket/>
        </div>
        <div style={{display:'flex', alignItems:'start', justifyContent:'space-between'}}>
            <div style={{display:'flex', flexDirection:'column', gap:'2rem'}}>
                <button onClick={() => push(inputRef.current?.value!)}>push</button>
                <input type="text" ref={inputRef}/>
            </div>
            <div style={{display:'flex', flexDirection:'column'}}>
              <button onClick={() => peak(peakState)}>{peakState ? 'peak': 'unpeak'}</button>
              <p>{stack.length === 0 ? 'stack is empty':`stack has ${stack.length} items`}</p>
            </div>
            <div>
              <p>last popped item</p>
              <p>{lastPoppedItem?.val}</p>
            </div>
        </div>
    </section>
  )
}

export default StackContainer