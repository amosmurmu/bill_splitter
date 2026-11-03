CREATE TABLE bills (
  id TEXT PRIMARY KEY NOT NULL,
  home_id TEXT NOT NULL,
  title TEXT NOT NULL,
  total_cents INTEGER NOT NULL,

  CONSTRAINT fk_bills_home
    FOREIGN KEY (home_id) REFERENCES homes(id),

  CONSTRAINT bill_title_not_empty
    CHECK (length(trim(title)) > 0),
  
  CONSTRAINT total_cents_not_negative
    CHECK (total_cents > 0)
);

CREATE TABLE bill_shares (
  id TEXT PRIMARY KEY NOT NULL,
  bill_id TEXT NOT NULL,
  member_id TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  paid_at TEXT,

  CONSTRAINT fk_bill_shares_bill
    FOREIGN KEY (bill_id) REFERENCES bills(id),

  CONSTRAINT fk_bill_members_member
    FOREIGN KEY (member_id) REFERENCES members(id),
  
  CONSTRAINT amount_cents_not_negative
    CHECK (amount_cents >= 0)
    
    CONSTRAINT bill_member_unique
    UNIQUE (bill_id, member_id)
);