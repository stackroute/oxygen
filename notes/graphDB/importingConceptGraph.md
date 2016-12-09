CREATE CONSTRAINT ON (c:concept) ASSERT c.name IS UNIQUE;

USING PERIODIC COMMIT 50
LOAD CSV WITH HEADERS FROM "file:///javaConcepts.csv" AS Line
WITH Line
WHERE Line.name IS NOT NULL
MERGE (c:concept {name:Line.name})
SET c.conceptid = Line.`node id`
SET c.context = Line.context
SET c.desc = Line.description

USING PERIODIC COMMIT 50
LOAD CSV WITH HEADERS FROM "file:///javaConcepts.csv" AS Line
WITH Line
WHERE Line.name IS NOT NULL
MATCH (c:concept {name:Line.name})
MATCH (pc:concept {conceptid:Line.`parent node id`})
call apoc.create.relationship(c, Line.`parent relation`, {}, pc) YIELD rel
return c, pc, rel

match (c:concept) merge (d:domain {name:'Java Web Programming'}) merge (c)-[r:conceptOf]->(d) return c,r,d

MATCH (c:concept)
MATCH (pc:concept)
MATCH (d:domain)
MATCH (c)-[]-(pc)
MATCH (c)-[]-(d)
return *