//Requisição assincrona para pegar os dados do JSON "Webservice"
var ajax = new XMLHttpRequest()

ajax.open('GET', './dados.json', true)
ajax.send()
ajax.onreadystatechange = function () {
  let conteudo = document.getElementById('conteudo')

  if (this.readyState == 4 && this.status == 200) {
    let data_json = JSON.parse(this.responseText)

    if (data_json.length == 0) {
      conteudo.innerHTML = template_alerta(
        'Não há produtos cadastrados!',
        'warning'
      )
    } else {
      //Desenhar os produtos (Cards)
      let conteudo_html = ''

      //Desenhar categorias
      for (let i = 0; i < data_json.length; i++) {
        conteudo_html += template_categoria(data_json[i].categoria)

        if (data_json[i].produtos.length == 0) {
          conteudo_html += template_alerta(
            'Não há produtos cadastrados para esta categoria!',
            'warning'
          )
        } else {
          //Desenhar os cards dos produtos

          conteudo_html += '<div class="row">'

          for (let j = 0; j < data_json[i].produtos.length; j++) {
            conteudo_html += template_produto(
              data_json[i].produtos[j].id,
              data_json[i].produtos[j].img,
              data_json[i].produtos[j].nome,
              data_json[i].produtos[j].descricao,
              data_json[i].produtos[j].preco,
              data_json[i].produtos[j].url_compra
            )
          }

          conteudo_html += '</div>'
        }
      }
      cache_dinamico(data_json)
      conteudo.innerHTML = conteudo_html
    }
  }
}

//##### Carrinho ######

var itens_carrinho = [{}]

addProduto = function (id, quant) {
  testar_produto = false
  itens_carrinho.forEach((object) => {
    if (object.id === id) {
      testar_produto = true
      return false
    }
  })

  if (testar_produto == false) {
    itens_carrinho.push({ id: id, quant: quant })
  }

  console.log(itens_carrinho)
}

montarCarrinho = function () {}

//##### Cache Dinâmico ######

var cache_dinamico = function (data_json) {
  caches.delete('Bazar_Natura_dinamico').then(function () {
    if (data_json.length > 0) {
      var files = ['dados.json']

      for (let i = 0; i < data_json.length; i++) {
        if (data_json[i].produtos.length > 0) {
          for (let j = 0; j < data_json[i].produtos.length; j++) {
            if (files.indexOf(data_json[i].produtos[j].img) == -1) {
              files.push(data_json[i].produtos[j].img)
            }
          }
        }
      }
    }

    caches.open('Bazar_Natura_dinamico').then(function (cache) {
      cache.addAll(files).then(function () {
        console.log('Cache dinâmico adicionado com sucesso!')
      })
    })
  })
}

//##### Template Engine ######

//Alerta
template_alerta = function (mensagem, tipo) {
  return (
    '<div class="alert alert-' + tipo + '" role="alert">' + mensagem + '</div>'
  )
}

//Categoria
template_categoria = function (titulo) {
  return (
    '<div class="row">' +
    '<div class="col-12">' +
    '<h1 class="categoria"><strong>Categoria:</strong> ' +
    titulo +
    '</h1>' +
    '</div>' +
    '</div>'
  )
}

//Card
template_produto = function (id, img, nome, descricao, preco, url) {
  return (
    '<div class="col-12 col-md-4">' +
    '<div class="card">' +
    '<div class="img_produto"><img src="' +
    img +
    '" class="card-img-top" alt="produto 1"></div>' +
    '<div class="card-body">' +
    '<h5 class="card-title">' +
    nome +
    '</h5>' +
    '<p class="card-text">' +
    descricao +
    '</p>' +
    '<strong>R$ ' +
    preco +
    '</strong>&nbsp;<input type="number" min="1" max="99" value="1" id="quat_' +
    id +
    '" class="input_quant">&nbsp;<button onClick="javascript:addProduto(' +
    id +
    ",document.getElementById('quat_" +
    id +
    '\').value);" class="btn btn-primary btAddCarrinho">Adicionar ao Carrinho</button>' +
    '</div>' +
    '</div>' +
    '</div>'
  )
}

//##### Botão de Instalação ######

let janelaInstalacao = null

const btInstall = document.getElementById('btInstall')

window.addEventListener('beforeinstallprompt', gravarJanela)

function gravarJanela(evt) {
  janelaInstalacao = evt
}

let inicializarInstalacao = function () {
  btInstall.removeAttribute('hidden')
  btInstall.addEventListener('click', function () {
    janelaInstalacao.prompt()

    janelaInstalacao.userChoice.then((choice) => {
      if (choice.outcome === 'accepted') {
        console.log('Usuário instalou o app!')
      } else {
        console.log('Usuário NÃO instalou o app!')
      }
    })
  })
}
