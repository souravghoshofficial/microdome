import React from 'react'
import { ContactItem } from '../components'
import { RiMailLine , RiPhoneLine , RiMapPinLine } from "@remixicon/react"

const Contact = () => {
  return (
    <div className='mt-16 md:mt-32 w-full flex items-center justify-center'>
        <div className='w-[90%] flex flex-col md:flex-row items-center justify-between'>
            <div className='w-full md:w-[60%]'>
                <p className='text-sm font-bold'>Connect</p>
                <h2 className='mt-2 text-3xl md:text-4xl font-bold'>Get In Touch</h2>
                <p className='mt-1 w-[90%] md:w-full'>We are here to help you with any inquiries or support you need.</p>
            </div>
            <div className='w-full md:w-[40%] flex flex-col'>
                <ContactItem contactType="Email" logo={<RiMailLine size={24} />} desc="microdomeclasses@gmail.com" />
                <ContactItem contactType="Phone" logo={<RiPhoneLine size={24} />} desc="+91 84788 05171" />
                <ContactItem contactType="Office" logo={<RiMapPinLine size={24} />} desc="Kolkata - 700032" />
            </div> 
        </div>
    </div>
  )
}

export default Contact