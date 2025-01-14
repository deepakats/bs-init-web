import { teamTabSelector } from "../../constants/selectors/team";
import { fake } from "../../fixtures/fake";

export const deleteTestUser = (user) => {
  //delete dummy user
  cy.get(teamTabSelector.searchTeamMemberPlaceholder).clear().type(user);
  cy.get(teamTabSelector.searchIcon).click();
  cy.get(teamTabSelector.deleteTeamMemberButton).first().click();
};

export const addNewUser = (role) => {
  const firstName = fake.firstName
  const lastName = fake.lastName
  const email = fake.email
  cy.get(teamTabSelector.addNewUserButton).click();
  cy.get(teamTabSelector.newMemberFirstName).type(firstName);
  cy.get(teamTabSelector.newMemberLastname).type(lastName);
  cy.get(teamTabSelector.newMemberEmail).type(email);
  cy.get(teamTabSelector.adminRadioButton).check();

  if (role == "admin") {
    cy.get(teamTabSelector.adminRadioButton).check();
  } else {
    cy.get(teamTabSelector.employeeRadioButton).check();
  }
  cy.get(teamTabSelector.sendInviteButton).click();
  deleteTestUser(firstName)
};
