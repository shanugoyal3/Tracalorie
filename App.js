// will make controllers for item ui ,App and storage

// Storage Controller
const StorageCtrl = (function(){
    
    
    // Public Methods
    return {

      storeItems: function(item){
          // lets take an aaray
          let items;
          // check if there is any item in local Sotrage 
          if(localStorage.getItem('items') === null){
            items = [];
            items.push(item)
            localStorage.setItem('items',JSON.stringify(items))
          }else {
            items = JSON.parse(localStorage.getItem('items'))

            // add new Item
            items.push(item)
            localStorage.setItem('items',JSON.stringify(items))


          }
      },

      getItemsFromStorage : function (){
          let items;
        if(localStorage.getItem('items') === null) {
            items = []
        }
        else {
          items = JSON.parse(localStorage.getItem('items'))
        }
        return items
      },

      updateItemStorage : function(updatedItem){
          let items = JSON.parse(localStorage.getItem('items'))

          items.forEach(function(item,index){
              if(updatedItem.id === item.id){
                items.splice(index,1,updatedItem)
              }
          })
          // reset the local storage 
          localStorage.setItem('items',JSON.stringify(items))
      },

      deleteItemFromStorage : function(id){
        let items = JSON.parse(localStorage.getItem('items'))

        items.forEach(function(item,index){
            if(id === item.id){
              items.splice(index,1)
            }
        })
        // reset the local storage 
        localStorage.setItem('items',JSON.stringify(items))
      },
      clearAllItemsFromStorage : function(){
        // let items = JSON.parse(localStorage.getItem('items'))

        // there is a `function of lS removeItems 
        localStorage.removeItem('items')
      }

    }
})()




// Item Controller
const ItemCtrl = (function(){
  // it takes the id meak name and calories data whenever an item gets added
  // it should have an id
  // make constructor for this 
  const Item = function(id,name,calories){
    this.id=id
    this.name=name
    this.calories=calories
  }

  // Data Structure/State
  // Basically how the react or angular works on this we are implementing 
  // in vanilla JS Data Structure means when we add the data then how it will
  // get stored and in which data structure 

  const data = {
    // items : [
    //   // somehardcoded values
    //   // {id:0,name:'Steak Dinner',calories:1200},
    //   // {id:1,name:'Cookie',calories:400},
    //   // {id:2,name:'Eggs',calories:300}
    //   // if we comment the above hadrcoded data still the ui list line is present
    //   // so to hide that list will make hidelist function
    // ],

    items : StorageCtrl.getItemsFromStorage(),
    // currentitem is for when we want to update any item from UI list
    // then that item to be set as current and its data to be populated in UI
    // fields for Edit
    currentItem : null,
    totalcalories : 0
  }
  // we know as the above parts are private in Module Pattern so we should have
  // return for public things to access above

  return {
    // will make a getItem  method for fecthing the above hardcoded
    // data and bind it into the list
    getItems : function (){
      return data.items
    } ,
    addItem:function(name,calories){
        // as we have id to generate then to put some logic
        let ID
        if(data.items.length>0){
            ID = data.items[data.items.length - 1].id +1
        }
        else{
          ID=0
        }
        // as calories is passed as string so need to parse it
         calories = parseInt(calories)

        // create newItem
        newItem = new Item(ID,name,calories)
        data.items.push(newItem)

        return newItem
    },
    // get item by id
    getItemById:function(id){
        // now by using this id we need to match it in items array
        let found = null
        data.items.forEach(function(item){
          if(item.id === id){
              found = item
          }
        })
        return found
    },
    // set current item
    setCurrentItem:function(item){
      data.currentItem = item
      // now our current item has been into the data object and we need
      // to put in form
    },
    // get Current item to show it in form
    getCurrentItem:function(){
      return data.currentItem
    },
    // update item
    updateItem:function(name,calories){
      // parse calories to number
      calories = parseInt(calories)

      let found = null
      // loop through for checking if id of item is matching with id of current items 
      data.items.forEach(function(item){
          if(item.id === data.currentItem.id){
              item.name = name
              item.calories = calories
              found = item
          }
      })
      return found
    },
    // delete item from datastructiures
    deleteItem:function(id){
        // get ids we are using ,ap beocz it returns an aaray
        console.log(id); // it has id no 
        const ids = data.items.map(function(item){
              return item.id
        })
        // console.log(ids);
        const index = ids.indexOf(id) // here we r finding the index of
        // console.log(index); 
        // remove item
        data.items.splice(index,1)
    },
    // clearAllItems 
    clearAllItems:function(){
      // need to clear All Items from Data Structure
      data.items = []
      // this means array will be empty
    },

    // total caloreis
    getTotalCalories:function(){
      let total =0

      data.items.forEach(function(item){
        total += item.calories
      })
      // set totalcalories in data structure
      data.totalcalories = total
      // return total calories
      return data.totalcalories
    },
    

    logData: function() {
          return data
    }
  }

})();






// UI Controller
const UICtrl = (function(){

  const UISelectors = {
    itemList : '#item-list',
    listItems: '#item-list li',
    addBtn : '.add-btn',
    updateBtn : '.update-btn',
    deleteBtn : '.delete-btn',
    backBtn : '.back-btn',
    clearAllBtn : '.clear-btn',
    itemNameInput : '#item-name',
    itemCaloriesInput: '#item-calorie',
    totalCaloriesdata: '.total-calories'
  }

  // Public Methods
  return {
    populateItems: function(items){
        // take one var to put the data of items 
        let html = ''
        items.forEach(function(item){
          html += `
            <li class="collection-item" id="item-${item.id}">
            <strong>${item.name} :</strong> <em>${item.calories} calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
            </li>
          `
        })
        // will make an item list object if in future this id gonna to be
        // chnage then it will change only in the object which makes our code efficient
        document.querySelector(UISelectors.itemList).innerHTML= html
    },

    getItemInput : function(){
      return {
        name:document.querySelector(UISelectors.itemNameInput).value,
        calories:document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    addItemtoList : function(item){
      // show the list 
      document.querySelector(UISelectors.itemList).style.display = 'block'
      // create li 
      const li = document.createElement('li')
      // Add class
      li.className = 'collection-item'
      // Add id
      li.id=`item-${item.id}`
      // Add html
      li.innerHTML = ` 
      <strong>${item.name} :</strong> <em>${item.calories} calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
      `
      // insert item to ul
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li)
    },

    getSelectors: function(){
      return UISelectors
    },
    // update list item
    updateListItem:function(item){
        // to update UI with the updated item need to fetch all the li to match
        // id to edit
        let listItems = document.querySelectorAll(UISelectors.listItems)
        console.log(listItems); // it will give node list 
        // so we can froEach on node list so need to convert it into array

        // convert to array 
        listItems = Array.from(listItems)

        listItems.forEach(function(listItem){
          const itemId = listItem.getAttribute('id')
            if(itemId  ===  `item-${item.id}`){
              document.querySelector(`#${itemId}`).innerHTML = `
              <strong>${item.name} :</strong> <em>${item.calories} calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
              `
            }
        })
    },

    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = ''
      document.querySelector(UISelectors.itemCaloriesInput).value = ''
    },
    // add current item to form for Edit
    addItemToForm:function(){
      document.querySelector(UISelectors.itemNameInput).value = 
      ItemCtrl.getCurrentItem().name
      document.querySelector(UISelectors.itemCaloriesInput).value = 
      ItemCtrl.getCurrentItem().calories

      UICtrl.showEditState()
      
    },

    // deleteitem from List
    deleteListItem:function(id){
        const itemId = `#item-${id}`
        // grab the item of above it id
        const item = document.querySelector(itemId)
        item.remove()
    },
    // removeAllItems on clearAll from UI
    removeAllItems:function(){
        let listItems = document.querySelectorAll(UISelectors.listItems)

        // turn node list to array
        listItems = Array.from(listItems)

        listItems.forEach(function(item){
              item.remove()
        })
    },

    hideList : function(){
      document.querySelector(UISelectors.itemList).style.display = 'none'
    },
    showTotalCalories:function(totalCalories){
      const totalcaloriedata = document.querySelector(UISelectors.totalCaloriesdata)
      // console.log(parent);
      totalcaloriedata.textContent= totalCalories
      // we can also do .innerHtml 
      // but better to use .innerHtml when you need to insert a tag with content
      // otherwise if for content then use textcontent
    },
    // clear Edit State is for hiding the update,del and back button when 
    // page loads initially and we call it in App controller in init
    clearEditState : function (){
      UICtrl.clearInput()
      document.querySelector(UISelectors.addBtn).style.display = 'inline'
      document.querySelector(UISelectors.updateBtn).style.display = 'none'
      document.querySelector(UISelectors.deleteBtn).style.display = 'none'
      document.querySelector(UISelectors.backBtn).style.display = 'none'
    },
    // show Edit State
    showEditState:function(){
      document.querySelector(UISelectors.addBtn).style.display = 'none'
      document.querySelector(UISelectors.updateBtn).style.display = 'inline'
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline'
      document.querySelector(UISelectors.backBtn).style.display = 'inline'
    }

  }

})();
// App Controller
const App = (function(ItemCtrl,StorageCtrl,UICtrl){
  // App ctrl takes two param Itemctrl and UICtrl

  // will make function for loading event listenerss
  const loadEventListeners = function(){
    // Get UISekectors
    const UISelectors = UICtrl.getSelectors()
    // add event 
    document.querySelector(UISelectors.addBtn).addEventListener('click',itemAddSubmit)

    // we want to disable enter on key press
    // document.addEventListener('keypress',function(e){
    //   if(e.keyCo === 13){
    //     e.preventDefault()
    //     return false
    //   }
    // })

    // edit click icon
    // as this edit button is inside the li and li is inside the ul so
    // we cant directly addevent listener to that so we need to do event
    // delegation 
    document.querySelector(UISelectors.itemList).addEventListener('click',
    itemEditClick)

    // itemUpdateSubmit
    document.querySelector(UISelectors.updateBtn).addEventListener('click',
    itemUpdateSubmit)

    //deleteitemSubmit
    document.querySelector(UISelectors.deleteBtn).addEventListener('click',
    deleteItemSubmit)

    // for back button we want to clear the Edit state 
    document.querySelector(UISelectors.backBtn).addEventListener('click',(e)=>{
      UICtrl.clearEditState()
      e.preventDefault()
    })

    // for Clear All
    document.querySelector(UISelectors.clearAllBtn).addEventListener('click',
    clearAllItemsClick)
  }

  // itemAddSubmit will add the item to the dataStructre
  const itemAddSubmit = function(e){
      // console.log('Add');
      // for adding item to DS it needs to fetch from UI
      const input = UICtrl.getItemInput()
      // check for name and calorie input if it is null
      if(input.name !== '' && input.calories!== ''){
        const newItem = ItemCtrl.addItem(input.name,input.calories)
        // additem to the list 
        UICtrl.addItemtoList(newItem)

        // total calories 
        const totalCalories = ItemCtrl.getTotalCalories()
        // add total calories to UI
        UICtrl.showTotalCalories(totalCalories)
        // clear input fields 
        UICtrl.clearInput()
        // add to local Storage
        StorageCtrl.storeItems(newItem)

        e.preventDefault()
      } 

}

    // itemEditClick
    const itemEditClick = function(e){
      // console.log('test');
      // here we want only action to be generate on clicking on pencil button w
      // so we want to do event delegation becooz this icon is generate after
      // the initpage loads so to do event delegtion
      if(e.target.classList.contains('edit-item')){
        // will get the item id (item-0n,item-1)
        const listId = e.target.parentNode.parentNode.id
        // console.log(listId); we item-0 as id so we need to separate its
        // break into array
        const listIdArr = listId.split('-')
        // console.log(listIdArr);
        
        // get actual id
        const id = parseInt(listIdArr[1])

        // get item to Edit
        const itemToEdit = ItemCtrl.getItemById(id)
        console.log(itemToEdit);
        // set current item
        ItemCtrl.setCurrentItem(itemToEdit)

        // add current item to form for Edit
        UICtrl.addItemToForm() // we will not pass anything as current item
        // is set in data object
      }

    e.preventDefault();
  }

  // itemUpdateSubmit
  const itemUpdateSubmit = function(e){
    // console.log('123');

    // get item input
    const input =UICtrl.getItemInput()
    // item update
    const updatedItem = ItemCtrl.updateItem(input.name,input.calories)

    // update UI
    UICtrl.updateListItem(updatedItem)

    // update in local sotrage 
    StorageCtrl.updateItemStorage(updatedItem)


    // total calories 
    const totalCalories = ItemCtrl.getTotalCalories()
    // add total calories to UI
    UICtrl.showTotalCalories(totalCalories)

    // clear Edit state
    UICtrl.clearEditState()

    

    e.preventDefault();
}

// delete item from datastructure 
  const deleteItemSubmit = function(e){
    
    const currentItem = ItemCtrl.getCurrentItem()
    // console.log(currentItem);

    // delete item from DS 
    ItemCtrl.deleteItem(currentItem.id)

    // delete from list 
    UICtrl.deleteListItem(currentItem.id)

    // deleteStorage
    StorageCtrl.deleteItemFromStorage(currentItem.id)

    // total calories 
    const totalCalories = ItemCtrl.getTotalCalories()
    // add total calories to UI
    UICtrl.showTotalCalories(totalCalories)

    // clear Edit state
    UICtrl.clearEditState()




    e.preventDefault()
  }

  // clear All items click
  const clearAllItemsClick = function(){
      // Delete all items from Data Structure
      ItemCtrl.clearAllItems()

      // total calories 
    const totalCalories = ItemCtrl.getTotalCalories()
    // add total calories to UI
    UICtrl.showTotalCalories(totalCalories)


      // Remove All items from UI
      UICtrl.removeAllItems()

      // ClearAll items from LS
      StorageCtrl.clearAllItemsFromStorage()

      // hide List
      UICtrl.hideList()
  }

// for clear button 
  // const clearEdit = function(e){
  //   UICtrl.clearEditState()
    
  //   e.preventDefault()
  // }

  // in this we should have method init for Initialising the App
  return{
    init:function (){
      // clear Edit state /set initial state
      UICtrl.clearEditState()
      // console.log('Initialising App...');
      // we call that getitems function here to populate the data into UI
      // actually this data should come from local storage or from API but no matters
      const items = ItemCtrl.getItems()
      // check if any items 
      if(items.length === 0){
          UICtrl.hideList()
      }else {
        UICtrl.populateItems(items)
      }

      // when page refresh then need to refresh total calorie also 
      const totalCalories = ItemCtrl.getTotalCalories()
        // add total calories to UI
        UICtrl.showTotalCalories(totalCalories)

      // we made UI ctrl for UI changes so will pass this item to UI and make 
      
      // want to call load event 
      loadEventListeners()
      
    }
  }
})(ItemCtrl,StorageCtrl,UICtrl); // this extra parenthesis is for invoking the function 
// hence we pass param here also as we are calling App

App.init()