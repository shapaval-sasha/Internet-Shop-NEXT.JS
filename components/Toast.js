import React from 'react'
import {useEffect} from 'react'



export default function Toast({msg, handleShow, bgColor}) {

  useEffect(() => {
    setTimeout(() => {
      handleShow()
    }, 1200);
  }, [])

  return (
    <div className={`toast show position-fixed text-light ${bgColor}`} 
    style={{ top: '5px', right: '5px', zIndex: 9, minWidth: '280px', padding:3, opacity:0.5, borderRadius:10, cursor: 'pointer' }} onClick={handleShow}>
    <div className={`toast-header ${bgColor} text-light`}>
      <strong className="mr-auto text-light">{msg.title}</strong>
      <button type="button" className="ml-2 mb-1 close text-light" data-dismiss="toast" style={{outline: 'none', background: 'none'}} onClick={handleShow}>&times;</button>
    </div>
    <div className="toast-body">
      {msg.msg}
    </div>
  </div>
  )
}
