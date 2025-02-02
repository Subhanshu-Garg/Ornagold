import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Button,
  Linking,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { RootStackParamList } from '../types';
import { useAuth } from '../contexts/AuthContext';


type ShopScreenProps = {
  route: RouteProp<RootStackParamList, 'Shop'>;
};

export default function ShopScreen({ route }: ShopScreenProps) {
  const { shop } = route.params;
  const [newReview, setNewReview] = useState('');
  const [reviews, setReviews] = useState(shop.reviews);
  const [rating, setRating] = useState(0);
  const [submitReviewWarning, setsubmitReviewWarning] = useState('')
  const { requireAuth } = useAuth();

  const handleSubmitReview = () => {
    Keyboard.dismiss()
    setsubmitReviewWarning('')
    if (newReview.trim() === '') {
      setsubmitReviewWarning('Please enter review.')
      return
    } // Don't submit empty reviews
    if (rating === 0) {
      setsubmitReviewWarning('Please give the rating.')
      return
    }
    // Add the new review
    setReviews([
      {
        id: (reviews.length + 1).toString(),
        userName: 'New User',
        rating,
        comment: newReview,
        date: new Date().toLocaleDateString(),
      },
      ...reviews,
    ]);

    // Reset the form
    setRating(0);
    setNewReview('');
  };

  const handleCall = async () => {
    try {
      const phoneNumber = `tel:${shop.phone}`;
      const supported = await Linking.canOpenURL(phoneNumber);
      console.log('phoneNumber', phoneNumber)
      if (supported) {
        await Linking.openURL(phoneNumber);
      } else {
        console.info('Phone calls are not supported on this device');
      }
    } catch (error) {
      console.error('Error making call:', error);
    }
  };

  const StarRating = () => {
    return (
      <View style={styles.ratingTitleContainer}>
        <View style={styles.ratingTextContainer}>
          <Text style={styles.ratingTitle}>Rate and review</Text>
        </View>
        <View style={styles.starContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              style={styles.starButton}
            >
              <Text style={[styles.starText, { color: star <= rating ? '#FFD700' : '#CCCCCC' }]}>
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            loadingEnabled
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

        <View style={styles.separator} />
        <View style={styles.addReviewContainer}>
          <StarRating />
          <View style={styles.inputButtonContainer}>
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
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.warningText, !submitReviewWarning && styles.hiddenWarning]}>
            {submitReviewWarning}
          </Text>
        </View>

        <View style={styles.separator} />
        <View style={styles.reviewsContainer}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          {reviews.map((review) => (
            <View key={review.id} style={styles.reviewItem}>
              <Text style={styles.reviewUser}>{review.userName}</Text>
              <Text style={styles.reviewRating}>Rating: {review.rating}/5</Text>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      
      <View style={styles.fixedButtonContainer}>
        <Button 
          title="Call Shop" 
          onPress={() => requireAuth(handleCall)}
          color="#007AFF"
        />
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
    padding: 15,
    paddingTop: 0,
  },
  inputButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  reviewInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    minHeight: 50,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  ratingTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
    marginBottom: 5,
  },
  ratingTextContainer: {
    flex: 1,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starButton: {
    padding: 3,
  },
  starText: {
    fontSize: 24,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginBottom: 15,
  },
  warningText: {
    color: 'red',
    marginTop: 5,
    fontSize: 14,
    height: 'auto', // Default height when there is text
  },
  hiddenWarning: {
    height: 0, // Make it disappear when empty
    opacity: 0, // Hide the text
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});