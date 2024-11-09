"use client";

import * as React from "react";
import EVENT_LIST from "./_components/events_map";

const USER_DASH: React.FC = () => {
  return (
    <div className="container flex flex-col gap-4">
      <div className="flex justify-between mt-8">
        <div className="text-2xl font-bold">Welcome User Search the Events</div>
      </div>
      <EVENT_LIST />
    </div>
  );
};

export default USER_DASH;
