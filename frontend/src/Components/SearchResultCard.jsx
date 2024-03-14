import React from "react";

const SearchResultCard = ({ user, handleClick }) => {
  return (
    <div
      className="w-full bg-blue-100 rounded-b p-2 border-b border-slate-300 hover:bg-blue-200 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center gap-3 ">
        <img
          className="h-[25px]"
          src="https://cdn-icons-png.flaticon.com/128/1144/1144760.png"
          alt=""
        />
        <div className="capitalize">{user.name}</div>
      </div>
    </div>
  );
};

export default SearchResultCard;
