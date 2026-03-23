import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { getAllConferences, initDatabase } from '../database/database'
import { Conference } from '../types/conference'
import { formatDate, formatTime } from '../utils/utils'

export default function ConferencesScreen() {
  const [conferences, setConferences] = useState<Conference[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadConferences()
  }, [])

  async function loadConferences() {
    try {
      await initDatabase()
      const data = await getAllConferences()
      setConferences(data)
    } catch (error) {
      console.error('Error loading conferences:', error)
    } finally {
      setLoading(false)
    }
  }

  function renderConference({ item }: { item: Conference }) {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/conference/${item.id}`)}
        activeOpacity={0.7}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.cardContent}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.speaker}>{item.speaker}</Text>
          <Text style={styles.brewery}>{item.brewery}</Text>
          <View style={styles.timeContainer}>
            <Text style={styles.date}>{formatDate(item.startTime)}</Text>
            <Text style={styles.time}>
              {formatTime(item.startTime)} - {formatTime(item.endTime)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fbbf24" />
        <Text style={styles.loadingText}>Cargando conferencias...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={conferences}
        renderItem={renderConference}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  loadingText: {
    marginTop: 10,
    color: '#fbbf24',
    fontSize: 16,
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: '#0f3460',
  },
  cardContent: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  speaker: {
    fontSize: 16,
    color: '#fbbf24',
    marginBottom: 4,
  },
  brewery: {
    fontSize: 14,
    color: '#70b601',
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 13,
    color: '#a0a0a0',
  },
  time: {
    fontSize: 13,
    color: '#a0a0a0',
  }
})
