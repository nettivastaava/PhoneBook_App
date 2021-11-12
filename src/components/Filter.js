import React from 'react'

const Filter = (props) => {
    return(
      <div>
        <input value={props.filter} onChange={props.change}/>
      </div>
    )
  }

export default Filter