'use client';

import React, {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import Quill  from 'quill';
import './quill.css';

export interface EditorProps {
  readOnly: boolean;
  defaultValue: any;
  onTextChange?: (
    delta: any,
    oldDelta: any,
    source: any,
    editor?: Quill
  ) => void;
  onSelectionChange?: (
    range: any,
    oldRange: any,
    source: any,
    editor?: Quill
  ) => void;
}

const Editor = forwardRef<Quill | null, EditorProps>(
  ({ readOnly, defaultValue, onTextChange, onSelectionChange }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);

    // Always update the latest callbacks.
    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    });

    // When readOnly changes, update the editor.
    useEffect(() => {
      if (ref && typeof ref !== 'function' && ref.current) {
        ref.current.enable(!readOnly);
      }
    }, [ref, readOnly]);

    // Initialize Quill on mount.
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const Font = Quill.import('formats/font') as any;
      Font.whitelist = ['mirza', 'roboto'];
      Quill.register(Font, true);

      // Create a child div to host the editor.
      const editorContainer = container.appendChild(
        document.createElement('div')
      );
      const quill = new Quill(editorContainer, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{Font: ['mirza', 'roboto']}],
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['clean'],
            ['link', 'image'],
          ],
        },
      });

      // Expose the instance via ref.
      if (typeof ref === 'function') {
        ref(quill);
      } else if (ref) {
        ref.current = quill;
      }

      // Set initial content.
      if (defaultValueRef.current) {
        quill.setContents(defaultValueRef.current);
      }

      // Register event listeners.
      quill.on(Quill.events.TEXT_CHANGE, (...args) => {
        onTextChangeRef.current?.(...args);
      });
      quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
        onSelectionChangeRef.current?.(...args);
      });

      // Cleanup on unmount.
      return () => {
        if (typeof ref === 'function') {
          ref(null);
        } else if (ref) {
          ref.current = null;
        }
        container.innerHTML = '';
      };
    }, [ref]);

    return <div ref={containerRef} />;
  }
);

Editor.displayName = 'Editor';

export default Editor;
