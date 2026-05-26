import { apiClient } from "@/lib/api-mask";

export interface PredictRequest {
  item_id: string;
  horizon: number;
  price: number;
  promo: number | string;
  weekday: number | string;
  month: number | string;
  sales: number;
  [key: string]: string | number;
}

export interface PredictResponse {
  status: string;
  product_id: string;
  forecast_horizon_days: number;
  predicted_units: number;
  requested_by: string | number;
}

export const predictionService = {
  predict: async (data: PredictRequest) => {
    return apiClient.post<PredictResponse>("/ai/v1/predict", data);
  },
};
