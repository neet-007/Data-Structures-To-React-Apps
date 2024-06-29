import React, {ComponentProps, useState} from 'react'
import LeftBracket from './LeftBracket'
import RightBracket from './RightBracket'
import { Node } from './data_structure/Stack'
import StackItem from './StackItem'

interface StackContainerProps extends ComponentProps<'div'>{

}

const StackContainer:React.FC<StackContainerProps> = ({children, ...props}) => {
  const [stack, setStack] = useState<(string | number)[]>(['test'])

  function push(item:string | number){
    setStack(prev => {
        prev.push(item);
        return [...prev]
    });
  };

  function pop(){
    setStack(prev => {
        prev.pop();
        return [...prev]
    });
  }

  return (
    <section {...props}>
        <div style={{display:'flex', gap:'1rem', alignItems:'center', backgroundColor:'red'}}>
            <LeftBracket/>
                {stack.map((item, index) => {
                    return <StackItem key={`${index}-${item}-stack-item`} val={item}/>
                })}
            <RightBracket style={{justifySelf:'right'}}/>
        </div>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <div style={{display:'flex', flexDirection:'column', gap:'2rem'}}>
                <button>push</button>
                <input type="text" />
            </div>
            <button>pop</button>
        </div>
    </section>
  )
}

export default StackContainer