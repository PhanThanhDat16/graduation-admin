import { useEffect, useState } from 'react'
import { ThemeContext } from '../ThemeContext'
import { ConfigProvider, theme } from 'antd'

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    const html = document.querySelector('html')

    if (isDark) {
      html?.classList.add('dark')
    } else {
      html?.classList.remove('dark')
    }

    localStorage.setItem('theme', JSON.stringify(isDark))
  }, [isDark])
  const toggleTheme = () => {
    setIsDark((prev) => !prev)
  }
  const configProps = { theme: { algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm } }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <ConfigProvider {...configProps}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
