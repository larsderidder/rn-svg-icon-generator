import React from 'react'
import SvgIcon from 'react-native-svg-icon'
import svgs from '../lib/svgs'

const buildProps = (props) => Object.assign({}, props, { svgs })

const IconBridge = (props) => {
  return React.createElement(SvgIcon, buildProps(props))
}

export default IconBridge
