import { useEffect, useRef, useState } from 'react';
import { ArrowUp, ShieldCheck, Square } from 'lucide-react';

type Props = {
  busy: boolean;
  onSend: (message: string) => boolean;
  onStop: () => void;
  onPrivacy: () => void;
  onDemo?: () => void;
};

export function ChatInput({ busy, onSend, onStop, onPrivacy, onDemo }: Props) {
  const [value, setValue] = useState('');
  const textarea = useRef<HTMLTextAreaElement>(null);
  const wasBusy = useRef(false);
  const composing = useRef(false);

  useEffect(() => {
    if (!textarea.current) return;
    textarea.current.style.height = 'auto';
    textarea.current.style.height = `${Math.min(textarea.current.scrollHeight, 160)}px`;
  }, [value]);

  useEffect(() => {
    if (wasBusy.current && !busy) textarea.current?.focus();
    wasBusy.current = busy;
  }, [busy]);

  function submit() {
    if (busy) return;
    if (onSend(value)) setValue('');
    textarea.current?.focus();
  }

  return (
    <div className="composer-area">
      <form className="composer" onSubmit={(event) => { event.preventDefault(); submit(); }}>
        <label className="sr-only" htmlFor="message">Message Asclepius</label>
        <textarea
          ref={textarea}
          id="message"
          value={value}
          rows={1}
          maxLength={4000}
          readOnly={busy}
          aria-disabled={busy}
          aria-describedby="input-guidance"
          placeholder={busy ? 'Asclepius is thinking…' : 'Describe how you’re feeling…'}
          onChange={(event) => setValue(event.target.value)}
          onCompositionStart={() => { composing.current = true; }}
          onCompositionEnd={() => { composing.current = false; }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing
              && !composing.current && event.keyCode !== 229) {
              event.preventDefault();
              submit();
            }
          }}
        />
        <div className="composer-bottom">
          <button className="privacy-button" type="button" onClick={onPrivacy}>
            <ShieldCheck size={14} aria-hidden="true" /><span>How your message is protected</span>
          </button>
          <div className="composer-actions">
            {value.length > 3400 && <span className="character-count">{value.length}/4000</span>}
            {busy ? (
              <button className="send-button stop-button" type="button" onClick={onStop} aria-label="Stop response" title="Stop response">
                <Square size={15} fill="currentColor" />
              </button>
            ) : (
              <button className="send-button" type="submit" disabled={!value.trim()} aria-label="Send message" title="Send message">
                <ArrowUp size={21} strokeWidth={2.2} />
              </button>
            )}
          </div>
        </div>
      </form>
      <span id="input-guidance" className="sr-only">Enter sends your message. Shift and Enter adds a new line.</span>
      <p className="ai-disclosure">{onDemo ? 'Medical education demo. Not a diagnosis.' : 'AI information may be inaccurate. Not a diagnosis.'}{onDemo && <> <button className="demo-link" onClick={onDemo}>Demo</button></>}</p>
    </div>
  );
}
