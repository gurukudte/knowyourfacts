import { useEffect, useState } from "react";
import { Candidates } from "../json/page";
import { toast } from "@/hooks/use-toast";

const useJsonHook = () => {
  const [jsonContent, setJsonContent] = useState<Candidates>({});
  const loadJsonContent = async () => {
    // try {
    //   const response = await fetch("/api/save-json");
    //   const data = await response.json();
    //   setJsonContent(data);
    // } catch (err) {
    //   console.error("Error loading JSON:", err);
    //   toast({
    //     variant: "destructive",
    //     title: "Error",
    //     description: "Failed to load candidates data",
    //   });
    // }
  };

  useEffect(() => {
    loadJsonContent();
  }, []);
  return { jsonContent };
};

export default useJsonHook;
