'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { 
  createEditor, 
  type Descendant, 
  Editor, 
  Transforms, 
  Element as SlateElement, 
  Text, 
  Node, 
  Range,
  type BaseEditor 
} from 'slate';
import { Slate, Editable, withReact, useSlate, ReactEditor, type RenderElementProps, type RenderLeafProps } from 'slate-react';
import { withHistory } from 'slate-history';
import isHotkey from 'is-hotkey';

// Enhanced types for custom elements and text
type CustomElement = {
  type: 'paragraph' | 'heading-one' | 'heading-two' | 'heading-three' | 
        'bulleted-list' | 'numbered-list' | 'list-item' | 
        'block-quote' | 'code-block' | 'image';
  children: Descendant[];
  url?: string;
  alt?: string;
};

type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
};

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      {
        text: 'This is an enhanced Slate editor. Try different formatting options from the toolbar or use keyboard shortcuts.',
      },
    ],
  },
];

// --- Mark Formatting Helpers ---
const isMarkActive = (editor: Editor, format: keyof Omit<CustomText, 'text'>): boolean => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const toggleMark = (editor: Editor, format: keyof Omit<CustomText, 'text'>) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

// --- Block Formatting Helpers ---
const LIST_TYPES = ['bulleted-list', 'numbered-list'] as const;
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'] as const;

const isBlockActive = (editor: Editor, format: string, blockType = 'type') => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType as keyof typeof n] === format,
    })
  );

  return !!match;
};

const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format as any);

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type as any),
    split: true,
  });

  let newProperties: Partial<CustomElement>;
  if (isActive) {
    newProperties = { type: 'paragraph' };
  } else if (isList) {
    newProperties = { type: 'list-item' };
  } else {
    newProperties = { type: format as CustomElement['type'] };
  }

  Transforms.setNodes<CustomElement>(editor, newProperties);

  if (!isActive && isList) {
    const block: CustomElement = { type: format as CustomElement['type'], children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

// --- Toolbar Button Components ---
type MarkButtonProps = {
  format: keyof Omit<CustomText, 'text'>;
  icon: string;
};

const MarkButton: React.FC<MarkButtonProps> = ({ format, icon }) => {
  const editor = useSlate();
  const active = isMarkActive(editor, format);

  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        toggleMark(editor, format);
      }}
      className={`mx-1 px-2 py-1 border rounded text-sm ${
        active ? 'bg-gray-200 border-gray-800' : 'bg-white border-gray-300'
      }`}
      title={format}
    >
      {icon}
    </button>
  );
};

type BlockButtonProps = {
  format: string;
  icon: string;
};

const BlockButton: React.FC<BlockButtonProps> = ({ format, icon }) => {
  const editor = useSlate();
  const active = isBlockActive(editor, format);

  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        toggleBlock(editor, format);
      }}
      className={`mx-1 px-2 py-1 border rounded text-sm ${
        active ? 'bg-gray-200 border-gray-800' : 'bg-white border-gray-300'
      }`}
      title={format}
    >
      {icon}
    </button>
  );
};

// --- Image Insertion ---
const insertImage = (editor: Editor, url: string, alt: string = '') => {
  const image: CustomElement = {
    type: 'image',
    url,
    alt,
    children: [{ text: '' }],
  };
  Transforms.insertNodes(editor, image);
};

const ImageButton = () => {
  const editor = useSlate();
  
  const handleImageInsert = () => {
    const url = prompt('Enter image URL:');
    if (!url) return;
    
    const alt = prompt('Enter alt text (optional):') || '';
    insertImage(editor, url, alt);
  };

  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        handleImageInsert();
      }}
      className="mx-1 px-2 py-1 border rounded text-sm bg-white border-gray-300"
      title="Insert Image"
    >
      🖼️
    </button>
  );
};

// Type guard to check if node is a CustomElement
const isCustomElement = (node: Node): node is CustomElement => {
  return SlateElement.isElement(node) && 'type' in node;
};

// --- Element Renderer ---
const Element = ({ attributes, children, element }: RenderElementProps) => {
  switch (element.type) {
    case 'heading-one':
      return <h1 {...attributes} className="text-2xl font-bold my-2">{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes} className="text-xl font-bold my-2">{children}</h2>;
    case 'heading-three':
      return <h3 {...attributes} className="text-lg font-bold my-2">{children}</h3>;
    case 'block-quote':
      return <blockquote {...attributes} className="border-l-4 border-gray-300 pl-4 italic my-2">{children}</blockquote>;
    case 'bulleted-list':
      return <ul {...attributes} className="list-disc ml-5 my-2">{children}</ul>;
    case 'numbered-list':
      return <ol {...attributes} className="list-decimal ml-5 my-2">{children}</ol>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'code-block':
      return (
        <pre {...attributes} className="bg-gray-100 p-2 rounded font-mono my-2">
          <code>{children}</code>
        </pre>
      );
    case 'image':
      return (
        <div {...attributes} className="my-2">
          <div contentEditable={false}>
            <img src={element.url} alt={element.alt || ''} className="max-w-full h-auto" />
          </div>
          {children}
        </div>
      );
    default:
      return <p {...attributes} className="my-1">{children}</p>;
  }
};

// --- Leaf Renderer ---
const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  if (leaf.code) {
    children = <code className="bg-gray-100 px-1 font-mono rounded">{children}</code>;
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }
  if (leaf.strikethrough) {
    children = <s>{children}</s>;
  }

  return <span {...attributes}>{children}</span>;
};

// --- HTML Serialization Functions ---
const serializeToHtml = (nodes: Descendant[]): string => {
  return nodes.map(node => serializeNodeToHtml(node)).join('');
};

const serializeNodeToHtml = (node: Node): string => {
  if (Text.isText(node)) {
    let string = node.text;
    if (node.bold) string = `<strong>${string}</strong>`;
    if (node.italic) string = `<em>${string}</em>`;
    if (node.code) string = `<code>${string}</code>`;
    if (node.underline) string = `<u>${string}</u>`;
    if (node.strikethrough) string = `<s>${string}</s>`;
    return string;
  }

  if (!isCustomElement(node)) return '';
  
  const children = node.children.map(n => serializeNodeToHtml(n)).join('');

  switch (node.type) {
    case 'paragraph':
      return `<p>${children}</p>`;
    case 'heading-one':
      return `<h1>${children}</h1>`;
    case 'heading-two':
      return `<h2>${children}</h2>`;
    case 'heading-three':
      return `<h3>${children}</h3>`;
    case 'block-quote':
      return `<blockquote>${children}</blockquote>`;
    case 'bulleted-list':
      return `<ul>${children}</ul>`;
    case 'numbered-list':
      return `<ol>${children}</ol>`;
    case 'list-item':
      return `<li>${children}</li>`;
    case 'code-block':
      return `<pre><code>${children}</code></pre>`;
    case 'image':
      return `<img src="${node.url || ''}" alt="${node.alt || ''}" />`;
    default:
      return children;
  }
};

// --- Markdown Serialization ---
const serializeToMarkdown = (nodes: Descendant[]): string => {
  return nodes.map(node => serializeNodeToMarkdown(node)).join('');
};

const serializeNodeToMarkdown = (node: Node): string => {
  if (Text.isText(node)) {
    let string = node.text;
    if (node.bold) string = `**${string}**`;
    if (node.italic) string = `*${string}*`;
    if (node.code) string = `\`${string}\``;
    if (node.strikethrough) string = `~~${string}~~`;
    // Note: Markdown doesn't have native underline syntax
    return string;
  }

  if (!isCustomElement(node)) return '';
  
  const children = node.children.map(n => serializeNodeToMarkdown(n)).join('');

  switch (node.type) {
    case 'paragraph':
      return `${children}\n\n`;
    case 'heading-one':
      return `# ${children}\n\n`;
    case 'heading-two':
      return `## ${children}\n\n`;
    case 'heading-three':
      return `### ${children}\n\n`;
    case 'block-quote':
      return `> ${children}\n\n`;
    case 'bulleted-list':
      return children;
    case 'numbered-list':
      return children;
    case 'list-item':
      // This is simplified; proper list indentation would need more context
      return `- ${children}\n`;
    case 'code-block':
      return `\`\`\`\n${children}\n\`\`\`\n\n`;
    case 'image':
      return `![${node.alt || ''}](${node.url || ''})\n\n`;
    default:
      return children;
  }
};

// Custom editor with plugins
const withCustomPlugins = (editor: Editor) => {
  // Store the original deletion behavior
  const { isVoid, deleteBackward } = editor;

  // Override isVoid to handle image elements
  editor.isVoid = element => {
    return element.type === 'image' ? true : isVoid(element);
  };

  // Improve backspace handling
  editor.deleteBackward = unit => {
    const { selection } = editor;
    
    if (selection && Range.isCollapsed(selection)) {
      const [currentNode, path] = Editor.node(editor, selection);
      
      // Add any special handling here if needed
    }
    
    // Default to the original behavior
    deleteBackward(unit);
  };

  return editor;
};

// --- Main Editor Component ---
const SlateEditor: React.FC = () => {
  // Create a stable editor instance that won't change on re-renders
  const editor = useMemo(() => withCustomPlugins(withHistory(withReact(createEditor()))), []);
  const [value, setValue] = useState<Descendant[]>(initialValue);
  const [htmlOutput, setHtmlOutput] = useState<string>('');
  const [markdownOutput, setMarkdownOutput] = useState<string>('');
  const [outputFormat, setOutputFormat] = useState<'html' | 'markdown'>('html');

  const HOTKEYS: Record<string, keyof Omit<CustomText, 'text'>> = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+`': 'code',
    'mod+u': 'underline',
    'mod+s': 'strikethrough',
  };

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    for (const hotkey in HOTKEYS) {
      if (isHotkey(hotkey, event)) {
        event.preventDefault();
        const mark = HOTKEYS[hotkey];
        toggleMark(editor, mark);
        return;
      }
    }

    // Additional hotkeys for blocks
    if (isHotkey('mod+alt+1', event)) {
      event.preventDefault();
      toggleBlock(editor, 'heading-one');
    }
    if (isHotkey('mod+alt+2', event)) {
      event.preventDefault();
      toggleBlock(editor, 'heading-two');
    }
    if (isHotkey('mod+alt+3', event)) {
      event.preventDefault();
      toggleBlock(editor, 'heading-three');
    }
    if (isHotkey('mod+shift+7', event)) {
      event.preventDefault();
      toggleBlock(editor, 'numbered-list');
    }
    if (isHotkey('mod+shift+8', event)) {
      event.preventDefault();
      toggleBlock(editor, 'bulleted-list');
    }
    if (isHotkey('mod+shift+9', event)) {
      event.preventDefault();
      toggleBlock(editor, 'block-quote');
    }
    if (isHotkey('mod+shift+0', event)) {
      event.preventDefault();
      toggleBlock(editor, 'code-block');
    }
  }, [editor]);

  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, []);

  const updateOutput = useCallback((value: Descendant[]) => {
    const html = serializeToHtml(value);
    const markdown = serializeToMarkdown(value);
    setHtmlOutput(html);
    setMarkdownOutput(markdown);
  }, []);

  return (
    <div className="slate-editor-container">
      <Slate 
        editor={editor} 
        initialValue={value} 
        onChange={(newValue) => {
          setValue(newValue);
          updateOutput(newValue);
        }}
      >
        {/* Enhanced Toolbar */}
        <div className="flex flex-wrap items-center border-b border-gray-200 mb-4 p-2">
          {/* Text formatting */}
          <div className="flex items-center mr-2 mb-1">
            <MarkButton format="bold" icon="𝐁" />
            <MarkButton format="italic" icon="𝘐" />
            <MarkButton format="underline" icon="U̲" />
            <MarkButton format="strikethrough" icon="S̶" />
            <MarkButton format="code" icon="&lt;/&gt;" />
          </div>
          
          {/* Block formatting */}
          <div className="flex items-center mr-2 mb-1">
            <BlockButton format="heading-one" icon="H1" />
            <BlockButton format="heading-two" icon="H2" />
            <BlockButton format="heading-three" icon="H3" />
          </div>
          
          <div className="flex items-center mr-2 mb-1">
            <BlockButton format="bulleted-list" icon="•" />
            <BlockButton format="numbered-list" icon="1." />
            <BlockButton format="block-quote" icon='"' />
            <BlockButton format="code-block" icon="{}" />
          </div>
          
          <div className="flex items-center mb-1">
            <ImageButton />
          </div>
        </div>

        {/* Editable Area */}
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter some rich text…"
          spellCheck
          autoFocus
          onKeyDown={handleKeyDown}
          className="p-4 border border-gray-300 rounded min-h-[150px] leading-relaxed prose max-w-none"
        />
      </Slate>
      
      {/* Output Selector */}
      <div className="mt-4 flex items-center">
        <h3 className="text-sm font-semibold mr-4">Output Format:</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => setOutputFormat('html')}
            className={`px-3 py-1 text-sm rounded ${outputFormat === 'html' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            HTML
          </button>
          <button 
            onClick={() => setOutputFormat('markdown')}
            className={`px-3 py-1 text-sm rounded ${outputFormat === 'markdown' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Markdown
          </button>
        </div>
      </div>
      
      {/* Output Display */}
      <div className="mt-2">
        <h3 className="text-sm font-semibold mb-2">{outputFormat === 'html' ? 'HTML' : 'Markdown'} Output</h3>
        <div className="p-3 bg-gray-100 rounded border border-gray-300 font-mono text-xs overflow-auto max-h-40">
          <pre>{outputFormat === 'html' ? htmlOutput : markdownOutput}</pre>
        </div>
      </div>
    </div>
  );
};

export default SlateEditor;