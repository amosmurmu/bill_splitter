
CREATE TABLE homes (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    CONSTRAINT homes_name_not_empty CHECK (length(trim(name)) > 0)
);

CREATE TABLE members (
    id TEXT PRIMARY KEY NOT NULL,
    home_id TEXT NOT NULL,
    name TEXT NOT NULL,
    position INTEGER NOT NULL,

    CONSTRAINT fk_members_home
        FOREIGN KEY (home_id) REFERENCES homes(id),

    CONSTRAINT members_name_not_empty
        CHECK (length(trim(name)) > 0),

    CONSTRAINT members_home_position_unique
        UNIQUE (home_id, position)
);
