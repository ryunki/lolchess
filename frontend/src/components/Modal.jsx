import React, { useState, useEffect } from 'react';
import '../css/Modal.css'
export const Modal = ({ isOpen, onClose, deckMessage }) => {
  useEffect(() => {
    let timeoutId;
    if (isOpen) {
      // Set a timeout to close the modal after 2 seconds
      timeoutId = setTimeout(() => {
        onClose();
      }, 2000);
    }
    // Cleanup the timeout on component unmount or when the modal is closed manually
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isOpen, onClose]);

  return (
    <div className="modal-container" style={{ display: isOpen ? 'block' : 'none' }}>
      <div className="modal-content font-white">
        {deckMessage}
      </div>
    </div>
  );
};