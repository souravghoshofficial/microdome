import React from 'react'

const DownloadBtn = ({noteUrl}) => {
  return (
    <a href={noteUrl} target='_blank' className='text-center text-white px-3 py-1.5 rounded-lg bg-button text-sm cursor-pointer'>Download</a>
  )
}

export default DownloadBtn