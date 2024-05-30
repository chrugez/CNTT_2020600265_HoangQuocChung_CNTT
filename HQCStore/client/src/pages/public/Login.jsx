import React, { useState, useCallback, useEffect } from "react"
import { InputField, Button, Loading } from "../../components"
import ImgLogin from '../../assets/login.webp'
import { apiRegister, apiLogin, apiForgotPassword, apiFinalRegister } from "../../apis/user"
import Swal from 'sweetalert2'
import { useNavigate, Link, useSearchParams } from "react-router-dom"
import path from "../../ultils/path"
import { login } from '../../store/user/userSlice'
import { showModal } from '../../store/app/appSlice'
import { useDispatch } from "react-redux"
import { toast } from 'react-toastify'
import { validate } from "../../ultils/helper"


const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [payload, setPayload] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        mobile: ''
    })
    const [token, setToken] = useState('')
    const [isVerifyEmail, setIsVerifyEmail] = useState(false)
    const [email, setEmail] = useState('')
    const [invalidFields, setInvalidFields] = useState([])
    const [isForgotPassword, setIsForgotPassword] = useState(false)
    const [isRegister, setIsRegister] = useState(false)
    const [searchParams] = useSearchParams()
    const resetPayload = () => {
        setPayload({
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            mobile: ''
        })
    }
    const handleForgotPassword = async () => {
        const response = await apiForgotPassword({ email })
        console.log(response);
        if (response.success) {
            Swal.fire('Notification!', `${response.mes}`, 'success').then(() => setIsForgotPassword(false))

        } else {
            toast.error(response.mes)
        }
    }

    useEffect(() => {
        resetPayload()
    }, [isRegister])

    //SUBMIT
    const handleSubmit = useCallback(async () => {
        const { firstName, lastName, mobile, ...data } = payload

        const invalids = isRegister ? validate(payload, setInvalidFields) : validate(data, setInvalidFields)

        if (invalids === 0) {
            if (isRegister) {
                dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
                const response = await apiRegister(payload)
                dispatch(showModal({ isShowModal: false, modalChildren: null }))
                if (response.success) {
                    setIsVerifyEmail(true)
                    // Swal.fire('Congratulation!', response.mes, 'success')
                    // .then(()=>{
                    //     setIsRegister(false)
                    //     resetPayload()
                    // })
                } else {
                    Swal.fire('Opps!', response.mes, 'error')
                }
            } else {
                const result = await apiLogin(data)
                if (result.success) {
                    dispatch(login({ isLoggedIn: true, token: result.accessToken, userData: result.userData }))
                    searchParams.get('redirect') ? navigate(searchParams.get('redirect')) : navigate(`/${path.HOME}`)
                } else {
                    Swal.fire('Opps!', 'Wrong Email or Password', 'error')
                }
            }
        }
    }, [payload, isRegister])

    const finalRegister = async () => {
        const response = await apiFinalRegister(token)
        if (response.success) {
            Swal.fire('Congratulation!', response.mes, 'success')
                .then(() => {
                    setIsRegister(false)
                    resetPayload()
                })
        } else {
            Swal.fire('Opps!', response.mes, 'error')
        }
        setIsVerifyEmail(false)
        setToken('')
    }

    return (
        <div className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 w-screen h-screen flex relative">
            {isVerifyEmail && <div className="absolute top-0 bottom-0 left-0 right-0 z-50 bg-overlay flex flex-col items-center justify-center">
                <div className="bg-white w-[500px] rounded-md p-8">
                    <h4>We sent the register code to your email. Please check your email and enter your code:</h4>
                    <input
                        type="text"
                        value={token}
                        onChange={e => setToken(e.target.value)}
                        className="p-2 border rounded-md outline-none"
                    />
                    <button
                        type="button"
                        className="px-4 py-2 bg-blue-500 font-semibold text-white rounded-md ml-4"
                        onClick={finalRegister}
                    >
                        Submit
                    </button>
                </div>
            </div>}
            {isForgotPassword && <div
                className="absolute top-0 bottom-0 left-0 right-0 z-50 bg-overlay flex items-center justify-center"
                onClick={(e) => {
                    e.stopPropagation()
                    setIsForgotPassword(false)
                }}
            >
                <div className="flex flex-col bg-white rounded-md gap-4">
                    <label htmlFor="email" className="text-main font-semibold text-lg px-4 mt-4">Enter your email: </label>
                    <input
                        type="text"
                        id="email"
                        className="w-[800px] px-4 border-b outline-none mb-4 placeholder:text-sm placeholder:italic"
                        placeholder="Exp: email@gmail.com"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                        onClick={e => e.stopPropagation()}
                    />
                    <div className="flex items-center justify-center">
                        <Button
                            name='Submit'
                            handleOnClick={handleForgotPassword}
                        />
                    </div>
                </div>
            </div>}
            <div className="w-1/2 flex items-center justify-center ">
                <div className="p-8 bg-white flex flex-col items-center rounded-md min-w-[500px]">
                    <h1 className="text-[28px] font-semibold text-main mb-8">{isRegister ? 'Register' : 'Login'}</h1>
                    {isRegister && <div className="flex flex-col items-center gap-2 w-full">
                        <InputField
                            value={payload.firstName}
                            setValue={setPayload}
                            nameKey='firstName'
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                            style='w-full'
                        />
                        <InputField
                            value={payload.lastName}
                            setValue={setPayload}
                            nameKey='lastName'
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                            style='w-full'
                        />
                        <InputField
                            value={payload.mobile}
                            setValue={setPayload}
                            nameKey='mobile'
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                            style='w-full'
                        />
                    </div>}
                    <InputField
                        value={payload.email}
                        setValue={setPayload}
                        nameKey='email'
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                        style='w-full'
                    />
                    <InputField
                        value={payload.password}
                        setValue={setPayload}
                        nameKey='password'
                        type='password'
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                        style='w-full'
                    />
                    <Button
                        name={isRegister ? 'Register' : 'Login'}
                        handleOnClick={handleSubmit}
                        fw
                    />
                    <div className="flex items-center justify-between my-2 w-full text-sm">
                        {!isRegister && <span
                            className="text-blue-500 hover:underline cursor-pointer"
                            onClick={() => setIsForgotPassword(true)}
                        >
                            Forgot your account?
                        </span>}
                        {!isRegister && <span
                            className="text-blue-500 hover:underline cursor-pointer"
                            onClick={() => setIsRegister(true)}
                        >
                            Create account
                        </span>}
                        {isRegister && <span
                            className="text-blue-500 hover:underline cursor-pointer w-full text-center"
                            onClick={() => setIsRegister(false)}
                        >
                            Go Login
                        </span>}
                    </div>
                    <Link to={`/${path.HOME}`} className="text-sm text-blue-500 hover:underline">Back to Home</Link>
                </div>
            </div>
            <div className="w-1/2 flex flex-col items-center justify-center ">
                <h1
                    className="text-[48px] font-bold my-8 ">
                    <span className="text-main px-2">HQC</span>
                    <span className="text-[32px] font-semibold text-gray-800">STORE</span>
                </h1>
                <img src={ImgLogin} alt="image" className="w-[600px] h-[500px] object-contain" />
            </div>
        </div>
    )
}

export default Login