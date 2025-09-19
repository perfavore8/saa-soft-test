export type RecordType = 'LDAP' | 'local';

export interface Account {
  marks: { text: string }[];
  recordType: RecordType;
  login: string;
  password: string | null;
}

export const accountMarkSeparator = '; ';
