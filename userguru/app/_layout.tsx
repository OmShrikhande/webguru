// app/_layout.tsx or App.tsx
import { AuthProvider } from "../context/AuthContext";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <AuthProvider children={undefined}>
      <Stack />
    </AuthProvider>
  );
}
