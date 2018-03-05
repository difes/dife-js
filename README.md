<img src="https://s3-sa-east-1.amazonaws.com/dife/assets/img/logo-inverse.png"/>

# Dife Panel Javascript

Você pode encontrar a documentação mais detalhada em nosso [site](https://dife.com.br/doc).

## Instalação

Você tem várias opções de instalação da nossa biblioteca Javascript:

Via npm

```bash
npm install dife-js --save
```

Via Bower

```bash
bower install dife-js --save
```

Utilizando direto de nosso servidor 

```html
<script src="https://dife.com.br/assets/js/dife-0.0.7.min.js"></script>
```

## Documentação da API

Para mais detalhes, acesse a documentação em nosso [site](https://dife.com.br/doc).

### Listando as Funcionalidades

O método `listFeatures()` retorna uma lista com as funcionalidades cadastradas no site. Para utilizá-lo é necessário criar um instância do objeto `Dife`.

```javascript
var dife = new Dife('CHAVE_PUBLICA_SITE');

dife.listFeatures(function (response) {
  // sucesso
});
```

### Listando Registros

O método `listValues()` retorna uma lista (com paginação) dos registros de uma determinada funcionalidade. Para utilizá-lo é necessário criar um instância do objeto `Dife`.

```javascript
var dife = new Dife('CHAVE_PUBLICA_SITE');

dife.listValues(id, function (response) {
  // sucesso
});
```

### Enviando Formulário

O método `form()` envia os dados para o preenchimento de um determinado formulário. Para utilizá-lo é necessário criar um instância do objeto `Dife`.

```javascript
var dife = new Dife('CHAVE_PUBLICA_SITE');

dife.form(id, object, function (response) {
  // sucesso
});
```

### Template

O método `template()` é utilizado para facilitar a renderização, caso você não utilize alguma biblioteca/framework que já possuia (como AngularJS). É um método estático, portando não deve ser chamado via intância, por não necessitar da chave.


```javascript
var object = {
  title: 'Título de exemplo',
  description: 'Descrição de exemplo'
};

var html = Dife.template('EXAMPLE', object);
document.getElementById('local').innerHTML = html;
```


Template HTML:

```html
<div id="local"></div>

<script type="text/dife" id="EXAMPLE">
  <div>
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
  </div>
</script>
```

O template deve estar dentro da tag `<body>`. Utilizamos a tag `<script>` com o atributo `type="text/dife"` é ignorado pelo navegador. Ao utilizar a função `Dife.template()` você deve adicionar o HTML gerado na página.