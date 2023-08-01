import { useState } from 'react';

const Notification = () => {
  const [refresh, setRefresh] = useState<boolean>(false);

  return (
    <>
      <div className="text-[20px] font-bold">Notifications</div>
      <div className="mt-5 flex gap-4">
        <div className="text-[#4346e1] border-b-[1px] border-b-[#4346e1]">Follows</div>
        <div>Creations</div>
      </div>
    </>
  );
};

export default Notification;
