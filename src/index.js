import {
  createElement,
  useReducer,
  useEffect,
  useCallback,
} from 'react'
import PropTypes from 'prop-types'
import Content from './Content'

const useShears = ({
  text,
  maxHeight,
}) => {
  const initialState = {
    max: text.length - 1,
    min: 0,
    visibleText: text,
    hiddenText: '',
    offsetWidth: 0,
    offsetHeight: 0,
    binaryDone: false,
    done: false,
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'RECEIVE_CONTAINER_DIMENSIONS':
        return {
          ...state,
          ...action.payload,
        }
      case 'ITERATE_BINARY_SEARCH':
      case 'ITERATE_STEP_SEARCH':
        return {
          ...state,
          ...action.payload,
          visibleText: `${text.slice(0, action.payload.max)}`,
          hiddenText: `${text.slice(action.payload.max)}`,
          offsetHeight: 0,
        }
      case 'ITERATE_DONE':
        return {
          ...state,
          ...action.payload,
          binaryDone: true,
          done: true,
          visibleText: `${text.slice(0, action.payload.max)}`,
          hiddenText: `${text.slice(action.payload.max)}`,
        }
      case 'CONTAINER_RESIZED':
        return {
          ...initialState,
        }
      default:
        throw new Error()
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  let {
    min,
    max,
  } = state

  const {
    visibleText,
    hiddenText,
    offsetHeight,
    done,
    binaryDone,
  } = state

  const container = useCallback((node) => {
    if (node !== null && !done) {
      dispatch({
        type: 'RECEIVE_CONTAINER_DIMENSIONS',
        payload: {
          offsetWidth: node.getBoundingClientRect().width,
          offsetHeight: node.getBoundingClientRect().height,
        },
      })
    }
  }, [max, done])

  useEffect(() => {
    const midpoint = (min + max + 1) >> 1 // eslint-disable-line no-bitwise

    if (offsetHeight > 0) {
      if (min < max && !binaryDone && !done) {
        if (offsetHeight > maxHeight) {
          max = midpoint - 1
        } else {
          min = midpoint
        }

        dispatch({
          type: 'ITERATE_BINARY_SEARCH',
          payload: {
            min,
            max,
          },
        })
      }

      if (offsetHeight <= maxHeight && max < text.length && !done) {
        dispatch({
          type: 'ITERATE_STEP_SEARCH',
          payload: {
            binaryDone: true,
            max: max + 1,
          },
        })
      }

      if (offsetHeight > maxHeight && binaryDone && !done) {
        dispatch({
          type: 'ITERATE_DONE',
          payload: {
            max: max - 1,
            done: true,
          },
        })
      }

      if (offsetHeight <= maxHeight && max === text.length - 1) {
        dispatch({
          type: 'ITERATE_DONE',
          payload: {
            max: text.length,
          },
        })
      }
    }
  }, [offsetHeight])

  return [container, visibleText, hiddenText, done]
}

const Shears = ({
  maxHeight,
  text,
  tag,
  className,
}) => {
  const [container, visibleText, hiddenText, done] = useShears({ text, maxHeight })

  if (
    !text
    || !maxHeight
    || !visibleText
  ) {
    return text
  }

  return (
    createElement(
      tag,
      {
        tabIndex: 0,
        style: {
          overflow: 'hidden',
          maxHeight,
          opacity: done ? 1 : 0,
          transition: 'opacity 0.2s',
        },
        className,
      },
      createElement(
        'div',
        {
          ref: container,
        },
        createElement(
          Content,
          {
            visibleText,
            hiddenText,
          },
        ),
      ),
    )
  )
}

Shears.propTypes = {
  maxHeight: PropTypes.number.isRequired,
  text: PropTypes.element.isRequired,
  tag: PropTypes.string,
  className: PropTypes.string,
}

Shears.defaultProps = {
  tag: 'div',
  className: '',
}

export default Shears
