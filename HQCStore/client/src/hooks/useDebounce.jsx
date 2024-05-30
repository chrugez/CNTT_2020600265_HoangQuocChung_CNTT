import React, { useEffect, useState } from 'react'

const useDebounce = (value, ms) => {
    const [debounceValue, setDebounceValue] = useState('')
    useEffect(() => {
        const setTimeOutID = setTimeout(() => {
            setDebounceValue(value)
        }, ms)
        return () => {
            clearTimeout(setTimeOutID)
        }
    }, [value, ms])
    return debounceValue
}

export default useDebounce

//expect: khi mà nhập giá thì sẽ call api
//problem: call api liên tục với mỗi lượt nhập
//resovle: call api chỉ khi người dùng nhập xong
//dựa trên thời gian onChange của Input

//tách giá nhập vào (price) thành 2 biến
//1. biến phục vụ UI => gõ tới đâu nhập tới đó => UI render
//2. biến quyết định để call api => setTimeout => biến sẽ được gán sau khoảng thời gian delay 