import {
  LOADING_DATA,
  STOP_LOADING_DATA,
  // Data Handling
  SET_DATA_ARRAY,
  SET_DATA,
  POST_DATA,
  DELETE_DATA,
  // Announcements
  SET_ANNOUNCEMENTS,
  POST_ANNOUNCEMENT,
  DELETE_ANNOUNCEMENT,
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
  POST_IMAGE,
  // Folders
  ADD_SUBFOLDER,
  PATCH_FOLDER,
  PATCH_SUBFOLDER,
  DELETE_SUBFOLDER,
  SORT_SUBFOLDER,
  SET_NAV_PATH,
  RESET_NAV_PATH,
} from "../types";

const initialState = {
  loading: false,
  data: [],
  navpath: {id:"",parent:"",children:[]},
  announcements: [],
  departments: [],
  contacts: [],
  matchingSearchContacts: [],
  uploadedImageUrl: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true,
      };
    case STOP_LOADING_DATA:
      return {
        ...state,
        loading: false,
      };
    // Imagess
    case POST_IMAGE:
      console.log(action.payload);
      return {
        ...state,
        uploadedImageUrl: action.payload.imgUrl,
      };
    // Announcements
    case SET_ANNOUNCEMENTS:
      return {
        ...state,
        announcements: action.payload,
        loading: false,
      };
    case POST_ANNOUNCEMENT:
      return {
        ...state,
        announcements: [action.payload, ...state.announcements],
        loading: false,
      };
    case DELETE_ANNOUNCEMENT:
      let index = state.announcements.findIndex(
        (x) => x.announcementId === action.payload
      );
      state.announcements.splice(index, 1);
      return {
        ...state,
      };
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
      return {
        ...state,
        contacts: updatedDeleteContacts,
        matchingSearchContacts: updatedDeleteContacts,
        loading: false,
      };
    case SEARCH_CONTACTS:
      const searchTerm = action.payload;
      const matchingSearchContacts = state.contacts.filter((contact) =>
        contact.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
      );

      return {
        ...state,
        matchingSearchContacts: matchingSearchContacts,
        loading: false,
      };
    // Folders
    case ADD_SUBFOLDER:
      state.data[0].subfolders.push(action.payload);
      return { ...state };
    case PATCH_FOLDER:
      state.data[0] = Object.assign({}, state.data[0], action.payload);
      return { ...state };
    case PATCH_SUBFOLDER:
      let sf = state.data[0].subfolders;
      index = sf.findIndex((x) => x.id === action.payload.id);
      if(action.payload.patch){
        sf[index] = Object.assign({}, sf[index], action.payload.patch);
      }
      state.data[0].subfolders = sf;
      return { ...state };
    case DELETE_SUBFOLDER:
      sf = state.data[0].subfolders;
      index = sf.findIndex((x) => x.id === action.payload);
      state.data[0].subfolders = sf.slice(0,index).concat(sf.slice(index+1))
      return {...state};
    case SORT_SUBFOLDER:
      switch(parseInt(action.payload)){
        case 0:
        state.data[0].subfolders.sort((a,b)=>
          (a.title.toUpperCase()>=b.title.toUpperCase())
        )
        break;
        case 1:
        state.data[0].subfolders.sort((a,b)=>
          (a.title.toUpperCase()<b.title.toUpperCase())
        )
        break;
        case 2:
        state.data[0].subfolders.sort((a,b)=>(a.createdAt<b.createdAt))
        break;
        case 3:
        state.data[0].subfolders.sort((a,b)=>(a.createdAt>=b.createdAt))
        break;
        default:
        state.data[0].subfolders.sort((a,b)=>(a.id>=b.id))
        break;
      }
      return {...state};
    case SET_NAV_PATH:
      return {
        ...state,
        navpath: {
          id:action.payload.id,
          title:action.payload.title,
          parent:action.payload.parent,
          children:action.payload.subfolders
        },
        loading: false,
      };
    case RESET_NAV_PATH:
      return {
        ...state,
        navpath: {
          id:state.data[0].id,
          title:state.data[0].title,
          parent:state.data[0].parent,
          children:state.data[0].subfolders
        },
        loading: false,
      };

    // Data Handling
    case SET_DATA_ARRAY:
      return {
        ...state,
        data: action.payload,
        loading: false,
      };

    case SET_DATA:
      return {
        ...state,
        data: [action.payload],
        loading: false,
      };
    case POST_DATA:
      return {
        ...state,
        data: [action.payload, ...state.data],
      };
    case DELETE_DATA:
      index = state.data.findIndex((x) => x.postId === action.payload);
      state.data.splice(index, 1);
      return {
        ...state,
      };

    default:
      return state;
  }
}
