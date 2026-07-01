
window.onload = function() {
  // Build a system
  var url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  var options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "info": {
      "title": "TFG Backend API",
      "version": "1.0.0",
      "description": "API documentation for TFG Backend - VR Training Platform",
      "contact": {
        "name": "API Support"
      }
    },
    "servers": [
      {
        "url": "/api",
        "description": "API Server"
      }
    ],
    "components": {
      "securitySchemes": {
        "bearerAuth": {
          "type": "http",
          "scheme": "bearer",
          "bearerFormat": "JWT",
          "description": "Enter your JWT token"
        }
      },
      "schemas": {
        "User": {
          "type": "object",
          "properties": {
            "_id": {
              "type": "string",
              "description": "User ID"
            },
            "name": {
              "type": "string",
              "description": "User name"
            },
            "email": {
              "type": "string",
              "format": "email",
              "description": "User email"
            },
            "avatarUrl": {
              "type": "string",
              "description": "Avatar URL"
            },
            "role": {
              "type": "string",
              "enum": [
                "user",
                "admin"
              ],
              "description": "User role"
            }
          }
        },
        "UserWithToken": {
          "allOf": [
            {
              "$ref": "#/components/schemas/User"
            },
            {
              "type": "object",
              "properties": {
                "token": {
                  "type": "string",
                  "description": "JWT access token"
                }
              }
            }
          ]
        },
        "Module": {
          "type": "object",
          "properties": {
            "_id": {
              "type": "string",
              "description": "Module ID"
            },
            "title": {
              "type": "string",
              "description": "Module title"
            },
            "description": {
              "type": "string",
              "description": "Module description"
            },
            "thumbnailUrl": {
              "type": "string",
              "description": "Thumbnail URL"
            },
            "type": {
              "type": "string",
              "enum": [
                "VR",
                "WEB"
              ],
              "description": "Module type"
            },
            "duration": {
              "type": "string",
              "description": "Duration (e.g., \"15 mins\")"
            },
            "totalLessons": {
              "type": "number",
              "description": "Total number of lessons"
            },
            "createdAt": {
              "type": "string",
              "format": "date-time"
            },
            "updatedAt": {
              "type": "string",
              "format": "date-time"
            }
          }
        },
        "Report": {
          "type": "object",
          "properties": {
            "_id": {
              "type": "string",
              "description": "Report ID"
            },
            "user": {
              "type": "string",
              "description": "User ID"
            },
            "module": {
              "type": "object",
              "properties": {
                "_id": {
                  "type": "string"
                },
                "title": {
                  "type": "string"
                },
                "thumbnailUrl": {
                  "type": "string"
                }
              }
            },
            "overallScore": {
              "type": "string",
              "description": "Overall score (e.g., \"Good\")"
            },
            "interactionTime": {
              "type": "string",
              "description": "Interaction time"
            },
            "speakingPace": {
              "type": "object",
              "properties": {
                "wpm": {
                  "type": "number",
                  "description": "Words per minute"
                },
                "rating": {
                  "type": "string",
                  "description": "Rating"
                }
              }
            },
            "fillerWords": {
              "type": "object",
              "properties": {
                "count": {
                  "type": "number",
                  "description": "Filler word count"
                },
                "rating": {
                  "type": "string",
                  "description": "Rating"
                }
              }
            },
            "skills": {
              "type": "object",
              "properties": {
                "communication": {
                  "type": "string"
                },
                "problemSolving": {
                  "type": "string"
                },
                "clarity": {
                  "type": "string"
                },
                "bodyLanguage": {
                  "type": "string"
                }
              }
            },
            "transcript": {
              "type": "string",
              "description": "Session transcript"
            },
            "feedback": {
              "type": "string",
              "description": "Feedback text"
            },
            "createdAt": {
              "type": "string",
              "format": "date-time"
            },
            "updatedAt": {
              "type": "string",
              "format": "date-time"
            }
          }
        },
        "Error": {
          "type": "object",
          "properties": {
            "message": {
              "type": "string",
              "description": "Error message"
            },
            "stack": {
              "type": "string",
              "description": "Error stack trace (dev only)"
            }
          }
        },
        "RegisterRequest": {
          "type": "object",
          "required": [
            "name",
            "email",
            "password"
          ],
          "properties": {
            "name": {
              "type": "string",
              "description": "User name"
            },
            "email": {
              "type": "string",
              "format": "email",
              "description": "User email"
            },
            "password": {
              "type": "string",
              "format": "password",
              "description": "User password"
            }
          }
        },
        "LoginRequest": {
          "type": "object",
          "required": [
            "email",
            "password"
          ],
          "properties": {
            "email": {
              "type": "string",
              "format": "email",
              "description": "User email"
            },
            "password": {
              "type": "string",
              "format": "password",
              "description": "User password"
            }
          }
        },
        "UpdateProfileRequest": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "description": "User name"
            },
            "avatarUrl": {
              "type": "string",
              "description": "Avatar URL"
            }
          }
        },
        "UpdatePasswordRequest": {
          "type": "object",
          "required": [
            "currentPassword",
            "newPassword"
          ],
          "properties": {
            "currentPassword": {
              "type": "string",
              "format": "password",
              "description": "Current password"
            },
            "newPassword": {
              "type": "string",
              "format": "password",
              "description": "New password"
            }
          }
        },
        "MessageResponse": {
          "type": "object",
          "properties": {
            "message": {
              "type": "string",
              "description": "Response message"
            }
          }
        },
        "CreateReportRequest": {
          "type": "object",
          "required": [
            "module",
            "overallScore",
            "interactionTime",
            "transcript",
            "feedback"
          ],
          "properties": {
            "module": {
              "type": "string",
              "description": "Module ID"
            },
            "overallScore": {
              "type": "string"
            },
            "interactionTime": {
              "type": "string"
            },
            "speakingPace": {
              "type": "object",
              "properties": {
                "wpm": {
                  "type": "number"
                },
                "rating": {
                  "type": "string"
                }
              }
            },
            "fillerWords": {
              "type": "object",
              "properties": {
                "count": {
                  "type": "number"
                },
                "rating": {
                  "type": "string"
                }
              }
            },
            "skills": {
              "type": "object",
              "properties": {
                "communication": {
                  "type": "string"
                },
                "problemSolving": {
                  "type": "string"
                },
                "clarity": {
                  "type": "string"
                },
                "bodyLanguage": {
                  "type": "string"
                }
              }
            },
            "transcript": {
              "type": "string"
            },
            "feedback": {
              "type": "string"
            }
          }
        }
      }
    },
    "paths": {
      "/auth/register": {
        "post": {
          "summary": "Register a new user",
          "tags": [
            "Auth"
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RegisterRequest"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "User registered successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserWithToken"
                  }
                }
              }
            },
            "400": {
              "description": "User already exists or invalid data",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        }
      },
      "/auth/login": {
        "post": {
          "summary": "Authenticate user and get token",
          "tags": [
            "Auth"
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LoginRequest"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Login successful",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserWithToken"
                  }
                }
              }
            },
            "401": {
              "description": "Invalid email or password",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        }
      },
      "/auth/logout": {
        "post": {
          "summary": "Logout user and clear cookie",
          "tags": [
            "Auth"
          ],
          "responses": {
            "200": {
              "description": "Logged out successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/MessageResponse"
                  }
                }
              }
            }
          }
        }
      },
      "/modules": {
        "get": {
          "summary": "Get all modules",
          "tags": [
            "Modules"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "responses": {
            "200": {
              "description": "List of all modules",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Module"
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Not authorized",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        }
      },
      "/modules/{id}": {
        "get": {
          "summary": "Get module by ID",
          "tags": [
            "Modules"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Module ID"
            }
          ],
          "responses": {
            "200": {
              "description": "Module details",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Module"
                  }
                }
              }
            },
            "401": {
              "description": "Not authorized",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Error"
                  }
                }
              }
            },
            "404": {
              "description": "Module not found",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        }
      },
      "/reports": {
        "get": {
          "summary": "Get all reports for the authenticated user",
          "tags": [
            "Reports"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "responses": {
            "200": {
              "description": "List of user reports",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Report"
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Not authorized",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        },
        "post": {
          "summary": "Create a new training report",
          "tags": [
            "Reports"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateReportRequest"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Report created successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Report"
                  }
                }
              }
            },
            "401": {
              "description": "Not authorized",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        }
      },
      "/reports/{id}": {
        "get": {
          "summary": "Get report by ID",
          "tags": [
            "Reports"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "in": "path",
              "name": "id",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Report ID"
            }
          ],
          "responses": {
            "200": {
              "description": "Report details",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Report"
                  }
                }
              }
            },
            "401": {
              "description": "Not authorized to view this report",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Error"
                  }
                }
              }
            },
            "404": {
              "description": "Report not found",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        }
      },
      "/users/profile": {
        "get": {
          "summary": "Get user profile",
          "tags": [
            "Users"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "responses": {
            "200": {
              "description": "User profile retrieved successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/User"
                  }
                }
              }
            },
            "401": {
              "description": "Not authorized",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Error"
                  }
                }
              }
            },
            "404": {
              "description": "User not found",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        },
        "put": {
          "summary": "Update user profile",
          "tags": [
            "Users"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateProfileRequest"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Profile updated successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserWithToken"
                  }
                }
              }
            },
            "401": {
              "description": "Not authorized",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Error"
                  }
                }
              }
            },
            "404": {
              "description": "User not found",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        }
      },
      "/users/password": {
        "put": {
          "summary": "Update user password",
          "tags": [
            "Users"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdatePasswordRequest"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Password updated successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/MessageResponse"
                  }
                }
              }
            },
            "401": {
              "description": "Invalid current password or not authorized",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Error"
                  }
                }
              }
            },
            "404": {
              "description": "User not found",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        }
      },
      "/users/me": {
        "get": {
          "summary": "Get current user profile (alias for /profile)",
          "tags": [
            "Users"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "responses": {
            "200": {
              "description": "User profile retrieved successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/User"
                  }
                }
              }
            },
            "401": {
              "description": "Not authorized",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Error"
                  }
                }
              }
            },
            "404": {
              "description": "User not found",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        }
      }
    },
    "tags": []
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  var urls = options.swaggerUrls
  var customOptions = options.customOptions
  var spec1 = options.swaggerDoc
  var swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (var attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  var ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.oauth) {
    ui.initOAuth(customOptions.oauth)
  }

  if (customOptions.preauthorizeApiKey) {
    const key = customOptions.preauthorizeApiKey.authDefinitionKey;
    const value = customOptions.preauthorizeApiKey.apiKeyValue;
    if (!!key && !!value) {
      const pid = setInterval(() => {
        const authorized = ui.preauthorizeApiKey(key, value);
        if(!!authorized) clearInterval(pid);
      }, 500)

    }
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }

  window.ui = ui
}
