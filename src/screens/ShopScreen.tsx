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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MapView, { Marker } from 'react-native-maps';
import { RootStackParamList } from '../types';
import { Icon } from 'react-native-elements';
import useProtectedAction from '../hooks/useProtectedAction';

type ShopScreenProps = {
  route: RouteProp<RootStackParamList, 'Shop'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Shop'>;
};

export default function ShopScreen({ route, navigation }: ShopScreenProps) {
  const { shop } = route.params;
  const [newReview, setNewReview] = useState('');
  const [reviews, setReviews] = useState(shop.reviews);
  const [rating, setRating] = useState(0);
  const [submitReviewWarning, setsubmitReviewWarning] = useState('')
  const protectedAction = useProtectedAction();

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

  const handleCallPress = async (phoneNum: string) => {
    try {
      const phoneNumber = `tel:${phoneNum}`;
      const supported = await Linking.canOpenURL(phoneNumber);
      if (supported) {
        await Linking.openURL(phoneNumber);
      } else {
        console.info('Phone calls are not supported on this device');
      }
    } catch (error) {
      console.error('Error making call:', error);
    }
  };


  return (
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
        <View style={styles.addressAndCallContainer}>
          <View style={styles.ratesContainer}>
            <Text style={styles.rateText}>Making Charges: {shop.makingCharges}%</Text>
            <Text style={styles.rateText}>Gold Rate: ₹{shop.goldRate}/g</Text>
          </View>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => protectedAction(() => handleCallPress(shop.phone))}
          >
            <Icon name="call" size={24} color="#fff" />
          </TouchableOpacity>
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
            onPress={() => protectedAction(handleSubmitReview)}
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
  addressAndCallContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  callButton: {
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 50,
    borderRadius: 8
  },
  address: {
    fontSize: 16,
    marginBottom: 10,
  },
  ratesContainer: {
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
  }
});