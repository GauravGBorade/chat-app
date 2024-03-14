import React, { useState, useEffect, useRef } from "react";
import { useChatContext } from "../Context/ChatProvider";
import * as apiClient from "../apiClient";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";
import io from "socket.io-client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
let socket, selectedChatCompare;

const SingleChat = () => {
  const [loggedUser, setLoggedUser] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnection, setSocketConnection] = useState(false);
  const messagesEndRef = useRef(null);

  const { user, currentChat } = useChatContext();

  //create socket connection
  useEffect(() => {
    socket = io(API_BASE_URL);
    socket.emit("setup", user);
    socket.on("connection", () => setSocketConnection(true));
  }, []);

  useEffect(() => {
    setLoggedUser(user);
  }, [user]);

  useEffect(() => {
    selectedChatCompare = currentChat;
  }, [currentChat]);

  //look for incoming messages using socket
  useEffect(() => {
    socket.on("message received", (newMessage) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessage.chat._id
      ) {
        //Notify user
      } else {
        setMessages([...messages, newMessage]);
        scrollToBottom();
      }
    });
  });

  //call fetch function to send the message
  const { mutate: sendMessageMutate } = useMutation(
    "sendMessage",
    apiClient.sendMessage,
    {
      onSuccess: (data) => {
        //if successful then emit the message to backend
        socket.emit("new message", data);
        setMessages([...messages, data]);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  //get all the messages for current chat
  useQuery(
    ["getAllMessages", currentChat?._id],
    () => apiClient.fetchMessages(currentChat._id, user.token),
    {
      enabled: !!currentChat && !!user.token,
      onSuccess: (data) => {
        setMessages(data);
        socket.emit("join chat", currentChat._id);
      },
    }
  );

  const scrollToBottom = () => {
    messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
  };

  const getSendersName = (loggedUser, users) => {
    return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
  };
  //on click of enter call sending message mutate
  const sendMessage = (e) => {
    if (e.key === "Enter" && newMessage) {
      sendMessageMutate({
        newMessage,
        chatId: currentChat._id,
        token: user.token,
      });
      setNewMessage("");
    }
  };

  return (
    <div className=" bg-green-50 border-green-100 rounded-lg p-3 flex flex-col w-full h-[95vh]">
      {currentChat ? (
        <>
          <div className="p-2">
            {currentChat.isGroupChat ? (
              <h1 className=" capitalize text-3xl font-bold">
                {currentChat.chatName}
              </h1>
            ) : (
              <div className=" capitalize text-3xl font-bold">
                {getSendersName(loggedUser, currentChat.users)}
              </div>
            )}
          </div>
          <div className="flex flex-col h-full justify-end p-2 shadow-lg bg-white rounded-lg">
            <div
              className={`flex flex-col gap-2 overflow-y-scroll`}
              ref={messagesEndRef}
            >
              {messages &&
                messages.map((message, index) => (
                  <div
                    className={`flex flex-col w-fit  min-w-[15%] ${
                      message.sender._id === user._id ? "self-end" : ""
                    }`}
                    key={index}
                  >
                    <span
                      className={`${
                        message.sender._id === user._id
                          ? "bg-blue-200 self-end"
                          : "bg-blue-300"
                      } rounded-lg px-4 py-2 max-w-[75%]`}
                    >
                      {message.content}
                    </span>
                  </div>
                ))}
            </div>
            <div ref={messagesEndRef}></div>
            <input
              onKeyDown={sendMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
              }}
              value={newMessage}
              className=" mt-2 rounded-lg text-lg bg-slate-50 py-3 px-2 font-normal focus:outline-slate-100"
              placeholder="Type a Message"
            ></input>
          </div>
        </>
      ) : (
        <h1 className=" text-5xl opacity-50 flex h-[80vh] justify-center items-center">
          Click on user to start the chat
        </h1>
      )}
    </div>
  );
};

export default SingleChat;
