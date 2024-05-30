import React, { useState, useCallback } from 'react'
import { InputField, Button } from '../../components'
import { useParams, useNavigate } from 'react-router-dom'
import { apiResetPassword } from '../../apis/user'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import path from '../../ultils/path'

const ResetPassword = () => {
    const navigate = useNavigate()
    const { token } = useParams()
    console.log(token);
    const [payload, setPayload] = useState({
        password: '',
        retypePassword: ''
    })
    const handleSubmit = useCallback(async () => {
        const { password, retypePassword } = payload
        if (password === retypePassword) {
            const response = await apiResetPassword({ password, token })
            console.log(response);
            if (response.success) {
                Swal.fire('Congratulations!', `${response.mes}`, 'success').then(() => {
                    navigate(`/${path.LOGIN}`)
                })
            } else {
                toast.error(response.mes)
            }
        } else {
            toast.error('RetypePassword does not match Password! Please retype your password!')
        }

    })
    return (
        <div className='h-screen w-screen bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 flex items-center justify-center'>
            <div className='w-1/4 bg-white flex flex-col items-center rounded-md min-w-[500px] shadow-md'>
                <h1 className='font-semibold text-main'>RESET PASSWORD</h1>
                <InputField
                    value={payload.password}
                    setValue={setPayload}
                    nameKey='password'
                    type='password'
                    style='w-full'
                />
                <InputField
                    value={payload.retypePassword}
                    setValue={setPayload}
                    nameKey='retypePassword'
                    type='password'
                    style='w-full'
                />
                <Button
                    name='Submit'
                    handleOnClick={handleSubmit}
                />
            </div>
        </div>
    )
}

export default ResetPassword