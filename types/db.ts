export interface Database {
  sessions: Session;
  links: Link;
}

export interface Session {
  id: string;
  address: string;
  expires_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface Link {
  id: string;
  address: string;
  resolved_link: string;
  stripeUrlIdentifier: string;
  used?: boolean;
  expires_at?: Date;
  created_at?: Date;
}
