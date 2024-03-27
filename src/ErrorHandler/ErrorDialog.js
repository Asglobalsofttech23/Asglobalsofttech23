import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const ErrorDialog = ({ open, onClose, errorMessage }) => {
  return (
    <Dialog open={open} maxWidth='lg'>
      <DialogTitle className='text-center bg-danger text-white'>Error</DialogTitle>
      <DialogContent><h4>{errorMessage}</h4></DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorDialog;
