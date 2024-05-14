const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];

// abrir o modal do carrinho
cartBtn.addEventListener("click", function() {
    updateCartModal();
    cartModal.style.display = "flex"
})

//fechar o modal quando clicar fora
cartModal.addEventListener("click", function(event) {
    if (event.target ==cartModal){
        cartModal.style.display = "none"
    }
})
closeModalBtn.addEventListener("click", function() {
    cartModal.style.display = "none"
})

menu.addEventListener("click", function(event) {
    let parantButton = event.target.closest(".add-to-cart-btn")

    if (parantButton) {
        const name = parantButton.getAttribute("data-name")
        const price = parseFloat(parantButton.getAttribute("data-price"))

       //adicionar no carrinho.
       addToCart(name, price)
    }
})

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name == name)

    if (existingItem) {
        //se o item já existe, aumenta apenas a quantidade + 1
        existingItem.quantity += 1

    }else {

        cart.push({
            name: name,
            price: price,
            quantity: 1,
        })
    }  
    
    updateCartModal()
}

//atualiza o carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("style-pedido");

        cartItemElement.innerHTML = `
        <div class="style-js-pd">
            <div>
                <p class="style-js-titulo">${item.name}</p>
                <p class="style-js-paragrafo">Qtd: ${item.quantity}</p>
                <p class="style-js-paragrafo">R$ ${item.price.toFixed(2)}</p>
            </div>

                <button class="remove-from-cart-btn" data-name="${item.name}">Remover</button>


        </div>
        `
        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)

    });

    cartTotal.textContent = total.toLocaleString("pt-br", {style: "currency", currency: "BRL"});

    cartCounter.innerHTML = cart.length;

}

//Função para remover o item do carrinho
cartItemsContainer.addEventListener("click", function(event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function  removeItemCart(name) {
    const index = cart.findIndex(item => item.name == name);

    if (index != -1) {
        const item = cart[index];
       if (item.quantity > 1) {
        item.quantity -= 1
        updateCartModal()
        return;
       }

       cart.splice(index, 1);
       updateCartModal()
    }
}

addressInput.addEventListener("input", function(event) {
    let inputValue = event.target.value;
   
    if(inputValue != "") {
        addressInput.style.removeProperty("border")
        addressWarn.style.removeProperty("display")
    }
})

checkoutBtn.addEventListener("click", function() {

    const isOpen = abrirRestaurante();
    if(!isOpen) {
        Toastify({
            text: "Ops o restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
          }).showToast();
          
        return;
    }

    if(cart.length == 0) return;
    if(addressInput.value == "") {
        addressWarn.style.display = "flex";
        addressInput.style.border = "1px solid red"
        return;
    }

    //Enviar o pedido para api whats

    const cartItems = cart.map((item) => {
        return (
            ` ${item.name} quantidade: (${item.quantity})  Preço: R$ ${item.price} | `
    )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "8186154739"

    window.open(`https://wa.me/${phone}?text=${message} Total: ${cartTotal.textContent} | Endereço: ${addressInput.value} `, "_blank")

    cart = [];
    updateCartModal();

})

//Verificar a hora e manipular o card horario
function abrirRestaurante() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
    //True = restaurante esta aberto
}

const spanItem = document.getElementById("span2")
const isOpen = abrirRestaurante();

if(isOpen) {
    spanItem.style.backgroundColor = "rgb(19, 209, 19);"
}else {
    spanItem.style.backgroundColor = "red"
}