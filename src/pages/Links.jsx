import React, { useState } from 'react'

const Links = () => {
  const [bgImage] = useState(localStorage.getItem('bgImage'))

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex justify-center items-start pt-12 relative overflow-hidden">
      {bgImage ? (
        <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-xl" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-slate-950" />
      )}

    </div>
  )
}

export default Links
