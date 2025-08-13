import React from 'react'

const Button = ({btnText , className , onClick}) => {
  return (
    <button onClick={onClick} className={`px-3 py-1.5 rounded-sm cursor-pointer hover:-translate-y-1 transition-all duration-200 ${className}`}>
        {btnText}
    </button>
  )
}

export default Button