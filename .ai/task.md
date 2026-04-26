CONTEXT:
I need to add an AI Chat assistant as a non-intrusive addon to this existing layout. Do not 
redesign or touch the existing navigation structure. The chat is an overlay/panel feature.
This is to be navigated by user at the evidence home page there, include a button saying Evidence Assistant and when clicked then it should redirect to the feature page.
---

FEATURE: AI Assistant Chat Panel

PLACEMENT & TRIGGER:
- Add a floating action button (FAB) fixed at bottom-right of the screen.
- Icon: a chat bubble with a small sparkle/AI indicator.
- Clicking it opens a chat panel that slides up from bottom-right (like Intercom 
  or Crisp style), approximately 420px wide and 600px tall.
- Panel should have minimize and close controls.
- On wider screens (>1280px) it can also optionally be docked as a right sidebar panel.
- The panel must not overlap the left navigation sidebar.

---

CHAT UI STRUCTURE (inside the panel):

Header:
- Title: "AI Assistant" with a pulsing green dot when the agent is active/streaming.
- Small subtitle text: "Ask about your resources, metrics, or take actions."
- Minimize button (chevron down) and close button (X).

Messages Area:
- Scrollable message list.
- User messages: right-aligned, filled bubble.
- Agent messages: left-aligned, with a small bot avatar icon.
- Render markdown in agent responses (bold, inline code, bullet lists).
- Messages should stream in token by token — do not wait for full response.

Agent State Indicators (these are critical — show them inline as status messages 
between user message and final response):
- "Thinking…" — animated brain or sparkle icon, subtle pulsing.
- "Searching data…" — magnifier icon with spinner.
- "Querying database…" — database/cylinder icon with spinner.
- "Executing action…" — lightning bolt icon with spinner.
- "Writing changes…" — pencil icon with spinner.
- These status messages should disappear once the final streamed response arrives.
- Each state indicator should be a small pill/chip style, not a full bubble.

Input Area:
- Text input at bottom with placeholder "Ask anything or describe a task…"
- Send button (arrow icon), disabled when input is empty or agent is responding.
- Show a "Stop generating" button (square stop icon) while the agent is streaming.
- Pressing Enter sends the message; Shift+Enter adds a newline.

---

FAQ QUICK PROMPTS:

Show these as horizontally scrollable chip buttons above the input field.
Only show them when the conversation is empty (no messages yet).
On click, populate the input and auto-send.

Use these example FAQ chips (I will replace with real ones later):
1. "Show resource usage summary"       → path hint: /dashboard/resources
2. "List recent alerts"                → path hint: /alerts
3. "How many active users today?"      → path hint: /analytics/users
4. "Show failed deployments"           → path hint: /deployments?status=failed
5. "What is current system health?"    → path hint: /health

Style: small outlined chips, icon on left (each a relevant icon like 
BarChart, Bell, Users, Rocket, HeartPulse from lucide-react).

---

WRITE ACTION CONFIRMATION UI:

When the agent signals a write/destructive action is about to happen, render a 
special confirmation card inside the message list (not a browser dialog). It should 
contain:
- Warning icon (amber/yellow).
- Action description text (passed from agent response).
- Two buttons: "Confirm" (primary, filled) and "Cancel" (outlined).
- After confirm/cancel, the card collapses and shows the outcome inline.

---

TECHNICAL WIRING (stubs only — I will wire the real backend later):

- Create a custom hook: useChatStream(threadId) that handles:
  - POST to /api/chat with { message, threadId }
  - ReadableStream / SSE reader loop
  - Parses event types: "token" | "status" | "action_proposal" | "done" | "error"
  - Exposes: { messages, sendMessage, isStreaming, stopStream, agentStatus }

- threadId: generate a UUID on first load, persist in sessionStorage.

- For now the hook can use a mock that streams fake tokens with a delay so the 
  UI is fully testable before the real backend is connected.

---

STYLING RULES:
- Match the existing console's design language (neutral grays, professional density).
- Use CSS variables for theming so it adapts to both light and dark mode.
- No playful colors — this is a professional tool. Use blue as the primary accent.
- Font: inherit from parent application.
- Use lucide-react for all icons.
- Subtle box shadows and borders, not heavy cards.
- The panel should feel like it belongs in GCP/Dynatrace, not a consumer chatbot.

---

OUTPUT EXPECTED:
- ChatPanel component (the full panel)
- ChatFAB component (the floating trigger button)
- useChatStream hook (with mock streaming)
- Types file for message/event structures
- Wire ChatFAB and ChatPanel into the root layout so they appear on all pages
- Do not modify any existing page or navigation component