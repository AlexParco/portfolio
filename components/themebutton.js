import { IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'

const ThemeButton = () => {
  const {toggleColorMode } = useColorMode()

  return (
    <IconButton
      aria-label='Toggle Theme'
      variant='outline'
      onClick={toggleColorMode}
      icon={useColorModeValue(<MoonIcon />, <SunIcon />)}
    >
    </IconButton>
  )
}

export default ThemeButton

