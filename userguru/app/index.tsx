// app/index.tsx
import { Redirect } from "expo-router";

export default function Index() {
  const isLoggedIn = false; // Replace with your actual logic

  if (isLoggedIn) {
    return <Redirect href="./(dashboard)" />;
  } else {
    return <Redirect href="./(auth)/login" />;
  }
}
