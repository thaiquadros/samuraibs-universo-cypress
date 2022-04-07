//import faker from '@faker-js/faker'
import signupPage from '../support/pages/signup'

describe('cadastro', function () {

    context('quando o usuario e novato', function () {
        //definindo a massa de testes
        const user = {
            name: 'Fernando Papito',
            email: 'papito@samuraibs.com',
            password: 'pwd123'
        }
        before(function () { //removendo o usuario para que a massa seja sempre valida
            cy.task('removeUser', user.email)
                .then(function (result) {
                    console.log(result)
                })
        })
        it('deve cadastrar com sucesso', function () {

            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            cy.wait(2000)
            signupPage.toast.shouldHaveText('Agora você se tornou um(a) Samurai, faça seu login para ver seus agendamentos!')

        })
    })

    context('quando o email ja existe', function () {
        const user = {
            name: 'Joao Lucas',
            email: 'joao@samuraibs.com',
            password: 'pwd123',
            is_provider: true
        }
        before(function () {
            cy.task('removeUser', user.email)
                .then(function (result) {
                    console.log(result)
                })

            cy.request(
                'POST',
                'http://localhost:3333/users',
                user
            ).then(function (response) {
                expect(response.status).to.eq(200)
            })
        })

        it('nao deve cadastra o usuario', function () {

            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            cy.wait(2000)
            signupPage.toast.shouldHaveText('Email já cadastrado para outro usuário.')
        })
    })

    context('quando o email e incorreto', function () {
        const user = {
            name: 'Elizabeth Olsen',
            email: 'liza.yahoo.com',
            password: 'pwd123'
        }
        it('deve exibir mesagem de alerta', function () {
            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.alertHaveText('Informe um email válido')

        })
    })

    context('quando a senha e muito curta', function () {

        const passwords = ['1', '2a', 'ab3', 'abc4', 'ab#c5']

        beforeEach(function () {
            signupPage.go()
        })

        passwords.forEach(function (p) {
            it('nao deve cadastrar com a senha: ' + p, function () {
                const user = {
                    name: 'Jason Friday',
                    email: 'jason@gmail.com',
                    password: p
                }
                signupPage.form(user)
                signupPage.submit()
            })
        })

        afterEach(function () {
            signupPage.alertHaveText('Pelo menos 6 caracteres')
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
                signupPage.alertHaveText(alert)
            })
        })
    })

})
