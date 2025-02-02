import { supabase } from "../lib/supabase";
import { errorHandler } from "../utils/errorHandler";
import { Review } from "../types";

export const getShopReviews = async (shopId: string): Promise<Review[]> => {
  try {
    let { data: reviews, error } = await supabase
        .from("reviews")
        .select("*")
        .eq('shopId', shopId)

    if (error) {
      throw error;
    }

    return reviews as Review[]
  } catch (error) {
    throw errorHandler.normalize(error);
  }
};

export const submitShopReview = async (
    shopId: string,
    review: Partial<Review>
  ): Promise<Review> => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          shopId,
          rating: review.rating,
          comment: review.comment,
          userId: review.userId,
          userName: review.userName
        })
        .single();
  
      if (error) throw error;
      return data as Review;
    } catch (error) {
      throw errorHandler.normalize(error);
    }
  };