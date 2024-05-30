import React, { memo } from 'react'
import { SyncLoader } from 'react-spinners'

const Loading = () => {
    return (
        <SyncLoader color='rgb(59,130,246)' />
    )
}

export default memo(Loading)