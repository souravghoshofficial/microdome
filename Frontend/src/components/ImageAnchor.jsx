import React from 'react'

const ImageAnchor = ({imageUrl , altText , aHref = "#" , height , width}) => {
  return (
    <div className={`w-${width} h-${height}`}>
        <a href={aHref}>
            <img className='w-full h-full' src={imageUrl} alt={altText} />
        </a>
    </div> 
  )
}

export default ImageAnchor