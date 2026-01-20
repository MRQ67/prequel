import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { initSchema } from "../lib/schema";


export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await initSchema();
      setIsReady(true);
    }
    prepare();
  }, []);
  
  if (!isReady) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
