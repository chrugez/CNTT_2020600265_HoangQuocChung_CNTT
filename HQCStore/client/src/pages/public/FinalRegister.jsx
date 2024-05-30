import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import path from '../../ultils/path'
import Swal from 'sweetalert2'

const FinalRegister = () => {
    const {status} = useParams() 
    const navigate = useNavigate()
    useEffect(()=>{
        if(status === 'failed') Swal.fire('Oop!', 'Register Failed', 'error').then(()=>{
            navigate(`/${path.LOGIN}`)
        })
        if(status === 'success') Swal.fire('Congratulation!!', 'Register successful', 'success').then(()=>{
            navigate(`/${path.LOGIN}`)
        })
    },[])
  return (
    <div className='h-screen w-screen bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500'></div>
  )
}

export default FinalRegister