'use client';

import React, { useRef, useState, type JSX } from 'react';
import dynamic from 'next/dynamic';
import Quill from 'quill';

// Dynamically import the Editor component (client-side only)
const Editor = dynamic(() => import('./Editor'), { ssr: false });

// Import the Delta type from Quill.
const Delta = Quill.import('delta') as any;

export default function QuillPage(): JSX.Element {
  const [range, setRange] = useState<any>(undefined);
  const [lastChange, setLastChange] = useState<any>(undefined);
  const [readOnly, setReadOnly] = useState<boolean>(false);
  const quillRef = useRef<Quill | null>(null);

  return (
    <div className="w-full mx-auto p-4">
      <Editor
        ref={quillRef}
        readOnly={readOnly}
        defaultValue={
          new Delta()
            .insert('Hello')
            .insert('\n', { header: 1 })
            .insert('Some ')
            .insert('initial', { bold: true })
            .insert(' ')
            .insert('content', { underline: true })
            .insert('\n')
        }
        onSelectionChange={setRange}
        onTextChange={setLastChange}
      />
      <div className="flex border border-gray-300 border-t-0 p-3">
        <label className="flex items-center">
          Read Only:{' '}
          <input
            type="checkbox"
            checked={readOnly}
            onChange={(e) => setReadOnly(e.target.checked)}
            className="ml-2"
          />
        </label>
        <button
          type="button"
          onClick={() => {
            alert(quillRef.current?.getLength());
          }}
          className="ml-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Get Content Length
        </button>
      </div>
      <div className="my-3 font-mono">
        <div className="text-gray-500 uppercase">Current Range:</div>
        {range ? JSON.stringify(range) : 'Empty'}
      </div>
      <div className="my-3 font-mono">
        <div className="text-gray-500 uppercase">Last Change:</div>
        {lastChange ? JSON.stringify(lastChange.ops) : 'Empty'}
      </div>
    </div>
  );
}
