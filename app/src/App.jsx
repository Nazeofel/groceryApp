import React, { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api'
import './App.scss'

const Card = ({addItem, title, deleteCard, data, deleteItem, editItem, id, showOptions, hideOptions, validateItem}) => {
  return(
    <>
      <div className='cards'>
        <h1 className='card-title'>{title}</h1>    
        <div className="item-section">
            <ul className='ul-style'>
              {
                data.length > 0 && data.map((value, index) =>
                  <li className="li-container" key={index} index={index} id={id} onMouseEnter={(e) => showOptions(e)} onMouseLeave={(e) => hideOptions(e)} >
                    <div className='li-style'>
                      <input  type='text' className="input-style" id={id} key={index} index={index}  
                        value={value.text} readOnly={value.isEditable} onChangeCapture={(e) => value.text = e.target.value}/>
                    </div>
                    <div className="icon-container">
                    {value.isShown && (
                    <>
                      {value.isEditable ? 
                        <>
                        <object className='delete-item-button' onClick={(e) => editItem(e)} id={id} index={index}  data="/images/pen-solid.svg" type="image/png" width="15" height="15" alt="delete-item"></object>                          </>
                        :
                        <> 
                        <object className='delete-item-button' onClick={(e) => validateItem(e)} id={id} index={index}  data="/images/check-solid.svg" type="image/png" width="15" height="15" alt="delete-item"></object>
                        </>
                    }
                    <object className='delete-item-button' onClick={(e) => deleteItem(e)} id={id} index={index}  data="/images/delete.svg" type="image/png" width="15" height="15" alt="delete-item"></object>
                    </>
                    )}
                    </div>
                  </li>
                )
                }
            </ul>
        </div>      
          <div className="button-container">
            <button onClick={(e) => addItem(e)} id={id} className='add-button-style'>add</button>
            <button onClick={(e) => deleteCard(e)} id={id} className='delete-button-style'>delete</button>
          </div>
      </div>
    </>
  )
};

function CardList({listArray, setListArray}) {
  const [item, setItems] = useState([]);

  useEffect(() => {
    setItems(listArray);
  }, [listArray]);

  const basedComponent = (e, prop, bool) => {
    const target = e.target;
    for(let value of Object.values(item)){
      if(target.id === value.id.toString()){
        const cardIndex = item.indexOf(value);
        const itemIndex = target.getAttribute("index");

        value.items[itemIndex][prop] = bool;
        
        let updatedValue = {
          id: value.id,
          title: value.title,
          items: value.items
        };

      const arrItemCopy = [...item]
      arrItemCopy[cardIndex] = updatedValue;
      setItems(arrItemCopy);
      }
    }
  }

 const writeToFile = (cardIndex, updatedValue) => {
    const arrItemCopy = [...item]
    arrItemCopy[cardIndex] = updatedValue;
    setItems(arrItemCopy);

    invoke('write_file', {data: JSON.stringify(item)}).then((response) => {
      const parsedJSON = JSON.parse(response);           
      setListArray(parsedJSON);
    });
  }

  const validateItem = (e) => {
    basedComponent(e, "isEditable", true);  
  }

  const editItem = (e) => {
    basedComponent(e, "isEditable", false);
  }
 
  const showOptions = (e) => {
    basedComponent(e, "isShown", true);
  }

  const hideOptions = (e) => {
    basedComponent(e, "isShown", false);
  }

  const addItem = (e) => {
    const target = e.target;
    const listItem = {
      text: "",
      isEditable: true,
      isShown: false
    };

    for (let value of Object.values(item)) {
      if (target.id === value.id.toString()) {
      const cardIndex = item.indexOf(value);

      let updatedValue = {
        id: value.id,
        title: value.title,
        items: value.items = [...value.items, listItem]
      };

      writeToFile(cardIndex, updatedValue);
      }
    }
  }

  const deleteItem = (e) => {
    const target = e.target;
    for(let value of Object.values(item)){
      if(target.id === value.id.toString()){
        const cardIndex = item.indexOf(value);
        const itemIndex = target.getAttribute("index");

        value.items.splice(itemIndex, 1)

        let updatedValue = {
          title: value.title,
          items: value.items,
          id: value.id
        }

      writeToFile(cardIndex, updatedValue);
      }
    }
  }
  
  const deleteCard = (e) => {
    const target = e.target;
    for(let value of Object.values(item)){
      if(target.id === value.id.toString()){
        const cardIndex = item.indexOf(value);
        item.splice(cardIndex, 1);

        const arrItemCopy = [...item]
        arrItemCopy[cardIndex];
        setItems(arrItemCopy);

        writeToFile();
      }
    }
  }

  return (
      <>
          {item.length > 0 &&
              item.map((value, index) =>
                  <Card title={value.title} showOptions={showOptions} hideOptions={hideOptions} data={value.items} addItem={addItem} deleteItem={deleteItem} deleteCard={deleteCard} editItem={editItem} validateItem={validateItem} key={index} id={value.id}/>
              )
          }
      </>)
} 

function Form(){
  const [title, setTitle] = useState('');
  const [listArray, setListArray] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    invoke('parse_data_file').then((response) => 
  {
    setIndex(0)
    setListArray([])

    const parsed = JSON.parse(response);
    if(parsed.length > 0){
      let max = 0;
      parsed.map((a) => (setListArray(listArray => [...listArray, a]), max = a.id)
      );
      setIndex(index => index + max + 1);
    } else {
      return;
    }
  });
  }, []);

  const obj = () => {
    if(title === "" || title.length > 10){
      console.log("TITLE SHOULDNT BE EMPTY OR SUPERIOR TO TEN CHARACTERS");
      return;
    } else {
      setIndex(index => index + 1);
      const objc = {
        id: index,
        title: title,
        items:[
          {
          text: "",
          isEditable: true,
          isShown: false
        }
        ]
      }
      
      setListArray(listArray => [...listArray, objc]);
    }
  }

  return(
    <>
    <div className="form-container">
    <form onSubmit={(e) => {e.preventDefault(); obj()}} className="form">
      <input type="text" name="listTitle" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="enter a name"/>
      <button type="submit">Submit</button>
    </form>
    </div>
    <main className="main-container">
      <CardList listArray={listArray} setListArray={setListArray}/>
    </main>
</>);
}
export default Form;


  
