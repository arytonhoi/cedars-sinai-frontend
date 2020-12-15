import {
  // Departments
  SET_DEPARTMENTS,
  PATCH_DEPARTMENT,
  POST_DEPARTMENT,
  DELETE_DEPARTMENT,
  // Contacts
  SET_CONTACTS,
  PATCH_CONTACT,
  POST_CONTACT,
  DELETE_CONTACT,
  SEARCH_CONTACTS,
} from "../types";

const initialState = {
  departments: [],
  contacts: [],
  matchingSearchContacts: [],
};

// export functions
export const contactReducer = (state = initialState, action) => {
  switch (action.type) {
    // departments
    case SET_DEPARTMENTS:
      return {
        ...state,
        departments: action.payload,
        loading: false,
      };
    case POST_DEPARTMENT:
      return {
        ...state,
        departments: [...state.departments, action.payload],
        loading: false,
      };
    case PATCH_DEPARTMENT:
      const updatedDepartment = action.payload;
      return {
        ...state,
        departments: state.departments.map((department) =>
          department.id === updatedDepartment.id
            ? updatedDepartment
            : department
        ),
        loading: false,
      };
    case DELETE_DEPARTMENT:
      const deletedDepartmentId = action.payload;
      return {
        ...state,
        departments: state.departments.filter(
          (department) => department.id !== deletedDepartmentId
        ),
        loading: false,
      };
    // Contacts
    case SET_CONTACTS:
      return {
        ...state,
        contacts: action.payload,
        matchingSearchContacts: action.payload,
        loading: false,
      };
    case POST_CONTACT:
      return {
        ...state,
        contacts: [...state.contacts, action.payload],
        matchingSearchContacts: [...state.contacts, action.payload],
        loading: false,
      };
    case PATCH_CONTACT:
      const updateContact = action.payload;
      const updatedPatchContacts = state.contacts.map((contact) =>
        contact.id === updateContact.id ? updateContact : contact
      );
      return {
        ...state,
        contacts: updatedPatchContacts,
        matchingSearchContacts: updatedPatchContacts,
        loading: false,
      };
    case DELETE_CONTACT:
      const deletedContactId = action.payload;
      const updatedDeleteContacts = state.contacts.filter(
        (contact) => contact.id !== deletedContactId
      );
      const updatedSearchDeleteContacts = state.matchingSearchContacts.filter(
        (contact) => contact.id !== deletedContactId
      );
      return {
        ...state,
        contacts: updatedDeleteContacts,
        matchingSearchContacts: updatedSearchDeleteContacts,
        loading: false,
      };
    case SEARCH_CONTACTS:
      const searchTerm = action.payload;
      return {
        ...state,
        matchingSearchContacts: state.contacts.filter((contact) =>
          contact.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
        ),
        loading: false,
      };
    default:
      return state;
  }
};
