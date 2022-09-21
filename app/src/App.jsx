import React, { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api'
import './App.scss'

const Card = ({ addItem, title, deleteCard, data, inputData, deleteItem, editItem, id, showOptions, hideOptions, validateItem }) => {
  return (
    <>
      <div className='cards'>
        <h2 className='card-title'>{title}</h2>
        <div className="item-section">
          <ul className='ul-style'>
            {
              data.length > 0 && data.map((value, index) =>
                <li className="li-container" key={index} index={index} id={id} onMouseEnter={(e) => showOptions(e)} onMouseLeave={(e) => hideOptions(e)} >
                  <div className='li-style'>
                    <input type='text' className="input-style" id={id} key={index} index={index}
                      value={value.text} readOnly={value.isReadOnly} onChange={(e) => inputData(e)} />
                  </div>
                  <div className="icon-container">
                    {value.isShown && (
                      <>
                        {value.isReadOnly ?
                          <>
                            <object className='delete-item-button' onClick={(e) => editItem(e)} id={id} index={index} data="/images/pen-solid.svg" type="image/png" width="15" height="15" alt="delete-item"></object>
                          </>
                          :
                          <>
                            <object className='delete-item-button' onClick={(e) => validateItem(e)} id={id} index={index} data="/images/check-solid.svg" type="image/png" width="15" height="15" alt="delete-item"></object>
                          </>
                        }
                        <object className='delete-item-button' onClick={(e) => deleteItem(e)} id={id} index={index} data="/images/delete.svg" type="image/png" width="15" height="15" alt="delete-item"></object>
                      </>
                    )}
                  </div>
                </li>
              )
            }
          </ul>
        </div>
        <div className="button-container">
          <button onClick={(e) => addItem(e)} id={id} className='add-button-style'>ADD</button>
          <button onClick={(e) => deleteCard(e)} id={id} className='delete-button-style'>DELETE</button>
        </div>
      </div>
    </>
  )
};

function CardList({ listArray, setListArray }) {
  const [item, setItems] = useState([]);

  useEffect(() => {
    setItems(listArray);
  }, [listArray]);

  const basedComponent = (e, prop, bool) => {
    const target = e.target;
    const itemIndex = target.getAttribute("index");

    const newState = item.map(obj => {
      if (target.id === obj.id.toString()) {
        obj.items[itemIndex][prop] = bool;
        return { ...obj, items: obj.items }
      }
      return obj;
    })
    setItems(newState);
  }

  const input = (e) => {
    const target = e.target;
    const itemIndex = target.getAttribute("index");
    const map = item.map(obj => {
      if (target.id === obj.id.toString()) {
        obj.items[itemIndex].text = e.target.value;
      }
      return obj;
    })
    setItems(map);
  }

  const writeToFile = (array) => {
    const pending = array || item;
      invoke('write_file', { data: JSON.stringify(pending) }).then((response) => {
        const parsedJSON = JSON.parse(response);
        console.log(parsedJSON);
        setListArray(parsedJSON);
      })
      .catch((err) => console.log(err));
  }

  const validateItem = (e) => {
    const target = e.target;
    const itemIndex = target.getAttribute("index");
    const map = item.map(obj => {
      if (target.id === obj.id.toString()) {
        obj.items[itemIndex].isReadOnly = true;
      }
      return obj;
    })
    setItems(map);
    writeToFile();
  }

  const editItem = (e) => {
    basedComponent(e, "isReadOnly", false);
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
      isReadOnly: true,
      isShown: false
    };
    const newState = item.map(obj => {
      if (target.id === obj.id.toString()) {
        return { ...obj, items: obj.items = [...obj.items, listItem] }
      }
      return obj;
    })
    setItems(newState);
  }

  const deleteItem = (e) => {
    const target = e.target;
    const itemIndex = target.getAttribute("index");
    const newState = item.map(obj => {
      if (target.id === obj.id.toString()) {
        const filter = obj.items.filter((_, i) => i.toString() !== itemIndex);
        return { ...obj, items: obj.items = filter }
      }
      return obj;
    })
    setItems(newState);
    writeToFile();
  }

  const deleteCard = (e) => {
    const target = e.target;
    const filter = item.filter(obj => obj.id.toString() !== target.id);
    setItems(filter);
    writeToFile(filter);
  }

  return (
    <>
      {item.length > 0 &&
        item.map((value, index) =>
          <Card title={value.title} showOptions={showOptions} inputData={input} hideOptions={hideOptions} data={value.items} setData={setItems} addItem={addItem} deleteItem={deleteItem} deleteCard={deleteCard} editItem={editItem} validateItem={validateItem} key={index} id={value.id} />
        )
      }
    </>)
}

function Form() {
  const [title, setTitle] = useState('');
  const [listArray, setListArray] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    invoke('parse_data_file').then((response) => {
      setIndex(0)
      setListArray([])

      const parsed = JSON.parse(response);
      if (parsed.length > 0) {
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
    if (title === "" || title.length > 10) {
      console.log("TITLE SHOULDN'T BE EMPTY OR SUPERIOR TO TEN CHARACTERS");
      return;
    } else {
      setIndex(index => index + 1);
      const objc = {
        id: index,
        title: title,
        items: [
          {
            text: "",
            isReadOnly: true,
            isShown: false
          }
        ]
      }

      setListArray(listArray => [...listArray, objc]);
    }
  }

  return (
    <>
      <div className="form-container">
        <form onSubmit={(e) => { e.preventDefault(); obj() }} className="form">
          <label htmlFor="listTitle">Create a new list</label>
          <input type="text" name="listTitle" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="enter a name" />
          <button type="submit" className='form-add-button'>ADD</button>
        </form>
      </div>
      <main className="main-container">
        <CardList listArray={listArray} setListArray={setListArray} />
      </main>
    </>);
}
export default Form;



