import './App.css'
import TreeContainer from './TreeContainer'
import { TreeContextProvidor } from './TreeContext'

function App() {

  return (
    <div>
      <TreeContextProvidor>
        <TreeContainer/>
      </TreeContextProvidor>
    </div>
  )
}

export default App
