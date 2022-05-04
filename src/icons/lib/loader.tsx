import { createIcon } from '@chakra-ui/react'

export const Loader = createIcon({
  displayName: 'Loader',
  viewBox: '0 0 100 100',
  path: (
    <path
      d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50"
      fill="#ffffff"
      stroke="none"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        dur="0.689655172413793s"
        repeatCount="indefinite"
        keyTimes="0;1"
        values="0 50 51;360 50 51"
      ></animateTransform>
    </path>
  ),
})
