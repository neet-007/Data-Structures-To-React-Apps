import { useRef } from 'react';
import './App.css'
import LcpArray from './LcpArray'
import SuffixArray from './SuffixArray'
import Node from './Node';
import { useTreeContext } from './TreeContext'
import NodeTest from './NodeTest';

function App() {
  const {text, suffixTree, command, setText, setCommand} = useTreeContext();
  const InputRef = useRef<HTMLInputElement>(null);

  function handleClick(){
    if (!InputRef.current){
      return
    };
    setText(InputRef.current.value);
    setCommand(1);
  };

  console.log(suffixTree);

  return (
    <div style={{position:'relative'}}>
      {command > 0 &&
        <SuffixArray/>
      }
      {command > 1 &&
        <LcpArray/>
      }

        <div>
          <input type="text" ref={InputRef}/>
          <button onClick={handleClick}>create</button>
        </div>
      <div style={{height:'100%', width:'100%', display:'flex', flexDirection:'column', alignItems:'center'}}>
        {command > 2 &&
          <NodeTest node={suffixTree[0]} adjustedHeight={0}/>
        }
      </div>
    </div>
  )
}

export default App
