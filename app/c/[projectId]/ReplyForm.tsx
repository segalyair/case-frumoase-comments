'use client'

import axios from "axios"
import React, { useLayoutEffect, useRef, useState } from "react"
import { Button } from "../../components/ui/Button"

function useFormField<T>(initialValue: T) {
  const [value, setValue] = React.useState<T>(initialValue)

  function onChangeHandler() {
    return (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setValue(e.target.value as any)
    }
  }

  return {
    value,
    onChange: onChangeHandler()
  }
}

export function ReplyForm(props: {
  locale: any,
  projectId: string
  pageSlug: string
  isEditing?: boolean,
  cancelable?: boolean
  parentId?: string
  session?: any
  isModerate?: boolean
}) {
  const usernameField = useFormField("")
  const emailField = useFormField("")
  const commentField = useFormField("")
  const [isEditing, setIsEditing] = useState(!!props.isEditing)
  const $commentBox = useRef<HTMLTextAreaElement>(null)
  const cancelable = props.cancelable !== undefined ? props.cancelable : true

  async function onClickReply() {
    await axios.post('/api/v2/comments', {
      projectId: props.projectId,
      pageId: props.pageSlug,
      comment: commentField.value,
      username: usernameField.value,
      parentId: props.parentId,
      email: emailField.value,
    })
    // const res = await axios.post('/api/open/comments', {
    //   appId: props.projectId,
    //   pageId,
    //   content,
    //   nickname,
    //   email,
    //   parentId,
    //   pageUrl,
    //   pageTitle,
    // })
  }

  useLayoutEffect(() => {
    if ($commentBox.current) {
      $commentBox.current.focus()
    }
  }, [isEditing])

  return (
    <div className="">
      {!isEditing &&
        <div onClick={_ => {
          setIsEditing(true)
        }} className="border border-gray-100 bg-gray-50 hover:bg-white hover:text-gray-300 transition-colors rounded px-3 py-2 text-gray-400 cursor-text text-sm">
          {props.locale.reply_placeholder}
        </div>
      }
      {isEditing && (
        <div className="flex flex-col gap-4">
          {props.session && <>
            <div>
              {props.session.user.name}
            </div>
          </>}
          {!props.session && (
            <div className="flex flex-col md:flex-row gap-2">
              <input value={emailField.value} onChange={emailField.onChange} className="border rounded px-2 py-1" type="email" placeholder={'email'} />
              <input value={usernameField.value} onChange={usernameField.onChange} className="border rounded px-2 py-1" type="text" placeholder="Name" />
            </div>
          )}
          <textarea value={commentField.value} onChange={commentField.onChange} ref={$commentBox} className="border rounded w-full p-4"></textarea>
          <div className="flex gap-2">
            <button onClick={onClickReply} type="button" className="border text-sm px-3 py-1 rounded">Send</button>
            {cancelable && <button onClick={_ => {
              setIsEditing(false)
            }} type="button" className="border text-sm px-3 py-1 rounded">Cancel</button>}
          </div>
        </div>
      )}
    </div>
  )
}