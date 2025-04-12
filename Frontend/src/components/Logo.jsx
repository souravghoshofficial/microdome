import React from 'react'
import microdomeLogo from "../assets/microdomeLogo.png"

const Logo = ({className}) => {
  return (
    <div className={`${className}`}>
        <img className='w-full' src={microdomeLogo} alt="microdome logo" />
    </div>
  )
}

export default Logo