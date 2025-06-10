// src/components/Toast.jsx
import { useEffect } from 'react';

export default function Toast({ message, onClose, isSuccess = false }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
<div className={`fixed bottom-4 right-4 px-4 py-2 rounded-md 
      ${isSuccess ? 'bg-green-500' : 'bg-red-500'} text-white`}>
      {message}
    </div>
  );
}