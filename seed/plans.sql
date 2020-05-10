INSERT INTO "plans" ("name","restrictions")
VALUES
(E'free',E'{"organizations.invite": false, "organizations.maxCount": 1}'),
(E'starter',E'{"organizations.maxCount": 1, "organizations.users.maxCount": 3}'),
(E'team',E'{"organizations.maxCount": 1}'),
(E'enterprise',E'{}');
