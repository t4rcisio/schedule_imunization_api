# Desafio final Pitang

Módulo: API back-end

Para compilar por completo o projeto, é preciso baixar e executar dois repositório:

1: A API (esse)
2: O front-end [front](https://github.com/t4rcisio/schedule_imunization_consumer)

Preparando o ambiente de execução da API

Passo 1: 
    Clone o projeto 
        -> *git clone https://github.com/t4rcisio/schedule_imunization_api.git*

Passo 2:
    Modifique o arquivo .env-example
        -> Modifique o nome do arquivo para .env e adicione um link para o mongoDB cloud

Passo 3
    Instale as dependências:
        -> Na raiz do projeto, execute  *yarn install*

Passo 4
    Subindo o servidor
        -> Por padrão, a porta que o servidor irá usar é a 5000
        caso queira modificar, o parâmetro está no arquivo .env.
        Execute o comando *yarn dev*

Se tudo ocorrer bem, o servidor estará funcionando

A próxima etapa é subir o front-end, [clique aqui](https://github.com/t4rcisio/schedule_imunization_consumer)
