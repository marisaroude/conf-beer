import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import MapView, { Marker } from 'react-native-maps'

export default function MapScreen() {
  const params = useLocalSearchParams<{
    lat?: string
    lng?: string
    title?: string
  }>()
  const [loading, setLoading] = useState(true)

  const latitude = params.lat && parseFloat(params.lat) 
  const longitude = params.lng && parseFloat(params.lng) 
  const title = params.title || ""

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fbbf24" />
        <Text style={styles.loadingText}>Cargando mapa...</Text>
      </View>
    )
  }

  return (

    <View style={styles.container}>
      {latitude && longitude && (

      <MapView
        style={styles.map}
        // provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
        showsMyLocationButton>
        <Marker
          coordinate={{ latitude, longitude }}
          title={title}
        />
      </MapView>
      )}
      <View style={styles.locationBadge}>
          <Text style={styles.locationText}>📍 {params.title}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  loadingText: {
    marginTop: 10,
    color: '#fbbf24',
    fontSize: 16,
  },
  map: {
    flex: 1,
  },
  locationBadge: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    backgroundColor: '#fbbf24',
    padding: 20,
    borderRadius: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  locationText: {
    color: '#1a1a2e',
    fontWeight: '600',
    fontSize: 14,
  },
})
