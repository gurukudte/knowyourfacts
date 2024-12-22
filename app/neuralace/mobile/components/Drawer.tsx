import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useState } from "react";

interface props {
  onUpdate: () => void;
  onComplete: () => void;
}

const SessionDrawer = ({ onUpdate, onComplete }: props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen((prev) => !prev);
  };

  const handleUpdate = () => {
    if (onUpdate) onUpdate();
    toggleDrawer();
  };

  const handleComplete = () => {
    if (onComplete) onComplete();
    toggleDrawer();
  };

  return (
    <>
      {/* Drawer Trigger Button */}
      <Drawer>
        <DrawerTrigger>
          <Button
            className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none"
            onClick={toggleDrawer}
          >
            {isOpen ? "Close" : "Open"}
          </Button>
        </DrawerTrigger>

        {/* Drawer Content */}
        <DrawerContent
          className={`fixed inset-y-0 right-0 z-50 bg-white w-3/4 max-w-sm shadow-lg transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-4 flex flex-col h-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Google Sheet Manager
            </h2>

            {/* Content for updating/competing */}
            <div className="flex-1 overflow-y-auto">
              <p className="text-gray-600 mb-4">
                Manage your entries directly:
              </p>

              <Button
                className="w-full mb-3 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none"
                onClick={handleUpdate}
              >
                Update Google Sheet
              </Button>

              <Button
                className="w-full bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 focus:outline-none"
                onClick={handleComplete}
              >
                Complete Task
              </Button>
            </div>

            {/* Close button */}
            <Button
              className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none"
              onClick={toggleDrawer}
            >
              Close Drawer
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleDrawer}
        ></div>
      )}
    </>
  );
};

export default SessionDrawer;
