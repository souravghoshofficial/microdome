import React from 'react'
import abcfile from '../assets/pdfs/abc.pdf'
function DownloadBtn() {
  return (
    <a href={abcfile}  download={true}  className='text-center px-3 py-1.5 bg-button' >Download</a>
  )
}

export default DownloadBtn