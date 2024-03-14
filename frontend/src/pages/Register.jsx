import { useMutation } from "react-query";
import * as apiClient from "../apiClient";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useChatContext } from "../Context/ChatProvider";
import { toast } from "sonner";

export const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setUser } = useChatContext();

  const mutation = useMutation(apiClient.register, {
    onSuccess: (data) => {
      toast.success("Registered Successfully");
      localStorage.setItem("userInformation", JSON.stringify(data));
      setUser(data);
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Callback function to execute when the form is submitted
  const handleOnSubmit = (event) => {
    event.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please Enter All the Fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const userData = { name, email, password };

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
      <h2 className="text-3xl font-bold">Create an Account</h2>
      <div className="flex flex-col md:flex-row max-w-4xl gap-5">
        {/*Name input field */}
        <label className="text-gray-700 text-sm font-bold flex-1">
          Name
          <input
            className="border rounded w-full py-2 px-2 font-normal focus:outline-black"
            onChange={(e) => {
              setName(e.target.value);
            }}
          ></input>
        </label>
      </div>

      {/* Email input field */}
      <label className="text-gray-700 text-sm max-w-4xl font-bold flex-1">
        Email
        <input
          type="email"
          className="border rounded w-full py-2 px-2 font-normal focus:outline-black "
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        ></input>
      </label>

      {/* Password input field */}
      <label className="text-gray-700 text-sm max-w-4xl font-bold flex-1 relative">
        Password
        <input
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

      {/* Confirm Password input field */}
      <label className="text-gray-700 text-sm max-w-4xl font-bold flex-1 relative">
        Confirm Password
        <input
          value={confirmPassword}
          type="password"
          className="border rounded w-full py-2 px-2 font-normal focus:outline-black"
          onChange={(e) => {
            setConfirmPassword(e.target.value);
          }}
        ></input>
      </label>

      {/* Submit button */}
      <span>
        <button
          type="submit"
          className="rounded-md bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
        >
          Create Account
        </button>
      </span>
    </form>
  );
};

export default Register;
