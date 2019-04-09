module.exports ={
    "swagger": "2.0",
    "info": {
      "version": "1.0.0",
      "title": "Oxygen"
    },
    "host": "localhost:8080",
    "basePath": "/",
    "paths": {
      "/crawl/doc": {
        "post": {
          "tags": [
            "WebDocuments"
          ],
          "summary": "This endpoint crawls a document and saves it to database\"",
          "operationId": "crawlOneDocument",
          "produces": [
            "*/*"
          ],
          "consumes": [
            "*/*"
          ],
          "parameters": [
            {
              "name": "WebDocument",
              "in": "body",
              "description": "WebDocument",
              "required": true,
              "schema": {
                "$ref": "#/definitions/WebDocuments"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "Not Found"
            }
          }
        }
      },
      "/crawl/{urlID}": {
        "get": {
          "tags": [
            "WebDocuments"
          ],
          "summary": "Get WebDocument using urlId",
          "operationId": "getDocumentById",
          "produces": [
            "application/xml",
            "application/json"
          ],
          "parameters": [
            {
              "name": "urlId",
              "in": "path",
              "description": "urlId",
              "required": true,
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "Not Found"
            }
          }
        }
      },
      "/crawl": {
        "get": {
          "tags": [
            "WebDocuments"
          ],
          "summary": "Get all WebDocuments",
          "operationId": "getWebDocuments",
          "produces": [
            "application/xml",
            "application/json"
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "Not Found"
            }
          }
        }
      },
      "/domain/{domainName}": {
        "post": {
          "tags": [
            "Domain"
          ],
          "summary": "Display a domain",
          "operationId": "getResult",
          "produces": [
            "*/*"
          ],
          "parameters": [
            {
              "name": "domainName",
              "in": "path",
              "description": "domainName",
              "required": true,
              "type": "string"
            },
            {
              "name": "Domain",
              "in": "body",
              "description": "Domain",
              "required": true,
              "schema": {
                "$ref": "#/definitions/Domains"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "Not Found"
            }
          }
        },
        "get": {
          "tags": [
            "Domain"
          ],
          "summary": "get domain by domain name",
          "operationId": "getDomainByName",
          "consumes": [
            "*/*"
          ],
          "produces": [
            "application/json"
          ],
          "parameters": [
            {
              "name": "domainName",
              "in": "path",
              "description": "domainName",
              "required": true,
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK",
              "schema": {
                "type": "string"
              }
            },
            "201": {
              "description": "Created"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "Not Found"
            }
          }
        }
      },
      "/domain/{domainName}/crawl": {
        "post": {
          "tags": [
            "Domain"
          ],
          "summary": "Insert a Url",
          "operationId": "insertUrl",
          "consumes": [
            "application/json"
          ],
          "produces": [
            "*/*"
          ],
          "parameters": [
            {
              "name": "domainName",
              "in": "path",
              "description": "domainName",
              "required": true,
              "type": "string"
            },
            {
              "name": "Domain",
              "in": "body",
              "description": "Domain",
              "required": true,
              "schema": {
                "$ref": "#/definitions/Domains"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "OK",
              "schema": {
                "type": "string"
              }
            },
            "201": {
              "description": "Created"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "Not Found"
            }
          }
        }
      },
      "/domain": {
        "get": {
          "tags": [
            "Domain"
          ],
          "summary": "get all domain details",
          "operationId": "getAllDomainDetails",
          "consumes": [
            "*/*"
          ],
          "produces": [
            "application/json"
          ],
          "responses": {
            "200": {
              "description": "OK",
              "schema": {
                "type": "string"
              }
            },
            "201": {
              "description": "Created"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "Not Found"
            }
          }
        }
      },
      "/domain/domains": {
        "get": {
          "tags": [
            "Domain"
          ],
          "summary": "get all domains",
          "operationId": "getAllDomains",
          "consumes": [
            "*/*"
          ],
          "produces": [
            "application/json"
          ],
          "responses": {
            "200": {
              "description": "OK",
              "schema": {
                "type": "string"
              }
            },
            "201": {
              "description": "Created"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "Not Found"
            }
          }
        }
      },
      "/domain/{domainName}/index": {
        "post": {
          "tags": [
            "Domain"
          ],
          "summary": "Index a Domain",
          "operationId": "indexDomain",
          "consumes": [
            "application/json"
          ],
          "produces": [
            "*/*"
          ],
          "parameters": [
            {
              "name": "domainName",
              "in": "path",
              "description": "domainName",
              "required": true,
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK",
              "schema": {
                "type": "string"
              }
            },
            "201": {
              "description": "Created"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "Not Found"
            }
          }
        }
      },
      "/domain/documents/{domainName}": {
        "post": {
          "tags": [
            "Domain"
          ],
          "summary": "Retrieve Web Documents",
          "operationId": "fetchWebDocuments",
          "consumes": [
            "application/json"
          ],
          "produces": [
            "*/*"
          ],
          "parameters": [
            {
              "name": "domainName",
              "in": "path",
              "description": "domainName",
              "required": true,
              "type": "string"
            },
            {
              "name": "Domain",
              "in": "body",
              "description": "Domain",
              "required": true,
              "schema": {
                "$ref": "#/definitions/Domains"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "OK",
              "schema": {
                "type": "string"
              }
            },
            "201": {
              "description": "Created"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "Not Found"
            }
          }
        }
      },
      "/domain/domainhomeview/{domainName}": {
        "get": {
          "tags": [
            "Domain"
          ],
          "summary": "Get Tree of Domain",
          "operationId": "getTreeOfDomain",
          "consumes": [
            "application/json"
          ],
          "produces": [
            "*/*"
          ],
          "parameters": [
            {
              "name": "domainName",
              "in": "path",
              "description": "domainName",
              "required": true,
              "type": "string"
            },
            {
              "name": "Domain",
              "in": "body",
              "description": "Domain",
              "required": true,
              "schema": {
                "$ref": "#/definitions/Domains"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "OK",
              "schema": {
                "type": "string"
              }
            },
            "201": {
              "description": "Created"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "Not Found"
            }
          }
        }
      },
      "/domain/deletedomain/{domainName}": {
        "delete": {
          "tags": [
            "Domain"
          ],
          "summary": "Delete a Domain",
          "operationId": "deleteDomain",
          "consumes": [
            "application/json"
          ],
          "produces": [
            "*/*"
          ],
          "parameters": [
            {
              "name": "domainName",
              "in": "path",
              "description": "domainName",
              "required": true,
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK",
              "schema": {
                "type": "string"
              }
            },
            "201": {
              "description": "Created"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "Not Found"
            }
          }
        }
      },
      "/docSearchJob/job": {
        "post": {
          "tags": [
            "doc-Search-Job"
          ],
          "summary": "This endpoint creates a job",
          "operationId": "addJob",
          "consumes": [
            "application/json"
          ],
          "produces": [
            "application/json"
          ],
          "parameters": [
            {
              "name": "jobModel",
              "in": "body",
              "description": "jobModel",
              "required": true,
              "schema": {
                "$ref": "#/definitions/jobModel"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "Not Found"
            }
          }
        }
      },
      "/docSearchJob/show": {
        "get": {
          "tags": [
            "doc-Search-Job"
          ],
          "summary": "This endpoint shows all Jobs",
          "operationId": "showJob",
          "consumes": [
            "*/*"
          ],
          "produces": [
            "application/json"
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "Not Found"
            }
          }
        }
      },
      "/docSearchJob/{resultJobId}": {
        "get": {
          "tags": [
            "doc-Search-Job"
          ],
          "summary": "This endpoint shows job by Id",
          "operationId": "showResults",
          "consumes": [
            "*/*"
          ],
          "produces": [
            "application/json"
          ],
          "parameters": [
            {
              "name": "resultJobId",
              "in": "path",
              "description": "resultJobId",
              "required": true,
              "type": "string"
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "Not Found"
            }
          }
        }
      },
      "/docSearchJob/delete": {
        "delete": {
          "tags": [
            "doc-Search-Job"
          ],
          "summary": "This endpoint deletes a job",
          "operationId": "deleteJob",
          "consumes": [
            "*/*"
          ],
          "produces": [
            "*/*"
          ],
          "parameters": [
            {
              "name": "jobModel",
              "in": "body",
              "description": "jobModel",
              "required": true,
              "schema": {
                "$ref": "#/definitions/jobModel"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "OK"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "Not Found"
            }
          }
        }
      },
      "/docSearchJob/update": {
        "post": {
          "tags": [
            "doc-Search-Job"
          ],
          "summary": "This endpoint updates a job",
          "operationId": "updateJob",
          "consumes": [
            "application/json"
          ],
          "produces": [
            "*/*"
          ],
          "parameters": [
            {
              "name": "jobModel",
              "in": "body",
              "description": "jobModel",
              "required": true,
              "schema": {
                "$ref": "#/definitions/jobModel"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "OK",
              "schema": {
                "type": "string"
              }
            },
            "201": {
              "description": "Created"
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "Not Found"
            }
          }
        }
      }
    },
    "definitions": {
      "WebDocuments": {
        "type": "object",
        "properties": {
          "domain": {
            "type": "string"
          },
          "concept": {
            "type": "string"
          },
          "url": {
            "type": "string"
          },
          "terms": {
            "type": "object",
            "properties": {
              "word": {
                "type": "string"
              },
              "intensity": {
                "type": "string"
              }
            }
          },
          "title": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "lastIndexedOn": {
            "type": "string"
          }
        }
      },
      "Domains": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "domainImgURL": {
            "type": "string"
          },
          "createdBy": {
            "type": "string"
          },
          "createdOn": {
            "type": "string"
          },
          "updatedOn": {
            "type": "string"
          },
          "status": {
            "type": "string"
          },
          "statusText": {
            "type": "string"
          }
        }
      },
      "jobModel": {
        "type": "object",
        "properties": {
          "engineId": {
            "type": "string"
          },
          "exactTerms": {
            "type": "string"
          },
          "results": {
            "type": "number"
          },
          "siteSearch": {
            "type": "string"
          }
        }
      }
    }
  }