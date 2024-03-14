import React from "react";
import { useState } from "react";
import { useMutation } from "react-query";
import * as apiClient from "../apiClient";
import { Link, useNavigate } from "react-router-dom";
import { useChatContext } from "../Context/ChatProvider";
import { toast } from "sonner";

const SignIn = () => {
  const { setUser } = useChatContext();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //* make call to signIn function which will call the api end point
  const mutation = useMutation(apiClient.signIn, {
    onSuccess: (data) => {
      toast.success("Signed In Successfully");
      localStorage.setItem("userInformation", JSON.stringify(data));
      setUser(data);
      navigate("/chat");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleOnSubmit = (event) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error("Please Enter All the Fields");
      return;
    }

    const userData = { email, password };

    // handle submit will first verify all the form data. and if all good then will return the validated data to call function. then call mutate function to call fetch function using obtained data.
    mutation.mutate(userData);
  };

  const handleShowPassword = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };
  return (
    <form
      className="flex flex-col max-w-3xl gap-5 mx-auto background-style p-16"
      onSubmit={handleOnSubmit}
    >
      <h2 className="text-3xl font-bold">Sign In</h2>
      <label className="text-gray-700 text-sm max-w-3xl font-bold flex-1">
        Email
        <input
          value={email}
          type="email"
          className="border rounded w-full py-2 px-2 font-normal focus:outline-black focus:outline-4"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        ></input>
      </label>

      {/* Password input field */}
      <label className="text-gray-700 text-sm max-w-4xl font-bold flex-1 relative">
        Password
        <input
          value={password}
          type={showPassword ? "text" : "password"}
          className="border rounded w-full py-2 px-2 font-normal focus:outline-black"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button
          className="p-2 absolute top-10 transform -translate-y-1/2 right-2"
          onClick={handleShowPassword}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </label>

      <span className="flex items-center justify-between max-w-3xl">
        <span className="sm:text-sm text-xs">
          Not Registered ?
          <div className="underline underline-offset-2 text-blue-900">
            <Link to="/register">Create an account here</Link>
          </div>
        </span>
        <button
          type="submit"
          className="rounded-md bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-md sm:text-xl"
        >
          Login
        </button>
      </span>
      <div className="flex items-center justify-start">
        <button
          type="submit"
          className="rounded-md bg-blue-400 w-1/2 text-white p-2 font-bold hover:bg-blue-500 text-md sm:text-xl"
          onClick={() => {
            setEmail("guest@g.com");
            setPassword("123456");
          }}
        >
          Sign In as Guest
        </button>
      </div>
    </form>
  );
};

export default SignIn;
