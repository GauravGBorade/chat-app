import React from "react";
import { useState } from "react";
import { useChatContext } from "../Context/ChatProvider";
import { toast } from "sonner";
import * as apiClient from "../apiClient";
import { useMutation } from "react-query";

const CreateGroup = ({ setShowCreateGroupModal }) => {
  const [groupName, setGroupName] = useState();
  const [selectedGroupUsers, setSelectedGroupUsers] = useState([]);
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const { user, allUserChats, setAllUserChats } = useChatContext();

  //get the users to handle search when user searches for users to add in group
  const { mutate } = useMutation("getUsers", apiClient.getUsers, {
    onSuccess: (data) => {
      setSearchResult(data);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  //call fetch function to create group
  const { mutate: createGroupMutation } = useMutation(
    "createGroup",
    apiClient.createGroup,
    {
      onSuccess: (data) => {
        setAllUserChats([data, ...allUserChats]);
        toast.success("Group Created");
        setShowCreateGroupModal(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const handleSearch = (searchInput) => {
    //when user enters in search input change local state of search
    setSearch(searchInput);
    if (!searchInput) {
      setSearchResult([]);
      return;
    }

    mutate({ search, token: user.token });
  };

  const handleSubmit = async () => {
    if (!groupName || !selectedGroupUsers) {
      toast.error("Please Enter Details");
      return;
    }

    //on submit call mutate function
    createGroupMutation({ groupName, selectedGroupUsers, token: user.token });
  };

  const handleAddUser = (userToAddToGroup) => {
    //update local state when user clicks on user name to add user to group
    if (selectedGroupUsers.includes(userToAddToGroup)) {
      toast.error("already added");
      return;
    }
    setSelectedGroupUsers([...selectedGroupUsers, userToAddToGroup]);
  };
  return (
    <div>
      <div className="flex justify-center">
        <h1 className="text-3xl">Create Group</h1>
      </div>
      <div className="flex flex-col justify-center">
        <div>
          <label
            className="text-gray-700 text-sm font-bold flex-1"
            onChange={(e) => setGroupName(e.target.value)}
          >
            Group Name
            <input className="border rounded w-full  py-2 px-2 font-normal focus:outline-black"></input>
          </label>
          <label className="text-gray-700 text-sm font-bold flex-1">
            Add Users
            <input
              className="border rounded w-full  py-2 px-2 font-normal focus:outline-black"
              placeholder="Search"
              onChange={(e) => handleSearch(e.target.value)}
            ></input>
          </label>
        </div>
        <div className="text-base  capitalize z-30 flex  gap-4 p-2 w-fit mt-2">
          {searchResult?.slice(0, 5).map((user) => (
            <div
              className="border p-2 rounded-lg text-white bg-pink-400 hover:bg-pink-500 cursor-pointer"
              key={user._id}
              onClick={() => handleAddUser(user)}
            >
              <span>{user.name}</span>
            </div>
          ))}
        </div>
        <div className="flex p-2 mt-2 gap-3 overflow-scroll">
          <h3 className="text-base">Added Users:-</h3>
          {selectedGroupUsers.map((addedUser) => (
            <div key={addedUser._id}>
              <div className="flex gap-4">
                <span className=" capitalize text-base border px-2 py-1 rounded-lg text-white bg-red-700 cursor-pointer">
                  {addedUser.name}
                </span>
              </div>
            </div>
          ))}
        </div>
        <button
          className=" mt-4 rounded-md bg-blue-600 w-1/3 text-white p-2 font-bold hover:bg-blue-500 text-xl"
          onClick={handleSubmit}
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default CreateGroup;
