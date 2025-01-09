import { Stack } from 'expo-router';

export default function TabsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide header for all stack screens
      }}
    >
     

      <Stack.Screen 
        name="Actialitiess" 
        options={{ title: "Actualitiess" }} 
      />
      <Stack.Screen 
        name="Home" 
        options={{ title: "Home" }} 
      />
      <Stack.Screen 
        name="Signupps" 
        options={{ title: "Signupps" }} 
      />
    
      <Stack.Screen name="[id]" 
       options={{ title: 'rideDetails' }}
        />
        <Stack.Screen name="PassengerProfil" 
       options={{ title: 'PassengerProfil' }}
        />
        
      
    </Stack>
  );
}
