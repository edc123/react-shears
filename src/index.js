import {
  createElement,
  useReducer,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import Content from './Content'
 
// Simple fork of _.debounce
function debounce(func, wait) {
  let timeout
  return function () {
    const context = this
    const args = arguments
    const later = function () {
      timeout = null
      func.apply(context, args)
    }
 
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

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
    offsetWidth,
    offsetHeight,
    done,
    binaryDone,
  } = state
 
  const container = useRef(null)
  const [isMounted, setIsMounted] = useState(false)
 
  useLayoutEffect(() => {
    if (!done) {
      dispatch({
        type: 'RECEIVE_CONTAINER_DIMENSIONS',
        payload: {
          offsetWidth: container.current.getBoundingClientRect().width,
          offsetHeight: container.current.getBoundingClientRect().height,
        },
      })
    }
  }, [max, done])
 
  useLayoutEffect(() => {
    setIsMounted(true)
  }, [isMounted])
 
  useLayoutEffect(() => {
    const handleResize = () => {
      if (
        done
        && (
          container
          && container.current
          && offsetWidth > 0
          && container.current.getBoundingClientRect().width > 0
          && container.current.getBoundingClientRect().width !== offsetWidth
        )
      ) {
        dispatch({
          type: 'CONTAINER_RESIZED',
        })
      }
    }
 
    window.addEventListener('resize', debounce(handleResize, 1000))
    return () => {
      window.removeEventListener('resize', debounce(handleResize, 1000))
    }
  })
 
  useEffect(() => {
    if (offsetHeight > 0) {
      if (min < max && !binaryDone && !done) {
        const midpoint = (min + max + 1) >> 1 // eslint-disable-line no-bitwise
 
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
 
  return [container, visibleText, hiddenText, isMounted]
}
 
const Shears = ({
  maxHeight,
  text,
  tag,
  className,
}) => {
  const [
    container,
    visibleText,
    hiddenText,
    isMounted,
  ] = useShears({ text, maxHeight })
 
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
        style: {
          overflow: 'hidden',
          maxHeight,
          opacity: isMounted ? 1 : 0,
          transition: 'opacity 200ms',
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