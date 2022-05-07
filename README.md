# Plataforma de agendamento de vacina

Módulo: API back-end

Para compilar por completo o projeto, é preciso baixar e executar dois repositórios:

->	A API (atual) <br/>
->	O front-end [front](https://github.com/t4rcisio/schedule_imunization_consumer)



Preparando o ambiente de execução da API

Passo 1<br/>
-> Clone o projeto
- *git clone https://github.com/t4rcisio/schedule_imunization_api.git*

Passo 2<br/>
-> Modifique o arquivo .env-example
-  Modifique o nome do arquivo para .env e adicione um link para o mongoDB cloud
Exemplo de banco com algums dados carregados; "mongodb+srv://pitang:jNJzTpo2XRn73TCa@gotamagica-cluster.tosaw.mongodb.net/data-sus?retryWrites=true&w=majority"

<br/>

Passo 3 <br/>
-> Instale as dependências:
- Na raiz do projeto, execute  *yarn install*

Passo 4 <br/>
-> Subindo o servidor
- Por padrão, a porta que o servidor irá usar é a 5000<br />
        caso queira modificar, o parâmetro está no arquivo .env.<br />
        Execute o comando *yarn dev*

Se tudo ocorrer bem, o servidor estará funcionando<br />

A próxima etapa é subir o front-end, [clique aqui](https://github.com/t4rcisio/schedule_imunization_consumer)<br />
