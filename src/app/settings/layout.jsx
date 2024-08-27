import { BasicTabs } from "@/app/UiComponents/Navigation/BasicTabs/BasicTabs";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col gap-3">
      <BasicTabs />
      {children}
    </div>
  );
}
