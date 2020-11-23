function populateUFs(){
    const ufSelect = document.querySelector("select[name=uf]")
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then(res => res.json() )
    .then(states => {
        for(const state of states){
            ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
        }

    }   )
}
populateUFs()


function getCities(event){
    const citySelect = document.querySelector("select[name=city]")
    const stateInput = document.querySelector("input[name=state]")

    const ufValue = event.target.value

    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`
    
    citySelect.innerHTML = "<option value>Selecione a Cidade</option>"  /*Ele limpa o campo */
    citySelect.disabled = true

    fetch(url)
    .then(res => res.json() )
    .then(cities => {
        
        for(const city of cities){
            citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
        }

        citySelect.disabled = false

    }   )
}


document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)

    //Items de coleta
    //Pegar todos os li's

    const itemsToCollect = document.querySelectorAll(".items-grid li")

    for(const item of itemsToCollect){
        item.addEventListener("click", handleSelectedItem)
    }
    
    
    const collectedItems = document.querySelector("input[name=items")

    let selectedItems = []
    function handleSelectedItem(event){
        const itemLi = event.target
        //ad/remove or toggle uma classe com JS

        
        
        itemLi.classList.toggle("selected")
        
        const itemId = itemLi.dataset.id
        
        console.log('ITEM ID: ', itemId)
        
        
        //verificar se existe itens selecionados
        //caso tenha, pegar os itens selecionados
        const alreadySelected = selectedItems.findIndex(item =>{
            const itemFound = item == itemId //True ou false
            return itemFound
        })
        //Se já estiver selecionado 
        if(alreadySelected >= 0){
            //Tirar da seleção
            const filteredItems = selectedItems.filter(item =>{
                const itemIsDiferent = item != itemId
                return itemIsDiferent
            })
            selectedItems = filteredItems
        }else{
            //Se não estiver selecionado, adicionar a seleção
            selectedItems.push(itemId)
            
        }

        console.log('selectedItems: ',selectedItems)
        //Atualizar o campo escondido com items selecionados
        collectedItems.value = selectedItems
    }

