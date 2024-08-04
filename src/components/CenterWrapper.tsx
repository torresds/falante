export default function CenterWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="grid h-screen place-items-center">{children}</div>;
}
