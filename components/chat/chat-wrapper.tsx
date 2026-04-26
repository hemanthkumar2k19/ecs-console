"use client";

import React, { useState } from "react";
import { ChatFAB } from "./chat-fab";
import { ChatPanel } from "./chat-panel";

export function ChatWrapper() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ChatFAB isOpen={isOpen} onClick={() => setIsOpen(true)} />
      {isOpen && <ChatPanel onClose={() => setIsOpen(false)} />}
    </>
  );
}
