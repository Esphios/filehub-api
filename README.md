# FileHub API

Este projeto consiste em uma API backend denominada FileHub, que permite a interação dos usuários com arquivos e diretórios de forma similar ao Google Docs. O objetivo deste projeto é fornecer uma plataforma para manipulação de dados armazenados em bancos de dados, não sendo necessário criar uma interface gráfica nem realizar o upload de arquivos reais, apenas representações em banco de dados.

## Tecnologias Utilizadas

- Node.js
- TypeScript
- Express.js
- Docker
- Banco de dados PostgreSQL

## Requisitos da Aplicação

- **Autenticação:** A aplicação utiliza JWT para autenticação de usuários.
- **Permissionamento:**
  - **Administrador:** Tem acesso de leitura, escrita, deleção e compartilhamento sobre todos os arquivos e diretórios.
  - **Criador:** Tem acesso de leitura, escrita, deleção e compartilhamento sobre todos os objetos criados por ele.
  - **Convidado:** Acesso de acordo com as permissões concedidas pelos perfis acima (possíveis leitura, escrita e deleção).
  - As permissões podem ser recursivas, contemplando diversos níveis de profundidade nos diretórios.

## Funcionalidades

- Criação, leitura, atualização e deleção (CRUD) de arquivos e diretórios (em desenvolvimento).
- Autenticação de usuários com JWT.
- Implementação de diferentes perfis de usuário (Administrador, Criador, Convidado) com diferentes níveis de permissões.
- Utilização de seeds para testes iniciais.
- Testes unitários automatizados (em desenvolvimento).
- Documentação (em desenvolvimento).

## Configuração e Uso

1. Clone o repositório.
2. Instale as dependências utilizando `npm install`.
3. Execute o ambiente utilizando Docker.

## Executando os Testes
(Em desenvolvimento)
Para executar os testes unitários automatizados, utilize o comando:

```bash
npm test
```
## Documentação da API

A documentação da API está em desenvolvimento.

## Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.

## Autores

Eduardo Ribeiro de Lima - Desenvolvedor

## Licença

Este projeto é licenciado sob a [MIT License](LICENSE).
