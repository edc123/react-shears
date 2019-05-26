import {
  createElement,
  Fragment,
} from 'react'
import PropTypes from 'prop-types'

const ELLIPSIS_CHAR = '…'

const Content = ({
  visibleText,
  hiddenText,
}) => (
  createElement(
    Fragment,
    null,
    visibleText,
    hiddenText && createElement(
      Fragment,
      null,
      createElement(
        'span',
        {
          'aria-hidden': 'true',
          unselectable: 'on',
          style: {
            userSelect: 'none',
          },
        },
        ELLIPSIS_CHAR,
      ),
      createElement(
        'span',
        {
          style: {
            width: '1px',
            height: '1px',
            margin: '-1px',
            border: 0,
            clip: 'rect(0, 0, 0, 0)',
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
          },
        },
        hiddenText,
      ),
    ),
  )
)

Content.propTypes = {
  visibleText: PropTypes.string.isRequired,
  hiddenText: PropTypes.string,
}

Content.defaultProps = {
  hiddenText: '',
}

export default Content
