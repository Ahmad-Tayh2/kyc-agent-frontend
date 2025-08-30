export interface RemittancePurpose {
  id: number;
  service_provider_id: number;
  purpose_provider: string;
  purpose_key: string;
  formal_name: string;
  is_off_by_service_provider: boolean;
  last_job_run_at: string;
  created_at: string;
  updated_at: string;
}

export interface RemittancePurposesResponse {
  data: RemittancePurpose[];
}

export interface RemittancePurposeResponse {
  data: RemittancePurpose;
}

export interface SourceIncome {
  id: number;
  service_provider_id: number;
  source_of_income_provider: string;
  source_of_income_key: string;
  formal_name: string;
  is_off_by_service_provider: boolean;
  last_job_run_at: string;
  created_at: string;
  updated_at: string;
}

export interface SourceIncomesResponse {
  data: SourceIncome[];
}

export interface SourceIncomeResponse {
  data: SourceIncome;
}
