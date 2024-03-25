import React from 'react'
// import { NotifyOnChangeProps } from '@tanstack/query-core'
import { useFocusEffect } from '@react-navigation/native'

export function useFocusNotifyOnChangeProps(notifyOnChangeProps?: any) {
  const focusedRef = React.useRef(true)

  useFocusEffect(
    React.useCallback(() => {
      focusedRef.current = true

      return () => {
        focusedRef.current = false
      }
    }, [])
  )

  return () => {
    if (!focusedRef.current) {
      return []
    }

    if (typeof notifyOnChangeProps === 'function') {
      return notifyOnChangeProps()
    }

    return notifyOnChangeProps.current
  }
}

export default useFocusNotifyOnChangeProps;