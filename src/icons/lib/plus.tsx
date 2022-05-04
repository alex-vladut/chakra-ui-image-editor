import { createIcon } from '@chakra-ui/react'

export const Plus = createIcon({
  displayName: 'Plus',
  viewBox: '0 0 24 24',
  defaultProps: {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
  path: [
    <line x1="12" y1="5" x2="12" y2="19"></line>,
    <line x1="5" y1="12" x2="19" y2="12"></line>,
  ],
})
