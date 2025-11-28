export type User = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_organization_admin: boolean;
  position: string;
  phone: string;
  date_joined: string;
  last_login: string | null;
  organization_name: string;
  organization_type: string;
  can_manage_organization: boolean;
  groups: string[];
  group_ids: number[];
  permissions: string[];
};
