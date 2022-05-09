import { extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

const overrides = extendTheme({
  styles: {
    global: (props) => ({
      body: {
        bg: mode('white', 'blackAlpha.900')(props),
        fontFamily: 'Sans'
      },
      button: {
        bg: mode('blackAlpha.200', 'whiteAlpha.200')(props),
      },
      p: {
        color: mode('blackAlpha.700', 'whiteAlpha.700')(props),
      },
      ul: {
        color: mode('blackAlpha.700', 'whiteAlpha.700')(props),
      },
    }),
  },
})

export default overrides
