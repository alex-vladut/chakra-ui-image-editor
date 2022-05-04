import { createContext, ReactNode, useContext, useState } from "react";

type Props = {
  isOpen: boolean;
  setOpen(isOpen: boolean): void;
  type?: string;
  setType(type?: string): void;
  toggle(type?: string): void;
  close(): void;
};

const Context = createContext<Props | null>(null);

export function useToolbarContext() {
  const context = useContext(Context);
  if (!context) {
    throw new Error(
      "Cannot access useToolbarContext() outside <ToolbarContextProvider/>"
    );
  }

  return context;
}

export function ToolbarContextProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [type, setType] = useState<string>();

  const toggle = (currentType: string) => {
    if (type === currentType) {
      setOpen(false);
      setType(undefined);
    } else {
      setOpen(true);
      setType(currentType);
    }
  };

  const close = () => {
    setOpen(false);
    setType(undefined);
  };

  return (
    <Context.Provider value={{ isOpen, setOpen, type, setType, toggle, close }}>
      {children}
    </Context.Provider>
  );
}
