//call backend from here to fetch data

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const signIn = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/api/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error(responseBody.message);
  }
  return responseBody;
};

export const register = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/api/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error(responseBody.message);
  }
  return responseBody;
};

export const getUsers = async ({ search: searchData, token }) => {
  const response = await fetch(
    `${API_BASE_URL}/api/user/?search=${searchData}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error(responseBody.message);
  }
  return responseBody;
};

export const getAllUserChats = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error(responseBody.message);
  }
  return responseBody;
};

export const createChat = async ({ userId, token }) => {
  const response = await fetch(`${API_BASE_URL}/api/chat/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error(responseBody.message);
  }
  return responseBody;
};

export const createGroup = async ({ groupName, selectedGroupUsers, token }) => {
  const body = JSON.stringify({
    groupName: groupName,
    users: JSON.stringify(selectedGroupUsers.map((user) => user._id)),
  });

  const response = await fetch(`${API_BASE_URL}/api/chat/group`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body,
  });
  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error(responseBody.message);
  }
  return responseBody;
};

export const sendMessage = async ({ newMessage, chatId, token }) => {
  const body = JSON.stringify({
    content: newMessage,
    chatId: chatId,
  });

  const response = await fetch(`${API_BASE_URL}/api/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body,
  });
  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error(responseBody.message);
  }
  return responseBody;
};

export const fetchMessages = async (chatId, token) => {
  if (!chatId || !token) return;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(`${API_BASE_URL}/api/message/${chatId}`, config);
  if (!response.ok) {
    throw new Error("Error fetching messages");
  }
  const data = await response.json();
  return data;
};
