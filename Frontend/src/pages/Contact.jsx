import React from 'react'

import emailIcon from '../assets/envelope.svg'
import phoneIcon from '../assets/phone.svg'
import locationIcon from '../assets/map-pin.svg'

import { ContactItem } from '../components'

const Contact = () => {
  return (
    <div className='mt-8 w-full flex items-center justify-center'>
        <div className='w-[90%] flex items-center justify-between'>
            <div className='w-[60%]'>
                <p className='text-sm font-bold'>Connect</p>
                <h2 className='mt-2 text-4xl font-bold'>Get In Touch</h2>
                <p className='mt-1'>We are here to help you with any inquiries or support you need.</p>
            </div>
            <div className='w-[40%] flex flex-col'>
                <ContactItem contactType="Email" logo={emailIcon} desc="info@microdomeclasses.com" />
                <ContactItem contactType="Phone" logo={phoneIcon} desc="+91 99999 99999" />
                <ContactItem contactType="Office" logo={locationIcon} desc="Kolkata - 700032" />
            </div> 
        </div>
    </div>
  )
}

export default Contact