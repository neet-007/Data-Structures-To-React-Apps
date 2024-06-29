import React from "react"
import { BracketProprs } from "./LeftBracket"

const RightBracket:React.FC<BracketProprs> = ({height='96', width='96'}) => {
  return (
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width={width} height={height} viewBox="0 0 96 96"><rect x="0" y="0" width="96" height="96" fill="#FFFFFF"></rect><g transform="translate(43.656000000000006, 60)"><path d="M5.71-34.08L1.06-34.08 1.06-36 7.63-36 7.63 12 1.06 12 1.06 10.08 5.71 10.08 5.71-34.08Z" fill="#404040"></path></g></svg>
  )
}

export default RightBracket