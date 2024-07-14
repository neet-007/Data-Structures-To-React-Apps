import { useRef } from 'react';
import './App.css'
import LcpArray from './LcpArray'
import SuffixArray from './SuffixArray'
import Node from './Node';
import { useTreeContext } from './TreeContext'
import NodeTest from './NodeTest';
import Query from './Query';

function App() {
  const {text, suffixTree, command, suffix, setText, setCommand} = useTreeContext();
  const InputRef = useRef<HTMLInputElement>(null);

  function handleClickInput(){
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

        <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
          <div>
            <input type="text" ref={InputRef}/>
            <button disabled={command > 0} onClick={handleClickInput}>create</button>
          </div>
            <p>text: {text}</p>
            <p>current suffix: {text.slice(suffix, text.length)}</p>
        </div>

          <Query/>

      <div style={{height:'100%', width:'100%', display:'flex', flexDirection:'column', alignItems:'center'}}>
        {command > 2 &&
          <NodeTest node={suffixTree[0]} adjustedHeight={0}/>
        }
      </div>
    </div>
  )
}

export default App
