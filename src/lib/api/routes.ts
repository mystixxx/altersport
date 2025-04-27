/**
 * API Routes
 *
 * This file defines all API routes in the application in a centralized location.
 * Each route is defined as a string path that can be used with the API client.
 */

export const apiRoutes = {
  /**
   * Airtable routes
   */
  airtable: {
    kategorije: "/airtable/kategorije",
    sports: "/airtable/sports",
    teams: "/airtable/teams",
    matches: "/airtable/matches",
    locations: "/airtable/locations",
  },

  /**
   * External API routes
   */
  users: {
    base: "/users",
    getAll: "/users",
    getById: (id: string | number) => `/users/${id}`,
    create: "/users",
    update: (id: string | number) => `/users/${id}`,
    delete: (id: string | number) => `/users/${id}`,
    initialize: (id: string | number) => `/users/initialize/${id}`,
  },
};
