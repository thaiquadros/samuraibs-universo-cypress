// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('postUser', function (user) {
    cy.task('removeUser', user.email)
        .then(function (result) {
            console.log(result)
        })
    //codigo acima apaga o usuario por email no BD

    cy.request(
        'POST',
        'http://localhost:3333/users',
        user
    ).then(function (response) {
        expect(response.status).to.eq(200)
    })

    //codigo acima cadastra o usuario pela API (nome, email e senha)
})

Cypress.Commands.add('recoveryPass', function (email) {
    cy.request(
        'POST',
        'http://localhost:3333/password/forgot',
        { email: email } //ultimo campo email eh o equivalente a email da function
    ).then(function (response) {
        expect(response.status).to.eq(204)  //codigo recupera senha pela API (email)

        cy.task('findToken', email)
            .then(function (result) {
                //console.log(result.token) //faz consulta no BD pra pegar o token
                Cypress.env('recoveryToken', result.token)
            })
    })


})