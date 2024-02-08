import { Box, Collapse, Divider, ScrollArea, Skeleton } from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useGlobalStore from "../../../../store/useGlobalStore";

import EmptyRoom from "../../../../components/InfoScreens/EmptyRoom";
import Message from "./Message/Message";

const Messages = (): JSX.Element => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
    console.log("messagesEndRef.current scroll", messagesEndRef.current);
  };

  console.log("messagesEndRef", messagesEndRef.current);

  const {
    currentRoom: { messages, roomParticipants, isLoadingMessages },
    user: { uid },
  } = useGlobalStore();

  useEffect(() => {
    scrollToBottom();
  }, [messages?.length]);

  useEffect(() => {
    if (!roomParticipants) return;
    if (roomParticipants.length === 0) return;

    const me = roomParticipants.find(
      (participant) => participant.user_id === uid,
    );
  }, [roomParticipants, uid, messages]);

  if (isLoadingMessages) {
    return (
      <>
        <Skeleton
          h={30}
          mb={10}
          width="50%"
        />
        <Skeleton
          h={30}
          mb={10}
          width="80%"
        />
        <Skeleton
          h={30}
          mb={10}
          width="35%"
        />
        <Skeleton
          h={30}
          mb={10}
          width="40%"
        />
        <Skeleton
          h={30}
          mb={10}
          width="60%"
        />
        <Skeleton
          h={30}
          mb={10}
          width="20%"
        />
        <Skeleton
          h={30}
          mb={10}
          width="30%"
        />
      </>
    );
  }

  if (!messages) return <p>Error loading messages</p>;
  if (messages.length === 0) return <EmptyRoom />;

  return (
    <ScrollArea
      w="100%"
      h="calc(100%)"
    >
      <Box>
        {messages.map((message) => {
          return (
            <div key={message.id}>
              <motion.div layout key={message.id}>
                <AnimatePresence>
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Message
                      key={message.id}
                      message={message}
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </Box>
    </ScrollArea>
  );
};

export default Messages;
