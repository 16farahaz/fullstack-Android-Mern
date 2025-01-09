import { Stack } from 'expo-router';

export default function TabsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide header for all stack screens
      }}
    >
     
      <Stack.Screen 
        name="Signup" 
        options={{ title: "Sign Up" }} 
      />
      <Stack.Screen 
        name="HomeDriver" 
        options={{ title: "Home" }} 
      />
      <Stack.Screen 
        name="AddRide" 
        options={{ title: "AddRide" }} 
      />
      <Stack.Screen 
        name="Verifmail" 
        options={{ title: "Verifyemail" }} 
      />
      <Stack.Screen 
        name="UpdateRide" 
        options={{ title: "UpdateRide" }} 
      />

      <Stack.Screen 
        name="AllRide" 
        options={{ title: "AllRide" }} 
      />

      <Stack.Screen 
        name="Actualities" 
        options={{ title: "Actualities" }} 
      />
      <Stack.Screen 
        name="RideDetails" 
        options={{ title: "RideDetails" }} 
      />

       <Stack.Screen name="[id]" 
       options={{ title: 'DriverDetails' }}
        />
         <Stack.Screen name="Note" 
       options={{ title: 'Note' }}
        />
        <Stack.Screen name="Orders" 
       options={{ title: 'Orders' }}
        />
    </Stack>
  );
}
