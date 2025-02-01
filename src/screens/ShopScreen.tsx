import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { RootStackParamList } from '../types';

type ShopScreenProps = {
  route: RouteProp<RootStackParamList, 'Shop'>;
};

export default function ShopScreen({ route }: ShopScreenProps) {
  const { shop } = route.params;
  const [newReview, setNewReview] = useState('');

  const handleSubmitReview = () => {
    // In a real app, this would send the review to a backend
    setNewReview('');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: shop.latitude,
              longitude: shop.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: shop.latitude,
                longitude: shop.longitude,
              }}
              title={shop.name}
            />
          </MapView>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.address}>{shop.address}</Text>
          <View style={styles.ratesContainer}>
            <Text style={styles.rateText}>Making Charges: {shop.makingCharges}%</Text>
            <Text style={styles.rateText}>Gold Rate: ₹{shop.goldRate}/g</Text>
          </View>
        </View>


      <View style={styles.reviewsContainer}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          {shop.reviews.map((review) => (
            <View key={review.id} style={styles.reviewItem}>
              <Text style={styles.reviewUser}>{review.userName}</Text>
              <Text style={styles.reviewRating}>Rating: {review.rating}/5</Text>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          ))}
      </View>
      </ScrollView>
      <View style={styles.addReviewContainer}>
        <TextInput
          style={styles.reviewInput}
          placeholder="Write your review..."
          value={newReview}
          onChangeText={setNewReview}
          multiline
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitReview}
        >
          <Text style={styles.submitButtonText}>Submit Review</Text>
        </TouchableOpacity>
      </View>

    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapContainer: {
    height: 200,
    width: '100%',
  },
  map: {
    flex: 1,
  },
  detailsContainer: {
    padding: 15,
  },
  address: {
    fontSize: 16,
    marginBottom: 10,
  },
  ratesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  rateText: {
    fontSize: 16,
    fontWeight: '500',
  },
  reviewsContainer: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  reviewItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  reviewUser: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  reviewRating: {
    color: '#666',
    marginBottom: 5,
  },
  reviewComment: {
    fontSize: 14,
  },
  addReviewContainer: {
    padding: 15
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    minHeight: 50,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});