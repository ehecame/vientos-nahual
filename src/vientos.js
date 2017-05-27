import fetch from 'isomorphic-fetch'
import cuid from 'cuid'
import * as ActionTypes from './actionTypes'

const service = require('../config.json').service
const pwa = require('../config.json').pwa

// otherwise unit tests not run in browser will fail
if (typeof window !== 'undefined') {
  // TODO: discover from vientos-service API
  window.vientos.login = {
    google: service + '/auth/google',
    facebook: service + '/auth/facebook',
    vientos: service + '/auth/vientos'
  }
}

const hello = service + '/auth/hello'
const data = {
  categories: '/node_modules/vientos-data/categories.json',
  'collaboration-types': '/node_modules/vientos-data/collaborationTypes.json',
  labels: '/node_modules/vientos-data/labels.json'
}
const fixtures = {
  projects: '/node_modules/vientos-fixtures/projects.json',
  intents: '/node_modules/vientos-fixtures/intents.json'
}
const collections = {
  people: { type: 'Person' },
  projects: { type: 'Project' },
  intents: { type: 'Intent' },
  sessions: { type: 'Session' },
  followings: { type: 'Following' }
}

function dataUrl (actionType) {
  let key = actionType.replace('FETCH_', '').replace('_REQUESTED', '').replace('_', '-').toLowerCase()
  return pwa + data[key]
}

function collectionUrl (actionType) {
  let key = actionType.replace('FETCH_', '').replace('_REQUESTED', '').toLowerCase()
  if (service) {
    return service + '/' + key
  } else {
    return pwa + fixtures[key]
  }
}

function mintUrl (resource) {
  let path = Object.keys(collections)
              .find(key => collections[key].type === resource.type)
  return `${service}/${path}/${cuid()}`
}

function get (url) {
  return fetch(url, { credentials: 'include' })
      .then(response => response.json())
}

function put (resource) {
  if (!resource._id) resource._id = mintUrl(resource)
  return fetch(resource._id, {
    method: 'PUT',
    credentials: 'include',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(resource)
  }).then(response => response.json())
}

function del (resource) {
  return fetch(resource._id, {
    method: 'DELETE',
    credentials: 'include'
  }).then(response => {
    if (response.ok) {
      return null
    } else {
      return response.json()
    }
  })
}

export default function vientos (action) {
  switch (action.type) {
    case ActionTypes.HELLO_REQUESTED:
      return get(hello)
    case ActionTypes.BYE_REQUESTED:
      return del(action.session)
    case ActionTypes.FOLLOW_REQUESTED:
      return put(action.following)
    case ActionTypes.UNFOLLOW_REQUESTED:
      return del(action.following)
    case ActionTypes.SAVE_INTENT_REQUESTED:
      return put(action.intent)
    case ActionTypes.DELETE_INTENT_REQUESTED:
      return del(action.intent)
    case ActionTypes.FETCH_PERSON_REQUESTED:
      return get(action.id)
    case ActionTypes.FETCH_CATEGORIES_REQUESTED:
    case ActionTypes.FETCH_COLLABORATION_TYPES_REQUESTED:
    case ActionTypes.FETCH_LABELS_REQUESTED:
      return get(dataUrl(action.type))
    case ActionTypes.FETCH_PROJECTS_REQUESTED:
    case ActionTypes.FETCH_INTENTS_REQUESTED:
      return get(collectionUrl(action.type))
    default:
      throw new Error('unknown action: ' + action.type)
  }
}
