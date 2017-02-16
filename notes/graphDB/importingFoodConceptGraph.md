CREATE CONSTRAINT ON (c:Concept) ASSERT c.name IS UNIQUE;

##Creating all the nodes from CSV file

USING PERIODIC COMMIT 50
LOAD CSV WITH HEADERS FROM "file:///food.csv" AS Line
WITH Line
WHERE Line.name IS NOT NULL
MERGE (c:Concept {name:Line.name})
SET c.conceptid = Line.`node id`
SET c.context = Line.context
SET c.desc = Line.description
SET c.parent = Line.`parent node id`

#---End of creating nodes---

## create a relationship between nodes dynamically

USING PERIODIC COMMIT 50
LOAD CSV WITH HEADERS FROM "file:///food.csv" AS Line
WITH Line
WHERE Line.name IS NOT NULL
MATCH (c:concept {name:Line.name})
MATCH (pc:concept {conceptid:Line.`parent node id`})
call apoc.create.relationship(c, Line.`parent relation`, {}, pc) YIELD rel
return c, pc, rel

##Create a relationship if you know the relation between nodes
USING PERIODIC COMMIT 50
LOAD CSV WITH HEADERS FROM "file:///food.csv" AS Line
WITH Line, Line.`parent relation` as rl
WHERE Line.name IS NOT NULL
MATCH (c:Concept {name:Line.name})
MATCH (pc:Concept {conceptid:Line.`parent node id`})
FOREACH(ignoreme in CASE WHEN rl = "subconcept of" THEN [1] ELSE [] END | MERGE (c)-[:`subconcept of`]->(pc))
FOREACH(ignoreme in CASE WHEN rl = "related" THEN [1] ELSE [] END | MERGE (c)-[:`related`]->(pc))

##Creating a Domain and create relation between domain and concepts

Match (c:Concept {context: 'Food'}) merge (d:Domain {name:'Food'}) merge (c)-[r:ConceptOf]->(d) return c,r,d

##To return all the node from database
MATCH (c:Concept)
MATCH (pc:Concept)
MATCH (d:Domain)
MATCH (c)-[]-(pc)
MATCH (c)-[]-(d)
