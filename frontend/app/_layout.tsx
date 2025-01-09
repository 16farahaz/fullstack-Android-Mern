// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Default screens */}
      <Stack.Screen name="index" />
      <Stack.Screen name="Signin" />
      {/* Section-specific layouts */}
      <Stack.Screen name="Driver" />
      <Stack.Screen name="Passenger" />
      <Stack.Screen name="Superadmin" />
      <Stack.Screen name="socket" />
      <Stack.Screen name="ProfilD" />
      <Stack.Screen name="profilP" />
      <Stack.Screen name="About" />
    </Stack>
  );
}
