import { trpc } from "@shared/trpc";
import { Suspense } from "react";

export const ImportDanfe = () => {
  const [data] = trpc.supply.enter.useSuspenseQuery();
  return <div>MyComponent {data}</div>;
};

export const Import = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ImportDanfe />
    </Suspense>
  );
};
