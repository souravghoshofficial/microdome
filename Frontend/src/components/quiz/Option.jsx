import React , {useId} from 'react'

const Option = ({option}) => {
    const id = useId()
  return (
    <div className='flex items-center gap-2'>
        <input type="radio" id={id} name='option' className='cursor-pointer' />
        <label htmlFor={id} className='cursor-pointer'>{option}</label>
    </div>
  )
}

export default Option