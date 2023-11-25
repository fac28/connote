'use client';

import React, { useEffect } from 'react';

export default function PracticePage() {
  const handleSelection = () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText !== '') {
      console.log(`Clicked on: ${selectedText}`);
      // You can perform any other actions with the selected text here
    }
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('touchend', handleSelection);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('touchend', handleSelection);
    };
  }, []);

  return (
    <p>
      It is a long established fact that a reader will be distracted by the
      readable content of a page when looking at its layout.
      <br />
      The point of using Lorem Ipsum is that it has a more-or-less normal
      distribution of letters, as opposed to using 'Content here, content here',
      making it look like readable English.
      <br />
      Many desktop publishing packages and web page editors now use Lorem Ipsum
      as their default model text, and a search for 'lorem ipsum' will uncover
      many web sites still in their infancy.
      <br />
      Various versions have evolved over the years, sometimes by accident,
      sometimes on purpose (injected humour and the like).
    </p>
  );
}
