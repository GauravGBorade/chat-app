import { createContext, useContext, useEffect, useState } from "react";

const ChatContext = createContext();

//create context so that we have access to these state in whole app.
const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [currentChat, setCurrentChat] = useState();
  const [allUserChats, setAllUserChats] = useState([]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInformation"));
    setUser(userInfo);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        currentChat,
        setCurrentChat,
        allUserChats,
        setAllUserChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
