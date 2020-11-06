import React, { Component } from "react";
import PropTypes from "prop-types";

// redux
import { connect } from "react-redux";
import {
  // departments
  getDepartments,
  patchDepartment,
  postDepartment,
  deleteDepartment,
  // contacts
  getContacts,
  patchContact,
  postContact,
  deleteContact,
  // search
  getSearchedContacts,
} from "../redux/actions/dataActions";

// Components
import Department from "../components/contacts/department";
import AddDepartmentModal from "../components/contacts/addDepartmentModal";

class ContactPage extends Component {
  componentDidMount() {
    this.props.getDepartments();
    this.props.getContacts();
  }

  constructor() {
    super();
    this.state = {
      // departments
      addingDepartment: false,
      targettedDepartmentId: "",
      departmentName: "",
      // contacts
      targettedContactId: "",
      addingContact: false,
      contactName: "",
      contactImgUrl: "",
      contactDepartmentId: "",
      contactPhone: "",
      contactEmail: "",
      // search
      searchTerm: "",
      // idk??
      errors: {},
    };
  }

  // contact functions
  handleAddNewContact = (event) => {
    const departmentId = event.target.value;
    this.setState({
      addingContact: true,
      contactName: "",
      contactImgUrl: "",
      contactDepartmentId: departmentId,
      contactPhone: "",
      contactEmail: "",
    });
  };

  handleSubmitNewContact = (event) => {
    event.preventDefault();
    const newContact = {
      name: this.state.contactName,
      imgUrl: this.state.contactImgUrl,
      departmentId: this.state.contactDepartmentId,
      phone: this.state.contactPhone,
      email: this.state.contactEmail,
    };
    this.props.postContact(newContact);
    this.setState({
      addingContact: false,
      contactName: "",
      contactImgUrl: "",
      contactDepartmentId: "",
      contactPhone: "",
      contactEmail: "",
      searchTerm: "",
    });
  };

  handleEditThisContact = (event) => {
    const contactId = event.target.value;
    const contacts = this.props.data.contacts;
    const contact = contacts.find((c) => c.id === contactId);
    this.setState({
      targettedContactId: contactId,
      contactName: contact.name,
      contactImgUrl: contact.imgUrl,
      contactDepartmentId: contact.departmentId,
      contactPhone: contact.phone,
      contactEmail: contact.email,
    });
  };

  handleSubmitContactChange = (event) => {
    event.preventDefault();
    const updatedContactId = this.state.targettedContactId;
    const updatedContact = {
      name: this.state.contactName,
      imgUrl: this.state.contactImgUrl,
      departmentId: this.state.contactDepartmentId,
      phone: this.state.contactPhone,
      email: this.state.contactEmail,
    };
    this.props.patchContact(updatedContactId, updatedContact);
    this.setState({
      targettedContactId: "",
      searchTerm: "",
    });
  };

  handleCancelContactChange = (event) => {
    this.setState({
      targettedContactId: "",
      addingContact: false,
      contactName: "",
      contactImgUrl: "",
      contactDepartmentId: "",
      contactPhone: "",
      contactEmail: "",
    });
  };

  handleDeleteContact = (event) => {
    const confirmDeleteContact = window.confirm("Are you sure?");
    if (confirmDeleteContact) {
      const deleteContactId = event.target.value;
      this.props.deleteContact(deleteContactId);
    }
    this.setState({
      searchTerm: "",
    });
  };

  // department functions
  handleAddNewDepartment = (event) => {
    this.setState({
      addingDepartment: true,
      departmentName: "",
    });
  };

  handleSubmitNewDepartment = (event) => {
    event.preventDefault();
    const newDepartment = {
      name: this.state.departmentName,
    };
    this.props.postDepartment(newDepartment);
    this.setState({
      addingDepartment: false,
      departmentName: "",
    });
  };

  handleEditThisDepartment = (event) => {
    const departmentId = event.target.value;
    const departments = this.props.data.departments;
    const department = departments.find((d) => d.id === departmentId);
    this.setState({
      targettedDepartmentId: departmentId,
      departmentName: department.name,
    });
  };

  handleSubmitDepartmentChange = (event) => {
    event.preventDefault();
    const updatedDepartmentId = this.state.targettedDepartmentId;
    const updatedDepartment = {
      name: this.state.departmentName,
    };
    this.props.patchDepartment(updatedDepartmentId, updatedDepartment);
    this.setState({
      targettedDepartmentId: "",
    });
  };

  handleCancelDepartmentChange = (event) => {
    this.setState({
      targettedDepartmentId: "",
      addingDepartment: false,
      departmentName: "",
    });
  };

  handleDeleteDepartment = (event) => {
    const confirmDeleteDepartment = window.confirm("Are you sure?");
    if (confirmDeleteDepartment) {
      const deleteDepartmentId = event.target.value;
      this.props.deleteDepartment(deleteDepartmentId);
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password,
    };
    this.props.loginUser(userData, this.props.history);
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });

    if (event.target.name === "searchTerm") {
      this.props.getSearchedContacts(event.target.value);
    }
  };

  render() {
    const { credentials } = this.props.user;
    const isAdmin = credentials.isAdmin;
    const { matchingSearchContacts, departments } = this.props.data;

    // departments
    const departmentsMarkup = departments.map(function (d) {
      const departmentContacts = matchingSearchContacts.filter(
        (c) => c.departmentId === d.id
      );

      return (
        <Department
          key={d.id}
          department={d}
          contacts={departmentContacts}
          handleEditThisDepartment={this.handleEditThisDepartment}
          handleDeleteDepartment={this.handleDeleteDepartment}
          handleAddNewContact={this.handleAddNewContact}
          handleSubmitNewContact={this.handleSubmitNewContact}
          handleEditThisContact={this.handleEditThisContact}
          handleSubmitContactChange={this.handleSubmitContactChange}
          handleCancelContactChange={this.handleCancelContactChange}
          handleDeleteContact={this.handleDeleteContact}
          handleChange={this.handleChange}
        />
      );
    }, this);

    return (
      <div>
        <h1>Contacts</h1>
        <input
          id="searchTerm"
          name="searchTerm"
          type="text"
          placeholder="Search"
          value={this.state.searchTerm}
          onChange={this.handleChange}
        />
        {isAdmin && (
          <button type="button" onClick={this.handleAddNewDepartment}>
            Add Department
          </button>
        )}

        {isAdmin && this.state.addingDepartment && (
          <AddDepartmentModal
            handleSubmit={this.handleSubmit}
            departmentName={this.state.departmentName}
            handleChange={this.handleChange}
            handleSubmitNewDepartment={this.handleSubmitNewDepartment}
            handleCancelDepartmentChange={this.handleCancelDepartmentChange}
          />
        )}

        {isAdmin && this.state.targettedDepartmentId !== "" && (
          <form noValidate onSubmit={this.handleSubmit}>
            <label htmlFor="departmentName">Update Department Name:</label>
            <input
              id="departmentName"
              name="departmentName"
              type="text"
              value={this.state.departmentName}
              onChange={this.handleChange}
            />
            <button type="button" onClick={this.handleSubmitDepartmentChange}>
              Change!
            </button>
            <button type="button" onClick={this.handleCancelDepartmentChange}>
              Cancel
            </button>
          </form>
        )}

        {isAdmin && this.state.addingContact && (
          <form noValidate onSubmit={this.handleSubmit}>
            <label htmlFor="contactDepartmentId">Department:</label>
            <select
              name="contactDepartmentId"
              onChange={this.handleChange}
              value={this.state.contactDepartmentId}
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <br />
            <label htmlFor="contactName">Name:</label>
            <input
              id="contactName"
              name="contactName"
              type="text"
              value={this.state.contactName}
              onChange={this.handleChange}
            />
            <br />
            <label htmlFor="contactImgUrl">ImgUrl:</label>
            <input
              id="contactImgUrl"
              name="contactImgUrl"
              type="text"
              value={this.state.contactImgUrl}
              onChange={this.handleChange}
            />
            <br />
            <label htmlFor="contactPhone">Phone:</label>
            <input
              id="contactPhone"
              name="contactPhone"
              type="text"
              value={this.state.contactPhone}
              onChange={this.handleChange}
            />
            <br />
            <label htmlFor="contactEmail">Email:</label>
            <input
              id="contactEmail"
              name="contactEmail"
              type="text"
              value={this.state.contactEmail}
              onChange={this.handleChange}
            />
            <br />
            <button type="button" onClick={this.handleSubmitNewContact}>
              Create contact!
            </button>
            <button type="button" onClick={this.handleCancelContactChange}>
              Cancel
            </button>
          </form>
        )}

        {isAdmin && this.state.targettedContactId !== "" && (
          <form noValidate onSubmit={this.handleSubmit}>
            <label htmlFor="contactDepartmentId">Department:</label>
            <select
              name="contactDepartmentId"
              onChange={this.handleChange}
              value={this.state.contactDepartmentId}
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <br />
            <label htmlFor="contactName">Name:</label>
            <input
              id="contactName"
              name="contactName"
              type="text"
              value={this.state.contactName}
              onChange={this.handleChange}
            />
            <br />
            <label htmlFor="contactImgUrl">ImgUrl:</label>
            <input
              id="contactImgUrl"
              name="contactImgUrl"
              type="text"
              value={this.state.contactImgUrl}
              onChange={this.handleChange}
            />
            <br />
            <label htmlFor="contactPhone">Phone:</label>
            <input
              id="contactPhone"
              name="contactPhone"
              type="text"
              value={this.state.contactPhone}
              onChange={this.handleChange}
            />
            <br />
            <label htmlFor="contactEmail">Email:</label>
            <input
              id="contactEmail"
              name="contactEmail"
              type="text"
              value={this.state.contactEmail}
              onChange={this.handleChange}
            />
            <br />
            <button type="button" onClick={this.handleSubmitContactChange}>
              Change!
            </button>
            <button type="button" onClick={this.handleCancelContactChange}>
              Cancel
            </button>
          </form>
        )}

        {departmentsMarkup}
      </div>
    );
  }
}

ContactPage.propTypes = {
  data: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  // departments
  getDepartments: PropTypes.func.isRequired,
  postDepartment: PropTypes.func.isRequired,
  patchDepartment: PropTypes.func.isRequired,
  deleteDepartment: PropTypes.func.isRequired,
  // contacts
  getContacts: PropTypes.func.isRequired,
  patchContact: PropTypes.func.isRequired,
  postContact: PropTypes.func.isRequired,
  deleteContact: PropTypes.func.isRequired,
  getSearchedContacts: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    data: state.data,
    user: state.user,
  };
};

export default connect(mapStateToProps, {
  // departments
  getDepartments,
  postDepartment,
  patchDepartment,
  deleteDepartment,
  // contacts
  getContacts,
  patchContact,
  postContact,
  deleteContact,
  // search
  getSearchedContacts,
})(ContactPage);
