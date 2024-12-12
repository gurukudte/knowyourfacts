export const useLocalStorage = () => {
  const getFromLocalStorage = (itemName: string): any | null => {
    const savedData = localStorage.getItem(itemName);

    if (savedData) {
      return savedData;
    } else {
      return null;
    }
  };
  const setLocalStorage = (itemName: string, data: any) => {
    localStorage.setItem(itemName, data);
  };
  return { getFromLocalStorage, setLocalStorage };
};
