import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export function useUrlParams() {
  const router = useRouter()

  // 移除参数的函数
  const removeParam = useCallback(
    (param: string) => {
      const url = new URL(window.location.href)
      url.searchParams.delete(param)
      router.replace(url.pathname + url.search, { scroll: false })
      console.log('Removed type=new parameter from URL')
    },
    [router]
  )

  return {
    removeParam,
  }
}
