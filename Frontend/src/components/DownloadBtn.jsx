import React from 'react'

const DownloadBtn = ({url}) =>{
  return (
    <div>
      <a href={url}  target='_blank'  className='text-center px-3 py-1.5 bg-button rounded-2xl' >Download</a>
    </div>
  );
};

export default DownloadBtn;