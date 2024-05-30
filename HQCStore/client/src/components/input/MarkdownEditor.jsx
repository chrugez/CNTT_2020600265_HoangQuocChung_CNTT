import React, { memo, useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react'

const MarkdownEditor = ({ label, value, changeValue, name, invalidField, setInvalidField }) => {
    const editorRef = useRef(null)
    const log = () => {
        if (editorRef.current) {
            console.log(editorRef.current.getContent())
        }
    }
    return (
        <div className='flex flex-col'>
            <span className='capitalize'>{label}</span>
            <Editor
                apiKey={import.meta.env.VITE_MCETINY}
                onInit={(evt, editor) => editorRef.current = editor}
                initialValue={value}
                init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar: 'undo redo | formatselect | ' +
                        'bold italic backcolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
                onChange={e => changeValue(prev => ({ ...prev, [name]: e.target.getContent() }))}
                onFocus={() => {
                    setInvalidField && setInvalidField([])
                }}
            />
            {invalidField?.some(el => el.name === name) &&
                <span className='text-main text-xs'>
                    {invalidField?.find(el => el.name === name)?.mes}
                </span>}
        </div>
    )
}

export default memo(MarkdownEditor)