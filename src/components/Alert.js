import React from 'react'

const Alert = ({message}) => {
  if (message === '') {
    return null
  } else if (message.match('^Added')) {
    return <div className='addNot'>{message}</div>
  } else if (message.match('^Deleted')) {
    return <div className='deleteNot'>{message}</div>
  }  else if (message.match('^Updated')) {
    return <div className='addNot'>{message}</div>
  } else if (message.match('^Malformed')) {
    return <div className='deleteNot'>{message}</div>
  }
}


export default Alert