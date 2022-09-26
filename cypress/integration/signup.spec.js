//import faker from '@faker-js/faker'
import signupPage from '../support/pages/signup'

describe('cadastro', function () {

    before(function(){
        cy.fixture('signup.json').then(function(signup){ //colocar .json eh opicional
            this.success = signup.success
            this.email_dup = signup.email_dup
            this.email_inv = signup.email_inv
            this.short_password = signup.short_password
        })
    })

    context('quando o usuario e novato', function () {

        before(function () { //removendo o usuario para que a massa seja sempre valida
            cy.task('removeUser', this.success.email)
                .then(function (result) {
                    console.log(result)
                })
        })
        it('deve cadastrar com sucesso', function () {

            signupPage.go()
            signupPage.form(this.success)
            signupPage.submit()
            cy.wait(2000)
            signupPage.toast.shouldHaveText('Agora você se tornou um(a) Samurai, faça seu login para ver seus agendamentos!')

        })
    })

    context('quando o email ja existe', function () {

        before(function () {
            cy.postUser(this.email_dup)
        })

        it('nao deve cadastra o usuario', function () {

            signupPage.go()
            signupPage.form(this.email_dup)
            signupPage.submit()
            cy.wait(2000)
            signupPage.toast.shouldHaveText('Email já cadastrado para outro usuário.')
        })
    })

    context('quando o email e incorreto', function () {

        it('deve exibir mesagem de alerta', function () {
            signupPage.go()
            signupPage.form(this.email_inv)
            signupPage.submit()
            signupPage.alert.haveText('Informe um email válido')

        })
    })

    context('quando a senha e muito curta', function () {

        const passwords = ['1', '2a', 'ab3', 'abc4', 'ab#c5']

        beforeEach(function () {
            signupPage.go()
        })

        passwords.forEach(function (p) {
            it('nao deve cadastrar com a senha: ' + p, function () {

                this.short_password.password = p

                signupPage.form(this.short_password)
                signupPage.submit()
            })
        })

        afterEach(function () {
            signupPage.alert.haveText('Pelo menos 6 caracteres')
        })
    })

    context('quando nao preencho nenhum dos campos', function () {
        const alertMessages = [
            'Nome é obrigatório',
            'E-mail é obrigatório',
            'Senha é obrigatória'
        ]
        before(function () {
            signupPage.go()
            signupPage.submit()
        })

        alertMessages.forEach(function (alert) {
            it('deve exibir ' + alert.toLowerCase(), function () {
                signupPage.alert.haveText(alert)
            })
        })
    })

})
