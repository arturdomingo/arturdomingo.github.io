# Portfólio — Artur Domingos

Portfólio profissional pessoal, construído com **HTML, CSS e JavaScript puros**
(sem frameworks nem dependências). Design minimalista a preto e branco, com tema
claro/escuro e foco em acessibilidade.

**Site online:** https://arturdomingo.github.io/

## Estrutura

| Ficheiro      | Descrição                                            |
| ------------- | ---------------------------------------------------- |
| `index.html`  | Estrutura semântica e conteúdo do site               |
| `styles.css`  | Estilos, layout responsivo e temas                   |
| `script.js`   | Tema, menu, animações, validação e envio do formulário |

## Funcionalidades

- Tema claro/escuro com preferência guardada (`localStorage`)
- Menu mobile acessível (fecha com `Esc`, devolve o foco)
- Animação de entrada das secções (respeita `prefers-reduced-motion`)
- Navegação com link ativo conforme a secção visível
- Ligação automática aos repositórios do GitHub
- Formulário de contato com validação e envio por e-mail (Web3Forms)

## Formulário de contato (Web3Forms)

O envio de e-mail usa o [Web3Forms](https://web3forms.com/), que funciona sem
backend (ideal para GitHub Pages). Para ativar:

1. Acede a https://web3forms.com/
2. Introduz `arturxandeldomingos@gmail.com` e clica em **Create Access Key**
3. Copia a chave recebida no e-mail
4. Em `index.html`, substitui o valor de `access_key`:

   ```html
   <input type="hidden" name="access_key" id="access-key" value="COLE_AQUI_A_SUA_ACCESS_KEY">
   ```

5. Envia a alteração:

   ```bash
   git add -A
   git commit -m "Configura access key do formulário"
   git push
   ```

> A access key é uma chave **pública** (identifica apenas o destinatário), por
> isso é normal ficar visível no HTML. O e-mail não aparece no código.

## Publicação

Hospedado no **GitHub Pages** a partir da branch `main` (raiz). Cada `git push`
para `main` publica automaticamente.
