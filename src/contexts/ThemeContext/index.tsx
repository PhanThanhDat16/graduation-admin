import React from 'react'

type ThemeContextType = {
  isDark: boolean
  toggleTheme: () => void
}

export const ThemeContext = React.createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {}
})
