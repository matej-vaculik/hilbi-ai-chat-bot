import { useLayoutEffect, useRef, useState } from 'react';
import { ArrowDown, MessageCircle, Plus, ShieldCheck, X } from 'lucide-react';
import { ChatInput } from './components/ChatInput';
import { ChatMessage } from './components/ChatMessage';
import { DoctorRobot } from './components/DoctorRobot';
import { useStreamingChat } from './hooks/useStreamingChat';

const prompts = [
  'Help me describe my symptoms',
  'I have a health question',
];

export default function App() {
  const chat = useStreamingChat();
  const conversation = useRef<HTMLDivElement>(null);
  const follow = useRef(true);
  const scrollFrame = useRef<number | null>(null);
  const [showJump, setShowJump] = useState(false);
  const [robotGreeted, setRobotGreeted] = useState(false);
  const [dialogContent, setDialogContent] = useState<'privacy' | 'demo'>('privacy');
  const dialog = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    const element = conversation.current;
    if (!element || !follow.current) return;
    if (chat.messages.length === 0) {
      element.scrollTop = 0;
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.scrollTop = element.scrollHeight;
      return;
    }
    let lastTime = performance.now();
    const scroll = (now: number) => {
      const gap = element.scrollHeight - element.clientHeight - element.scrollTop;
      if (!follow.current || gap <= 2) {
        if (follow.current) element.scrollTop = element.scrollHeight;
        scrollFrame.current = null;
        return;
      }
      element.scrollTop += gap * (1 - Math.exp(-(now - lastTime) / 65));
      lastTime = now;
      scrollFrame.current = requestAnimationFrame(scroll);
    };
    scrollFrame.current = requestAnimationFrame(scroll);
    return () => {
      if (scrollFrame.current !== null) cancelAnimationFrame(scrollFrame.current);
      scrollFrame.current = null;
    };
  }, [chat.messages]);

  function pauseFollowing() {
    if (scrollFrame.current !== null) cancelAnimationFrame(scrollFrame.current);
    scrollFrame.current = null;
    follow.current = false;
    const element = conversation.current;
    setShowJump(Boolean(element && element.scrollHeight > element.clientHeight));
  }

  function send(message: string) {
    const sent = chat.send(message);
    if (sent) {
      setRobotGreeted(true);
      follow.current = true;
      setShowJump(false);
    }
    return sent;
  }

  function openInfo(content: 'privacy' | 'demo') {
    setDialogContent(content);
    dialog.current?.showModal();
  }

  const announcement = chat.status === 'loading' ? 'Asclepius, your health AI assistant, is thinking.'
    : chat.status === 'streaming' ? 'AI response is arriving.'
    : chat.status === 'success' ? 'AI response complete.'
    : chat.status === 'error' ? 'The response could not be completed. You can try again.'
    : chat.messages.at(-1)?.outcome === 'cancelled' ? 'Response stopped.' : '';

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <div className="brand-mark"><MessageCircle size={23} strokeWidth={1.8} aria-hidden="true" /></div>
          <div><h1>Hilbi IQ</h1><p className="assistant-identity"><span>Asclepius</span><span className="assistant-badge">Health AI assistant</span></p></div>
        </div>
        <div className="header-actions">
          <button className="new-chat" aria-label="New chat" disabled={chat.messages.length === 0} onClick={() => {
            chat.clear(); follow.current = true; setShowJump(false);
            document.getElementById('message')?.focus();
          }}><Plus size={17} aria-hidden="true" /><span>New chat</span></button>
        </div>
      </header>

      <main className="chat-layout">
        <div className="conversation-wrapper">
          <div
            className={`conversation ${chat.messages.length === 0 ? 'conversation-empty' : ''}`}
            ref={conversation}
            role="region"
            aria-label="Conversation"
            tabIndex={0}
            aria-live="off"
            onPointerDown={pauseFollowing}
            onWheel={(event) => { if (event.deltaY < 0) pauseFollowing(); }}
            onKeyDown={(event) => {
              if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) pauseFollowing();
            }}
            onScroll={() => {
              if (scrollFrame.current !== null) return;
              const element = conversation.current!;
              follow.current = element.scrollHeight - element.scrollTop - element.clientHeight < 64;
              setShowJump(!follow.current);
            }}
          >
            {chat.messages.length === 0 ? (
              <div className="empty-state">
                <div className="hero-symbol"><DoctorRobot greet={!robotGreeted} onGreeted={() => setRobotGreeted(true)} /></div>
                <h2>Hi, I am <span>Asclepius.</span></h2>
                <p className="welcome-copy">Your health AI assistant.</p>
                <p className="welcome-question">What is your problem?</p>
                <div className="prompt-suggestions">
                  {prompts.map((prompt) => <button className="prompt-suggestion" key={prompt} onClick={() => send(prompt)}>{prompt}</button>)}
                </div>
              </div>
            ) : (
              <div className="message-list">
                {chat.messages.map((message, index) => <ChatMessage
                  key={message.id}
                  message={message}
                  active={chat.busy && index === chat.messages.length - 1}
                  retryable={!chat.busy && index === chat.messages.length - 1}
                  onRetry={() => { follow.current = true; setShowJump(false); chat.retry(); }}
                  onWordFinished={chat.finishWord}
                />)}
              </div>
            )}
          </div>
          {showJump && <button className="jump-button" onClick={() => {
            if (scrollFrame.current !== null) cancelAnimationFrame(scrollFrame.current);
            scrollFrame.current = null;
            follow.current = true; setShowJump(false);
            if (conversation.current) conversation.current.scrollTop = conversation.current.scrollHeight;
          }}><ArrowDown size={15} aria-hidden="true" />Latest response</button>}
        </div>
        <ChatInput busy={chat.busy} onSend={send} onStop={chat.stop} onPrivacy={() => openInfo('privacy')} onDemo={import.meta.env.VITE_IQ_MOCK === 'true' ? () => openInfo('demo') : undefined} />
      </main>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</div>

      <dialog ref={dialog} className="info-dialog" aria-labelledby="info-title" onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        <div className="dialog-heading"><div className="dialog-icon">{dialogContent === 'privacy' ? <ShieldCheck size={22} /> : <MessageCircle size={22} />}</div><button className="icon-button" onClick={() => dialog.current?.close()} aria-label="Close information"><X size={19} /></button></div>
        {dialogContent === 'privacy' ? <>
          <h2 id="info-title">How your message is protected.</h2>
          <p>Your current message is encrypted in this browser before it is sent. The server decrypts it to prepare a reply. Conversations stay in memory in this tab and are not saved by this app.</p>
          <p>The app accepts personal details without blocking or redacting them. Only your current message is included in the encrypted request. Your conversation history is not sent.</p>
          <p>Encryption protects the request contents, but the server can still read the message after decrypting it. The server also receives normal connection information, such as your IP address. Production connections require HTTPS.</p>
        </> : <>
          <h2 id="info-title">A real stream. A local demo.</h2>
          <p>Asclepius has 100 prepared medical education replies, matched to keywords in your question. These examples cannot diagnose conditions. No AI provider is connected.</p>
          <p>Try <code>/demo answer 1</code> through <code>/demo answer 100</code> to explore every topic.</p>
          <p>Most replies start with a two-second thinking pause. Urgent topics skip it. Send <code>/demo waiting</code> for a longer pause, or <code>/demo slow</code> to try Stop.</p>
          <p>To test failure states, send <code>/demo error</code>, <code>/demo empty</code>, or <code>/demo interrupted</code>.</p>
          <p>The mock must be replaced with your production endpoint for real AI-generated answers.</p>
        </>}
        <button className="dialog-close" onClick={() => dialog.current?.close()}>Got it</button>
      </dialog>
    </div>
  );
}
