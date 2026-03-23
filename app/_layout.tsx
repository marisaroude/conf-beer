import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#000000',
          },
          headerTintColor: '#fbbf24',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 30,
          },
          contentStyle: {
            backgroundColor: '#000000',
          },
        }}>
        <Stack.Screen
          name="index"
          options={{
            title: 'ConfBeer🍺',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="conference/[id]"
          options={{
            title: 'Detalle',
            headerBackTitle: 'Volver',
          }}
        />
        <Stack.Screen
          name="map"
          options={{
            title: 'Ubicación',
            headerBackTitle: 'Volver',
          }}
        />
      </Stack>
    </>
  )
}
