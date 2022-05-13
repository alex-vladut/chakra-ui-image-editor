import React, { ChangeEvent, PropsWithChildren, useRef } from "react";

export interface Props {
  multiple?: boolean;
  accept?: string;
  onChange: (files: File[]) => void;
}

export function FileInput({
  multiple,
  accept,
  onChange,
  children,
}: PropsWithChildren<Props>) {
  const ref = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <input
        ref={ref}
        type="file"
        multiple={multiple || false}
        hidden
        accept={accept}
        onChange={handleOnChange}
      />
      {React.Children.map(children, (child) => {
        if (
          !child ||
          typeof child === "string" ||
          typeof child === "number" ||
          typeof child === "boolean"
        ) {
          return child;
        }

        return React.cloneElement(child as never, {
          onClick: handleClick,
        });
      })}
    </>
  );

  function handleClick() {
    // force click action on the input to open files selection
    ref.current?.click();
  }

  function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target?.files) return;

    onChange && onChange(Array.from(event.target.files));
  }
}
