import React from 'react'
import WhatsAppButton from './WhatsAppButton'
import ScrollToTop from './ScrollToTop'

const FloatingButtons = () => {
    return (
        <div className='fixed bottom-24 lg:bottom-6 right-6 z-50 flex flex-col items-center gap-3'>
            <ScrollToTop />
            <WhatsAppButton />
        </div>
    )
}

export default FloatingButtons
