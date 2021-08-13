export default (data: any) => {
    return {
        inputedUser: {
            'Nome Completo': data.complete_name,
            'Data de Nascimento': data.birth_date,
             CPF: data.cpf,
             RG: data.rg
        },
        loggedUser: {
            Login: data.email,
            IP: ''
        }

    }
}
