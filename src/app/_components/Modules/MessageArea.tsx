import { useMessageStore } from '~/store';

export default function MessageArea() {
  const { input, output, setText, setTitle, title } = useMessageStore();
  
  return (
    <div className="message-area">
      <div className="title-section">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note Title"
          className="title-input"
        />
      </div>
      
      <div className="input-output-section">
        <div className="input-section">
          <h3>Plain Text</h3>
          <textarea
            value={input}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to encrypt..."
            className="message-input"
          />
        </div>
        
        <div className="output-section">
          <h3>Encrypted Text</h3>
          <textarea
            value={output}
            readOnly
            className="message-output"
          />
        </div>
      </div>
    </div>
  );
}