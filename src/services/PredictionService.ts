import { apiClient } from "@/lib/api-mask";

export interface PredictRequest {
  product_id: string;
  horizon: number;
  Price: number;
  Discount: number;
  "Units Sold": number;
  Seasonality: string;
  Category: string;
  Region: string;
  "Weather Condition": string;
  "Holiday/Promotion": number | string;
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
