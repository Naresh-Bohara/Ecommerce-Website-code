import React from "react";
import { Modal, Button } from "react-bootstrap";

const LogoutConfirmation = ({ show, onHide, onConfirm }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Logout</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to logout?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Logout
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LogoutConfirmation;
