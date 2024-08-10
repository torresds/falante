export interface Voice {
  voice_id: string;
  name: string;
  samples: any[];
  category: string;
  fine_tuning: any;
  labels: Record<string, any>;
  description: string;
  preview_url: string;
  available_for_tiers: string[];
  settings: any;
  sharing: any;
  high_quality_base_model_ids: string[];
  safety_control: string;
  voice_verification: any;
  owner_id: string;
  permission_on_resource: string;
  is_legacy: boolean;
}
