import { formatFullDate, formatTime } from '@/utils/utils'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { getConferenceById } from '../../database/database'
import { Conference } from '../../types/conference'

export default function ConferenceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [conference, setConference] = useState<Conference | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadConference() {
      try {
        if (id) {
          const data = await getConferenceById(parseInt(id))
          setConference(data)
        }
      } catch (error) {
        console.error('Error loading conference:', error)
      } finally {
        setLoading(false)
      }
    }
    loadConference()
  }, [id])



  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fbbf24" />
      </View>
    )
  }

  if (!conference) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Conferencia no encontrada</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={{ uri: conference.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>{conference.title}</Text>

        <View style={styles.speakerContainer}>
          <Text style={styles.label}>Disertante</Text>
          <Text style={styles.speaker}>{conference.speaker}</Text>
        </View>

        <View style={styles.breweryContainer}>
          <Text style={styles.label}>Cervecería</Text>
          <Text style={styles.brewery}>{conference.brewery}</Text>
        </View>

        <View style={styles.scheduleContainer}>
          <Text style={styles.label}>Fecha y Horario</Text>
          <Text style={styles.date}>
            {formatFullDate(conference.startTime)}
          </Text>
          <Text style={styles.time}>
            {formatTime(conference.startTime)} -{' '}
            {formatTime(conference.endTime)}
          </Text>
        </View>

        <View style={styles.locationContainer}>
          <Text style={styles.label}>Ubicación</Text>
          <Text style={styles.location}>{conference.locationName}</Text>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.label}>Descripción</Text>
          <Text style={styles.description}>{conference.description}</Text>
        </View>

        <TouchableOpacity
          style={styles.mapButton}
          onPress={() =>
            router.push({
              pathname: '/map',
              params: {
                lat: conference.latitude,
                lng: conference.longitude,
                title: conference.locationName,
              },
            })
          }>
          <Text style={styles.mapButtonText}>📍 Ver en el Mapa</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  errorText: {
    color: '#e94560',
    fontSize: 18,
  },
  image: {
    width: '100%',
    height: 250,
    backgroundColor: '#0f3460',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    color: '#a0a0a0',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  speakerContainer: {
    marginBottom: 16,
  },
  speaker: {
    fontSize: 20,
    color: '#fbbf24',
    fontWeight: '600',
  },
  breweryContainer: {
    marginBottom: 16,
  },
  brewery: {
    fontSize: 18,
    color: '#70b601',
    fontWeight: '500',
  },
  scheduleContainer: {
    marginBottom: 16,
    backgroundColor: '#16213e',
    padding: 16,
    borderRadius: 12,
  },
  date: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  time: {
    fontSize: 18,
    color: '#fbbf24',
    fontWeight: '600',
  },
  locationContainer: {
    marginBottom: 16,
  },
  location: {
    fontSize: 16,
    color: '#ffffff',
  },
  descriptionContainer: {
    marginBottom: 24,
    backgroundColor: '#16213e',
    padding: 16,
    borderRadius: 12,
  },
  description: {
    fontSize: 16,
    color: '#e0e0e0',
    lineHeight: 24,
  },
  mapButton: {
    backgroundColor: '#fbbf24',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
  },
  mapButtonText: {
    color: '#1a1a2e',
    fontSize: 18,
    fontWeight: 'bold',
  },
})
