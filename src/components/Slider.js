import React, { Component, PropTypes } from 'react';

const propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  minDistance: PropTypes.number,
  defaultValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number)
  ]),
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number)
  ]),
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  className: PropTypes.string,
  handleClassName: PropTypes.string,
  handleActiveClassName: PropTypes.string,
  withBars: PropTypes.bool,
  barClassName: PropTypes.string,
  pearling: PropTypes.bool,
  disabled: PropTypes.bool,
  snapDragDisabled: PropTypes.bool,
  invert: PropTypes.bool,
  onBeforeChange: PropTypes.func,
  onChange: PropTypes.func,
  onAfterChange: PropTypes.func,
  onSliderClick: PropTypes.func
};

class Slider extends Component {

  constructor(props) {
    super();
    this.renderHandle = this.renderHandle.bind(this);
    this.getMousePosition = this.getMousePosition.bind(this);
    const value = this.or(this.ensureArray(props.value), this.ensureArray(props.defaultValue), props);
    this.tempArray = value.slice();
    this.pendingResizeTimeouts = [];

    const zIndices = [];
    for (var i = 0; i < value.length; i++) {
      value[i] = this.trimAlignValue(value[i], props);
      zIndices.push(i);
    }

    this.state = {
      index: -1,
      upperBound: 0,
      sliderLength: 0,
      value,
      zIndices,
    };
  }

  componentWillReceiveProps(newProps) {
    const value = this.or(this.ensureArray(newProps.value), this.state.value);

    // ensure the array keeps the same size as `value`
    this.tempArray = value.slice();

    for (var i = 0; i < value.length; i++) {
      this.state.value[i] = this.trimAlignValue(value[i], newProps);
    }
    if (this.state.value.length > value.length) {
      this.state.value.length = value.length;
    }

    // If an upperBound has not yet been determined (due to the component being hidden
    // during the mount event, or during the last resize), then calculate it now
    if (this.state.upperBound === 0) {
      this.handleResize();
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  componentWillUnmount() {
    this.clearPendingResizeTimeouts();
    window.removeEventListener('resize', this.handleResize);
  }

  getValue() {
    return this.undoEnsureArray(this.state.value);
  }

  pauseEvent(e) {
    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault) e.preventDefault();
    return false;
  }

  stopPropagation(e) {
    if (e.stopPropagation) e.stopPropagation();
  }

  /**
   * Spreads `count` values equally between `min` and `max`.
   */
  linspace(min, max, count) {
    var range = (max - min) / (count - 1);
    var res = [];
    for (var i = 0; i < count; i++) {
      res.push(min + range * i);
    }
    return res;
  }

  ensureArray(x) {
    return x == null ? [] : Array.isArray(x) ? x : [x];
  }

  undoEnsureArray(x) {
    return x != null && x.length === 1 ? x[0] : x;
  }

  handleResize() {
    // setTimeout of 0 gives element enough time to have assumed its new size if it is being resized
    var resizeTimeout = window.setTimeout(function() {
      // drop this timeout from pendingResizeTimeouts to reduce memory usage
      this.pendingResizeTimeouts.shift();

      var slider = this.refs.slider;
      var handle = this.refs.handle0;
      var rect = slider.getBoundingClientRect();

      var size = this.sizeKey();

      var sliderMax = rect[this.posMaxKey()];
      var sliderMin = rect[this.posMinKey()];

      this.setState({
        upperBound: slider[size] - handle[size],
        sliderLength: Math.abs(sliderMax - sliderMin),
        handleSize: handle[size],
        sliderStart: this.props.invert ? sliderMax : sliderMin
      });
    }.bind(this), 0);

    this.pendingResizeTimeouts.push(resizeTimeout);
  }

  // clear all pending timeouts to avoid error messages after unmounting
  clearPendingResizeTimeouts() {
    do {
      var nextTimeout = this.pendingResizeTimeouts.shift();

      clearTimeout(nextTimeout);
    } while (this.pendingResizeTimeouts.length);
  }

  // calculates the offset of a handle in pixels based on its value.
  calcOffset(value) {
    var range = this.props.max - this.props.min;
    if (range === 0) {
      return 0;
    }
    var ratio = (value - this.props.min) / range;
    return ratio * this.state.upperBound;
  }

  // calculates the value corresponding to a given pixel offset, i.e. the inverse of `calcOffset`.
  calcValue(offset) {
    var ratio = offset / this.state.upperBound;
    return ratio * (this.props.max - this.props.min) + this.props.min;
  }

  buildHandleStyle(offset, i) {
    var style = {
      position: 'absolute',
      willChange: this.state.index >= 0 ? this.posMinKey() : '',
      zIndex: this.state.zIndices.indexOf(i) + 1
    };
    style[this.posMinKey()] = offset + 'px';
    return style;
  }

  buildBarStyle(min, max) {
    var obj = {
      willChange: this.state.index >= 0 ? this.posMinKey() + ',' + this.posMaxKey() : ''
    };
    obj[this.posMinKey()] = min;
    obj[this.posMaxKey()] = max;
    return obj;
  }

  getClosestIndex(pixelOffset) {
    var minDist = Number.MAX_VALUE;
    var closestIndex = -1;

    var value = this.state.value;
    var l = value.length;

    for (var i = 0; i < l; i++) {
      var offset = this.calcOffset(value[i]);
      var dist = Math.abs(pixelOffset - offset);
      if (dist < minDist) {
        minDist = dist;
        closestIndex = i;
      }
    }

    return closestIndex;
  }

  calcOffsetFromPosition(position) {
    var pixelOffset = position - this.state.sliderStart;
    if (this.props.invert) pixelOffset = this.state.sliderLength - pixelOffset;
    pixelOffset -= (this.state.handleSize / 2);
    return pixelOffset;
  }

  // Snaps the nearest handle to the value corresponding to `position` and calls `callback` with that handle's index.
  forceValueFromPosition(position, callback) {
    var pixelOffset = this.calcOffsetFromPosition(position);
    var closestIndex = this.getClosestIndex(pixelOffset);
    var nextValue = this.trimAlignValue(this.calcValue(pixelOffset));

    var value = this.state.value.slice(); // Clone this.state.value since we'll modify it temporarily
    value[closestIndex] = nextValue;

    // Prevents the slider from shrinking below `props.minDistance`
    for (var i = 0; i < value.length - 1; i += 1) {
      if (value[i + 1] - value[i] < this.props.minDistance) return;
    }

    this.setState({value: value}, callback.bind(this, closestIndex));
  }

  getMousePosition(e) {
    return [
      e['page' + this.axisKey()],
      e['page' + this.orthogonalAxisKey()]
    ];
  }

  or(value, defaultValue, props) {
    var props = this.props ? this.props : (props);
    var count = 0; //React.Children.count(props.children || 0);
    switch (count) {
      case 0:
        return value.length > 0 ? value : defaultValue;
      case value.length:
        return value;
      case defaultValue.length:
        return defaultValue;
      default:
        if (value.length !== count || defaultValue.length !== count) {
          console.warn(this.constructor.displayName + ": Number of values does not match number of children.");
        }
        return this.linspace(props.min, props.max, count);
    }
  }

  getTouchPosition(e) {
    var touch = e.touches[0];
    return [
      touch['page' + this.axisKey()],
      touch['page' + this.orthogonalAxisKey()]
    ];
  }

  getMouseEventMap() {
    return {
      'mousemove': this.onMouseMove.bind(this),
      'mouseup': this.onMouseUp.bind(this),
    };
  }

  getTouchEventMap() {
    return {
      'touchmove': this.onTouchMove,
      'touchend': this.onTouchEnd
    }
  }

  // create the `mousedown` handler for the i-th handle
  createOnMouseDown(i) {
    return function (e) {
      if (this.props.disabled) return;
      var position = this.getMousePosition(e);
      this.start(i, position[0]);
      this.addHandlers(this.getMouseEventMap());
      this.pauseEvent(e);
    }.bind(this);
  }

  // create the `touchstart` handler for the i-th handle
  createOnTouchStart(i) {
    return function (e) {
      if (this.props.disabled || e.touches.length > 1) return;
      var position = this.getTouchPosition(e);
      this.startPosition = position;
      this.isScrolling = undefined; // don't know yet if the user is trying to scroll
      this.start(i, position[0]);
      this.addHandlers(this.getTouchEventMap());
      this.stopPropagation(e);
    }.bind(this);
  }

  addHandlers(eventMap) {
    for (var key in eventMap) {
      document.addEventListener(key, eventMap[key], false);
    }
  }

  removeHandlers(eventMap) {
    for (var key in eventMap) {
      document.removeEventListener(key, eventMap[key], false);
    }
  }

  start(i, position) {
    // if activeElement is body window will lost focus in IE9
    // if activeElement is body window will lost focus in IE9
    if (document.activeElement && document.activeElement != document.body) {
      document.activeElement.blur && document.activeElement.blur();
    }

    this.hasMoved = false;

    this.fireChangeEvent('onBeforeChange');

    var zIndices = this.state.zIndices;
    zIndices.splice(zIndices.indexOf(i), 1); // remove wherever the element is
    zIndices.push(i); // add to end

    this.setState({
      startValue: this.state.value[i],
      startPosition: position,
      index: i,
      zIndices: zIndices
    });
 }

 onMouseUp() {
   this.onEnd(this.getMouseEventMap());
}

 onTouchEnd() {
   this.onEnd(this.getTouchEventMap());
}

 onEnd(eventMap) {
   this.removeHandlers(eventMap);
   this.setState({index: -1}, this.fireChangeEvent.bind(this, 'onAfterChange'));
}

 onMouseMove(e) {
   var position = this.getMousePosition(e);
   this.move(position[0]);
}

 onTouchMove(e) {
   if (e.touches.length > 1) return;

   var position = this.getTouchPosition(e);

   if (typeof this.isScrolling === 'undefined') {
     var diffMainDir = position[0] - this.startPosition[0];
     var diffScrollDir = position[1] - this.startPosition[1];
     this.isScrolling = Math.abs(diffScrollDir) > Math.abs(diffMainDir);
   }

   if (this.isScrolling) {
     this.setState({index: -1});
     return;
   }

   this.pauseEvent(e);

   this.move(position[0]);
}

 move(position) {
   this.hasMoved = true;

   var props = this.props;
   var state = this.state;
   var index = state.index;

   var value = state.value;
   var length = value.length;
   var oldValue = value[index];

   var diffPosition = position - state.startPosition;
   if (props.invert) diffPosition *= -1;

   var diffValue = diffPosition / (state.sliderLength - state.handleSize) * (props.max - props.min);
   var newValue = this.trimAlignValue(state.startValue + diffValue);

   var minDistance = props.minDistance;

   // if "pearling" (= handles pushing each other) is disabled,
   // prevent the handle from getting closer than `minDistance` to the previous or next handle.
   if (!props.pearling) {
     if (index > 0) {
       var valueBefore = value[index - 1];
       if (newValue < valueBefore + minDistance) {
         newValue = valueBefore + minDistance;
       }
     }

     if (index < length - 1) {
       var valueAfter = value[index + 1];
       if (newValue > valueAfter - minDistance) {
         newValue = valueAfter - minDistance;
       }
     }
   }

   value[index] = newValue;

   // if "pearling" is enabled, let the current handle push the pre- and succeeding handles.
   if (props.pearling && length > 1) {
     if (newValue > oldValue) {
       this.pushSucceeding(value, minDistance, index);
       this.trimSucceeding(length, value, minDistance, props.max);
     }
     else if (newValue < oldValue) {
       this.pushPreceding(value, minDistance, index);
       this.trimPreceding(length, value, minDistance, props.min);
     }
   }

   // Normally you would use `shouldComponentUpdate`, but since the slider is a low-level component,
   // the extra complexity might be worth the extra performance.
   if (newValue !== oldValue) {
     this.setState({value: value}, this.fireChangeEvent.bind(this, 'onChange'));
   }
}

 pushSucceeding(value, minDistance, index) {
   var i, padding;
   for (i = index, padding = value[i] + minDistance;
        value[i + 1] != null && padding > value[i + 1];
        i++, padding = value[i] + minDistance) {
     value[i + 1] = this.alignValue(padding);
   }
}

 trimSucceeding(length, nextValue, minDistance, max) {
   for (var i = 0; i < length; i++) {
     var padding = max - i * minDistance;
     if (nextValue[length - 1 - i] > padding) {
       nextValue[length - 1 - i] = padding;
     }
   }
}

 pushPreceding(value, minDistance, index) {
   var i, padding;
   for (i = index, padding = value[i] - minDistance;
        value[i - 1] != null && padding < value[i - 1];
        i--, padding = value[i] - minDistance) {
     value[i - 1] = this.alignValue(padding);
   }
}

 trimPreceding(length, nextValue, minDistance, min) {
   for (var i = 0; i < length; i++) {
     var padding = min + i * minDistance;
     if (nextValue[i] < padding) {
       nextValue[i] = padding;
     }
   }
}

 axisKey() {
   var orientation = this.props.orientation;
   if (orientation === 'horizontal') return 'X';
   if (orientation === 'vertical') return 'Y';
}

 orthogonalAxisKey() {
   var orientation = this.props.orientation;
   if (orientation === 'horizontal') return 'Y';
   if (orientation === 'vertical') return 'X';
}

 posMinKey() {
   var orientation = this.props.orientation;
   if (orientation === 'horizontal') return this.props.invert ? 'right' : 'left';
   if (orientation === 'vertical') return this.props.invert ? 'bottom' : 'top';
}

 posMaxKey() {
   var orientation = this.props.orientation;
   if (orientation === 'horizontal') return this.props.invert ? 'left' : 'right';
   if (orientation === 'vertical') return this.props.invert ? 'top' : 'bottom';
}

 sizeKey() {
   var orientation = this.props.orientation;
   if (orientation === 'horizontal') return 'clientWidth';
   if (orientation === 'vertical') return 'clientHeight';
}

 trimAlignValue(val, props) {
   return this.alignValue(this.trimValue(val, props), props);
}

 trimValue(val, props) {
   props = props || this.props;

   if (val <= props.min) val = props.min;
   if (val >= props.max) val = props.max;

   return val;
}

 alignValue(val, props) {
   props = props || this.props;

   var valModStep = (val - props.min) % props.step;
   var alignValue = val - valModStep;

   if (Math.abs(valModStep) * 2 >= props.step) {
     alignValue += (valModStep > 0) ? props.step : (-props.step);
   }

   return parseFloat(alignValue.toFixed(5));
}

 renderHandle(style, child, i) {
   var className = this.props.handleClassName + ' ' +
     (this.props.handleClassName + '-' + i) + ' ' +
     (this.state.index === i ? this.props.handleActiveClassName : '');

   return (
     React.createElement('div', {
         ref: 'handle' + i,
         key: 'handle' + i,
         className: className,
         style: style,
         onMouseDown: this.createOnMouseDown.bind(this, i),
         onTouchStart: this.createOnTouchStart.bind(this, i)
       },
       child
     )
   );
}

 renderHandles(offset) {
   var length = offset.length;

   var styles = this.tempArray;
   for (var i = 0; i < length; i++) {
     styles[i] = this.buildHandleStyle(offset[i], i);
     if(i === 1) {
       console.log(styles[i].left);
       if(parseInt(styles[i].left, 10) > 600) {
         document.getElementsByClassName('bar')[0].style.backgroundImage = "url('/assets/4.jpg')";
       } else if(parseInt(styles[i].left, 10) > 500) {
         document.getElementsByClassName('bar')[0].style.backgroundImage = "url('/assets/3.jpg')";
       } else if(parseInt(styles[i].left, 10) > 460) {
         document.getElementsByClassName('bar')[0].style.backgroundImage = "url('/assets/2.jpg')";
       }
     }
   }

   var res = this.tempArray;
   var renderHandle = this.renderHandle;
   if (React.Children.count(this.props.children) > 0) {
     React.Children.forEach(this.props.children, function (child, i) {
       res[i] = renderHandle(styles[i], child, i);
     });
   } else {
     for (i = 0; i < length; i++) {
       res[i] = renderHandle(styles[i], null, i);
     }
   }
   return res;
}

 renderBar(i, offsetFrom, offsetTo) {
   return (
     React.createElement('div', {
       key: 'bar' + i,
       ref: 'bar' + i,
       className: this.props.barClassName + ' ' + this.props.barClassName + '-' + i,
       style: this.buildBarStyle(offsetFrom, this.state.upperBound - offsetTo)
     })
   );
}

 renderBars(offset) {
   var bars = [];
   var lastIndex = offset.length - 1;

   bars.push(this.renderBar(0, 0, offset[0]));

   for (var i = 0; i < lastIndex; i++) {
     bars.push(this.renderBar(i + 1, offset[i], offset[i + 1]));
   }

   bars.push(this.renderBar(lastIndex + 1, offset[lastIndex], this.state.upperBound));

   return bars;
}

 onSliderMouseDown(e) {
   if (this.props.disabled) return;
   this.hasMoved = false;
   if (!this.props.snapDragDisabled) {
     var position = this.getMousePosition(e);
     this.forceValueFromPosition(position[0], function (i) {
       this.fireChangeEvent('onChange');
       this.start(i, position[0]);
       this.addHandlers(this.getMouseEventMap());
     }.bind(this));
   }

   this.pauseEvent(e);
}

 onSliderClick(e) {
   if (this.props.disabled) return;

   if (this.props.onSliderClick && !this.hasMoved) {
     var position = this.getMousePosition(e);
     var valueAtPos = this.trimAlignValue(this.calcValue(this.calcOffsetFromPosition(position[0])));
     this.props.onSliderClick(valueAtPos);
   }
}

 fireChangeEvent(event) {
   if (this.props[event]) {
     this.props[event](this.undoEnsureArray(this.state.value));
   }
 }

 render() {
   var state = this.state;
   var props = this.props;

   var offset = this.tempArray;
   var value = state.value;
   var l = value.length;
   for (var i = 0; i < l; i++) {
     offset[i] = this.calcOffset(value[i], i);
   }

   var bars = props.withBars ? this.renderBars(offset) : null;
   var handles = this.renderHandles(offset);

   return (
     React.createElement('div', {
       ref: 'slider',
       style: {position: 'relative'},
       className: props.className + (props.disabled ? ' disabled' : ''),
       onMouseDown: this.onSliderMouseDown.bind(this),
       onClick: this.onSliderClick.bind(this)
     },
       bars,
       handles
     )
   );
 }
}

Slider.propTypes = propTypes;

export default Slider;
