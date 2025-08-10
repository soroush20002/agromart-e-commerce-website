'use client';

import { useState } from 'react';
import UpdateCartContext from '../_context/UpdateCartContext';

export default function CartProvider({ children }) {
  const [updateCart, setUpdateCart] = useState(false);

  return (
    <UpdateCartContext.Provider value={{ updateCart, setUpdateCart }}>
      {children}
    </UpdateCartContext.Provider>
  );
}
