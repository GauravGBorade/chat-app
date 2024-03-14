import React, { useEffect } from "react";
import MyChat from "../Components/MyChat";
import ChatWindow from "../Components/ChatWindow";
import { useChatContext } from "../Context/ChatProvider";
import SearchBar from "../Components/SearchBar";

const Chat = () => {
  const { user } = useChatContext();

  return (
    <div className="width-full">
      {user && <SearchBar />}
      <div className="w-4/5 mx-auto grid grid-col-1 md:grid-cols-[350px_1fr] px-2 gap-4">
        {user && (
          <>
            <MyChat />
            <ChatWindow />
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
