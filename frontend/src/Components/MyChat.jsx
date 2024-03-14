import React, { useEffect, useRef, useState } from "react";
import { useChatContext } from "../Context/ChatProvider";
import { useQuery } from "react-query";
import * as apiClient from "../apiClient";
import CreateGroup from "./CreateGroup";
import { FaTimes } from "react-icons/fa";

const MyChat = () => {
  const [loggedUser, setLoggedUser] = useState();
  const [showCreateGropModal, setShowCreateGroupModal] = useState(false);
  const { user, currentChat, setCurrentChat, allUserChats, setAllUserChats } =
    useChatContext();

  const showGroupModalRef = useRef(null);

  useQuery("getAllUserChats", () => apiClient.getAllUserChats(user.token), {
    onSuccess: (data) => {
      setAllUserChats(data);
    },
  });

  useEffect(() => {
    setLoggedUser(user);
  }, [user]);

  const getSendersName = (loggedUser, users) => {
    return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
  };

  const handleCreateGroup = () => {
    setShowCreateGroupModal(true);
    return;
  };

  return (
    <div className=" md:block hidden h-[95vh] border p-3 text-2xl font-bold bg-green-50 w-full rounded-l-md">
      <div className="flex justify-between items-center">
        <h1 className="border-b border-black pb-2">Chats</h1>
        <button
          onClick={handleCreateGroup}
          className="bg-green-300  p-2 rounded-md  hover:bg-green-400 text-sm"
        >
          Create Group
        </button>
      </div>
      {showCreateGropModal && (
        <div
          ref={showGroupModalRef}
          className=" w-[500px] bg-slate-100 fixed top-[30%] left-[40%] z-20 rounded-md p-4"
        >
          <div className="flex justify-end">
            <button
              className=""
              onClick={() => {
                setShowCreateGroupModal(false);
              }}
            >
              <FaTimes />
            </button>
          </div>
          <CreateGroup setShowCreateGroupModal={setShowCreateGroupModal} />
        </div>
      )}
      <div className="flex flex-cols p-2 bg-green-100  overflow-y-hidden">
        {allUserChats && (
          <div className="overflow-y-scroll w-full">
            {allUserChats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => setCurrentChat(chat)}
                className={`cursor-pointer ${
                  currentChat === chat ? "bg-slate-200" : "bg-white"
                } hover:bg-slate-200 border-b border-slate-200 w-[300px] p-3 rounded mb-2`}
              >
                <div className="capitalize text-lg">
                  {!chat.isGroupChat
                    ? getSendersName(loggedUser, chat.users)
                    : chat.chatName}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyChat;
