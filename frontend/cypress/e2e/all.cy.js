describe('Fake Personal Data Generator', () => {
  beforeEach(() => {
    // Visit the application before each test
    cy.visit('/');
  });

  it('should generate a single person with full data', () => {
    // Scenario 1: Generate a single person with full data
    cy.get('#chkPerson').check();
    cy.get('#txtNumberPersons').clear().type('1');
    cy.get('#frmGenerate').submit();

    // Check if the output contains the expected data
    cy.get('#output').should('not.have.class', 'hidden');
    cy.get('.firstNameValue').should('not.have.class', 'hidden');
    cy.get('.lastNameValue').should('not.have.class', 'hidden');
    cy.get('.genderValue').should('not.have.class', 'hidden');
    cy.get('.dobValue').should('not.have.class', 'hidden');
    cy.get('.cprValue').should('not.have.class', 'hidden');
    cy.get('.streetValue').should('not.have.class', 'hidden');
    cy.get('.townValue').should('not.have.class', 'hidden');
    cy.get('.phoneNumberValue').should('not.have.class', 'hidden');
  });

  it('should generate only CPR', () => {
    // Scenario 2: Generate CPR only
    cy.get('#chkPartialOptions').check();
    cy.get('#cmbPartialOptions').select('cpr');
    cy.get('#frmGenerate').submit();

    // Check if the output contains only CPR
    cy.get('#output').should('not.have.class', 'hidden');
    cy.get('.cprValue').should('not.have.class', 'hidden');
    cy.get('.firstNameValue').should('have.class', 'hidden');
    cy.get('.genderValue').should('have.class', 'hidden');
    cy.get('.dobValue').should('have.class', 'hidden');
  });

  it('should generate name and gender only', () => {
    // Scenario 3: Generate name and gender
    cy.get('#chkPartialOptions').check();
    cy.get('#cmbPartialOptions').select('name-gender');
    cy.get('#frmGenerate').submit();

    // Check if the output contains name and gender only
    cy.get('#output').should('not.have.class', 'hidden');
    cy.get('.firstNameValue').should('not.have.class', 'hidden');
    cy.get('.genderValue').should('not.have.class', 'hidden');
    cy.get('.cprValue').should('have.class', 'hidden');
    cy.get('.dobValue').should('have.class', 'hidden');
  });

  it('should generate name, gender, and date of birth', () => {
    // Scenario 4: Generate name, gender, and date of birth
    cy.get('#chkPartialOptions').check();
    cy.get('#cmbPartialOptions').select('name-gender-dob');
    cy.get('#frmGenerate').submit();

    // Check if the output contains name, gender, and date of birth
    cy.get('#output').should('not.have.class', 'hidden');
    cy.get('.firstNameValue').should('not.have.class', 'hidden');
    cy.get('.genderValue').should('not.have.class', 'hidden');
    cy.get('.dobValue').should('not.have.class', 'hidden');
    cy.get('.cprValue').should('have.class', 'hidden');
  });

  it('should generate CPR, name, and gender', () => {
    // Scenario 5: Generate CPR, name, and gender
    cy.get('#chkPartialOptions').check();
    cy.get('#cmbPartialOptions').select('cpr-name-gender');
    cy.get('#frmGenerate').submit();

    // Check if the output contains CPR, name, and gender
    cy.get('#output').should('not.have.class', 'hidden');
    cy.get('.cprValue').should('not.have.class', 'hidden');
    cy.get('.firstNameValue').should('not.have.class', 'hidden');
    cy.get('.genderValue').should('not.have.class', 'hidden');
    cy.get('.dobValue').should('have.class', 'hidden');
  });

  it('should generate an address', () => {
    // Scenario 6: Generate an address
    cy.get('#chkPartialOptions').check();
    cy.get('#cmbPartialOptions').select('address');
    cy.get('#frmGenerate').submit();

    // Check if the output contains address
    cy.get('#output').should('not.have.class', 'hidden');
    
    // Validate the street and town values are displayed and not hidden
    cy.get('.streetValue')
      .should('not.have.class', 'hidden')
      .and('not.be.empty');

    cy.get('.townValue')
      .should('not.have.class', 'hidden')
      .and('not.be.empty');
});

  it('should generate a phone number', () => {
    // Scenario 7: Generate a phone number
    cy.get('#chkPartialOptions').check();
    cy.get('#cmbPartialOptions').select('phone');
    cy.get('#frmGenerate').submit();

    // Check if the output contains phone number
    cy.get('#output').should('not.have.class', 'hidden');
    cy.get('.phoneNumberValue').should('not.have.class', 'hidden');
  });

  it('should generate 3 persons when 3 is selected', () => {
    // Scenario 8: Generate multiple persons (e.g., 3 persons)
    cy.get('#chkPerson').check();
    cy.get('#txtNumberPersons').clear().type('3');
    cy.get('#frmGenerate').submit();

    // Wait for the API response
    cy.intercept('GET', '**/bulk/3').as('getMultiplePersons');

    // Check if the output contains 3 person cards
    cy.get('#output').should('not.have.class', 'hidden');
    cy.get('.personCard').should('have.length', 3);

    // Optionally: Check if each person card contains valid data
    cy.get('.personCard').each(($el) => {
        cy.wrap($el).find('.cprValue').should('not.be.empty');
        cy.wrap($el).find('.firstNameValue').should('not.be.empty');
        cy.wrap($el).find('.lastNameValue').should('not.be.empty');
        cy.wrap($el).find('.genderValue').should('not.be.empty');
        cy.wrap($el).find('.dobValue').should('not.be.empty');
        cy.wrap($el).find('.streetValue').should('not.be.empty');
        cy.wrap($el).find('.townValue').should('not.be.empty');
        cy.wrap($el).find('.phoneNumberValue').should('not.be.empty');
    });
});
});
