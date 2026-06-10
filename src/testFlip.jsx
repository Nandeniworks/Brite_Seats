import React from 'react';
import HTMLFlipBook from 'react-pageflip';

export default function Test() {
  return (
    <HTMLFlipBook width={300} height={500}>
      <div className="demoPage">Page 1</div>
      <div className="demoPage">Page 2</div>
    </HTMLFlipBook>
  );
}
