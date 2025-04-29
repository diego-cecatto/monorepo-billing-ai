import { trpc } from "@shared/trpc";
import { Suspense } from "react";

function MyComponent() {
  const [data] = trpc.analyze.composition.useSuspenseQuery();
  return <div>{data.name}</div>;
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyComponent />
    </Suspense>
  );
}
