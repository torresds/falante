interface IProps {
  children: React.ReactNode;
  className?: string;
  border?: boolean;
}
export default function ResponsiveForm(props: IProps) {
  const generateClassName = () => {
    let className =
      "md:w-1/2 w-screen flex flex-col  gap-6 border-gray-200 rounded p-10";
    if (props?.className) {
      className += props.className;
    }
    if (props?.border) {
      className += " md:border-2 border-0";
      console.log(className);
    }
    return className;
  };
  return <div className={generateClassName()}>{props.children}</div>;
}
