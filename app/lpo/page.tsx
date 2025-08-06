import LPOForm from '@/components/LPOForm'
import React from 'react'

function LpoPage() {
  return (
    <div className='space-y-6 w-full mt-20'>
      <h1 className="text-2xl font-bold tracking-widest text-center uppercase">Local Purchase Order</h1>
      <LPOForm />
    </div>
  )
}

export default LpoPage