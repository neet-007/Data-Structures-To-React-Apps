import { useRef } from 'react';
import './App.css'
import LcpArray from './LcpArray'
import SuffixArray from './SuffixArray'
import { useTreeContext } from './TreeContext'

function App() {
  const {text, setText} = useTreeContext();
  const InputRef = useRef<HTMLInputElement>(null);
  function handleClick(){
    if (!InputRef.current){
      return
    };
    setText(InputRef.current.value);
  };
  return (
    <div>
      {text !== '' &&
        <SuffixArray/>
      }
      {text !== '' &&
        <LcpArray/>
      }
      <div>
        <input type="text" ref={InputRef}/>
        <button onClick={handleClick}>create</button>
      </div>
    </div>
  )
}

export default App
