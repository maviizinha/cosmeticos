let modalKey = 0

let quantcosmeticos = 1

let cart = []

const seleciona = (elemento) => document.querySelector(elemento)
const selecionaTodos = (elemento) => document.querySelectorAll(elemento)

const formatoReal = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const formatoMonetario = (valor) => {
    if(valor) {
        return valor.toFixed(2)
    }
}

const abrirModal = () => {
    seleciona('.cosmeticoWindowArea').style.opacity = 0
    seleciona('.cosmeticoWindowArea').style.display = 'flex'
    setTimeout(() => seleciona('.cosmeticoWindowArea').style.opacity = 1, 150)
}

const fecharModal = () => {
    seleciona('.cosmeticoWindowArea').style.opacity = 0
    setTimeout(() => seleciona('.cosmeticoWindowArea').style.display = 'none', 500)
}

const botoesFechar = () => {
    selecionaTodos('.cosmeticoInfo--cancelButton, .cosmeticoInfo--cancelMobileButton').forEach( (item) => item.addEventListener('click', fecharModal) )
}

const preencheDadosDascosmeticos = (cosmeticoItem, item, index) => {

	cosmeticoItem.setAttribute('data-key', index)
    cosmeticoItem.querySelector('.cosmetico-item--img img').src = item.img
    cosmeticoItem.querySelector('.cosmetico-item--price').innerHTML = formatoReal(item.price[2])
    cosmeticoItem.querySelector('.cosmetico-item--name').innerHTML = item.name
    cosmeticoItem.querySelector('.cosmetico-item--desc').innerHTML = item.description
}

const preencheDadosModal = (item) => {
    seleciona('.cosmeticoBig img').src = item.img
    seleciona('.cosmeticoInfo h1').innerHTML = item.name
    seleciona('.cosmeticoInfo--desc').innerHTML = item.description
    seleciona('.cosmeticoInfo--actualPrice').innerHTML = formatoReal(item.price[2])
}

const pegarKey = (e) => {

    let key = e.target.closest('.cosmetico-item').getAttribute('data-key')
    console.log('cosmetico clicada ' + key)
    console.log(cosmeticoJson[key])

    quantcosmeticos = 1

    modalKey = key

    return key
}

const preencherTamanhos = (key) => {

    seleciona('.cosmeticoInfo--size.selected').classList.remove('selected')


    selecionaTodos('.cosmeticoInfo--size').forEach((size, sizeIndex) => {

        (sizeIndex == 2) ? size.classList.add('selected') : ''
        size.querySelector('span').innerHTML = cosmeticoJson[key].sizes[sizeIndex]
    })
}

const escolherTamanhoPreco = (key) => {

    selecionaTodos('.cosmeticoInfo--size').forEach((size, sizeIndex) => {
        size.addEventListener('click', (e) => {

            seleciona('.cosmeticoInfo--size.selected').classList.remove('selected')

            size.classList.add('selected')

            seleciona('.cosmeticoInfo--actualPrice').innerHTML = formatoReal(cosmeticoJson[key].price[sizeIndex])
        })
    })
}

const mudarQuantidade = () => {

    seleciona('.cosmeticoInfo--qtmais').addEventListener('click', () => {
        quantcosmeticos++
        seleciona('.cosmeticoInfo--qt').innerHTML = quantcosmeticos
    })

    seleciona('.cosmeticoInfo--qtmenos').addEventListener('click', () => {
        if(quantcosmeticos > 1) {
            quantcosmeticos--
            seleciona('.cosmeticoInfo--qt').innerHTML = quantcosmeticos	
        }
    })
}

const adicionarNoCarrinho = () => {
    seleciona('.cosmeticoInfo--addButton').addEventListener('click', () => {
        console.log('Adicionar no carrinho')

    	console.log("cosmetico " + modalKey)

	    let size = seleciona('.cosmeticoInfo--size.selected').getAttribute('data-key')
	    console.log("Tamanho " + size)

    	console.log("Quant. " + quantcosmeticos)

        let price = seleciona('.cosmeticoInfo--actualPrice').innerHTML.replace('R$&nbsp;', '')

	    let identificador = cosmeticoJson[modalKey].id+'t'+size

        let key = cart.findIndex( (item) => item.identificador == identificador )
        console.log(key)

        if(key > -1) {
            cart[key].qt += quantcosmeticos
        } else {
            let cosmetico = {
                identificador,
                id: cosmeticoJson[modalKey].id,
                size, 
                qt: quantcosmeticos,
                price: parseFloat(price)
            }
            cart.push(cosmetico)
            console.log(cosmetico)
            console.log('Sub total R$ ' + (cosmetico.qt * cosmetico.price).toFixed(2))
        }

        fecharModal()
        abrirCarrinho()
        atualizarCarrinho()
    })
}

const abrirCarrinho = () => {
    console.log('Qtd de itens no carrinho ' + cart.length)
    if(cart.length > 0) {
	    seleciona('aside').classList.add('show')
        seleciona('header').style.display = 'flex'
    }

    seleciona('.menu-openner').addEventListener('click', () => {
        if(cart.length > 0) {
            seleciona('aside').classList.add('show')
            seleciona('aside').style.left = '0'
        }
    })
}

const fecharCarrinho = () => {
    seleciona('.menu-closer').addEventListener('click', () => {
        seleciona('aside').style.left = '100vw'
        seleciona('header').style.display = 'flex'
    })
}

const atualizarCarrinho = () => {
	seleciona('.menu-openner span').innerHTML = cart.length
	
	if(cart.length > 0) {

		seleciona('aside').classList.add('show')

		seleciona('.cart').innerHTML = ''

		let subtotal = 0
		let desconto = 0
		let total    = 0

		for(let i in cart) {
			let cosmeticoItem = cosmeticoJson.find( (item) => item.id == cart[i].id )
			console.log(cosmeticoItem)

        	subtotal += cart[i].price * cart[i].qt

			let cartItem = seleciona('.models .cart--item').cloneNode(true)
			seleciona('.cart').append(cartItem)

			let cosmeticoSizeName = cart[i].size

			let cosmeticoName = `${cosmeticoItem.name} (${cosmeticoSizeName})`

			cartItem.querySelector('img').src = cosmeticoItem.img
			cartItem.querySelector('.cart--item-nome').innerHTML = cosmeticoName
			cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt

			cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
				console.log('Clicou no botão mais')
				cart[i].qt++
				atualizarCarrinho()
			})

			cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
				console.log('Clicou no botão menos')
				if(cart[i].qt > 1) {
					cart[i].qt--
				} else {
					cart.splice(i, 1)
				}

                (cart.length < 1) ? seleciona('header').style.display = 'flex' : ''

				atualizarCarrinho()
			})

			seleciona('.cart').append(cartItem)

		} 
		desconto = subtotal * 0
		total = subtotal - desconto

		seleciona('.subtotal span:last-child').innerHTML = formatoReal(subtotal)
		seleciona('.desconto span:last-child').innerHTML = formatoReal(desconto)
		seleciona('.total span:last-child').innerHTML    = formatoReal(total)

	} else {
		seleciona('aside').classList.remove('show')
		seleciona('aside').style.left = '100vw'
	}
}

const finalizarCompra = () => {
    seleciona('.cart--finalizar').addEventListener('click', () => {
        console.log('Finalizar compra')
        seleciona('aside').classList.remove('show')
        seleciona('aside').style.left = '100vw'
        seleciona('header').style.display = 'flex'
    })
}

cosmeticoJson.map((item, index ) => {
    let cosmeticoItem = document.querySelector('.models .cosmetico-item').cloneNode(true)
    seleciona('.cosmetico-area').append(cosmeticoItem)

    preencheDadosDascosmeticos(cosmeticoItem, item, index)
    
    cosmeticoItem.querySelector('.cosmetico-item a').addEventListener('click', (e) => {
        e.preventDefault()
        console.log('Clicou na cosmetico')

        let chave = pegarKey(e)

        abrirModal()

        preencheDadosModal(item)

        preencherTamanhos(chave)

		seleciona('.cosmeticoInfo--qt').innerHTML = quantcosmeticos

        escolherTamanhoPreco(chave)

    })

    botoesFechar()

}) 
mudarQuantidade()

adicionarNoCarrinho()
atualizarCarrinho()
fecharCarrinho()
finalizarCompra()
