/* eslint-disable */
// @ts-nocheck

export const RESIZER_DEFAULT_CLASSNAME = 'Resizer';

function Resizer(props) {
  const {
    className,
    onClick,
    onDoubleClick,
    onMouseDown,
    onTouchEnd,
    onTouchStart,
    resizerClassName = RESIZER_DEFAULT_CLASSNAME,
    split,
    style,
  } = props;
  const classes = [resizerClassName, split, className];

  return (
    <span
      role="presentation"
      className={classes.join(' ')}
      style={style}
      onMouseDown={event => onMouseDown(event)}
      onTouchStart={event => {
        event.preventDefault();
        onTouchStart(event);
      }}
      onTouchEnd={event => {
        event.preventDefault();
        onTouchEnd(event);
      }}
      onClick={event => {
        if (onClick) {
          event.preventDefault();
          onClick(event);
        }
      }}
      onDoubleClick={event => {
        if (onDoubleClick) {
          event.preventDefault();
          onDoubleClick(event);
        }
      }}
    />
  );
}

export default Resizer;
