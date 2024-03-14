import React, { useRef, useState, useEffect } from "react";
import { useChatContext } from "../Context/ChatProvider";
import { useNavigate } from "react-router-dom";
import SearchResultCard from "./SearchResultCard";
import { toast } from "sonner";
import { useMutation } from "react-query";
import * as apiClient from "../apiClient";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const {
    user,
    setUser,
    currentChat,
    setCurrentChat,
    allUserChats,
    setAllUserChats,
  } = useChatContext();
  const resultRef = useRef(null);
  const searchRef = useRef(null);

  const navigate = useNavigate();
  //close the results when user clicks outside search area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        resultRef.current &&
        !resultRef.current.contains(event.target)
      ) {
        setShowResult(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //get result i.e. users to show in search
  const { mutate: fetchUsers } = useMutation("getUsers", apiClient.getUsers, {
    onSuccess: (data) => {
      if (data) {
        setSearchResult(data);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  //when clicked on searched user call fetch function to create chat
  const { mutate: createChat } = useMutation("getUsers", apiClient.createChat, {
    onSuccess: (data) => {
      if (data) {
        //if chat connection is new then append it to frontend's state to show in chat's page
        if (!allUserChats.find((chat) => chat._id === data._id)) {
          setAllUserChats([data, ...allUserChats]);
        }
        setCurrentChat(data);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("userInformation");
    setUser(null);
    navigate("/");
  };

  const handleSearch = (userId) => {
    if (!search) {
      toast.error("Please Enter Something");
      return;
    }

    fetchUsers({ search, token: user.token });

    setShowResult(true);
  };

  const openChat = (userId) => {
    createChat({ userId, token: user.token });
    setShowResult(false);
    setSearch("");
  };

  return (
    <div className="w-4/5 mx-auto">
      <div className="md:flex-row flex flex-col justify-between items-center p-2 ">
        <div ref={searchRef} className="font-bold flex relative">
          <input
            placeholder="Search Users"
            type="text"
            value={search}
            className="border rounded-l min-w-[250px] py-2 px-2 font-normal focus:outline-none focus:outline-4"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          ></input>
          <button
            onClick={handleSearch}
            className=" bg-blue-200 rounded-r p-2 font-bold hover:bg-blue-300 "
          >
            Search
          </button>
        </div>
        {showResult && (
          <div
            ref={resultRef}
            className="absolute z-10 top-12 bg-white w-[320px] h-[300px] overflow-y-scroll"
          >
            {searchResult.map((user) => (
              <SearchResultCard
                user={user}
                key={user._id}
                handleClick={() => openChat(user._id)}
              />
            ))}
          </div>
        )}
        <h1 className="font-bold text-3xl">Chat App</h1>
        <div className="flex w-1/5 justify-center items-center gap-4">
          <div className=" text-2xl capitalize flex justify-center items-center gap-2 cursor-pointer">
            <img
              className="h-[30px]"
              src="https://cdn-icons-png.flaticon.com/128/1144/1144760.png"
            />
            {user.name}
          </div>
          <button
            onClick={handleLogout}
            className="rounded-md p-2 bg-blue-200 font-bold hover:bg-blue-300 text-md sm:text-xl"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
