import React, {useEffect} from 'react'
import './_support.scss'

const Support = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div>Support</div>
  )
}

export default Support