//libs
import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
//styles
import styles from "./Popup.module.css";

function OutsideClickListener({ reference, onOutsideClick }) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (reference.current && !reference.current.contains(event.target)) {
        if (onOutsideClick) onOutsideClick();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference]);

  return null;
}

const Popup = ({ children, popupClass, open, onClose, disableBackdropClick }) => {
  const wrapperRef = useRef(null);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div className={styles.container}>
      <div ref={wrapperRef} className={`${popupClass ?? styles.popup}`}>
        {children}
      </div>
      {!disableBackdropClick && onClose && (
        <OutsideClickListener reference={wrapperRef} onOutsideClick={onClose} />
      )}
    </div>,
    document.getElementById("root")
  );
};

Popup.propTypes = {
  disableBackdropClick: PropTypes.bool,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  popupClass: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default Popup;
