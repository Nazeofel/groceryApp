import React, { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api'
import './App.scss'

function Card({addItem, data, id, title, deleteItem, deleteCard}) {
  const [show, setShown] = useState(false);

  return (
      <div className='cards'>
          <h1 className='card-title'>{title}</h1>    
          <div className="item-section">
            <ul className='ul-style'>
              {
                data.length > 0 && data.map((value, index) =>
                    <li className="li-style" id={id} onMouseEnter={() => setShown(true)} onMouseLeave={() => setShown(false)} key={index}>{value}
                    {show && 
                    <object className='delete-item-button' onClick={deleteItem} id={id} index={index}  data="/images/delete.svg" type="image/png" width="15" height="15" alt="delete-item"></object>
                    }
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
  )
}

function CardList({listArray}) {
  const [item, setItems] = useState([]);  
  useEffect(() => {
    setItems(listArray);
  }, [listArray]);
  
  const deleteCard = (e) => {
    const target = e.target;
    for(let value of Object.values(item)){
      if(target.id === value.id.toString()){
        const cardIndex = item.indexOf(value);
        item.splice(cardIndex, 1);

        const arrItemCopy = [...item]
        arrItemCopy[cardIndex];
        setItems(arrItemCopy);


        invoke('write_file', {data: JSON.stringify(item)}).then((response) => response);
      }
    }
  }

  const addItem = (e) => {
    const target = e.target;
    const listItem = prompt("Enter a name");

      if(listItem === null || listItem === "" || listItem.length > 10){
        return;
      } else {
        for (let value of Object.values(item)) {
          if (target.id === value.id.toString()) {

          const itemIndex = item.indexOf(value);

          let updatedValue = {
            title: value.title,
            items: value.items = [...value.items, listItem],
            id: value.id
          }

          const arrItemCopy = [...item]
          arrItemCopy[itemIndex] = updatedValue;
          setItems(arrItemCopy);
          invoke('write_file', {data: JSON.stringify(item)}).then((response) => response);
          }
        }
      }
  }

  const deleteItem = (e) => {
    const target = e.target;
    for(let value of Object.values(item)){
      if(target.id === value.id.toString()){
        const itemIndex = item.indexOf(value);

        value.items.splice(target.getAttribute("index"), 1)

        let updatedValue = {
          title: value.title,
          items: value.items,
          id: value.id
        }

        const arrItemCopy = [...item]
        arrItemCopy[itemIndex] = updatedValue;
        setItems(arrItemCopy);

        invoke('write_file', {data: JSON.stringify(item)}).then((response) => response);
      }
    }
  }
  
  return (
      <>
          {item.length > 0 &&
              item.map((value, index) =>
                  <Card title={value.title} data={value.items} addItem={addItem} deleteItem={deleteItem} deleteCard={deleteCard} key={index} id={value.id}/>
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
    if(parsed.length > 0 && listArray.length === 0){
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
        title: title,
        items: [],
        id: index
      }
      invoke('parse_data_file').then((response) =>
       {
        const parsedJSON = JSON.parse(response);
        if(parsedJSON.length > 0){
          setListArray([...parsedJSON, objc]);
        } else {
          setListArray(listArray => [...listArray, objc]);
        }
       })
       .catch((err) => console.log(err));
    }
  }

  return(
    <>
    <form onSubmit={(e) => {e.preventDefault(); obj()}} className="form">
      <label htmlFor="listTitle">Create a new list : </label>
      <input type="text" name="listTitle" value={title} onChange={(e) => setTitle(e.target.value)}/>
      <button type="submit">Submit</button>
    </form>
    <main className="main-container">
      <CardList listArray={listArray}/>
    </main>
</>);
}

export default Form;


  
