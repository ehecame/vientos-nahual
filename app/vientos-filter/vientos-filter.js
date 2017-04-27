/* global Polymer, ReduxBehavior, ActionCreators, util */

Polymer({
  is: 'vientos-filter',
  behaviors: [ ReduxBehavior, Polymer.AppLocalizeBehavior ],

  actions: {
    updateFilteredCategories: ActionCreators.updateFilteredCategories,
    updateFilteredCollaborationTypes: ActionCreators.updateFilteredCollaborationTypes,
    toggleFilterFollowings: ActionCreators.toggleFilterFollowings,
    setLocationFilter: ActionCreators.setLocationFilter
  },

  properties: {
    categories: {
      type: Array,
      statePath: 'categories'
    },
    person: {
      type: Object,
      statePath: 'person'
    },
    locationFilter: {
      type: String,
      statePath: 'locationFilter'
    },
    filteredCategories: {
      type: Array,
      statePath: 'filteredCategories'
    },
    collaborationTypes: {
      type: Array,
      statePath: 'collaborationTypes'
    },
    filteredCollaborationTypes: {
      type: Array,
      statePath: 'filteredCollaborationTypes'
    },
    language: {
      type: String,
      statePath: 'language'
    },
    resources: {
      type: Object,
      statePath: 'labels'
    }
  },

  _iconFor: util.iconFor,

  _selectionChanged (e, selection) {
    this.dispatch('updateFilteredCategories', selection)
  },

  _clearCategoriesFilter () {
    this.dispatch('updateFilteredCategories', [])
  },

  _selectMyCategories () {
    this.dispatch('updateFilteredCategories', this.person.categories)
  },

  _toggleCollaborationType (e) {
    if (this.filteredCollaborationTypes.includes(e.model.item.id)) {
      this.set('filteredCollaborationTypes', this.filteredCollaborationTypes.filter(colType => colType !== e.model.item.id))
    } else {
      this.set('filteredCollaborationTypes', [...this.filteredCollaborationTypes, e.model.item.id])
    }
    this.dispatch('updateFilteredCollaborationTypes', this.filteredCollaborationTypes)
  },

  _clearCollaborationTypesFilter () {
    this.dispatch('updateFilteredCollaborationTypes', [])
  },

  _isCollaborationTypeSelected (collaborationType, filteredCollaborationTypes) {
    return filteredCollaborationTypes.includes(collaborationType.id)
  },

  _filterFollowings () {
    this.dispatch('toggleFilterFollowings')
  },

  _locationFilterChanged (e, detail) {
    if (this.locationFilter !== detail.item.name) this.dispatch('setLocationFilter', detail.item.name)
  }

})
