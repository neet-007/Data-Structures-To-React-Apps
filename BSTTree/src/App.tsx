import './App.css'
import TreeContainer from './TreeContainer'
import { TreeContextProvider } from './TreeContext'

function App() {

  return (
    <>
    <TreeContextProvider>
      <TreeContainer/>
    </TreeContextProvider>
    </>
  )
}

export default App
