import {
  createElement,
  useReducer,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import Content from './Content'

function debounce(callback, wait) {
  let timeout
  return (...args) => {
    const context = this
    clearTimeout(timeout)
    timeout = setTimeout(() => callback.apply(context, args), wait)
  }
}

const useShears = ({
  text,
  maxHeight,
  debounceDuration,
}) => {
  const initialState = {
    max: text.length - 1,
    min: 0,
    visibleText: text,
    hiddenText: '',
    width: 0,
    binarySearchDone: false,
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
          visibleText: `${text.slice(0, action.payload.max).trim()}`,
          hiddenText: `${text.slice(action.payload.max)}`,
        }
      case 'ITERATE_DONE':
        return {
          ...state,
          ...action.payload,
          binarySearchDone: true,
          done: true,
          visibleText: `${text.slice(0, action.payload.max).trim()}`,
          hiddenText: `${text.slice(action.payload.max)}`,
        }
      case 'RESET_STATE':
        return {
          ...initialState,
          ...action.payload,
        }
      default:
        throw new Error()
    }
  }

  const container = useRef(null)
  const [state, dispatch] = useReducer(reducer, initialState)
  const [isMounted, setIsMounted] = useState(false)

  let {
    min,
    max,
  } = state

  const {
    visibleText,
    hiddenText,
    width,
    done,
    binarySearchDone,
  } = state

  useLayoutEffect(() => {
    setIsMounted(true)
  }, [isMounted])

  useLayoutEffect(() => {
    if (!done) {
      dispatch({
        type: 'RECEIVE_CONTAINER_DIMENSIONS',
        payload: {
          width: container.current.getBoundingClientRect().width,
        },
      })
    }
  }, [max, done])

  useLayoutEffect(() => {
    dispatch({ type: 'RESET_STATE' })
  }, [text])

  useLayoutEffect(() => {
    const handleResize = () => {
      if (done && container && container.current && container.current.getBoundingClientRect().width !== width) {
        dispatch({ type: 'RESET_STATE' })
      }
    }

    window.addEventListener('resize', debounce(handleResize, debounceDuration))
    return () => {
      window.removeEventListener('resize', debounce(handleResize, debounceDuration))
    }
  })

  useLayoutEffect(() => {
    const { height } = container.current.getBoundingClientRect()

    if (height > 0) {
      if (min < max && !binarySearchDone && !done) {
        const midpoint = (min + max + 1) >> 1 // eslint-disable-line no-bitwise

        if (height > maxHeight) {
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

      if (height <= maxHeight && (max < text.length - 1) && !done) {
        dispatch({
          type: 'ITERATE_STEP_SEARCH',
          payload: {
            binarySearchDone: true,
            max: max + 1,
          },
        })
      }

      if (height > maxHeight && binarySearchDone && !done) {
        dispatch({
          type: 'ITERATE_DONE',
          payload: {
            max: max - 1,
            done: true,
          },
        })
      }

      if (height <= maxHeight && max === text.length - 1) {
        dispatch({
          type: 'ITERATE_DONE',
          payload: {
            max: text.length,
          },
        })
      }
    }
  }, [max])

  return [container, visibleText, hiddenText, isMounted]
}

const Shears = ({
  maxHeight,
  text,
  tag,
  className,
  fadeInDuration,
  debounceDuration,
}) => {
  const [
    container,
    visibleText,
    hiddenText,
    isMounted,
  ] = useShears({ text, maxHeight, debounceDuration })

  if (!text) return null

  if (!maxHeight || !visibleText) return text

  return (
    createElement(
      tag,
      {
        style: {
          overflow: 'hidden',
          height: '100%',
          maxHeight,
          opacity: isMounted ? 1 : 0,
          transition: fadeInDuration ? `opacity ${fadeInDuration.toString()}ms` : '',
        },
        className,
      },
      createElement(
        'div',
        {
          ref: container,
          style: {
            height: '100%',
          },
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
  fadeInDuration: PropTypes.number,
  debounceDuration: PropTypes.number,
}

Shears.defaultProps = {
  tag: 'div',
  className: '',
  fadeInDuration: 0,
  debounceDuration: 200,
}

export default Shears
